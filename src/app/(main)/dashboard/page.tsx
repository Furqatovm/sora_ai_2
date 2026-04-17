"use client"

import * as React from "react"
import { 
  MessageSquare, 
  Zap, 
  Clock, 
  ArrowUpRight, 
  TrendingUp,
  BrainCircuit
} from "lucide-react"
import { getConversations } from "@/app/(actions)/chat"

export default function DashboardPage() {
  const [history, setHistory] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchHistory() {
      try {
        const data = await getConversations()
        if (!data.error) setHistory(data.slice(0, 5)) // Faqat oxirgi 5 tasini ko'rsatish
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  return (
    <div className="max-w-[1000px] mx-auto w-full py-10 px-6 space-y-12">
      
      {/* 1. WELCOME SECTION */}
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-emerald-600 mb-2">
          <BrainCircuit size={18} />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Sizning AI tahlilingiz</span>
        </div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Xush kelibsiz, <span className="text-zinc-400 font-medium">Dashboardga</span>
        </h1>
      </header>

      {/* 2. STATS GRID (Minimalist) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard 
          icon={MessageSquare} 
          label="Jami suhbatlar" 
          value={history.length.toString()} 
          subValue="+2 bugun" 
        />
        <StatCard 
          icon={Zap} 
          label="AI Limit" 
          value="84%" 
          subValue="Premium faol" 
          isEmerald 
        />
        <StatCard 
          icon={TrendingUp} 
          label="Tahlil samaradorligi" 
          value="98.2%" 
          subValue="Juda yuqori" 
        />
      </div>

      {/* 3. RECENT ACTIVITY (Oxirgi suhbatlar) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
            <Clock size={16} className="text-zinc-400" /> Oxirgi faolliklar
          </h3>
          <a href="/" className="text-[11px] font-bold text-emerald-600 hover:underline flex items-center gap-1 uppercase tracking-wider">
            Barchasi <ArrowUpRight size={12} />
          </a>
        </div>

        <div className="space-y-1">
          {loading ? (
             <div className="h-20 flex items-center justify-center text-zinc-400 text-sm italic">Ma'lumotlar yuklanmoqda...</div>
          ) : history.length > 0 ? (
            history.map((chat) => (
              <div 
                key={chat.id}
                className="group flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-white dark:group-hover:bg-zinc-700 transition-colors shadow-sm">
                    <MessageSquare size={18} className="text-zinc-500" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate leading-none mb-1.5">
                      {chat.last_message}
                    </span>
                    <span className="text-xs text-zinc-400 flex items-center gap-2">
                       Suhbat ID: #{chat.id} &middot; 2 daqiqa avval
                    </span>
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-2 text-zinc-400 hover:text-emerald-600 transition-all">
                  <ArrowUpRight size={18} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-center py-10 text-zinc-500 text-sm italic">Hali suhbatlar mavjud emas.</p>
          )}
        </div>
      </section>

      {/* 4. UPGRADE BANNER (Silliq va minimalist) */}
      <div className="p-8 rounded-[2rem] bg-zinc-900 dark:bg-emerald-600/10 border border-zinc-800 dark:border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="relative z-10 space-y-2">
          <h4 className="text-lg font-bold text-white leading-tight">Sora AI Enterprise imkoniyatlari</h4>
          <p className="text-zinc-400 dark:text-emerald-100/60 text-sm max-w-[400px]">
            Cheksiz xotira va maxsus tahlil modellariga ega bo'lish uchun jamoaviy rejaga o'ting.
          </p>
        </div>
        <button className="relative z-10 px-6 py-3 bg-white text-zinc-900 hover:bg-zinc-100 rounded-xl font-bold text-sm transition-all active:scale-95 whitespace-nowrap">
          Batafsil ma'lumot
        </button>
        {/* Background bezak */}
        <Zap className="absolute -right-6 -bottom-6 h-32 w-32 text-white/5 rotate-12" />
      </div>

    </div>
  )
}

// Yordamchi komponent: StatCard
function StatCard({ icon: Icon, label, value, subValue, isEmerald }: { 
  icon: any, 
  label: string, 
  value: string, 
  subValue: string, 
  isEmerald?: boolean 
}) {
  return (
    <div className="p-6 rounded-[1.5rem] bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-4 ${
        isEmerald ? "bg-emerald-500/10 text-emerald-600" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
      }`}>
        <Icon size={20} />
      </div>
      <div className="space-y-1">
        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">{label}</p>
        <div className="flex items-baseline gap-2">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{value}</h2>
          <span className={`text-[10px] font-bold ${isEmerald ? "text-emerald-600" : "text-zinc-500"}`}>
            {subValue}
          </span>
        </div>
      </div>
    </div>
  )
}