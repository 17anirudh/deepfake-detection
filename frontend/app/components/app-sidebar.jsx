import { Home, Newspaper, Image, Gpu, Video, Rat } from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar";


const items = [
  {
    title: "Home",
    url: "#top",
    icon: Home
  },
  {
    title: "News",
    url: "#form",
    icon: Newspaper
  },
  {
    title: "Image",
    url: "#form",
    icon: Image
  },
  {
    title: "Video",
    url: "#form",
    icon: Video
  },
  {
    title: "Tech",
    url: "#tech",
    icon: Gpu
  }
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-black text-amber-50">
        <SidebarGroup className="bg-black text-amber-50">
          <SidebarGroupLabel>Moongoose   <Rat /> </SidebarGroupLabel>
          <SidebarTrigger />
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}