/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#05070d",
        panel: "rgba(16, 24, 39, 0.72)",
        line: "rgba(148, 163, 184, 0.16)",
        cyan: "#38d5ff",
        mint: "#6ee7b7",
        amber: "#f5c451",
        rose: "#fb7185"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "monospace"]
      },
      boxShadow: {
        glow: "0 0 60px rgba(56, 213, 255, 0.12)",
        card: "0 24px 90px rgba(0, 0, 0, 0.35)"
      },
      backgroundImage: {
        "radial-grid":
          "radial-gradient(circle at 20% 20%, rgba(56, 213, 255, .18), transparent 28%), radial-gradient(circle at 78% 18%, rgba(110, 231, 183, .14), transparent 26%), linear-gradient(135deg, #05070d 0%, #09111f 46%, #06070c 100%)"
      }
    }
  },
  plugins: []
};
