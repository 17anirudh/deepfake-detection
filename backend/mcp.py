from typing import List, Dict
import chromadb as Chroma
from langchain_ollama import OllamaLLM, OllamaEmbeddings
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from duckduckgo_search import DDGS
import os
import re
from structures import InformationResponse

# === CONFIG ONLY ===
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5vl:7b")
EMBEDDINGS = os.getenv("EMBEDDINGS", "nomic-embed-text:latest")
MAX_WEB_RESULTS = int(os.getenv("MAX_WEB_RESULTS", "10"))
CHROMA_PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", "./chroma_db")

TRUSTED_FACTS = [
    "Private credit markets have seen high-profile collapses like First Brands and Tricolor in 2025.",
    "September is historically a weak month for equities; the S&P 500 averages -1.1% since 1950.",
    "Tariffs on Chinese goods raise U.S. manufacturing costs by 2-5% according to the Federal Reserve.",
]

embeddings = None
vectorstore = None
llm = None
prompt = None
chain = None

def init_mcp_resources(device: str = "cpu"):
    """Initialize all MCP resources. Call ONCE during startup."""
    global embeddings, vectorstore, llm, prompt, chain

    embeddings = OllamaEmbeddings(model=EMBEDDINGS)
    vectorstore = Chroma(
        collection_name="trusted_facts",
        embedding_function=embeddings,
        persist_directory=CHROMA_PERSIST_DIR
    )

    # Seed facts if empty
    if vectorstore._collection.count() == 0:
        vectorstore.add_texts(
            texts=TRUSTED_FACTS,
            ids=[f"fact_{i}" for i in range(len(TRUSTED_FACTS))],
            metadatas=[{"source": "verified", "type": "baseline"} for _ in TRUSTED_FACTS]
        )
        print("✓ Seeded trusted facts into Chroma")

    llm = OllamaLLM(model=OLLAMA_MODEL, temperature=0.0)

    prompt_template = PromptTemplate.from_template(
        """You are a news fact-checker. Analyze the claim against retrieved information from the web.

WEB ARTICLES:
{web_context}

TRUSTED FACTS:
{static_context}

CLAIM TO VERIFY:
{claim}

Rules:
1. If web articles from credible sources confirm the claim with specific details, return REAL
2. If web articles contradict the claim, if the claim is absurd/impossible, or if no credible sources found for a significant claim, return FAKE
3. If there is insufficient information to verify, return UNVERIFIED
4. Be especially skeptical of sensational claims about celebrities, disasters, or unlikely events
5. Consider the plausibility of the claim itself

Respond ONLY in this format:
VERDICT: [REAL/FAKE/UNVERIFIED]
REASON: [One sentence explanation with source if available]
"""
    )

    chain = prompt_template | llm | StrOutputParser()


def extract_keywords(text: str) -> str:
    """Extract key search terms from claim"""
    stopwords = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were'}
    words = re.findall(r'\b\w+\b', text.lower())
    keywords = [w for w in words if w not in stopwords and len(w) > 2]
    return ' '.join(keywords[:8])  # Limit to 8 keywords


def fetch_news_multi_source(query: str) -> List[Dict]:
    """Fetch from multiple news sources covering various topics"""
    results = []
    
    # General news sources for diverse topics
    sources = [
        "site:reuters.com OR site:bbc.com OR site:apnews.com OR site:theguardian.com",
        "site:cnn.com OR site:nbcnews.com OR site:abcnews.go.com OR site:cbsnews.com",
        "site:timesofindia.indiatimes.com OR site:hindustantimes.com OR site:indianexpress.com",
    ]
    
    try:
        with DDGS() as ddgs:
            # First try: with site restrictions
            for source_group in sources:
                try:
                    search_results = ddgs.text(
                        f"{query} {source_group}", 
                        max_results=MAX_WEB_RESULTS // len(sources)
                    )
                    for r in search_results:
                        results.append({
                            "title": r.get("title", ""),
                            "snippet": r.get("body", ""),
                            "url": r.get("href", ""),
                            "source": r.get("href", "").split("/")[2] if "/" in r.get("href", "") else "unknown"
                        })
                except Exception:
                    continue
                
                if len(results) >= 3:  # If we have some results, stop
                    break
            
            # Second try: general search without site restrictions if no results
            if not results:
                try:
                    search_results = ddgs.text(query, max_results=MAX_WEB_RESULTS)
                    for r in search_results:
                        results.append({
                            "title": r.get("title", ""),
                            "snippet": r.get("body", ""),
                            "url": r.get("href", ""),
                            "source": r.get("href", "").split("/")[2] if "/" in r.get("href", "") else "unknown"
                        })
                except Exception:
                    pass
                    
    except Exception as e:
        print(f"⚠ Web search error: {e}")
    
    return results[:MAX_WEB_RESULTS]


def rag_classify(claim: str) -> InformationResponse:
    """Main RAG classification with web scraping"""
    keywords = extract_keywords(claim)
    web_articles = fetch_news_multi_source(keywords)
    
    if web_articles:
        web_context = "\n".join([
            f"[{a['source']}] {a['title']}: {a['snippet'][:200]}"
            for a in web_articles[:5]  # Top 5 most relevant
        ])
    else:
        web_context = "No recent web articles found."
    
    static_docs = vectorstore.similarity_search(claim, k=2)
    static_context = "\n".join([d.page_content for d in static_docs])
    
    try:
        raw_output = chain.invoke({
            "web_context": web_context,
            "static_context": static_context,
            "claim": claim
        })
        
        lines = raw_output.strip().split('\n')
        verdict_line = next((l for l in lines if 'VERDICT:' in l.upper()), "")
        reason_line = next((l for l in lines if 'REASON:' in l.upper()), "")
        
        classification = verdict_line.split(':', 1)[1].strip().upper() if ':' in verdict_line else "UNVERIFIED"
        reason = reason_line.split(':', 1)[1].strip() if ':' in reason_line else raw_output[:200]
        
        if classification not in ["REAL", "FAKE", "UNVERIFIED"]:
            classification = "UNVERIFIED"
            reason = f"Unable to verify: {reason}"
        
        return InformationResponse(classification=classification, reason=reason)
    
    except Exception as e:
        return InformationResponse(
            classification="ERROR",
            reason=f"Processing error: {str(e)[:100]}"
        )


def guess_news(text: str) -> InformationResponse:
    """
    Fact-check news claims using RAG + live web scraping.
    
    Args:
        text: News claim to verify (e.g., "Sara Tendulkar is now looking to join Brazzers" 
              or "Cyclone Montha is going to hit US East Coast and bring Tsunami tomorrow")
        
    Returns:
        InformationResponse with REAL/FAKE/UNVERIFIED classification and reason
    """
    if not text or len(text.strip()) < 10:
        return InformationResponse(
            classification="ERROR",
            reason="Claim too short to verify (minimum 10 characters)"
        )
    
    return rag_classify(text.strip())