import type { Config } from "tailwindcss";

export default {
  content: [
  "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],


  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gray: {
          750: "#374151",
          850: "#1f2937"
        }
      }
    }
  },
  plugins: []
} satisfies Config;