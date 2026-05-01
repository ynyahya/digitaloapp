import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Crown, RefreshCw, ShieldCheck, Sparkles, Users, Zap } from "lucide-react";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { PublicGlassCard, PublicMetricPill, PublicOfferingShell, PublicSection, PublicStickyCTA } from "@/components/public-offering/public-offering";
import { creatorHref } from "@/lib/routes/public";

export const revalidate = 120;

type Benefit = { title?: string; description?: string } | string;

function parseBenefits(value: string | null): Benefit[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return value.split("\n").map((item) => item.trim()).filter(Boolean);
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const membership = await db.membership.findFirst({ where: { slug: params.slug, status: "PUBLISHED" }, select: { title: true, description: true, coverImage: true } });
  if (!membership) return {};
  return { title: membership.title, description: membership.description ?? undefined, openGraph: membership.coverImage ? { images: [membership.coverImage] } : undefined };
}

export default async function PublicMembershipPage({ params }: { params: { slug: string } }) {
  const membership = await db.membership.findFirst({
    where: { slug: params.slug, status: "PUBLISHED" },
    include: { creator: { select: { handle: true, displayName: true, avatarUrl: true, verified: true } } },
  });
  if (!membership) notFound();

  const benefits = parseBenefits(membership.benefits);
  const cycle = membership.billingCycle === "YEARLY" ? "year" : "month";
  const joinHref = creatorHref(membership.creator.handle);

  return (
    <PublicOfferingShell>
      <section className="relative overflow-hidden border-b border-white/[0.08]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(180,243,0,0.2),transparent_34%),radial-gradient(circle_at_82%_14%,rgba(124,92,255,0.2),transparent_34%)]" />
        <div className="relative mx-auto grid w-full max-w-[1240px] gap-10 px-6 py-16 md:px-8 md:py-24 lg:grid-cols-[minmax(0,1fr)_420px] lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-lime/20 bg-lime/10 px-3 py-1 text-eyebrow uppercase text-lime"><Crown className="h-3.5 w-3.5" /> Membership</span>
            <h1 className="mt-6 max-w-4xl text-[46px] font-black leading-[0.95] tracking-[-0.055em] text-chalk md:text-[76px]">{membership.title}</h1>
            <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-chalk-muted md:text-[20px]">{membership.description || "Join an ongoing creator experience with recurring value, access, and member-only benefits."}</p>
            <div className="mt-8 flex flex-wrap gap-3 text-[13px] text-chalk-muted">
              <PublicMetricPill icon={Users}>{membership.memberCount} members</PublicMetricPill>
              <PublicMetricPill icon={RefreshCw}>{membership.billingCycle.toLowerCase()} billing</PublicMetricPill>
              <PublicMetricPill icon={ShieldCheck}>Creator-hosted access</PublicMetricPill>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#join" className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-lime px-6 text-[14px] font-bold text-night lime-shadow">Join membership <ArrowRight className="h-4 w-4" /></a>
              <Link href={creatorHref(membership.creator.handle)} className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.035] px-6 text-[14px] font-bold text-chalk hover:bg-white/[0.06]">By {membership.creator.displayName}</Link>
            </div>
          </div>
          <PublicGlassCard className="self-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-lime">Membership tier</p>
            <div className="mt-3 flex items-end gap-2"><p className="text-[44px] font-black tracking-[-0.05em] text-chalk">{formatCurrency(membership.priceCents, membership.currency)}</p><span className="pb-2 text-[13px] text-chalk-muted">/{cycle}</span></div>
            <p className="mt-3 text-[13px] leading-6 text-chalk-muted">Recurring access to benefits curated by {membership.creator.displayName}.</p>
            <div className="mt-5 space-y-2 text-[13px] text-chalk-muted">
              {(benefits.length ? benefits.slice(0, 4) : ["Member-only access", "Recurring creator updates", "Priority announcements"]).map((benefit, index) => (
                <div key={index} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-lime" /><span>{typeof benefit === "string" ? benefit : benefit.title || benefit.description}</span></div>
              ))}
            </div>
            <a href="#join" className="mt-6 flex h-12 w-full items-center justify-center rounded-2xl bg-lime text-[14px] font-bold text-night lime-shadow">Join now</a>
          </PublicGlassCard>
        </div>
      </section>

      <PublicSection eyebrow="Member value" title="What members get" description="Memberships are built around recurring value, not one-time downloads.">
        <div className="grid gap-4 md:grid-cols-2">
          {(benefits.length ? benefits : ["Exclusive content and updates", "Behind-the-scenes creator access", "Member-only resources", "Priority launch access"]).map((benefit, index) => (
            <PublicGlassCard key={index} className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-lime/10 text-lime"><Zap className="h-5 w-5" /></div>
              <div><p className="text-[15px] font-bold text-chalk">{typeof benefit === "string" ? benefit : benefit.title || `Benefit ${index + 1}`}</p>{typeof benefit !== "string" && benefit.description ? <p className="mt-2 text-[13px] leading-6 text-chalk-muted">{benefit.description}</p> : null}</div>
            </PublicGlassCard>
          ))}
        </div>
      </PublicSection>

      <PublicSection eyebrow="Join" title="Start your membership" className="pb-28">
        <div id="join" className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <PublicGlassCard><p className="text-[16px] font-bold text-chalk">Hosted by {membership.creator.displayName}</p><p className="mt-2 text-[13px] leading-6 text-chalk-muted">Membership checkout is prepared through the creator storefront. Visit the creator profile to see all active offers and access instructions.</p></PublicGlassCard>
          <PublicGlassCard><p className="text-[28px] font-black text-chalk">{formatCurrency(membership.priceCents, membership.currency)}<span className="text-[13px] text-chalk-muted">/{cycle}</span></p><Link href={joinHref} className="mt-5 flex h-12 w-full items-center justify-center rounded-2xl bg-lime text-[14px] font-bold text-night">Continue to creator</Link></PublicGlassCard>
        </div>
      </PublicSection>
      <PublicStickyCTA label="Join" href="#join" detail={`${formatCurrency(membership.priceCents, membership.currency)}/${cycle}`} />
    </PublicOfferingShell>
  );
}
