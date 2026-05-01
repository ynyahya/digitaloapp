"use client";

import * as React from "react";

type Props = {
  children: React.ReactNode;
  delay?: number;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  /** px translated from start, default 24 */
  y?: number;
  /** blur px at start, default 10 */
  blur?: number;
  /** stagger children via [data-reveal-child] */
  stagger?: number;
  once?: boolean;
};

export function Reveal({
  children,
  delay = 0,
  as = "div",
  className,
  y = 24,
  blur = 10,
  stagger = 0,
  once = true,
}: Props) {
  const ref = React.useRef<HTMLElement | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            if (once) io.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  const Tag = as as any;

  const style: React.CSSProperties = {
    transition:
      "opacity 800ms cubic-bezier(0.22,1,0.36,1), transform 800ms cubic-bezier(0.22,1,0.36,1), filter 800ms cubic-bezier(0.22,1,0.36,1)",
    transitionDelay: `${delay}ms`,
    opacity: visible ? 1 : 0,
    transform: visible ? "translate3d(0,0,0)" : `translate3d(0,${y}px,0)`,
    filter: visible ? "blur(0px)" : `blur(${blur}px)`,
    willChange: "opacity, transform, filter",
  };

  // stagger children (opt-in)
  const content =
    stagger > 0
      ? React.Children.map(children, (child, i) => {
          if (!React.isValidElement(child)) return child;
          const childStyle: React.CSSProperties = {
            transition: style.transition,
            transitionDelay: `${delay + i * stagger}ms`,
            opacity: visible ? 1 : 0,
            transform: visible ? "translate3d(0,0,0)" : `translate3d(0,${y}px,0)`,
            filter: visible ? "blur(0px)" : `blur(${blur}px)`,
          };
          return React.cloneElement(child as React.ReactElement<any>, {
            style: { ...((child.props as any).style || {}), ...childStyle },
          });
        })
      : children;

  return (
    <Tag
      ref={ref as any}
      className={className}
      style={stagger > 0 ? undefined : style}
    >
      {content}
    </Tag>
  );
}
