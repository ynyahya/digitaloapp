"use client";

import * as React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** max rotation in degrees, default 6 */
  max?: number;
  /** scale on hover, default 1.01 */
  scale?: number;
  /** enable lime pointer glow, default true */
  glow?: boolean;
};

export function Tilt({
  children,
  className,
  max = 6,
  scale = 1.01,
  glow = true,
}: Props) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const frame = React.useRef<number | null>(null);

  const onMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (0.5 - py) * max * 2;
      const ry = (px - 0.5) * max * 2;

      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        el.style.transform = `perspective(1100px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${scale})`;
        if (glow) {
          el.style.setProperty("--mx", `${px * 100}%`);
          el.style.setProperty("--my", `${py * 100}%`);
        }
      });
    },
    [max, scale, glow],
  );

  const onLeave = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (frame.current) cancelAnimationFrame(frame.current);
    el.style.transform =
      "perspective(1100px) rotateX(0deg) rotateY(0deg) scale(1)";
    if (glow) {
      el.style.setProperty("--mx", `50%`);
      el.style.setProperty("--my", `50%`);
    }
  }, [glow]);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{
        transformStyle: "preserve-3d",
        transition:
          "transform 260ms cubic-bezier(0.22,1,0.36,1), box-shadow 260ms",
        willChange: "transform",
        position: "relative",
      }}
    >
      {glow && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-0 rounded-[inherit] opacity-0 transition-opacity duration-300 [.group:hover_>_&]:opacity-100"
          style={{
            background:
              "radial-gradient(280px circle at var(--mx, 50%) var(--my, 50%), rgba(180,243,0,0.18), transparent 60%)",
          }}
        />
      )}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
