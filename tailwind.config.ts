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
      },
      backgroundImage: {
        "mono-fade":
          "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(0,0,0,0.02) 100%)",
        "mono-radial":
          "radial-gradient(circle at 50% 0%, rgba(0,0,0,0.04), transparent 60%)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
export default config;
