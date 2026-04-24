import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StarRating } from "@/components/ui/star-rating";

const QUOTES = [
  {
    body: "Digitalo transformed how I sell my digital products. The platform is sleek, fast, and incredibly easy to use.",
    name: "Arvid Kahl",
    role: "Founder of Lindo",
  },
  {
    body: "The best marketplace for indie creators. I've made over $50k in sales in just 6 months.",
    name: "Marc Lou",
    role: "Founder of Friday",
  },
  {
    body: "Beautiful stores, zero code, and powerful analytics. Everything a creator needs.",
    name: "Sara Dietschy",
    role: "YouTuber & Creator",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 md:py-24">
      <Container size="wide">
        <SectionHeading
          eyebrow="Testimonials"
          title="What creators are saying"
          description="Operators and indie hackers building on Digitalo."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {QUOTES.map((q) => {
            const initials = q.name
              .split(" ")
              .map((p) => p[0])
              .join("")
              .slice(0, 2);
            return (
              <blockquote
                key={q.name}
                className="flex flex-col gap-6 rounded-2xl border border-line bg-paper p-6"
              >
                <StarRating value={5} />
                <p className="text-[14.5px] leading-relaxed text-ink">“{q.body}”</p>
                <div className="mt-auto flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-[13px] font-semibold">{q.name}</p>
                    <p className="text-[11.5px] text-ink-muted">{q.role}</p>
                  </div>
                </div>
              </blockquote>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
