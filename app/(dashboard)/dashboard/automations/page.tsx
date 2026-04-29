"use client";

import { Bot, Zap, Shield, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AutomationsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-ink">AI Agent Control Center</h1>
          <p className="text-[14px] text-ink-muted">Deploy and manage autonomous agents to optimize your business.</p>
        </div>
        <Button className="rounded-xl shadow-float h-11 px-6 bg-ink text-paper">
          <Plus className="mr-2 h-4 w-4" />
          Deploy New Agent
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center py-24 px-6">
        <Card className="rounded-3xl border-line bg-paper shadow-soft max-w-[500px] w-full">
          <CardContent className="p-12 text-center space-y-6">
            <div className="h-16 w-16 rounded-3xl bg-paper-muted flex items-center justify-center mx-auto">
              <Sparkles className="h-8 w-8 text-ink-subtle" />
            </div>
            <div className="space-y-2">
              <h3 className="text-[20px] font-bold">No Active Agents</h3>
              <p className="text-[14px] text-ink-muted max-w-[320px] mx-auto">
                AI-powered automation agents help you run your store on autopilot. Deploy pricing, growth, and support agents to optimize your business.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-4">
              <MiniFeature icon={Bot} label="Pricing Agent" />
              <MiniFeature icon={Zap} label="Growth Agent" />
              <MiniFeature icon={Shield} label="Support Agent" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MiniFeature({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-paper-soft border border-line">
      <Icon className="h-5 w-5 text-ink-subtle" />
      <span className="text-[11px] font-bold text-ink-subtle">{label}</span>
    </div>
  );
}
