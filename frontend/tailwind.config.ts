import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--paper)",
        foreground: "var(--ink)",
        paper: {
          DEFAULT: "var(--paper)",
          50: "var(--paper-50)",
          100: "var(--paper-100)",
          200: "var(--paper-200)",
          300: "var(--paper-300)",
        },
        ink: {
          DEFAULT: "var(--ink)",
          muted: "var(--ink-muted)",
          soft: "var(--ink-soft)",
          faint: "var(--ink-faint)",
        },
        shield: {
          emerald: "var(--emerald)",
          "emerald-dark": "var(--emerald-dark)",
          "emerald-light": "var(--emerald-light)",
          crimson: "var(--crimson)",
          "crimson-light": "var(--crimson-light)",
          amber: "var(--amber)",
          "amber-light": "var(--amber-light)",
          slate: "var(--slate)",
          "slate-light": "var(--slate-light)",
        },
        line: {
          DEFAULT: "var(--line)",
          strong: "var(--line-strong)",
          faint: "var(--line-faint)",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
        mono: [
          '"SFMono-Regular"',
          "Consolas",
          '"Liberation Mono"',
          "Menlo",
          "monospace",
        ],
      },
      boxShadow: {
        subtle: "0 2px 8px -2px rgba(11,33,27,0.04), 0 8px 24px -4px rgba(11,33,27,0.06)",
        float: "0 12px 36px -6px rgba(11,33,27,0.08), 0 4px 12px -2px rgba(11,33,27,0.03)",
        elevated: "0 24px 64px -12px rgba(11,33,27,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;

