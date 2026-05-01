import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, RefreshCw, ShieldCheck, Sparkles, Star } from "lucide-react";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { createServiceInquiry } from "@/lib/actions/service-inquiries";

export const dynamic = "force-dynamic";
export const revalidate = 120;

type ServicePackage = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  deliveryDays: number;
  revisions: number;
};

type ServiceFaq = { id: string; question: string; answer: string };
type ServiceScope = { id: string; label: string; included: boolean };

function parseArray<T>(value: string | null): T[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = await db.service.findFirst({
    where: { slug: params.slug, status: "PUBLISHED" },
    select: { title: true, description: true, metaTitle: true, metaDescription: true, coverImage: true },
  });
  if (!service) return {};
  return {
    title: service.metaTitle ?? service.title,
    description: service.metaDescription ?? service.description ?? undefined,
    openGraph: service.coverImage ? { images: [service.coverImage] } : undefined,
  };
}

export default async function PublicServicePage({ params, searchParams }: { params: { slug: string }; searchParams?: { inquiry?: string } }) {
  const service = await db.service.findFirst({
    where: { slug: params.slug, status: "PUBLISHED" },
    include: { creator: { select: { handle: true, displayName: true, avatarUrl: true, verified: true } } },
  });
  if (!service) notFound();

  const packages = parseArray<ServicePackage>(service.packagesJson);
  const outcomes = parseArray<string>(service.outcomesJson);
  const proof = parseArray<string>(service.proofJson);
  const faqs = parseArray<ServiceFaq>(service.faqJson);
  const scope = parseArray<ServiceScope>(service.scopeJson);
  const signature = packages[0] ?? {
    id: "signature",
    name: "Signature package",
    description: service.promise ?? "Clear scope, timeline, and revision policy.",
    priceCents: service.priceCents,
    deliveryDays: service.deliveryDays,
    revisions: service.revisions,
  };

  return (
    <div className="min-h-screen bg-night text-chalk">
      <section className="relative overflow-hidden border-b border-white/[0.08]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 top-0 h-[520px] w-[520px] rounded-full bg-lime/20 blur-3xl" />
          <div className="absolute inset-0 grid-dark-fine opacity-30" />
        </div>
        <div className="relative mx-auto grid w-full max-w-[1240px] gap-10 px-6 py-20 md:px-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-lime/20 bg-lime/10 px-3 py-1 text-eyebrow uppercase text-lime">
              <Sparkles className="h-3.5 w-3.5" /> {service.category || "Service"}
            </span>
            <h1 className="mt-6 max-w-4xl text-[48px] font-black leading-[0.96] tracking-[-0.05em] text-chalk md:text-[82px]">
              {service.title}
            </h1>
            <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-chalk-muted md:text-[20px]">
              {service.promise || service.description || "A premium service package built for clear outcomes."}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-[13px] text-chalk-muted">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5"><Clock className="h-4 w-4 text-lime" /> {service.deliveryDays} day delivery</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5"><RefreshCw className="h-4 w-4 text-lime" /> {service.revisions} revisions</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5"><Star className="h-4 w-4 text-lime" /> {service.ratingAvg ? `${service.ratingAvg.toFixed(1)} rating` : "New offer"}</span>
            </div>
          </div>

          <aside className="rounded-[28px] border border-white/[0.08] bg-white/[0.035] p-5 shadow-2xl shadow-black/25 backdrop-blur-xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-lime">{signature.name}</p>
            <p className="mt-3 text-[38px] font-black tracking-[-0.05em] text-chalk">{formatCurrency(signature.priceCents, service.currency)}</p>
            <p className="mt-2 text-[13px] leading-relaxed text-chalk-muted">{signature.description}</p>
            <div className="mt-5 grid gap-2 text-[13px] text-chalk-muted">
              <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-lime" /> {signature.deliveryDays} day delivery</span>
              <span className="flex items-center gap-2"><RefreshCw className="h-4 w-4 text-lime" /> {signature.revisions} revisions included</span>
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-lime" /> Secure TESKEL checkout-ready offer</span>
            </div>
            <a href="#inquiry" className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-lime text-[14px] font-bold text-night lime-shadow">
              Request this service <ArrowRight className="h-4 w-4" />
            </a>
            <p className="mt-4 text-center text-[11px] text-chalk-dim">Hosted by {service.creator.displayName}</p>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1240px] gap-10 px-6 py-16 md:px-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-12">
          {service.description ? <div className="prose prose-invert max-w-none prose-p:text-chalk-muted prose-p:leading-relaxed">{service.description.split("\n").map((item, index) => item.trim() ? <p key={index}>{item}</p> : null)}</div> : null}

          {outcomes.length > 0 ? (
            <div>
              <h2 className="text-[28px] font-black tracking-[-0.04em] text-chalk">Outcomes</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {outcomes.map((item) => <div key={item} className="flex gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-lime" /><p className="text-[14px] text-chalk-muted">{item}</p></div>)}
              </div>
            </div>
          ) : null}

          {scope.length > 0 ? (
            <div>
              <h2 className="text-[28px] font-black tracking-[-0.04em] text-chalk">Scope</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-[24px] border border-lime/20 bg-lime/10 p-5"><p className="text-[13px] font-bold text-lime">Included</p><ul className="mt-3 space-y-2 text-[13px] text-chalk-muted">{scope.filter((item) => item.included).map((item) => <li key={item.id}>• {item.label}</li>)}</ul></div>
                <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.025] p-5"><p className="text-[13px] font-bold text-chalk">Not included</p><ul className="mt-3 space-y-2 text-[13px] text-chalk-muted">{scope.filter((item) => !item.included).map((item) => <li key={item.id}>• {item.label}</li>)}</ul></div>
              </div>
            </div>
          ) : null}

          {faqs.length > 0 ? (
            <div>
              <h2 className="text-[28px] font-black tracking-[-0.04em] text-chalk">FAQ</h2>
              <div className="mt-5 space-y-3">{faqs.map((faq) => <div key={faq.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5"><p className="text-[15px] font-bold text-chalk">{faq.question}</p><p className="mt-2 text-[13px] leading-relaxed text-chalk-muted">{faq.answer}</p></div>)}</div>
            </div>
          ) : null}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          {proof.length > 0 ? <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.025] p-5"><p className="text-[12px] font-bold uppercase tracking-[0.16em] text-lime">Proof</p><ul className="mt-3 space-y-2 text-[13px] text-chalk-muted">{proof.map((item) => <li key={item}>• {item}</li>)}</ul></div> : null}
          <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.025] p-5">
            <p className="text-[13px] font-bold text-chalk">Created by {service.creator.displayName}</p>
            <Link href={`/c/${service.creator.handle}`} className="mt-2 inline-flex text-[12px] font-bold text-lime">View creator profile →</Link>
          </div>
        </aside>
      </section>

      <section id="inquiry" className="mx-auto w-full max-w-[920px] px-6 pb-20 md:px-8">
        <div className="rounded-[28px] border border-white/[0.08] bg-white/[0.035] p-6 shadow-2xl shadow-black/20 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-lime">Service inquiry</p>
              <h2 className="mt-2 text-[30px] font-black tracking-[-0.04em] text-chalk">Tell {service.creator.displayName} what you need.</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-chalk-muted">Share your goal, timeline, and context. The creator can follow up with next steps.</p>
            </div>
          </div>
          {searchParams?.inquiry === "sent" ? (
            <div className="mt-6 rounded-2xl border border-lime/20 bg-lime/10 p-4 text-[14px] text-lime">
              Inquiry sent. The creator now has your request.
            </div>
          ) : null}
          <form action={createServiceInquiry} className="mt-6 grid gap-4 md:grid-cols-2">
            <input type="hidden" name="serviceId" value={service.id} />
            <input type="hidden" name="slug" value={service.slug} />
            <label className="space-y-2">
              <span className="text-[12px] font-bold text-chalk">Name *</span>
              <input name="name" required className="h-12 w-full rounded-2xl border border-white/[0.1] bg-night/70 px-4 text-[14px] text-chalk outline-none placeholder:text-chalk-dim focus:border-lime/45 focus:ring-2 focus:ring-lime/15" placeholder="Your name" />
            </label>
            <label className="space-y-2">
              <span className="text-[12px] font-bold text-chalk">Email *</span>
              <input name="email" type="email" required className="h-12 w-full rounded-2xl border border-white/[0.1] bg-night/70 px-4 text-[14px] text-chalk outline-none placeholder:text-chalk-dim focus:border-lime/45 focus:ring-2 focus:ring-lime/15" placeholder="you@example.com" />
            </label>
            <label className="space-y-2">
              <span className="text-[12px] font-bold text-chalk">Company</span>
              <input name="company" className="h-12 w-full rounded-2xl border border-white/[0.1] bg-night/70 px-4 text-[14px] text-chalk outline-none placeholder:text-chalk-dim focus:border-lime/45 focus:ring-2 focus:ring-lime/15" placeholder="Optional" />
            </label>
            <label className="space-y-2">
              <span className="text-[12px] font-bold text-chalk">Budget</span>
              <select name="budget" className="h-12 w-full rounded-2xl border border-white/[0.1] bg-night/70 px-4 text-[14px] text-chalk outline-none focus:border-lime/45 focus:ring-2 focus:ring-lime/15">
                <option value="">Not sure yet</option>
                <option value="< 1M IDR">&lt; 1M IDR</option>
                <option value="1M-5M IDR">1M-5M IDR</option>
                <option value="5M-15M IDR">5M-15M IDR</option>
                <option value="15M+ IDR">15M+ IDR</option>
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-[12px] font-bold text-chalk">Timeline</span>
              <select name="timeline" className="h-12 w-full rounded-2xl border border-white/[0.1] bg-night/70 px-4 text-[14px] text-chalk outline-none focus:border-lime/45 focus:ring-2 focus:ring-lime/15">
                <option value="">Flexible</option>
                <option value="ASAP">ASAP</option>
                <option value="This week">This week</option>
                <option value="This month">This month</option>
                <option value="Next quarter">Next quarter</option>
              </select>
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-[12px] font-bold text-chalk">Project details *</span>
              <textarea name="message" required rows={5} className="w-full rounded-2xl border border-white/[0.1] bg-night/70 px-4 py-3 text-[14px] text-chalk outline-none placeholder:text-chalk-dim focus:border-lime/45 focus:ring-2 focus:ring-lime/15" placeholder="What do you need help with? What does success look like?" />
            </label>
            <div className="md:col-span-2">
              <button className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-lime px-6 text-[14px] font-bold text-night lime-shadow">
                Send inquiry <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
