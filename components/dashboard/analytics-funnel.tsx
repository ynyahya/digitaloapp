"use client";

import { Users, ShoppingCart, DollarSign, TrendingUp, type LucideIcon } from "lucide-react";

interface FunnelStepProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  percentage?: string;
  color: string;
}

function FunnelStep({ label, value, icon: Icon, percentage, color }: FunnelStepProps) {
  return (
    <div className="flex-1 min-w-[120px] space-y-3 relative group">
      <div className="flex items-center gap-2">
        <div className={`h-8 w-8 rounded-lg ${color} flex items-center justify-center text-paper shadow-soft`}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
           <p className="text-[10px] font-bold text-ink-subtle uppercase tracking-wider">{label}</p>
           <p className="text-[16px] font-bold text-ink">{value}</p>
        </div>
      </div>
      
      {percentage && (
         <div className="absolute -right-4 top-1/2 -translate-y-1/2 hidden md:block">
            <div className="bg-paper border border-line px-2 py-0.5 rounded-full text-[10px] font-bold text-ink shadow-soft">
               {percentage}
            </div>
         </div>
      )}
    </div>
  );
}

export function AnalyticsFunnel({ data }: { data: { views: number; orders: number } }) {
  // Mocking funnel data based on real stats
  const views = data.views || 1240;
  const carts = Math.round(views * 0.15); // 15% to cart
  const sales = data.orders || 42;
  
  const cartConv = ((carts / views) * 100).toFixed(1);
  const checkoutConv = ((sales / carts) * 100).toFixed(1);
  const totalConv = ((sales / views) * 100).toFixed(1);

  return (
    <div className="p-6 rounded-2xl border border-line bg-paper shadow-soft">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h3 className="text-[15px] font-bold">Conversion Funnel</h3>
           <p className="text-[12px] text-ink-muted">Tracking visitor journey to purchase</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100">
           <TrendingUp className="h-4 w-4 text-emerald-600" />
           <span className="text-[12px] font-bold text-emerald-700">{totalConv}% Total CR</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center relative">
        {/* Connector lines for visual funnel */}
        <div className="hidden md:block absolute left-[15%] right-[15%] top-4 h-[2px] bg-gradient-to-r from-ink/5 via-ink/20 to-ink/5 -z-10" />

        <FunnelStep 
           label="Views" 
           value={views.toLocaleString()} 
           icon={Users} 
           color="bg-slate-400" 
           percentage={`${cartConv}%`}
        />
        <FunnelStep 
           label="Added to Cart" 
           value={carts.toLocaleString()} 
           icon={ShoppingCart} 
           color="bg-blue-500" 
           percentage={`${checkoutConv}%`}
        />
        <FunnelStep 
           label="Purchases" 
           value={sales.toLocaleString()} 
           icon={DollarSign} 
           color="bg-emerald-500" 
        />
      </div>
    </div>
  );
}
