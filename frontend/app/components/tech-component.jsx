import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Tech() {
    return (
        // Wrapper for 100% width and default text color
        <div className="w-full p-4 md:p-8 bg-black/10 rounded-xl shadow-2xl backdrop-blur-sm">
            
            {/* Main title with a bit more style */}
            <h2 className="text-3xl font-extrabold mb-8 text-amber-400 tracking-wider border-b border-amber-500/50 pb-2">
                Moongose's Technology Stack
            </h2>

            {/* Accordion Container with enhanced styling */}
            <Accordion type="single" collapsible className="w-full">

            {/* --- Item 1: Pytorch --- */}
            <AccordionItem value="item-1" className="border-b border-amber-500/20">
                <AccordionTrigger className="text-xl font-semibold hover:text-amber-300 transition-colors py-4">
                    🧠 Pytorch
                </AccordionTrigger>
                <AccordionContent className="bg-white/5 p-4 rounded-b-lg border-t border-amber-500/10">
                <dl className="space-y-2 text-amber-100/80 font-mono">
                    <dd className="pl-4">✨ EfficientNet Large v2</dd>
                    <dd className="pl-4">🔄 Temporal Convolutional Neural Network</dd>
                    <dd className="pl-4">📂 DataLoader API</dd>
                </dl>
                </AccordionContent>
            </AccordionItem>

            {/* --- Item 2: Pytorch's helpers --- */}
            <AccordionItem value="item-2" className="border-b border-amber-500/20">
                <AccordionTrigger className="text-xl font-semibold hover:text-amber-300 transition-colors py-4">
                    🔧 Pytorch's Helpers
                </AccordionTrigger>
                <AccordionContent className="bg-white/5 p-4 rounded-b-lg border-t border-amber-500/10">
                <dl className="space-y-2 text-amber-100/80 font-mono">
                    <dd className="pl-4">📷 Open Computer Vision (OpenCV)</dd>
                    <dd className="pl-4">🔢 Numpy</dd>
                    <dd className="pl-4">🎯 YOLO</dd>
                </dl>
                </AccordionContent>
            </AccordionItem>

            {/* --- Item 3: Backend --- */}
            <AccordionItem value="item-3" className="border-b border-amber-500/20">
                <AccordionTrigger className="text-xl font-semibold hover:text-amber-300 transition-colors py-4">
                    ⚙️ Backend
                </AccordionTrigger>
                <AccordionContent className="bg-white/5 p-4 rounded-b-lg border-t border-amber-500/10">
                <dl className="space-y-2 text-amber-100/80 font-mono">
                    <dd className="pl-4">🚀 FastAPI</dd>
                    <dd className="pl-4">💾 SQLModel</dd>
                    <dd className="pl-4">✅ Pydantic</dd>
                    <dd className="pl-4">📚 Langchain (RAG)</dd>
                    <dd className="pl-4">🌐 REST API</dd>
                </dl>
                </AccordionContent>
            </AccordionItem>

            {/* --- Item 4: Database --- */}
            <AccordionItem value="item-4" className="border-b border-amber-500/20">
                <AccordionTrigger className="text-xl font-semibold hover:text-amber-300 transition-colors py-4">
                    🗃️ Database
                </AccordionTrigger>
                <AccordionContent className="bg-white/5 p-4 rounded-b-lg border-t border-amber-500/10">
                <dl className="space-y-2 text-amber-100/80 font-mono">
                    <dd className="pl-4">📦 SQLite</dd>
                    <dd className="pl-4">🌈 Chroma</dd>
                </dl>
                </AccordionContent>
            </AccordionItem>

            {/* --- Item 5: Frontend --- */}
            <AccordionItem value="item-5" className="border-b-0"> {/* Last item needs no bottom border */}
                <AccordionTrigger className="text-xl font-semibold hover:text-amber-300 transition-colors py-4">
                    💻 Frontend
                </AccordionTrigger>
                <AccordionContent className="bg-white/5 p-4 rounded-b-lg border-t border-amber-500/10">
                <dl className="space-y-2 text-amber-100/80 font-mono">
                    <dd className="pl-4">🌐 Next.Js</dd>
                    <dd className="pl-4">🧩 MVPBlocks</dd>
                    <dd className="pl-4">💅 shad-cn</dd>
                    <dd className="pl-4">📝 zod</dd>
                </dl>
                </AccordionContent>
            </AccordionItem>

            </Accordion>
        </div>
    )
}