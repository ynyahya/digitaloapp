const STATS = [
  { value: "$12.4M+", label: "Paid to creators" },
  { value: "47K", label: "Active stores" },
  { value: "2.3M", label: "Students enrolled" },
  { value: "98%", label: "Would recommend" },
];

const LOGOS = [
  "STELLAR", "Nordic", "MONOTYPE", "Heliox", "BUILDR", "Fjord",
  "PARABOLA", "OBSIDIAN", "Lattice", "MERIDIAN", "Velvet", "AXIOM",
];

export function SocialProof() {
  return (
    <section className="relative border-y border-white/[0.06] bg-night/60 py-12">
      <div className="mx-auto w-full max-w-[1360px] px-5 md:px-8 lg:px-10">
        {/* metrics row */}
        <div className="grid grid-cols-2 gap-y-6 md:grid-cols-4 md:gap-y-0">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={[
                "flex flex-col items-center justify-center text-center md:px-6",
                i > 0 ? "md:border-l md:border-white/[0.06]" : "",
              ].join(" ")}
            >
              <span className="text-[28px] font-black tracking-[-0.03em] text-chalk md:text-[34px]">
                {s.value}
              </span>
              <span className="mt-1 text-[11px] font-medium text-chalk-muted">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* logo marquee */}
        <div className="mt-10">
          <p className="text-center text-eyebrow uppercase text-chalk-dim">
            Trusted by creators &amp; teams worldwide
          </p>
          <div className="relative mt-5 overflow-hidden mask-fade-edges-x">
            <div className="flex w-max animate-marquee-x items-center gap-10 py-2">
              {[...LOGOS, ...LOGOS].map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  className="select-none whitespace-nowrap text-[18px] font-bold uppercase tracking-[0.15em] text-chalk-dim/80 transition hover:text-chalk-muted md:text-[22px]"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
