import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        md: "2rem",
        lg: "2.5rem",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0a0a0a",
          soft: "#171717",
          muted: "#525252",
          subtle: "#737373",
        },
        accent: {
          DEFAULT: "#2563eb",
          strong: "#1d4ed8",
          soft: "#eff6ff",
          subtle: "#dbeafe",
        },
        paper: {
          DEFAULT: "#ffffff",
          soft: "#fafafa",
          muted: "#f5f5f5",
          sunken: "#f1f1f1",
        },
        line: {
          DEFAULT: "#e5e5e5",
          soft: "#ededed",
          strong: "#d4d4d4",
        },
        // Landing v2 — dark + electric lime palette
        night: {
          DEFAULT: "#08080A",
          surface: "#0F0F12",
          raised: "#18181C",
          well: "#0B0B0E",
        },
        edge: {
          DEFAULT: "#27272A",
          soft: "#1F1F23",
          strong: "#3F3F46",
        },
        chalk: {
          DEFAULT: "#FAFAFA",
          muted: "#A1A1AA",
          subtle: "#71717A",
          dim: "#52525B",
        },
        lime: {
          DEFAULT: "#B4F300",
          bright: "#C8FF1A",
          deep: "#7FB300",
          glow: "rgba(180,243,0,0.18)",
        },
        violet: {
          DEFAULT: "#7C5CFF",
          glow: "rgba(124,92,255,0.18)",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgb(0 0 0 / 0.04), 0 2px 6px rgb(0 0 0 / 0.03)",
        card: "0 1px 1px rgb(0 0 0 / 0.02), 0 4px 16px -4px rgb(0 0 0 / 0.06)",
        float: "0 6px 24px -6px rgb(0 0 0 / 0.12), 0 2px 4px rgb(0 0 0 / 0.04)",
        ring: "0 0 0 1px rgb(0 0 0 / 0.06), 0 4px 18px -6px rgb(0 0 0 / 0.08)",
        hero: "0 30px 70px -30px rgb(15 23 42 / 0.28)",
      },
      backgroundImage: {
        "mono-fade":
          "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(0,0,0,0.02) 100%)",
        "mono-radial":
          "radial-gradient(circle at 50% 0%, rgba(0,0,0,0.04), transparent 60%)",
        "accent-glow":
          "radial-gradient(circle at 20% 20%, rgba(37,99,235,0.14), transparent 60%), radial-gradient(circle at 80% 0%, rgba(59,130,246,0.12), transparent 45%)",
        "lime-glow":
          "radial-gradient(60% 50% at 50% 100%, rgba(180,243,0,0.22), transparent 70%), radial-gradient(40% 40% at 20% 0%, rgba(124,92,255,0.18), transparent 70%)",
        "lime-fade":
          "linear-gradient(180deg, rgba(180,243,0,0) 0%, rgba(180,243,0,0.06) 50%, rgba(180,243,0,0) 100%)",
        grain:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.06 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      },
      fontSize: {
        display: ["clamp(3rem, 7vw + 1rem, 6.75rem)", { lineHeight: "0.98", letterSpacing: "-0.045em", fontWeight: "800" }],
        "display-sm": ["clamp(2.25rem, 4.5vw + 0.5rem, 4.25rem)", { lineHeight: "1.02", letterSpacing: "-0.035em", fontWeight: "800" }],
        eyebrow: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.18em", fontWeight: "700" }],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "marquee-x": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-blur-up": {
          "0%": { opacity: "0", transform: "translateY(18px)", filter: "blur(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)", filter: "blur(0)" },
        },
        "pulse-soft": {
          "0%,100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        "drift": {
          "0%,100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-10px,0)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 6s ease-in-out infinite",
        "fade-up": "fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
        shimmer: "shimmer 2.8s linear infinite",
        "marquee-x": "marquee-x 40s linear infinite",
        "fade-blur-up": "fade-blur-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
        drift: "drift 8s ease-in-out infinite",
        "spin-slow": "spin-slow 24s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
export default config;
