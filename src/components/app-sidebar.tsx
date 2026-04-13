"use client"

import * as React from "react"
import { 
  Plus, 
  Home, 
  Settings, 
  User, 
  LayoutDashboard,
  MessageSquare,
  Loader2
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { getConversations } from "@/app/(actions)/chat"

const AppSidebar = () => {
  const [history, setHistory] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  const navItems = [
    { title: "Home", url: "/", icon: Home },
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Settings", url: "/settings", icon: Settings },
  ]

  // Tarixni yuklash
  React.useEffect(() => {
    async function fetchHistory() {
      try {
        const data = await getConversations()
        if (!data.error) {
          setHistory(data)
        }
      } catch (err) {
        console.error("Tarixni yuklashda xato:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      {/* 1. HEADER: Yangi Chat */}
      <SidebarHeader className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              className="bg-emerald-600 hover:bg-emerald-700 text-white transition-colors h-10 rounded-xl"
            >
              <a href="/">
                <Plus className="h-5 w-5" />
                <span className="font-medium">Yangi chat</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* 2. ASOSIY NAVIGATSIYA */}
        <SidebarGroup>
          <SidebarGroupLabel>Ilova</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <a href={item.url} className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* 3. CHAT TARIXI (Home pastida) */}
        <SidebarGroup>
          <SidebarGroupLabel>Suhbatlar tarixi</SidebarGroupLabel>
          <SidebarMenu>
            {loading ? (
              <div className="flex p-4 justify-center">
                <Loader2 className="h-4 w-4 animate-spin opacity-50" />
              </div>
            ) : (
              history.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton asChild tooltip={chat.last_message}>
                    <a href={`/history/${chat.id}`} className="flex items-center gap-3">
                      <MessageSquare className="h-4 w-4 shrink-0 opacity-70" />
                      <span className="truncate text-sm">{chat.last_message}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            )}
            {!loading && history.length === 0 && (
              <p className="p-4 text-xs text-muted-foreground text-center">Tarix mavjud emas</p>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* 4. FOOTER: Profil */}
      <SidebarFooter className="p-4 border-t dark:border-zinc-800">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-12 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <a href="/profile" className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex flex-col items-start overflow-hidden text-left">
                  <span className="text-sm font-medium truncate w-full">Foydalanuvchi</span>
                  <span className="text-xs text-muted-foreground truncate w-full">profile@mail.com</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar