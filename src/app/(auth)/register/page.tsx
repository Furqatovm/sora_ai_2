"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, Loader2, ArrowRight, UserPlus } from 'lucide-react';

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: 'Muvaffaqiyatli ro‘yxatdan o‘tdingiz! Yo‘naltirilmoqda...' });
        // Muvaffaqiyatli bo'lsa, 1.5 sekunddan keyin login sahifasiga o'tadi
        setTimeout(() => router.push('/login'), 1500);
      } else {
        setStatus({ type: 'error', message: data.error || 'Xatolik yuz berdi' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Serverga ulanishda xatolik!' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="-h-screen flex items-center justify-center bg-white dark:bg-[#171717] p-4 relative overflow-hidden font-sans">
      {/* Dekorativ effektlar (Login bilan bir xil aura) */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />

      <div className="w-full max-w-[420px] z-10">
        <div className="bg-white dark:bg-[#212121] border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-8 md:p-10 shadow-xl shadow-black/5">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 mb-5">
              <UserPlus className="text-emerald-600 dark:text-emerald-500 w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Ro'yxatdan o'tish</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm font-medium">Yangi hisob yaratish uchun ma'lumotlarni kiriting</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 ml-1 uppercase tracking-[1px]">
                Foydalanuvchi nomi
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors w-5 h-5" />
                <input
                  type="text"
                  required
                  placeholder="Yangi username"
                  className="w-full pl-11 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-zinc-400"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 ml-1 uppercase tracking-[1px]">
                Maxfiy parol
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors w-5 h-5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all placeholder:text-zinc-400"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {/* Status Messages */}
            {status.message && (
              <div className={`text-sm p-4 rounded-xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
                status.type === 'success' 
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                  : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
              }`}>
                <div className={`w-2 h-2 rounded-full shrink-0 ${status.type === 'success' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="font-medium">{status.message}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6 shadow-xl shadow-emerald-500/20"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Hisob yaratish
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Login sahifasiga qaytish */}
          <div className="mt-8 text-center border-t border-zinc-100 dark:border-zinc-800 pt-6">
            <p className="text-zinc-500 dark:text-zinc-500 text-sm font-medium">
              Hisobingiz bormi?{' '}
              <button 
                onClick={() => router.push('/login')}
                className="text-emerald-600 dark:text-emerald-500 font-bold hover:underline underline-offset-4 decoration-2"
              >
                Kirish
              </button>
            </p>
          </div>
        </div>
        
        {/* Footer */}
        <p className="text-center text-zinc-400 dark:text-zinc-600 text-[11px] mt-8 font-medium">
          &copy; 2026 AI CHAT SYSTEM. BARCHA HUQUQLAR HIMOYALANGAN.
        </p>
      </div>
    </div>
  );
};

export default Register;