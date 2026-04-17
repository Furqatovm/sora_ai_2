"use client"

import * as React from "react"
import { ArrowUp, Bot, Loader2, Copy, Volume2, RotateCcw, Check, Zap, Sparkles, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { askAI, getChatHistory } from "@/app/(actions)/chat"
import ReactMarkdown from 'react-markdown'

interface MessageType {
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatInput({ initialConvId }: { initialConvId?: number }) {
    const [text, setText] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [messages, setMessages] = React.useState<MessageType[]>([]);
    const [convId, setConvId] = React.useState<number | null>(initialConvId || null);
    const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);
    
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    // TEXTAREA BALANDLIGINI AVTOMATIK OSHIRISH
    React.useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [text]);

    React.useEffect(() => {
        if (initialConvId) {
            const fetchHistory = async () => {
                setLoading(true);
                try {
                    const data = await getChatHistory(initialConvId);
                    if (Array.isArray(data)) setMessages(data);
                } catch (error) {
                    console.error("History error:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchHistory();
        }
    }, [initialConvId]);

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const handleSend = async (overrideText?: string) => {
        const query = overrideText || text;
        if (!query.trim() || loading) return;

        if (!overrideText) {
            setMessages(prev => [...prev, { role: 'user', content: query }]);
            setText(""); 
        }
        
        setLoading(true);
        try {
            const data = await askAI(query, convId);
            if (data.error) {
                setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ Xato: " + data.error }]);
            } else {
                setConvId(data.conversation_id);
                setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ Server bilan aloqa uzildi." }]);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (content: string, index: number) => {
        navigator.clipboard.writeText(content);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#171717] relative overflow-hidden">
            
            {/* Xabarlar maydoni - Pastdan joy tashlaymiz (pb-32) */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-smooth pb-32">
                <div className="max-w-3xl mx-auto w-full px-4 py-8">
                    
                    {messages.length === 0 && !loading && (
                        <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-500">
                            <div className="h-20 w-20 rounded-[2.5rem] bg-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-600/20">
                                <Zap className="h-10 w-10 text-white fill-white" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                                    Sora <span className="text-emerald-600">AI</span>
                                </h2>
                                <p className="text-zinc-500 dark:text-zinc-400 max-w-[320px] mx-auto text-sm leading-relaxed">
                                    Bugun sizga qanday yordam bera olaman? Istalgan savolingizni bering.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-md pt-4">
                                <SuggestionCard text="Insho yozishga yordam ber" onClick={handleSend} />
                                <SuggestionCard text="Dasturlash bo'yicha maslahat" onClick={handleSend} />
                            </div>
                        </div>
                    )}

                    {messages.map((msg, i) => (
                        <div key={i} className={`flex gap-5 mb-10 ${msg.role === 'user' ? "flex-row-reverse" : "flex-row"}`}>
                            <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border ${
                                msg.role === 'assistant' 
                                ? "bg-emerald-500/10 border-emerald-500/20" 
                                : "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                            }`}>
                                {msg.role === 'assistant' ? <Bot className="h-5 w-5 text-emerald-600" /> : <UserIcon size={18} className="text-zinc-500" />}
                            </div>
                            
                            <div className="flex flex-col space-y-2 max-w-[85%]">
                                <div className={`prose dark:prose-invert prose-sm max-w-none px-1 text-[15px] leading-relaxed ${
                                    msg.role === 'user' ? "text-zinc-800 dark:text-zinc-200" : "text-zinc-700 dark:text-zinc-300"
                                }`}>
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>

                                {msg.role === 'assistant' && (
                                    <div className="flex items-center gap-3 pt-1">
                                        <ActionButton onClick={() => copyToClipboard(msg.content, i)}>
                                            {copiedIndex === i ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                        </ActionButton>
                                        <ActionButton><Volume2 size={14} /></ActionButton>
                                        {i === messages.length - 1 && (
                                            <ActionButton onClick={() => handleSend(messages[i-1].content)}>
                                                <RotateCcw size={14} />
                                            </ActionButton>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    
                    {loading && (
                        <div className="flex gap-5 items-center pl-1 animate-pulse">
                            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                            </div>
                            <span className="text-sm font-medium text-emerald-600/60 tracking-tight">O'ylamoqda...</span>
                        </div>
                    )}
                </div>
            </div>
            
            {/* FIXED INPUT FIELD */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-[#171717] dark:via-[#171717]/90 backdrop-blur-sm">
                <div className="max-w-3xl mx-auto relative group">
                    <div className="relative flex items-end bg-zinc-50 dark:bg-[#212121] rounded-[1.5rem] border border-zinc-200 dark:border-zinc-800 focus-within:border-emerald-500/50 focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all duration-300 shadow-lg">
                        <textarea 
                            ref={textareaRef}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder="Sora AI dan so'rang..."
                            className="w-full bg-transparent border-none outline-none resize-none p-4 pr-14 text-[15px] max-h-[200px] min-h-[56px] text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-500 overflow-y-auto"
                            rows={1}
                        />
                        <div className="absolute right-2.5 bottom-2.5">
                            <Button 
                                onClick={() => handleSend()} 
                                disabled={loading || !text.trim()} 
                                className="h-10 w-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all active:scale-95 disabled:bg-zinc-200 dark:disabled:bg-zinc-800"
                            >
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowUp size={20} strokeWidth={2.5} />}
                            </Button>
                        </div>
                    </div>
                    <p className="text-[10px] text-center mt-3 text-zinc-400 font-medium tracking-tight uppercase opacity-60">
                         Built with Gemini AI &middot; 2026 Sora AI
                    </p>
                </div>
            </div>
        </div>
    );
}

// Yordamchi komponentlar (Tegilmagan)
function SuggestionCard({ text, onClick }: { text: string, onClick: (t: string) => void }) {
    return (
        <button 
            onClick={() => onClick(text)}
            className="p-4 text-left border border-zinc-100 dark:border-zinc-800 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all group"
        >
            <Sparkles className="h-4 w-4 text-emerald-500 mb-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-emerald-600 transition-colors">{text}</span>
        </button>
    );
}

function ActionButton({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) {
    return (
        <button 
            onClick={onClick}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
            {children}
        </button>
    );
}