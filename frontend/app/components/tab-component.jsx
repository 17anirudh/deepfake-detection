import { Newspaper, Image, Video } from "lucide-react";
// Assuming these are forms or content components
import ImageForm from "./image-form";
import NewsForm from "./news-form";
import VideoForm from "./video-form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function TabsComponent() {
    return (
        // 1. Full width and enhanced wrapper (similar to Accordion)
        <div className="w-full p-4 md:p-8 bg-black/10 rounded-xl shadow-2xl backdrop-blur-sm text-amber-50">
        
        <h2 className="text-2xl font-bold mb-6 text-amber-400">
            Form Selector
        </h2>
        
        <Tabs defaultValue="image" className="w-full">
            
            {/* 2. Styled Tabs List */}
            <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-amber-500/10 rounded-lg shadow-inner">
            
                {/* 3. Styled Triggers with improved spacing and icons */}
                <TabsTrigger 
                    value="news" 
                    className="flex gap-2 p-3 data-[state=active]:bg-amber-600 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:rounded-md transition-all duration-300 text-amber-200 hover:text-amber-50"
                >
                    <Newspaper className="h-5 w-5" /> 
                    <span className="hidden sm:inline">News</span>
                </TabsTrigger>
                
                <TabsTrigger 
                    value="image" 
                    className="flex gap-2 p-3 data-[state=active]:bg-amber-600 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:rounded-md transition-all duration-300 text-amber-200 hover:text-amber-50"
                >
                    <Image className="h-5 w-5" /> 
                    <span className="hidden sm:inline">Image</span>
                </TabsTrigger>
                
                <TabsTrigger 
                    value="video" 
                    className="flex gap-2 p-3 data-[state=active]:bg-amber-600 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:rounded-md transition-all duration-300 text-amber-200 hover:text-amber-50"
                >
                    <Video className="h-5 w-5" /> 
                    <span className="hidden sm:inline">Video</span>
                </TabsTrigger>
            
            </TabsList>
            
            {/* 4. Styled Content Area */}
            <TabsContent value="news" className="mt-4 p-6 border border-amber-500/30 rounded-lg bg-black/20 min-h-[200px]">
                <NewsForm />
            </TabsContent>
            
            <TabsContent value="image" className="mt-4 p-6 border border-amber-500/30 rounded-lg bg-black/20 min-h-[200px]">
                <ImageForm />
            </TabsContent>
            
            <TabsContent value="video" className="mt-4 p-6 border border-amber-500/30 rounded-lg bg-black/20 min-h-[200px]">
                <VideoForm />
            </TabsContent>
        </Tabs>
        </div>
    )
}