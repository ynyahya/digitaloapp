import Link from "next/link";
import { ArrowUpRight, Briefcase, Clock, Mail, MessageSquare, UserRound } from "lucide-react";
import { db } from "@/lib/db";
import { requireCreator } from "@/lib/auth/session";
import { updateServiceInquiryStatus } from "@/lib/actions/service-inquiries";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STATUS = ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"];

const statusClass: Record<string, string> = {
  NEW: "border-lime/20 bg-lime/10 text-lime",
  CONTACTED: "border-sky-400/20 bg-sky-400/10 text-sky-200",
  QUALIFIED: "border-violet/20 bg-violet/10 text-violet-200",
  WON: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
  LOST: "border-red-400/20 bg-red-400/10 text-red-200",
};

export const metadata = {
  title: "Service Inquiries",
  description: "Manage service leads and inquiries.",
};

export default async function ServiceInquiriesPage({ searchParams }: { searchParams: { status?: string; service?: string } }) {
  const creator = await requireCreator();
  const where = {
    creatorId: creator.id,
    ...(searchParams.status ? { status: searchParams.status } : {}),
    ...(searchParams.service ? { service: { slug: searchParams.service } } : {}),
  };
  const [inquiries, services] = await Promise.all([
    db.serviceInquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { service: { select: { title: true, slug: true, currency: true } } },
    }),
    db.service.findMany({ where: { creatorId: creator.id }, select: { title: true, slug: true }, orderBy: { updatedAt: "desc" } }),
  ]);

  const counts = STATUS.reduce<Record<string, number>>((acc, status) => {
    acc[status] = inquiries.filter((inquiry) => inquiry.status === status).length;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-eyebrow uppercase text-lime">Service lead engine</p>
          <h1 className="mt-3 text-[36px] font-black tracking-[-0.04em] text-chalk">Service inquiries</h1>
          <p className="text-[14px] text-chalk-muted">Review leads from your public service pages and move them through your pipeline.</p>
        </div>
        <Button asChild className="rounded-2xl">
          <Link href="/dashboard/create">Create offering</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {STATUS.map((status) => (
          <Link key={status} href={`/dashboard/services/inquiries?status=${status}`} className="rounded-[22px] border border-white/[0.08] bg-white/[0.025] p-4 transition hover:border-lime/25 hover:bg-lime/10">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-chalk-muted">{status.toLowerCase()}</p>
            <p className="mt-2 text-[30px] font-black tracking-[-0.05em] text-chalk">{counts[status] ?? 0}</p>
          </Link>
        ))}
      </div>

      <form className="flex flex-wrap items-center gap-2 rounded-[22px] border border-white/[0.08] bg-white/[0.025] p-3">
        <select name="status" defaultValue={searchParams.status || ""} className="h-10 rounded-xl border border-white/[0.1] bg-night px-3 text-[13px] text-chalk">
          <option value="">All statuses</option>
          {STATUS.map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
        <select name="service" defaultValue={searchParams.service || ""} className="h-10 rounded-xl border border-white/[0.1] bg-night px-3 text-[13px] text-chalk">
          <option value="">All services</option>
          {services.map((service) => <option key={service.slug} value={service.slug}>{service.title}</option>)}
        </select>
        <Button type="submit" variant="outline" size="sm" className="h-10 rounded-xl">Filter</Button>
        <Button asChild variant="ghost" size="sm" className="h-10 rounded-xl"><Link href="/dashboard/services/inquiries">Reset</Link></Button>
      </form>

      <div className="grid gap-4">
        {inquiries.map((inquiry) => (
          <article key={inquiry.id} className="rounded-[24px] border border-white/[0.08] bg-white/[0.025] p-5 shadow-2xl shadow-black/15">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]", statusClass[inquiry.status] ?? statusClass.NEW)}>{inquiry.status}</span>
                  <Link href={`/dashboard/services/${inquiry.service.slug}/builder`} className="inline-flex items-center gap-1 text-[12px] font-bold text-lime">{inquiry.service.title}<ArrowUpRight className="h-3 w-3" /></Link>
                </div>
                <h2 className="mt-3 text-[20px] font-black tracking-[-0.03em] text-chalk">{inquiry.name}</h2>
                <div className="mt-2 flex flex-wrap gap-3 text-[12px] text-chalk-muted">
                  <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-lime" /> {inquiry.email}</span>
                  {inquiry.company ? <span className="inline-flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5 text-lime" /> {inquiry.company}</span> : null}
                  {inquiry.timeline ? <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-lime" /> {inquiry.timeline}</span> : null}
                  {inquiry.budget ? <span className="inline-flex items-center gap-1.5"><UserRound className="h-3.5 w-3.5 text-lime" /> {inquiry.budget}</span> : null}
                </div>
              </div>
              <form action={updateServiceInquiryStatus} className="flex items-center gap-2">
                <input type="hidden" name="inquiryId" value={inquiry.id} />
                <select name="status" defaultValue={inquiry.status} className="h-9 rounded-xl border border-white/[0.1] bg-night px-2 text-[12px] text-chalk">
                  {STATUS.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
                <Button type="submit" variant="outline" size="sm" className="h-9 rounded-xl">Update</Button>
              </form>
            </div>
            <div className="mt-5 rounded-2xl border border-white/[0.08] bg-night/55 p-4">
              <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-lime"><MessageSquare className="h-4 w-4" /> Project details</p>
              <p className="mt-3 whitespace-pre-wrap text-[14px] leading-relaxed text-chalk-muted">{inquiry.message}</p>
            </div>
          </article>
        ))}
        {inquiries.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-white/[0.12] bg-white/[0.025] p-10 text-center">
            <p className="text-[16px] font-bold text-chalk">No inquiries yet</p>
            <p className="mt-2 text-[13px] text-chalk-muted">Publish a service and share its public page to start collecting leads.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
