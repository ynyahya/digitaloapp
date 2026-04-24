import { Container } from "@/components/shared/container";

const STATS = [
  { value: "10,000+", label: "Active creators" },
  { value: "$5M+", label: "Paid out to creators" },
  { value: "150k+", label: "Products sold" },
  { value: "120+", label: "Countries served" },
  { value: "4.9/5", label: "Average rating" },
];

export function StatsStrip() {
  return (
    <section className="border-y border-line bg-paper-soft py-12 md:py-16">
      <Container size="wide">
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.16em] text-ink-subtle">
          Powering the creator economy
        </p>
        <ul className="mt-8 grid grid-cols-2 gap-y-8 sm:grid-cols-3 md:grid-cols-5">
          {STATS.map((s) => (
            <li
              key={s.label}
              className="flex flex-col items-center text-center"
            >
              <span className="text-[28px] font-semibold tracking-[-0.02em] text-ink md:text-[36px]">
                {s.value}
              </span>
              <span className="mt-2 text-[12px] font-medium uppercase tracking-[0.1em] text-ink-subtle">
                {s.label}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
