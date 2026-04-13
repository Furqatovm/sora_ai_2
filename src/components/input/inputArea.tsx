"use client"

import * as React from "react"
import { ArrowUp, Bot, Loader2, Copy, Volume2, RotateCcw, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { askAI, getChatHistory } from "@/app/(actions)/chat"
import ReactMarkdown from 'react-markdown'

interface ChatInputProps {
    initialConvId?: number;
}

export default function ChatInput({ initialConvId }: ChatInputProps) {
    const [text, setText] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [messages, setMessages] = React.useState<{ role: string, content: string }[]>([]);
    const [convId, setConvId] = React.useState<number | null>(initialConvId || null);
    const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);
    const scrollRef = React.useRef<HTMLDivElement>(null);

    // 1. Tarixni yuklash (useEffect)
    React.useEffect(() => {
        if (initialConvId) {
            const fetchHistory = async () => {
                setLoading(true);
                try {
                    const data = await getChatHistory(initialConvId);
                    // Backend formatiga qarab tekshiramiz
                    if (Array.isArray(data)) {
                        setMessages(data);
                    } else if (data && data.messages) {
                        setMessages(data.messages);
                    }
                } catch (error) {
                    console.error("Tarixni yuklashda xato:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchHistory();
        }
    }, [initialConvId]);

    // 2. Avto-scroll
    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const handleSend = async (overrideText?: string) => {
        const query = overrideText || text;
        if (!query.trim() || loading) return;

        if (!overrideText) setText(""); 
        
        if (!overrideText) {
            setMessages(prev => [...prev, { role: 'user', content: query }]);
        }
        
        setLoading(true);

        try {
            const data = await askAI(query, convId);
            if (data.error) {
                setMessages(prev => [...prev, { role: 'ai', content: "Xato yuz berdi: " + data.error }]);
            } else {
                setConvId(data.conversation_id);
                setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
            }
        } catch {
            setMessages(prev => [...prev, { role: 'ai', content: "Ulanish xatosi" }]);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (content: string, index: number) => {
        navigator.clipboard.writeText(content);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const readAloud = (content: string) => {
        const utterance = new SpeechSynthesisUtterance(content);
        utterance.lang = 'uz-UZ';
        window.speechSynthesis.speak(utterance);
    };

    const handleRegenerate = () => {
        const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
        if (lastUserMessage) {
            handleSend(lastUserMessage.content);
        }
    };

    return (
        <div className="flex flex-col h-[90vh] bg-white dark:bg-[#212121] overflow-hidden">
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth">
                <div className="max-w-3xl mx-auto w-full">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex gap-4 mb-8 ${msg.role === 'user' ? "justify-end" : "justify-start"}`}>
                            {msg.role === 'ai' && (
                                <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                    <Bot className="h-5 w-5 text-emerald-600" />
                                </div>
                            )}
                            
                            <div className={`group relative p-4 rounded-2xl max-w-[85%] ${msg.role === 'user' ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200" : "bg-transparent border border-transparent"}`}>
                                <div className="prose dark:prose-invert prose-sm max-w-none">
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>

                                {msg.role === 'ai' && (
                                    <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => copyToClipboard(msg.content, i)} className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors text-zinc-500">
                                            {copiedIndex === i ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                        </button>
                                        <button onClick={() => readAloud(msg.content)} className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors text-zinc-500">
                                            <Volume2 size={14} />
                                        </button>
                                        {i === messages.length - 1 && (
                                            <button onClick={handleRegenerate} className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors text-zinc-500">
                                                <RotateCcw size={14} />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    
                    {loading && messages.length === 0 && (
                        <div className="flex justify-center p-10">
                            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                        </div>
                    )}

                    {loading && messages.length > 0 && (
                        <div className="flex gap-4 items-center animate-pulse opacity-50">
                            <Bot className="h-6 w-6 text-emerald-500" />
                            <span className="text-sm italic">O'ylamoqda...</span>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="p-4 border-t dark:border-zinc-800 bg-white dark:bg-[#212121]">
                <div className="max-w-3xl mx-auto">
                    <div className="relative flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-2xl border dark:border-zinc-700 shadow-sm focus-within:ring-1 focus-within:ring-emerald-500 transition-all">
                        <textarea 
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder="Xabar yozing..."
                            className="w-full bg-transparent border-none outline-none resize-none p-4 pr-12 text-sm max-h-40 min-h-[56px]"
                            rows={1}
                        />
                        <div className="absolute right-2 bottom-2">
                            <Button 
                                onClick={() => handleSend()} 
                                disabled={loading || !text.trim()} 
                                size="icon"
                                className="h-10 w-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-transform active:scale-95"
                            >
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowUp size={20} />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}