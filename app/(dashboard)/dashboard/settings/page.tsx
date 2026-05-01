"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import { Bell, CheckCircle2, CreditCard, ExternalLink, Globe, LockKeyhole, Save, Shield, Store, User, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CommandHero, MetricTile, WorkflowRail } from "../_components/command-center";

interface SettingsData {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  avatarUrl: string | null;
  storeName: string;
  storeHandle: string;
  stripeConnected: boolean;
  emailNotifications: boolean;
  marketingEmails: boolean;
  salesAlerts: boolean;
  twoFactorEnabled: boolean;
}

const defaultSettings: SettingsData = {
  firstName: "",
  lastName: "",
  email: "",
  bio: "",
  avatarUrl: null,
  storeName: "",
  storeHandle: "",
  stripeConnected: false,
  emailNotifications: true,
  marketingEmails: false,
  salesAlerts: true,
  twoFactorEnabled: false,
};

const tabs = [
  { id: "profile", label: "Profile", icon: User, description: "Identity and creator credibility" },
  { id: "store", label: "Storefront", icon: Store, description: "Public brand, URL, and availability" },
  { id: "payments", label: "Payments", icon: CreditCard, description: "Payout readiness and processing" },
  { id: "notifications", label: "Notifications", icon: Bell, description: "Operational alerts and email preferences" },
  { id: "security", label: "Security", icon: Shield, description: "Account protection and access" },
] as const;

