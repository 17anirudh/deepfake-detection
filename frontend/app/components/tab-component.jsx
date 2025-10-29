import { Newspaper, Image, Video } from "lucide-react";
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
        <div className="flex w-96 flex-col gap-6">
        <Tabs defaultValue="image">
            <TabsList>
            <TabsTrigger value="news"><Newspaper /> News</TabsTrigger>
            <TabsTrigger value="image"><Image /> Image</TabsTrigger>
            <TabsTrigger value="video"><Video /> Video</TabsTrigger>
            </TabsList>
            <TabsContent value="news">
                <NewsForm />
            </TabsContent>
            <TabsContent value="image">
                <ImageForm />
            </TabsContent>
            <TabsContent value="video">
                <VideoForm />
            </TabsContent>
        </Tabs>
        </div>
    )
}