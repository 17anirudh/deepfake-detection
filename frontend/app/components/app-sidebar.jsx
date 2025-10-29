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
import { ModeToggle } from "./theme-toggle";


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
      <SidebarContent>
        <SidebarGroup>
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
              <SidebarMenuItem key="mode">
                  <SidebarMenuButton asChild>
                    <ModeToggle />
                  </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}