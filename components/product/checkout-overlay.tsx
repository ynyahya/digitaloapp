import { useState, useEffect, useTransition } from "react";
import { X, Lock, Mail, CheckCircle2, Circle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/actions/checkout";

export function CheckoutOverlay({
  product,
  licenses = [],
  isOpen,
  onClose,
}: {
  product: any;
  licenses?: any[];
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
    formData.append("productId", product.id);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-[800px] max-h-[95vh] overflow-y-auto md:overflow-hidden bg-paper rounded-[24px] shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-200 border border-line custom-scrollbar">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 h-8 w-8 flex items-center justify-center rounded-full bg-paper-muted hover:bg-line text-ink transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Left Column: Product Summary */}
        <div className="w-full md:w-[360px] bg-paper-soft p-8 border-r border-line flex flex-col">
          <div className="flex-1">
             <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-paper-muted border border-line mb-6">
                {product.coverImage ? (
                  <img src={product.coverImage} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-ink-subtle">No Cover</div>
                )}
             </div>
             <h3 className="text-[16px] font-bold text-ink leading-snug mb-2">{product.title}</h3>
             <div className="flex items-center justify-between text-[13px]">
                <span className="text-ink-muted">{licenseName}</span>
                <span className="font-bold text-ink">${price.toFixed(2)}</span>
             </div>
          </div>
          
          <div className="pt-6 mt-6 border-t border-line flex items-center gap-3 text-ink-muted text-[12px]">
             <Lock className="h-4 w-4" />
             <span>Secure digital delivery via email.</span>
          </div>
        </div>

        {/* Right Column: Checkout Form */}
        <div className="flex-1 p-8 flex flex-col bg-paper">
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-[20px] font-bold text-ink">Checkout</h2>
             <span className="text-[16px] font-bold text-ink">Total: ${price.toFixed(2)}</span>
          </div>

          <div className="space-y-6 flex-1">
             {/* License Selection */}
             {licenses && licenses.length > 1 && (
               <div className="space-y-3">
                  <label className="text-[12px] font-bold text-ink-subtle uppercase tracking-wider">Select License</label>
                  <div className="space-y-2">
                    {licenses.map(l => (
                      <div 
                        key={l.id} 
                        onClick={() => setSelectedId(l.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          selectedId === l.id ? "border-ink bg-paper shadow-soft" : "border-line bg-paper-soft hover:bg-paper-muted"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                           {selectedId === l.id ? <CheckCircle2 className="h-4 w-4 text-ink" /> : <Circle className="h-4 w-4 text-ink-muted" />}
                           <div>
                             <p className="text-[13px] font-bold text-ink">{l.name}</p>
                           </div>
                        </div>
                        <span className="font-bold text-ink text-[13px]">${(l.priceCents / 100).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
               </div>
             )}

             {/* Contact Info */}
             <div className="space-y-4">
                <div className="space-y-2">
                   <label className="text-[12px] font-bold text-ink-subtle uppercase tracking-wider">Full Name</label>
                   <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
                      <input 
                        type="text" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full h-12 bg-paper border border-line rounded-xl pl-11 pr-4 text-[14px] text-ink placeholder:text-ink-subtle focus:border-ink/40 transition-all outline-none"
                      />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[12px] font-bold text-ink-subtle uppercase tracking-wider">Contact Email</label>
                   <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full h-12 bg-paper border border-line rounded-xl pl-11 pr-4 text-[14px] text-ink placeholder:text-ink-subtle focus:border-ink/40 transition-all outline-none"
                      />
                   </div>
                   <p className="text-[11px] text-ink-muted mt-1">Where should we send your files?</p>
                </div>
             </div>

             {/* Payment Methods */}
             <div className="space-y-3 pt-2">
                <label className="text-[12px] font-bold text-ink-subtle uppercase tracking-wider">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                   <button className="h-16 rounded-xl border-2 border-ink bg-paper shadow-soft flex items-center justify-center transition-all">
                      <span className="font-bold text-ink text-[15px]">Card / Stripe</span>
                   </button>
                   <button className="h-16 rounded-xl border border-line bg-paper-soft hover:bg-paper-muted flex items-center justify-center transition-all">
                      <span className="font-bold text-ink-muted hover:text-ink text-[15px]">PayPal</span>
                   </button>
                </div>
             </div>
          </div>

          {/* Checkout Button */}
          <div className="pt-8">
             <Button 
                onClick={handlePay}
                disabled={isPending}
                className="w-full h-12 rounded-xl bg-ink hover:bg-ink/90 text-paper font-bold text-[15px] shadow-card"
             >
                {isPending ? "Processing..." : `Pay $${(price).toFixed(2)}`}
             </Button>
             <p className="text-center text-[11px] text-ink-muted mt-4 flex items-center justify-center gap-1.5">
                <Lock className="h-3 w-3" />
                Payments are secure and encrypted.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
}