type TabId = typeof tabs[number]["id"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const readiness = useMemo(() => {
    const checks = [
      Boolean(settings.firstName || settings.lastName || settings.email),
      Boolean(settings.bio),
      Boolean(settings.storeName && settings.storeHandle),
      settings.stripeConnected,
      settings.twoFactorEnabled,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [settings]);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const updateSetting = <K extends keyof SettingsData>(key: K, value: SettingsData[K]) => setSettings((prev) => ({ ...prev, [key]: value }));
  const initials = settings.firstName && settings.lastName ? `${settings.firstName[0]}${settings.lastName[0]}`.toUpperCase() : settings.email ? settings.email[0].toUpperCase() : "?";

  return (
    <div className="space-y-8 pb-12">
      <CommandHero
        eyebrow="Settings Control Center"
        title="Atur fondasi bisnis: identity, storefront, payments, notifications, dan security."
        description="Settings bukan halaman sampingan. Ini command center untuk memastikan brand, payment, alerts, dan trust layer siap mendukung semua produk, course, service, event, bundle, dan membership."
        icon={Workflow}
        accent="from-slate-300/20 via-lime/10 to-transparent"
      >
        <WorkflowRail
          title="Business readiness"
          items={[
            { label: "Creator identity", description: "Name, email, avatar, and bio", done: Boolean(settings.firstName || settings.lastName || settings.email) },
            { label: "Storefront", description: "Store name and public handle", done: Boolean(settings.storeName && settings.storeHandle) },
            { label: "Payments", description: "Stripe payout setup", done: settings.stripeConnected },
            { label: "Notifications", description: "Sales and account alerts", done: settings.emailNotifications || settings.salesAlerts },
            { label: "Security", description: "Two-factor and password hygiene", done: settings.twoFactorEnabled },
          ]}
        />
      </CommandHero>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricTile icon={CheckCircle2} label="Setup readiness" value={`${readiness}%`} helper="Core account configuration" tone="lime" />
        <MetricTile icon={Globe} label="Storefront" value={settings.storeHandle || "Not set"} helper="Public creator URL handle" tone="blue" />
        <MetricTile icon={CreditCard} label="Payments" value={settings.stripeConnected ? "Connected" : "Pending"} helper="Required for payouts" tone={settings.stripeConnected ? "emerald" : "amber"} />
        <MetricTile icon={LockKeyhole} label="Security" value={settings.twoFactorEnabled ? "2FA on" : "Basic"} helper="Account protection state" tone={settings.twoFactorEnabled ? "emerald" : "rose"} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
        <Card className="h-fit rounded-3xl border-white/[0.08] bg-night/70 shadow-soft">
          <CardContent className="p-3">
            {tabs.map((tab) => <NavButton key={tab.id} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} icon={tab.icon} label={tab.label} description={tab.description} />)}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {activeTab === "profile" ? <ProfilePanel settings={settings} initials={initials} updateSetting={updateSetting} onSave={handleSave} isSaving={isSaving} saveSuccess={saveSuccess} /> : null}
          {activeTab === "store" ? <StorePanel settings={settings} updateSetting={updateSetting} onSave={handleSave} isSaving={isSaving} saveSuccess={saveSuccess} /> : null}
          {activeTab === "payments" ? <PaymentsPanel settings={settings} updateSetting={updateSetting} /> : null}
          {activeTab === "notifications" ? <NotificationsPanel settings={settings} updateSetting={updateSetting} onSave={handleSave} isSaving={isSaving} saveSuccess={saveSuccess} /> : null}
          {activeTab === "security" ? <SecurityPanel settings={settings} updateSetting={updateSetting} onSave={handleSave} isSaving={isSaving} saveSuccess={saveSuccess} /> : null}
        </div>
      </div>
    </div>
  );
}

function ProfilePanel({ settings, initials, updateSetting, onSave, isSaving, saveSuccess }: PanelProps & { initials: string }) {
  return (
    <SettingsCard title="Creator profile" description="Make your account credible across storefronts, builders, and buyer touchpoints.">
      <div className="flex items-center gap-6 rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border-2 border-white/[0.08] bg-white/[0.06] text-[24px] font-bold text-chalk-dim">
          {settings.avatarUrl ? <Image src={settings.avatarUrl} alt="Avatar" className="h-full w-full object-cover" width={80} height={80} /> : initials}
        </div>
        <div className="space-y-2"><Button variant="outline" size="sm" className="h-9 rounded-xl border-white/[0.08] text-[12px] font-bold">Change avatar</Button><p className="text-[11px] text-chalk-muted">JPG, GIF or PNG. Max size of 2MB.</p></div>
      </div>
      <div className="grid gap-5 md:grid-cols-2"><Field label="First name"><Input value={settings.firstName} onChange={(e) => updateSetting("firstName", e.target.value)} placeholder="Enter your first name" /></Field><Field label="Last name"><Input value={settings.lastName} onChange={(e) => updateSetting("lastName", e.target.value)} placeholder="Enter your last name" /></Field></div>
      <Field label="Email address"><Input value={settings.email} onChange={(e) => updateSetting("email", e.target.value)} placeholder="your@email.com" /></Field>
      <Field label="Bio"><Textarea value={settings.bio} onChange={(e) => updateSetting("bio", e.target.value)} placeholder="Tell buyers why they can trust your work..." className="min-h-[120px]" /></Field>
      <SaveButton onSave={onSave} isSaving={isSaving} saveSuccess={saveSuccess} label="Save profile" />
    </SettingsCard>
  );
}

function StorePanel({ settings, updateSetting, onSave, isSaving, saveSuccess }: PanelProps) {
  return (
    <SettingsCard title="Storefront operating layer" description="Keep your public brand, handle, and store availability production-ready.">
      <Field label="Store name"><Input value={settings.storeName} onChange={(e) => updateSetting("storeName", e.target.value)} placeholder="My Digital Store" /></Field>
      <Field label="Custom URL"><div className="flex items-center gap-2"><span className="text-[14px] text-chalk-dim">TESKEL.app/c/</span><Input value={settings.storeHandle} onChange={(e) => updateSetting("storeHandle", e.target.value)} placeholder="your-handle" className="flex-1" /><Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl border border-white/[0.08]"><ExternalLink className="h-4 w-4" /></Button></div></Field>
      <ToggleRow title="Maintenance mode" description="Take your store offline while making major changes." />
      <SaveButton onSave={onSave} isSaving={isSaving} saveSuccess={saveSuccess} label="Update storefront" />
    </SettingsCard>
  );
}

function PaymentsPanel({ settings, updateSetting }: { settings: SettingsData; updateSetting: UpdateSetting }) {
  return (
    <SettingsCard title="Payments and payout readiness" description="Connect payment processing before scaling paid launches.">
      <div className="rounded-[28px] border border-white/[0.08] bg-white/[0.035] p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-blue-400/20 bg-blue-500/10"><CreditCard className="h-8 w-8 text-blue-300" /></div>
        <h3 className="mt-6 text-[20px] font-bold text-chalk">{settings.stripeConnected ? "Stripe connected" : "Connect your Stripe account"}</h3>
        <p className="mx-auto mt-2 max-w-md text-[14px] leading-6 text-chalk-muted">We use Stripe to process payments and send payouts to your bank account.</p>
        <Button onClick={() => updateSetting("stripeConnected", true)} className="mt-6 h-12 rounded-2xl bg-[#635BFF] px-8 font-bold text-white hover:bg-[#5249E0]">{settings.stripeConnected ? "Refresh Stripe status" : "Connect with Stripe"}</Button>
        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-medium text-lime"><CheckCircle2 className="h-3.5 w-3.5" />Secure payment processing by Stripe</div>
      </div>
    </SettingsCard>
  );
}

function NotificationsPanel({ settings, updateSetting, onSave, isSaving, saveSuccess }: PanelProps) {
  return (
    <SettingsCard title="Notification command rules" description="Choose what should interrupt you and what can wait.">
      <ToggleRow title="Email notifications" description="Receive updates about your account and products." checked={settings.emailNotifications} onCheckedChange={(v) => updateSetting("emailNotifications", v)} />
      <Separator />
      <ToggleRow title="Sales alerts" description="Get notified when you make a sale." checked={settings.salesAlerts} onCheckedChange={(v) => updateSetting("salesAlerts", v)} />
      <Separator />
      <ToggleRow title="Marketing emails" description="Receive tips, product updates, and promotional offers." checked={settings.marketingEmails} onCheckedChange={(v) => updateSetting("marketingEmails", v)} />
      <SaveButton onSave={onSave} isSaving={isSaving} saveSuccess={saveSuccess} label="Save preferences" />
    </SettingsCard>
  );
}

function SecurityPanel({ settings, updateSetting, onSave, isSaving, saveSuccess }: PanelProps) {
  return (
    <SettingsCard title="Security and access" description="Protect the account that controls your products, customers, and payouts.">
      <ToggleRow title="Two-factor authentication" description="Add an extra layer of security to your account." checked={settings.twoFactorEnabled} onCheckedChange={(v) => updateSetting("twoFactorEnabled", v)} />
      <Separator />
      <div className="grid gap-4"><Field label="Current password"><Input type="password" placeholder="Enter current password" /></Field><Field label="New password"><Input type="password" placeholder="Enter new password" /></Field><Field label="Confirm new password"><Input type="password" placeholder="Confirm new password" /></Field></div>
      <SaveButton onSave={onSave} isSaving={isSaving} saveSuccess={saveSuccess} label="Update security" />
    </SettingsCard>
  );
}

type UpdateSetting = <K extends keyof SettingsData>(key: K, value: SettingsData[K]) => void;
type PanelProps = { settings: SettingsData; updateSetting: UpdateSetting; onSave: () => void; isSaving: boolean; saveSuccess: boolean };

function SettingsCard({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <Card className="rounded-3xl border-white/[0.08] bg-night/70 shadow-soft"><CardHeader className="border-b border-white/[0.08] px-8 py-6"><CardTitle className="text-[17px] font-bold">{title}</CardTitle><p className="text-[13px] text-chalk-muted">{description}</p></CardHeader><CardContent className="space-y-6 p-8">{children}</CardContent></Card>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}

function ToggleRow({ title, description, checked, onCheckedChange }: { title: string; description: string; checked?: boolean; onCheckedChange?: (value: boolean) => void }) {
  return <div className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5"><div className="space-y-0.5"><h4 className="text-[14px] font-bold text-chalk">{title}</h4><p className="text-[12px] text-chalk-muted">{description}</p></div><Switch checked={checked} onCheckedChange={onCheckedChange} /></div>;
}

function SaveButton({ onSave, isSaving, saveSuccess, label }: { onSave: () => void; isSaving: boolean; saveSuccess: boolean; label: string }) {
  return <div className="flex justify-end pt-2"><Button onClick={onSave} disabled={isSaving} className="h-11 rounded-xl bg-lime px-8 font-bold text-night shadow-float"><Save className="mr-2 h-4 w-4" />{isSaving ? "Saving..." : saveSuccess ? "Saved!" : label}</Button></div>;
}

function NavButton({ active, onClick, icon: Icon, label, description }: { active: boolean; onClick: () => void; icon: LucideIcon; label: string; description: string }) {
  return (
    <button onClick={onClick} className={cn("w-full rounded-2xl p-4 text-left transition-all", active ? "bg-lime text-night shadow-soft" : "text-chalk hover:bg-white/[0.035]")}>
      <div className="flex items-center gap-3"><Icon className={cn("h-4 w-4", active ? "text-lime" : "text-chalk-dim")} /><span className="text-[14px] font-bold">{label}</span></div>
      <p className={cn("mt-1 pl-7 text-[11px] leading-4", active ? "text-night/60" : "text-chalk-muted")}>{description}</p>
    </button>
  );
}
