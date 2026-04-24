import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Braces,
  Code2,
  KeyRound,
  Package,
  ShieldCheck,
  Webhook,
  Zap,
} from "lucide-react";
import { CodeBlock } from "@/components/developer/code-block";

export const metadata = {
  title: "API reference · Digitalo",
  description:
    "Build on Digitalo — products, orders, customers, and webhooks. REST, TypeScript-first.",
};

const QUICKSTART_CURL = `curl https://api.digitalo.app/v1/products \\
  -H "Authorization: Bearer <YOUR_DIGITALO_API_KEY>" \\
  -H "Content-Type: application/json"`;

const QUICKSTART_TS = `import { Digitalo } from "@digitalo/sdk";

const d = new Digitalo({ apiKey: process.env.DIGITALO_API_KEY! });

const products = await d.products.list({ status: "PUBLISHED", limit: 20 });
for (const p of products.data) {
  console.log(p.id, p.title, p.priceCents);
}`;

const QUICKSTART_PY = `from digitalo import Digitalo

d = Digitalo(api_key=os.environ["DIGITALO_API_KEY"])

for p in d.products.list(status="PUBLISHED", limit=20).data:
    print(p.id, p.title, p.price_cents)`;

const WEBHOOK_TS = `// app/api/webhooks/digitalo/route.ts
import { verifyDigitaloSignature } from "@digitalo/sdk/webhooks";

export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get("digitalo-signature");
  const event = verifyDigitaloSignature(payload, sig, process.env.DIGITALO_WEBHOOK_SECRET!);

  if (event.type === "order.paid") {
    await fulfill(event.data); // your code
  }
  return new Response(null, { status: 200 });
}`;

