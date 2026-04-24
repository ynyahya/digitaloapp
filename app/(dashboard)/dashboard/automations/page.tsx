import { Bot, Play, Zap, Shield, Cpu, Network, Activity, Settings2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const AGENTS = [
  { name: "Pricing Agent", status: "AUTONOMOUS", impact: "+$1,240", efficiency: "98%", tasks: 142 },
  { name: "Growth Agent", status: "SEMI-AUTONOMOUS", impact: "+420 leads", efficiency: "94%", tasks: 86 },
  { name: "Support Agent", status: "ASSIST", impact: "2.4h saved", efficiency: "99%", tasks: 1205 },
  { name: "Launch Agent", status: "IDLE", impact: "-", efficiency: "-", tasks: 0 },
];

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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <AgentStatCard title="Active Agents" value="3" icon={Bot} />
        <AgentStatCard title="Tasks Automated" value="1,433" icon={Zap} />
        <AgentStatCard title="Revenue Impact" value="+$1,240" icon={Activity} />
        <AgentStatCard title="System Autonomy" value="High" icon={Shield} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
           <div className="grid grid-cols-2 gap-4">
             {AGENTS.map((agent) => (
               <Card key={agent.name} className="rounded-2xl border-line bg-paper shadow-soft transition-all hover:shadow-card group overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-10 w-10 rounded-xl bg-paper-muted flex items-center justify-center text-ink group-hover:bg-ink group-hover:text-paper transition-colors">
                        <Cpu className="h-5 w-5" />
                      </div>
                      <Badge variant="outline" className={cn(
                        "rounded-full text-[10px] uppercase font-bold",
                        agent.status === "AUTONOMOUS" && "border-emerald-200 bg-emerald-50 text-emerald-700",
                        agent.status === "SEMI-AUTONOMOUS" && "border-blue-200 bg-blue-50 text-blue-700",
                        agent.status === "ASSIST" && "border-line bg-paper-muted text-ink-muted",
                        agent.status === "IDLE" && "border-line bg-paper-soft text-ink-subtle",
                      )}>
                        {agent.status}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-[15px] font-bold text-ink">{agent.name}</h3>
                      <div className="flex items-center gap-4 text-[11px] text-ink-muted">
                        <span>Efficiency: <strong>{agent.efficiency}</strong></span>
                        <span>Tasks: <strong>{agent.tasks}</strong></span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-line flex items-center justify-between">
                       <div className="text-[12px] font-bold text-emerald-600">{agent.impact}</div>
                       <Button variant="ghost" size="sm" className="h-7 rounded-lg text-[11px] font-bold px-2">
                         <Settings2 className="mr-1.5 h-3 w-3" />
                         Configure
                       </Button>
                    </div>
                  </div>
               </Card>
             ))}
           </div>

           <Card className="rounded-2xl border-line bg-paper shadow-soft overflow-hidden">
             <CardHeader className="border-b border-line bg-paper-soft px-6 py-4">
               <CardTitle className="text-[15px] font-semibold">Agent Collaboration Network</CardTitle>
             </CardHeader>
             <CardContent className="h-[300px] flex items-center justify-center p-12 bg-grid-lines">
                <div className="relative w-full h-full">
                   {/* Abstract Diagram with CSS/SVG */}
                   <svg viewBox="0 0 400 200" className="w-full h-full text-ink opacity-20">
                     <circle cx="200" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
                     <circle cx="80" cy="60" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
                     <circle cx="320" cy="60" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
                     <circle cx="200" cy="180" r="25" fill="none" stroke="currentColor" strokeWidth="1" />
                     
                     <line x1="120" y1="75" x2="165" y2="85" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                     <line x1="235" y1="85" x2="290" y2="75" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                     <line x1="200" y1="140" x2="200" y2="155" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                   </svg>
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[11px] font-bold uppercase tracking-widest text-ink">Core Engine</div>
                </div>
             </CardContent>
           </Card>
        </div>

        <div className="space-y-6">
           <Card className="rounded-2xl border-line bg-paper shadow-soft overflow-hidden">
             <CardHeader className="border-b border-line bg-paper-soft px-6 py-4">
               <CardTitle className="text-[15px] font-semibold">Autonomous Activity</CardTitle>
             </CardHeader>
             <CardContent className="p-0">
               <div className="divide-y divide-line">
                 {[
                   { msg: "Pricing optimized (+5%)", time: "2m ago", agent: "Pricing" },
                   { msg: "Growth campaign launched", time: "14m ago", agent: "Growth" },
                   { msg: "Cart recovery sequence sent", time: "1h ago", agent: "Revenue" },
                   { msg: "Fraud risk detected & blocked", time: "3h ago", agent: "System" },
                 ].map((a, i) => (
                   <div key={i} className="px-6 py-4 flex items-start gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5" />
                      <div className="space-y-0.5">
                        <p className="text-[12.5px] font-medium text-ink">{a.msg}</p>
                        <p className="text-[11px] text-ink-muted">{a.agent} · {a.time}</p>
                      </div>
                   </div>
                 ))}
               </div>
             </CardContent>
           </Card>

           <Card className="rounded-2xl border border-ink bg-ink p-6 text-paper shadow-float">
             <h3 className="text-[16px] font-bold">System Health</h3>
             <p className="mt-2 text-[13px] opacity-70 leading-relaxed">
               All autonomous agents are operating within safety thresholds. Efficiency is up <strong>14%</strong> since last deployment.
             </p>
             <Button variant="secondary" className="mt-6 w-full h-10 rounded-xl bg-paper text-ink border-none hover:bg-paper-soft">
               <Network className="mr-2 h-4 w-4" />
               View Agent Logs
             </Button>
           </Card>
        </div>
      </div>
    </div>
  );
}

function AgentStatCard({ title, value, icon: Icon }: any) {
  return (
    <Card className="rounded-2xl border-line shadow-soft bg-paper">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-widest text-ink-subtle">{title}</p>
          <Icon className="h-4 w-4 text-ink-subtle" />
        </div>
        <p className="mt-2 text-[24px] font-bold tracking-tight text-ink">{value}</p>
      </CardContent>
    </Card>
  );
}
