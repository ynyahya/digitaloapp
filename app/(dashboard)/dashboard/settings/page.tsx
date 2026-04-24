"use client";

import { useState } from "react";
import { User, Store, CreditCard, Bell, Shield, Globe, ExternalLink, Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-8 max-w-[1000px]">
      <div>
        <h1 className="text-[28px] font-semibold tracking-tight text-ink">Settings</h1>
        <p className="text-[14px] text-ink-muted">Configure your account and marketplace preferences.</p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Nav */}
        <div className="w-64 space-y-1 shrink-0">
           <NavButton active={activeTab === "profile"} onClick={() => setActiveTab("profile")} icon={User} label="Profile" />
           <NavButton active={activeTab === "store"} onClick={() => setActiveTab("store")} icon={Store} label="Storefront" />
           <NavButton active={activeTab === "payments"} onClick={() => setActiveTab("payments")} icon={CreditCard} label="Payments" />
           <NavButton active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} icon={Bell} label="Notifications" />
           <NavButton active={activeTab === "security"} onClick={() => setActiveTab("security")} icon={Shield} label="Security" />
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
           {activeTab === "profile" && (
              <Card className="rounded-3xl border-line bg-paper shadow-soft">
                <CardHeader className="border-b border-line px-8 py-6">
                  <CardTitle className="text-[17px] font-bold">Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                   <div className="flex items-center gap-6">
                      <div className="h-20 w-20 rounded-3xl bg-paper-muted border-2 border-line flex items-center justify-center text-[24px] font-bold text-ink-subtle">
                        AM
                      </div>
                      <div className="space-y-2">
                         <Button variant="outline" size="sm" className="h-9 rounded-xl border-line text-[12px] font-bold">
                           Change Avatar
                         </Button>
                         <p className="text-[11px] text-ink-muted">JPG, GIF or PNG. Max size of 2MB.</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" defaultValue="Alex" />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" defaultValue="Morgan" />
                      </div>
                   </div>

                   <div className="space-y-1.5">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" defaultValue="alex@digitalo.app" readOnly className="bg-paper-soft text-ink-muted" />
                   </div>

                   <div className="space-y-1.5">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" placeholder="Founder of Digitalo..." className="min-h-[100px]" />
                   </div>

                   <div className="flex justify-end pt-4">
                      <Button className="h-11 px-8 rounded-xl bg-ink text-paper font-bold shadow-float">
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                   </div>
                </CardContent>
              </Card>
           )}

           {activeTab === "store" && (
              <Card className="rounded-3xl border-line bg-paper shadow-soft">
                <CardHeader className="border-b border-line px-8 py-6">
                  <CardTitle className="text-[17px] font-bold">Storefront Settings</CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                   <div className="space-y-1.5">
                      <Label htmlFor="storeName">Store Name</Label>
                      <Input id="storeName" defaultValue="Alex's Digital Assets" />
                   </div>
                   <div className="space-y-1.5">
                      <Label htmlFor="storeUrl">Custom URL</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] text-ink-subtle">digitalo.app/</span>
                        <Input id="storeUrl" defaultValue="alex" className="flex-1" />
                        <Button variant="ghost" size="icon" className="h-10 w-10 border border-line rounded-xl">
                           <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                   </div>

                   <div className="flex items-center justify-between p-6 rounded-2xl border border-line bg-paper-soft">
                      <div className="space-y-1">
                        <h4 className="text-[14px] font-bold">Maintenance Mode</h4>
                        <p className="text-[12px] text-ink-muted">Take your store offline while you make changes.</p>
                      </div>
                      <Switch />
                   </div>

                   <div className="flex justify-end pt-4">
                      <Button className="h-11 px-8 rounded-xl bg-ink text-paper font-bold shadow-float">
                        <Save className="mr-2 h-4 w-4" />
                        Update Store
                      </Button>
                   </div>
                </CardContent>
              </Card>
           )}

           {activeTab === "payments" && (
              <Card className="rounded-3xl border-line bg-paper shadow-soft overflow-hidden">
                <div className="p-12 text-center space-y-6">
                   <div className="h-16 w-16 rounded-3xl bg-blue-50 flex items-center justify-center mx-auto">
                      <CreditCard className="h-8 w-8 text-blue-600" />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-[20px] font-bold">Connect your Stripe account</h3>
                      <p className="text-[14px] text-ink-muted max-w-[400px] mx-auto">
                        We use Stripe to process payments and send payouts to your bank account.
                      </p>
                   </div>
                   <div className="pt-4">
                      <Button className="h-12 px-8 rounded-xl bg-[#635BFF] hover:bg-[#5249E0] text-white font-bold border-none shadow-float">
                         Connect with Stripe
                      </Button>
                   </div>
                   <div className="flex items-center justify-center gap-2 text-[11px] font-medium text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Secure payment processing by Stripe
                   </div>
                </div>
              </Card>
           )}

           {activeTab !== "profile" && activeTab !== "store" && activeTab !== "payments" && (
              <div className="py-20 text-center">
                 <h3 className="text-[16px] font-bold text-ink">Implementation in Progress</h3>
                 <p className="text-[13px] text-ink-muted mt-1">This module for <strong>{activeTab}</strong> will be updated soon.</p>
              </div>
           )}
        </div>
      </div>
    </div>
  );
}

function NavButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14px] font-medium transition-all",
        active ? "bg-paper-muted text-ink shadow-soft" : "text-ink-muted hover:bg-paper-soft hover:text-ink"
      )}
    >
      <Icon className={cn("h-4 w-4", active ? "text-ink" : "text-ink-subtle")} />
      {label}
    </button>
  );
}
