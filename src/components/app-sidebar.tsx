"use client"

import * as React from "react"
import { 
  Plus, 
  Home, 
  Settings, 
  User, 
  LayoutDashboard,
  MessageSquare,
  Loader2,
  Zap,
  Clock
} from "lucide-react"
import Cookies from "js-cookie"
import { usePathname } from "next/navigation"

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
  const pathname = usePathname()
  const [history, setHistory] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [user, setUser] = React.useState<{username: string} | null>(null)

  const navItems = [
    { title: "Bosh sahifa", url: "/", icon: Home },
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Sozlamalar", url: "/settings", icon: Settings },
  ]

  React.useEffect(() => {
    const savedUser = Cookies.get('username')
    if (savedUser) setUser({ username: savedUser })

    async function fetchHistory() {
      try {
        const data = await getConversations()
        if (!data.error) setHistory(data)
      } catch (err) {
        console.error("History error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r border-zinc-200 dark:border-zinc-800">
      {/* 1. HEADER: LOGO VA YANGI CHAT */}
      <SidebarHeader className="p-4 space-y-4">
        <a href="/" className="flex items-center gap-3 px-2 py-1">
          <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-600/20">
            <Zap className="h-5 w-5 text-white fill-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-white group-data-[collapsible=icon]:hidden">
            Sora <span className="text-emerald-600">AI</span>
          </span>
        </a>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all h-11 rounded-xl shadow-sm"
            >
              <a href="/">
                <Plus className="h-5 w-5 mr-2" />
                <span className="font-semibold">Yangi suhbat</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* 2. ASOSIY NAVIGATSIYA */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[11px] font-bold uppercase tracking-wider text-zinc-400">Menyu</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === item.url}
                  className="rounded-lg h-10 px-4 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
                  tooltip={item.title}
                >
                  <a href={item.url} className="flex items-center gap-3">
                    <item.icon className={`h-4 w-4 ${pathname === item.url ? 'text-emerald-600' : 'text-zinc-500'}`} />
                    <span className="font-medium text-sm">{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* 3. CHAT TARIXI */}
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="px-4 text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <Clock className="h-3 w-3" /> Tarix
          </SidebarGroupLabel>
          <SidebarMenu className="mt-2">
            {loading ? (
              <div className="flex p-6 justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-emerald-600 opacity-40" />
              </div>
            ) : (
              history.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton 
                    asChild 
                    className="rounded-lg h-9 px-4 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 group"
                    tooltip={chat.last_message}
                  >
                    <a href={`/history/${chat.id}`} className="flex items-center gap-3">
                      <MessageSquare className="h-4 w-4 shrink-0 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                      <span className="truncate text-[13px] text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                        {chat.last_message}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            )}
            {!loading && history.length === 0 && (
              <p className="px-6 py-2 text-xs text-zinc-500 italic">Suhbatlar hali yo'q</p>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* 4. FOOTER: PROFIL */}
      <SidebarFooter className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              className="h-14 rounded-xl hover:bg-white dark:hover:bg-zinc-800 shadow-none hover:shadow-sm border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 transition-all"
            >
              <a href="/profile" className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                </div>
                <div className="flex flex-col items-start overflow-hidden text-left flex-1">
                  <span className="text-sm font-bold truncate w-full text-zinc-900 dark:text-zinc-100 leading-none mb-1">
                    {user ? user.username : "Mehmon"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-tighter">
                      Premium
                    </span>
                  </div>
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