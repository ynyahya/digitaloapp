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
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.18em] text-ink-subtle">
          Powering the creator economy
        </p>
        <ul className="mt-8 grid grid-cols-2 divide-y divide-line border-line sm:grid-cols-3 sm:divide-x md:grid-cols-5 md:divide-y-0">
          {STATS.map((s, i) => (
            <li
              key={s.label}
              className={`flex flex-col items-center gap-1.5 px-4 py-6 text-center sm:py-3 ${i >= 3 ? "sm:border-t md:border-t-0" : ""}`}
            >
              <span className="text-[30px] font-semibold tracking-[-0.025em] text-ink md:text-[38px]">
                {s.value}
              </span>
              <span className="text-[11.5px] font-medium uppercase tracking-[0.12em] text-ink-subtle">
                {s.label}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
