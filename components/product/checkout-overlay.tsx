import { useState, useEffect, useTransition } from "react";
import { X, Lock, Mail, CheckCircle2, Circle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/actions/checkout";
import Image from "next/image";

export function CheckoutOverlay({
  product,
  licenses = [],
  isOpen,
  onClose,
}: {
  product: { id?: string; title: string; coverImage?: string; priceCents: number };
  licenses?: { id: string; name: string; priceCents: number }[];
  isOpen: boolean;
  onClose: () => void;
}) {
  const [selectedId, setSelectedId] = useState(licenses[0]?.id);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [isPending, startTransition] = useTransition();

  // Reset selection when modal opens
  useEffect(() => {
    if (isOpen && licenses.length > 0) setSelectedId(licenses[0].id);
  }, [isOpen, licenses]);

  const handlePay = () => {
    if (!email || !fullName) return alert("Please fill in your name and email.");
    
    const formData = new FormData();
    formData.append("productId", product.id || "");
    formData.append("licenseId", selectedId || "");
    formData.append("email", email);
    
    const nameParts = fullName.trim().split(" ");
    formData.append("firstName", nameParts[0]);
    formData.append("lastName", nameParts.slice(1).join(" "));

    startTransition(async () => {
       try {
         await createOrder(formData);
       } catch (error) {
         console.error("Order failed:", error);
         alert("Order failed. Please try again.");
       }
    });
  };

  if (!isOpen) return null;

  const selectedLicense = licenses.find(l => l.id === selectedId) || licenses[0];
  const price = selectedLicense ? selectedLicense.priceCents / 100 : product.priceCents / 100;
  const licenseName = selectedLicense ? selectedLicense.name : "Standard License";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-lime/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-[800px] max-h-[95vh] overflow-y-auto md:overflow-hidden bg-night rounded-[24px] shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-200 border border-white/[0.08] custom-scrollbar">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 h-8 w-8 flex items-center justify-center rounded-full bg-white/[0.06] hover:bg-line text-chalk transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Left Column: Product Summary */}
        <div className="w-full md:w-[360px] bg-white/[0.035] p-8 border-r border-white/[0.08] flex flex-col">
          <div className="flex-1">
             <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-white/[0.06] border border-white/[0.08] mb-6">
                {product.coverImage ? (
                  <Image 
                    src={product.coverImage} 
                    alt={product.title} 
                    className="w-full h-full object-cover" 
                    width={360}
                    height={270}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-chalk-dim">No Cover</div>
                )}
             </div>
             <h3 className="text-[16px] font-bold text-chalk leading-snug mb-2">{product.title}</h3>
             <div className="flex items-center justify-between text-[13px]">
                <span className="text-chalk-muted">{licenseName}</span>
                <span className="font-bold text-chalk">${price.toFixed(2)}</span>
             </div>
          </div>
          
          <div className="pt-6 mt-6 border-t border-white/[0.08] flex items-center gap-3 text-chalk-muted text-[12px]">
             <Lock className="h-4 w-4" />
             <span>Secure digital delivery via email.</span>
          </div>
        </div>

        {/* Right Column: Checkout Form */}
        <div className="flex-1 p-8 flex flex-col bg-night">
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-[20px] font-bold text-chalk">Checkout</h2>
             <span className="text-[16px] font-bold text-chalk">Total: ${price.toFixed(2)}</span>
          </div>

          <div className="space-y-6 flex-1">
             {/* License Selection */}
             {licenses && licenses.length > 1 && (
               <div className="space-y-3">
                  <label className="text-[12px] font-bold text-chalk-dim uppercase tracking-wider">Select License</label>
                  <div className="space-y-2">
                    {licenses.map(l => (
                      <div 
                        key={l.id} 
                        onClick={() => setSelectedId(l.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          selectedId === l.id ? "border-lime/30 bg-night shadow-soft" : "border-white/[0.08] bg-white/[0.035] hover:bg-white/[0.06]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                           {selectedId === l.id ? <CheckCircle2 className="h-4 w-4 text-chalk" /> : <Circle className="h-4 w-4 text-chalk-muted" />}
                           <div>
                             <p className="text-[13px] font-bold text-chalk">{l.name}</p>
                           </div>
                        </div>
                        <span className="font-bold text-chalk text-[13px]">${(l.priceCents / 100).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
               </div>
             )}

             {/* Contact Info */}
             <div className="space-y-4">
                <div className="space-y-2">
                   <label className="text-[12px] font-bold text-chalk-dim uppercase tracking-wider">Full Name</label>
                   <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-chalk-muted" />
                      <input 
                        type="text" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full h-12 bg-night border border-white/[0.08] rounded-xl pl-11 pr-4 text-[14px] text-chalk placeholder:text-chalk-dim focus:border-lime/30/40 transition-all outline-none"
                      />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[12px] font-bold text-chalk-dim uppercase tracking-wider">Contact Email</label>
                   <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-chalk-muted" />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full h-12 bg-night border border-white/[0.08] rounded-xl pl-11 pr-4 text-[14px] text-chalk placeholder:text-chalk-dim focus:border-lime/30/40 transition-all outline-none"
                      />
                   </div>
                   <p className="text-[11px] text-chalk-muted mt-1">Where should we send your files?</p>
                </div>
             </div>

             {/* Payment Methods */}
             <div className="space-y-3 pt-2">
                <label className="text-[12px] font-bold text-chalk-dim uppercase tracking-wider">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                   <button className="h-16 rounded-xl border-2 border-lime/30 bg-night shadow-soft flex items-center justify-center transition-all">
                      <span className="font-bold text-chalk text-[15px]">Card / Stripe</span>
                   </button>
                   <button className="h-16 rounded-xl border border-white/[0.08] bg-white/[0.035] hover:bg-white/[0.06] flex items-center justify-center transition-all">
                      <span className="font-bold text-chalk-muted hover:text-chalk text-[15px]">PayPal</span>
                   </button>
                </div>
             </div>
          </div>

          {/* Checkout Button */}
          <div className="pt-8">
             <Button 
                onClick={handlePay}
                disabled={isPending}
                className="w-full h-12 rounded-xl bg-lime hover:bg-lime/90 text-night font-bold text-[15px] shadow-card"
             >
                {isPending ? "Processing..." : `Pay $${(price).toFixed(2)}`}
             </Button>
             <p className="text-center text-[11px] text-chalk-muted mt-4 flex items-center justify-center gap-1.5">
                <Lock className="h-3 w-3" />
                Payments are secure and encrypted.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
}