export default function DevelopersPortal() {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 py-16 md:px-8 md:py-24">
      {/* Hero */}
      <section className="flex flex-col gap-6">
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-line bg-paper-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
          <Code2 className="h-3.5 w-3.5" /> Developers · API v1
        </div>
        <h1 className="text-balance text-[44px] font-semibold leading-[1.05] tracking-tight md:text-[64px]">
          Build on Digitalo.
        </h1>
        <p className="max-w-2xl text-balance text-[16.5px] leading-relaxed text-ink-muted">
          REST API and a first-class TypeScript SDK for products, orders,
          customers, reviews, downloads, and webhooks. Pagination via cursors,
          idempotency-keyed writes, and the same signing convention Stripe
          uses — so you already know how to integrate.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/api-keys"
            className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-ink bg-ink px-5 text-[13.5px] font-medium text-paper transition-opacity hover:opacity-90"
          >
            <KeyRound className="h-4 w-4" /> Get an API key
          </Link>
          <a
            href="#quickstart"
            className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-line bg-paper px-5 text-[13.5px] font-medium text-ink-muted transition-colors hover:border-ink/30 hover:text-ink"
          >
            <BookOpen className="h-4 w-4" /> Quickstart
          </a>
          <a
            href="#reference"
            className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-line bg-paper px-5 text-[13.5px] font-medium text-ink-muted transition-colors hover:border-ink/30 hover:text-ink"
          >
            <Braces className="h-4 w-4" /> API reference
          </a>
        </div>
      </section>

      {/* Pillars grid */}
      <section className="mt-20 grid gap-3 md:grid-cols-3">
        {[
          {
            icon: Zap,
            title: "Fast by default",
            body: "Edge-cached reads, p95 under 120ms globally. Writes are transactional and idempotent.",
          },
          {
            icon: ShieldCheck,
            title: "Signed everything",
            body: "Webhooks signed with HMAC-SHA256 · rotatable secrets · replay protection window of 5 minutes.",
          },
          {
            icon: Package,
            title: "Typed SDKs",
            body: "@digitalo/sdk for TypeScript and Python ship with full types and tagged-union event payloads.",
          },
        ].map((c) => (
          <div
            key={c.title}
            className="rounded-2xl border border-line bg-paper p-6"
          >
            <c.icon className="h-5 w-5 text-ink" />
            <p className="mt-3 text-[15px] font-semibold tracking-tight">
              {c.title}
            </p>
            <p className="mt-1 text-[13px] text-ink-muted">{c.body}</p>
          </div>
        ))}
      </section>

      {/* Quickstart */}
      <section id="quickstart" className="mt-24 scroll-mt-20">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
          Quickstart · 60 seconds
        </p>
        <h2 className="mt-2 text-[28px] font-semibold tracking-tight md:text-[36px]">
          From zero to your first response
        </h2>
        <p className="mt-2 max-w-2xl text-[13.5px] text-ink-muted">
          Create an API key in the dashboard, then pick your favorite shape.
          All three examples do the same thing: list published products.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
              curl
            </p>
            <CodeBlock code={QUICKSTART_CURL} lang="bash" />
          </div>
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
              TypeScript
            </p>
            <CodeBlock code={QUICKSTART_TS} lang="ts" />
          </div>
          <div className="lg:col-span-2">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
              Python
            </p>
            <CodeBlock code={QUICKSTART_PY} lang="py" />
          </div>
        </div>
      </section>

      {/* Authentication */}
      <section className="mt-24">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
          Authentication
        </p>
        <h2 className="mt-2 text-[28px] font-semibold tracking-tight md:text-[36px]">
          One header, bearer tokens
        </h2>
        <p className="mt-3 max-w-3xl text-[13.5px] text-ink-muted">
          Every request includes an{" "}
          <code className="rounded-md border border-line bg-paper-soft px-1.5 py-0.5 font-mono text-[11.5px] text-ink">
            Authorization
          </code>{" "}
          header. API keys are long-lived bearer tokens — you can mint as many
          as you want, scope them to{" "}
          <code className="rounded-md border border-line bg-paper-soft px-1.5 py-0.5 font-mono text-[11.5px] text-ink">
            read
          </code>{" "}
          or{" "}
          <code className="rounded-md border border-line bg-paper-soft px-1.5 py-0.5 font-mono text-[11.5px] text-ink">
            read-write
          </code>
          , and revoke instantly from{" "}
          <Link href="/dashboard/api-keys" className="text-ink hover:underline">
            /dashboard/api-keys
          </Link>
          . Digitalo stores only the SHA-256 hash of each key — it never leaves
          your clipboard twice.
        </p>
      </section>

      {/* Reference */}
      <section id="reference" className="mt-24 scroll-mt-20">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
          API reference
        </p>
        <h2 className="mt-2 text-[28px] font-semibold tracking-tight md:text-[36px]">
          Every resource, one consistent shape
        </h2>
        <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-paper">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-paper-soft text-[11px] uppercase tracking-[0.12em] text-ink-subtle">
              <tr>
                <Th>Method</Th>
                <Th>Path</Th>
                <Th>Description</Th>
                <Th>Scope</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {ENDPOINTS.map((e) => (
                <tr key={`${e.method} ${e.path}`} className="hover:bg-paper-soft">
                  <Td>
                    <span className="rounded-md border border-line bg-paper-soft px-1.5 py-0.5 font-mono text-[11px] font-semibold text-ink">
                      {e.method}
                    </span>
                  </Td>
                  <Td>
                    <code className="font-mono text-[12px] text-ink">{e.path}</code>
                  </Td>
                  <Td className="text-ink-muted">{e.description}</Td>
                  <Td>
                    <span className="text-[11.5px] text-ink-muted">{e.scope}</span>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Webhooks */}
      <section className="mt-24">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
          <Webhook className="h-3.5 w-3.5" /> Webhooks
        </div>
        <h2 className="mt-2 text-[28px] font-semibold tracking-tight md:text-[36px]">
          Server-sent, signed, and idempotent
        </h2>
        <p className="mt-3 max-w-3xl text-[13.5px] text-ink-muted">
          We deliver JSON payloads over HTTPS with an{" "}
          <code className="rounded-md border border-line bg-paper-soft px-1.5 py-0.5 font-mono text-[11.5px] text-ink">
            Digitalo-Signature
          </code>{" "}
          header. Retries use exponential backoff for up to 72 hours. Every
          event carries a stable{" "}
          <code className="rounded-md border border-line bg-paper-soft px-1.5 py-0.5 font-mono text-[11.5px] text-ink">
            event.id
          </code>{" "}
          so you can de-duplicate on your side without reaching for a Redis.
        </p>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-line bg-paper p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
              Events
            </p>
            <ul className="mt-3 flex flex-col divide-y divide-line text-[12.5px]">
              {EVENTS.map((e) => (
                <li key={e.name} className="flex items-start justify-between gap-4 py-2.5">
                  <code className="font-mono text-[12px] text-ink">{e.name}</code>
                  <span className="text-ink-muted">{e.desc}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
              Verify a payload
            </p>
            <CodeBlock code={WEBHOOK_TS} lang="ts" />
          </div>
        </div>
      </section>

      {/* Errors */}
      <section className="mt-24">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
          Errors & conventions
        </p>
        <h2 className="mt-2 text-[28px] font-semibold tracking-tight md:text-[36px]">
          Predictable, never silent
        </h2>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {CONVENTIONS.map((c) => (
            <div key={c.title} className="rounded-2xl border border-line bg-paper p-5">
              <p className="text-[14.5px] font-semibold">{c.title}</p>
              <p className="mt-1.5 text-[13px] text-ink-muted">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-24 rounded-2xl border border-ink bg-ink px-8 py-12 text-paper md:py-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-paper/60">
          Ready when you are
        </p>
        <h2 className="mt-2 text-balance text-[32px] font-semibold leading-tight tracking-tight md:text-[40px]">
          Ship your first call in a minute flat.
        </h2>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/dashboard/api-keys"
            className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-paper px-5 text-[13.5px] font-medium text-ink transition-opacity hover:opacity-90"
          >
            <KeyRound className="h-4 w-4" /> Issue your first key
          </Link>
          <a
            href="#quickstart"
            className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-paper/30 px-5 text-[13.5px] font-medium text-paper transition-colors hover:border-paper"
          >
            Read the quickstart <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  );
}

const ENDPOINTS: Array<{
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  description: string;
  scope: string;
}> = [
  { method: "GET", path: "/v1/products", description: "List products with pagination, filter by status/category.", scope: "read" },
  { method: "GET", path: "/v1/products/:id", description: "Retrieve a single product including licenses and files.", scope: "read" },
  { method: "POST", path: "/v1/products", description: "Create a product (DRAFT by default).", scope: "read-write" },
  { method: "PATCH", path: "/v1/products/:id", description: "Update title, pricing, licenses, status.", scope: "read-write" },
  { method: "DELETE", path: "/v1/products/:id", description: "Delete a product (forbidden if it has orders — archive instead).", scope: "read-write" },
  { method: "GET", path: "/v1/orders", description: "List your orders by status and date range.", scope: "read" },
  { method: "GET", path: "/v1/orders/:id", description: "Retrieve an order with items, downloads, and refunds.", scope: "read" },
  { method: "POST", path: "/v1/orders/:id/refunds", description: "Refund an order (calls Stripe atomically).", scope: "read-write" },
  { method: "GET", path: "/v1/customers", description: "List buyers with lifetime value.", scope: "read" },
  { method: "GET", path: "/v1/creators/:handle", description: "Public storefront shape for a creator handle.", scope: "read" },
  { method: "GET", path: "/v1/reviews", description: "List reviews across your products.", scope: "read" },
  { method: "GET", path: "/v1/downloads/:token", description: "Validate a download token; returns a short-lived signed URL.", scope: "read" },
];

const EVENTS: Array<{ name: string; desc: string }> = [
  { name: "order.paid", desc: "Order moved to PAID via Stripe." },
  { name: "order.refunded", desc: "Order refunded, full or partial." },
  { name: "product.published", desc: "Product went from DRAFT to PUBLISHED." },
  { name: "product.archived", desc: "Product archived." },
  { name: "review.created", desc: "New review on a product." },
  { name: "customer.created", desc: "New buyer registered via checkout." },
];

const CONVENTIONS: Array<{ title: string; body: string }> = [
  {
    title: "HTTP status codes",
    body: "2xx success, 4xx bad client input (validation / auth / not found), 5xx server. Never a 200 with a success:false body.",
  },
  {
    title: "Idempotency keys",
    body: "POST requests accept Idempotency-Key. Replays return the original response for 24 hours, even across crashes.",
  },
  {
    title: "Pagination",
    body: "Cursor-based. Every list endpoint returns data + has_more + next_cursor. No offsets, no drift.",
  },
  {
    title: "Versioning",
    body: "We version the API at /v1. Breaking changes get a new major; everything else is additive with dated changelog entries.",
  },
];

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <th className={"px-4 py-2.5 text-[11px] font-semibold " + className}>{children}</th>;
}
function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={"px-4 py-3 " + className}>{children}</td>;
}
