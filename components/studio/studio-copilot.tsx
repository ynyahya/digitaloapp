"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Bot, X, Sparkles, Send, Command, Lightbulb, 
  ChevronRight, ArrowRight, Zap, Target, Layout, 
  CheckCircle2, AlertCircle, RefreshCcw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useStudio } from "@/hooks/use-studio-state";

export function StudioCopilot() {
  const { isCopilotOpen, setCopilotOpen, product, setField } = useStudio();
  const [messages, setMessages] = useState<Array<{role: 'user' | 'ai', content: string}>>([
    { 
      role: 'ai', 
      content: "Hello! I'm your Digitalo Copilot. I can help you optimize your product for maximum conversion. What would you like to do today?" 
    }
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isCopilotOpen) return null;

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput("");
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: "I've analyzed your request. I recommend adding more specific highlights about the PDF deliverables to increase trust by 15%." 
      }]);
    }, 1000);
  };

  const suggestions = [
    { label: "Improve description", icon: Layout },
    { label: "Suggest pricing", icon: Zap },
    { label: "Check SEO score", icon: Target },
    { label: "Generate highlights", icon: Sparkles },
  ];

  return (
    <div className={cn(
      "fixed inset-y-0 right-0 w-full sm:w-[400px] bg-paper border-l border-line z-[150] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300",
      !isCopilotOpen && "hidden"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-line bg-paper-soft/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-ink flex items-center justify-center text-paper">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-ink">Digitalo Copilot</h3>
            <div className="flex items-center gap-1.5">
               <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-bold text-ink-subtle uppercase tracking-widest">AI Online</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setCopilotOpen(false)}>
          <X className="h-4 w-4 text-ink-subtle" />
        </Button>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-paper">
        {messages.map((msg, i) => (
          <div key={i} className={cn(
            "flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
            msg.role === 'user' ? "flex-row-reverse" : ""
          )}>
            <div className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
              msg.role === 'ai' ? "bg-ink text-paper" : "bg-paper-muted text-ink-subtle border border-line"
            )}>
              {msg.role === 'ai' ? <Bot className="h-4 w-4" /> : <div className="text-[10px] font-bold">ME</div>}
            </div>
            <div className={cn(
              "max-w-[85%] rounded-[18px] px-4 py-3 text-[13px] leading-relaxed",
              msg.role === 'ai' ? "bg-paper-soft text-ink border border-line" : "bg-ink text-paper"
            )}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-line bg-paper-soft/50">
        <div className="flex flex-wrap gap-2 mb-4">
          {suggestions.map((s, i) => (
            <button 
              key={i} 
              className="px-3 py-1.5 rounded-lg border border-line bg-paper hover:bg-paper-muted text-[11px] font-bold text-ink-muted transition-all flex items-center gap-2"
              onClick={() => setInput(s.label)}
            >
              <s.icon className="h-3 w-3" />
              {s.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about your product..."
            className="w-full h-12 bg-paper border border-line rounded-xl pl-4 pr-24 text-[13px] text-ink outline-none focus:border-ink/20 transition-all shadow-soft"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
             <div className="flex items-center gap-1 opacity-20 mr-1">
                <Command className="h-3 w-3" />
                <span className="text-[10px] font-bold">ENTER</span>
             </div>
             <Button size="icon" className="h-8 w-8 rounded-lg bg-ink text-paper" onClick={handleSend}>
                <Send className="h-3.5 w-3.5" />
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
