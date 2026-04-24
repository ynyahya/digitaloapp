"use client";

import { Plus, Trash2, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStudio } from "@/hooks/use-studio-state";
import { useState } from "react";
import { BlockWrapper } from "./block-wrapper";

export function DiscountBlock({ className }: { className?: string }) {
  const { product, setField } = useStudio();
  let codes: any[] = [];
  try {
    codes = product.discountCodes ? JSON.parse(product.discountCodes) : [];
  } catch {
    codes = [];
  }
  
  const [newCode, setNewCode] = useState({ code: "", type: "PERCENTAGE", amount: 10, usageLimit: 0 });

  const addCode = () => {
    if (!newCode.code) return;
    const updated = [...codes, { ...newCode, usedCount: 0 }];
    setField("discountCodes", JSON.stringify(updated));
    setNewCode({ code: "", type: "PERCENTAGE", amount: 10, usageLimit: 0 });
  };

  const removeCode = (index: number) => {
    const updated = [...codes];
    updated.splice(index, 1);
    setField("discountCodes", JSON.stringify(updated));
  };

  return (
    <BlockWrapper 
      icon={Ticket} 
      label="Offers & Discounts" 
      className={className}
    >
      <div className="space-y-6">
        {/* Active Codes */}
        <div className="space-y-3">
          {codes.map((code: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-line bg-paper-soft">
              <div className="flex items-center gap-3">
                <div className="px-2 py-1 rounded-md bg-paper border border-line text-[11px] font-bold font-mono tracking-wider">
                  {code.code}
                </div>
                <div className="text-[12px] text-ink-muted">
                  {code.type === "PERCENTAGE" ? `${code.amount}% off` : `$${code.amount} off`}
                  {code.usageLimit > 0 ? ` · ${code.usedCount}/${code.usageLimit} used` : ` · ${code.usedCount} used`}
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeCode(i)} className="h-7 w-7 text-red-500 hover:bg-red-50">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
          {codes.length === 0 && (
            <p className="text-[12px] text-ink-muted p-3 border border-dashed rounded-xl border-line">No discount codes active.</p>
          )}
        </div>

        {/* Create New Code */}
        <div className="pt-4 border-t border-line space-y-4">
          <p className="text-[11px] font-bold text-ink-subtle uppercase tracking-wider">Create New Code</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-ink-subtle">CODE</label>
              <input 
                type="text" 
                value={newCode.code}
                onChange={(e) => setNewCode({ ...newCode, code: e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "") })}
                placeholder="SUMMER25"
                className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-[12px] font-mono focus:border-ink/30 outline-none uppercase"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-ink-subtle">TYPE</label>
              <select 
                value={newCode.type}
                onChange={(e) => setNewCode({ ...newCode, type: e.target.value })}
                className="w-full bg-paper border border-line rounded-lg px-2 py-2 text-[12px] focus:border-ink/30 outline-none"
              >
                <option value="PERCENTAGE">% Off</option>
                <option value="FIXED">$ Off</option>
              </select>
            </div>
          </div>
          <div className="flex items-end gap-3">
            <div className="flex-1 space-y-1.5">
              <label className="text-[10px] font-bold text-ink-subtle">AMOUNT</label>
              <input 
                type="number" 
                value={newCode.amount}
                onChange={(e) => setNewCode({ ...newCode, amount: parseInt(e.target.value) || 0 })}
                className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-[12px] focus:border-ink/30 outline-none"
              />
            </div>
            <Button onClick={addCode} disabled={!newCode.code} className="h-9 px-4 rounded-lg bg-ink text-paper text-[12px] font-bold">
              <Plus className="h-3.5 w-3.5 mr-1" /> Add
            </Button>
          </div>
        </div>
      </div>
    </BlockWrapper>
  );
}
