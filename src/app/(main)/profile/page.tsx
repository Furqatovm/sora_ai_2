"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  ShieldCheck, 
  LogOut, 
  Settings2, 
  Mail, 
  Calendar,
  ChevronRight,
  Zap
} from 'lucide-react';
import Cookies from 'js-cookie';

const Profile = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = Cookies.get('username');
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
    } else {
      setUsername(savedUser || "Foydalanuvchi");
    }
  }, [router]);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('username');
    router.push('/login');
  };

  return (
    <div className="max-w-[800px] mx-auto py-10 px-6 space-y-12">
      {/* 1. Profil Sarlavhasi (Header) */}
      <div className="flex items-center justify-between pb-8 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center relative">
            <User className="w-10 h-10 text-zinc-400" />
            <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-emerald-600 rounded-lg border-2 border-white dark:border-[#171717] flex items-center justify-center">
              <Zap className="w-3 h-3 text-white fill-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white leading-tight">
              {username}
            </h1>
            <p className="text-sm text-zinc-500 font-medium">Sora AI Pro Foydalanuvchisi</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
          title="Chiqish"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Ma'lumotlar va Sozlamalar (Oddiy ro'yxat ko'rinishida) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        
        {/* Shaxsiy ma'lumotlar qismi */}
        <section className="space-y-4">
          <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest px-1">
            Hisob ma'lumotlari
          </h3>
          <div className="space-y-1">
            <InfoRow icon={User} label="Foydalanuvchi nomi" value={username || "Yuklanmoqda..."} />
            <InfoRow icon={Mail} label="Elektron pochta" value="foydalanuvchi@mail.com" />
            <InfoRow icon={Calendar} label="A'zo bo'lgan sana" value="Aprel, 2026" />
          </div>
        </section>

        {/* Xavfsizlik va holat qismi */}
        <section className="space-y-4">
          <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest px-1">
            Xizmat holati
          </h3>
          <div className="space-y-1">
            <div className="group flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer border border-transparent">
               <div className="flex items-center gap-3">
                 <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                 </div>
                 <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Premium obuna</span>
               </div>
               <span className="text-[10px] bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">FAOL</span>
            </div>

            <div className="group flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer border border-transparent">
               <div className="flex items-center gap-3">
                 <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:rotate-45 transition-transform">
                    <Settings2 className="w-4 h-4" />
                 </div>
                 <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Sozlamalar</span>
               </div>
               <ChevronRight className="w-4 h-4 text-zinc-300" />
            </div>
          </div>
        </section>

      </div>

      {/* 3. Foydalanish statistikasi (Minimalistik chiziq) */}
      <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex justify-between items-end mb-3">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">AI Limit</h4>
            <p className="text-xs text-zinc-500">Bugungi so'rovlar qoldig'i</p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-600">84/100</span>
        </div>
        <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-600 w-[84%] rounded-full" />
        </div>
      </div>
    </div>
  );
};

// Yordamchi komponent: Ma'lumot qatori uchun
const InfoRow = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="flex items-center gap-4 p-3 border-b border-zinc-50 dark:border-zinc-900/50 last:border-0">
    <Icon className="w-4 h-4 text-zinc-400 shrink-0" />
    <div className="flex flex-col">
      <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-tighter leading-none mb-1">{label}</span>
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{value}</span>
    </div>
  </div>
);

export default Profile;