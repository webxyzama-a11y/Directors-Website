/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#060608",
        charcoal: "#0c0d12",
        cinemaGold: "#d4af37",
        recRed: "#e74c3c",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Cinzel", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Outfit", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
