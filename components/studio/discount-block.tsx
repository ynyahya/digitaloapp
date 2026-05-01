"use client";

import { Plus, Trash2, Ticket, Copy, Check, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStudio, parseJsonField } from "@/hooks/use-studio-state";
import { useState } from "react";
import { BlockWrapper } from "./block-wrapper";
import { cn } from "@/lib/utils";

interface DiscountCode {
  code: string;
  type: "PERCENTAGE" | "FIXED";
  amount: number;
  usageLimit: number;
  usedCount: number;
  expiresAt: string | null;
  active: boolean;
}

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function DiscountBlock({ className }: { className?: string }) {
  const { product, setField } = useStudio();
  const codes: DiscountCode[] = parseJsonField<DiscountCode[]>(product.discountCodes, []);

  const [newCode, setNewCode] = useState({
    code: "",
    type: "PERCENTAGE" as "PERCENTAGE" | "FIXED",
    amount: 10,
    usageLimit: 0,
    expiresAt: "",
  });
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const addCode = () => {
    const code = newCode.code || generateCode();
    const updated = [
      ...codes,
      {
        code,
        type: newCode.type,
        amount: newCode.amount,
        usageLimit: newCode.usageLimit,
        usedCount: 0,
        expiresAt: newCode.expiresAt || null,
        active: true,
      },
    ];
    setField("discountCodes", JSON.stringify(updated));
    setNewCode({ code: "", type: "PERCENTAGE", amount: 10, usageLimit: 0, expiresAt: "" });
  };

  const removeCode = (index: number) => {
    const updated = [...codes];
    updated.splice(index, 1);
    setField("discountCodes", JSON.stringify(updated));
  };

  const toggleActive = (index: number) => {
    const updated = [...codes];
    updated[index] = { ...updated[index], active: !updated[index].active };
    setField("discountCodes", JSON.stringify(updated));
  };

  const copyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIdx(index);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <BlockWrapper
      icon={Ticket}
      label="Offers & Discounts"
      description="Promotional codes for your product"
      className={className}
      blockId="discounts"
    >
      <div className="space-y-6">
        {/* Active Codes */}
        <div className="space-y-3">
          {codes.map((code: DiscountCode, i: number) => {
            const expired = isExpired(code.expiresAt);
            return (
              <div
                key={i}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl border border-line bg-paper-soft transition-opacity",
                  !code.active && "opacity-50",
                  expired && "opacity-40 line-through"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => toggleActive(i)}
                    className={cn(
                      "h-5 w-9 rounded-full p-0.5 cursor-pointer transition-colors flex items-center shrink-0",
                      code.active && !expired ? "bg-emerald-500" : "bg-paper-muted border border-line"
                    )}
                    title={code.active ? "Deactivate" : "Activate"}
                  >
                    <div
                      className={cn(
                        "h-4 w-4 rounded-full bg-paper shadow-soft transition-transform",
                        code.active && !expired ? "ml-auto" : "ml-0"
                      )}
                    />
                  </button>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded-md bg-paper border border-line text-[11px] font-bold font-mono tracking-wider">
                        {code.code}
                      </span>
                      <button
                        onClick={() => copyCode(code.code, i)}
                        className="h-5 w-5 rounded-md text-ink-subtle hover:text-ink hover:bg-paper transition-colors flex items-center justify-center"
                        title="Copy code"
                      >
                        {copiedIdx === i ? (
                          <Check className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                    <div className="text-[12px] text-ink-muted mt-0.5">
                      {code.type === "PERCENTAGE" ? `${code.amount}% off` : `$${code.amount} off`}
                      {code.usageLimit > 0 ? ` · ${code.usedCount}/${code.usageLimit} used` : ` · ${code.usedCount} used`}
                      {code.expiresAt ? ` · Exp: ${new Date(code.expiresAt).toLocaleDateString()}` : ""}
                      {expired ? " · EXPIRED" : ""}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCode(i)}
                  className="h-7 w-7 text-red-500 hover:bg-red-50 shrink-0"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            );
          })}
          {codes.length === 0 && (
            <p className="text-[12px] text-ink-muted p-3 border border-dashed rounded-xl border-line">
              No discount codes active.
            </p>
          )}
        </div>

        {/* Create New Code */}
        <div className="pt-4 border-t border-line space-y-4">
          <p className="text-[11px] font-bold text-ink-subtle uppercase tracking-wider">
            Create New Code
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-ink-subtle">CODE</label>
              <div className="flex gap-1">
                <input
                  type="text"
                  value={newCode.code}
                  onChange={(e) =>
                    setNewCode({
                      ...newCode,
                      code: e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ""),
                    })
                  }
                  placeholder="SUMMER25"
                  className="flex-1 bg-paper border border-line rounded-lg px-3 py-2 text-[12px] font-mono focus:border-lime/30/30 outline-none uppercase"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 shrink-0"
                  onClick={() => setNewCode({ ...newCode, code: generateCode() })}
                  title="Generate random code"
                >
                  <RefreshCcw className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-ink-subtle">TYPE</label>
              <select
                value={newCode.type}
                onChange={(e) =>
                  setNewCode({ ...newCode, type: e.target.value as "PERCENTAGE" | "FIXED" })
                }
                className="w-full bg-paper border border-line rounded-lg px-2 py-2 text-[12px] focus:border-lime/30/30 outline-none"
              >
                <option value="PERCENTAGE">% Off</option>
                <option value="FIXED">$ Off</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-ink-subtle">AMOUNT</label>
              <input
                type="number"
                value={newCode.amount}
                onChange={(e) =>
                  setNewCode({ ...newCode, amount: parseInt(e.target.value) || 0 })
                }
                className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-[12px] focus:border-lime/30/30 outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-ink-subtle">USAGE LIMIT</label>
              <input
                type="number"
                value={newCode.usageLimit}
                onChange={(e) =>
                  setNewCode({ ...newCode, usageLimit: parseInt(e.target.value) || 0 })
                }
                placeholder="0 = unlimited"
                className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-[12px] focus:border-lime/30/30 outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-ink-subtle">EXPIRES</label>
              <input
                type="date"
                value={newCode.expiresAt}
                onChange={(e) => setNewCode({ ...newCode, expiresAt: e.target.value })}
                className="w-full bg-paper border border-line rounded-lg px-3 py-2 text-[12px] focus:border-lime/30/30 outline-none"
              />
            </div>
          </div>
          <Button
            onClick={addCode}
            className="h-9 px-4 rounded-lg bg-ink text-paper text-[12px] font-bold"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Add Code
          </Button>
        </div>
      </div>
    </BlockWrapper>
  );
}
