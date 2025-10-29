import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Tech() {
    return (
        <div className="text-amber-50">
            <h2 className="mb-5">Moongose is a thing because of: </h2>
            <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
                <AccordionTrigger>Pytorch</AccordionTrigger>
                <AccordionContent>
                <dl>
                    <dd>EfficientNet Large v2</dd>
                    <dd>Temporal Convolutional Neural Network</dd>
                    <dd>DataLoader API</dd>
                </dl>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>Pytorch's helpers</AccordionTrigger>
                <AccordionContent>
                <dl>
                    <dd>Open Computer Vision (OpenCV)</dd>
                    <dd>Numpy</dd>
                    <dd>YOLO</dd>
                </dl>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>Backend</AccordionTrigger>
                <AccordionContent>
                <dl>
                    <dd>FastAPI</dd>
                    <dd>SQLModel</dd>
                    <dd>Pydantic</dd>
                    <dd>Langchain (RAG)</dd>
                    <dd>REST API</dd>
                </dl>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
                <AccordionTrigger>Database</AccordionTrigger>
                <AccordionContent>
                <dl>
                    <dd>SQLite</dd>
                    <dd>Chroma</dd>
                </dl>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
                <AccordionTrigger>Frontend</AccordionTrigger>
                <AccordionContent>
                <dl>
                    <dd>Next.Js</dd>
                    <dd>MVPBlocks</dd>
                    <dd>shad-cn</dd>
                    <dd>zod</dd>
                </dl>
                </AccordionContent>
            </AccordionItem>
            </Accordion>
        </div>
    )
}