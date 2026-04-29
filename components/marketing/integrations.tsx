import {
  CreditCard,
  MessageCircle,
  Webhook,
  Zap,
  Github,
  FileText,
  Mail,
  Plug,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section";

const INTEGRATIONS = [
  { name: "Stripe", desc: "Payments + Connect", icon: CreditCard },
  { name: "Webhooks", desc: "Signed event delivery", icon: Webhook },
  { name: "Zapier", desc: "5,000+ apps", icon: Zap },
  { name: "GitHub", desc: "License & releases", icon: Github },
  { name: "Slack", desc: "Sales notifications", icon: MessageCircle },
  { name: "Notion", desc: "Embed + delivery", icon: FileText },
  { name: "Resend", desc: "Branded emails", icon: Mail },
  { name: "REST API", desc: "Programmable storefront", icon: Plug },
];

export function Integrations() {
  return (
    <section className="border-t border-line bg-paper-soft/40 py-16 md:py-24">
      <Container size="wide">
        <SectionHeading
          align="center"
          eyebrow="Integrations"
          title="Plays nice with your stack."
          description="Connect Stripe, Slack, GitHub, Notion, and the rest of your tools — or build your own with our API and webhooks."
        />
        <ul className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 md:grid-cols-4">
          {INTEGRATIONS.map(({ name, desc, icon: Icon }) => (
            <li
              key={name}
              className="group flex items-center gap-4 bg-paper p-5 transition-colors hover:bg-paper-soft"
            >
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-paper text-ink transition-colors group-hover:bg-ink group-hover:text-paper">
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-[14px] font-semibold tracking-tight text-ink">
                  {name}
                </p>
                <p className="truncate text-[12px] text-ink-muted">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-6 max-w-xl text-center text-[12.5px] text-ink-subtle">
          More integrations shipping every month. Need something specific?{" "}
          <a href="mailto:hello@teskel.app" className="font-semibold text-ink underline-offset-4 hover:underline">
            Talk to us
          </a>
          .
        </p>
      </Container>
    </section>
  );
}
