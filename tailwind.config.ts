import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "default-lime": "rgba(185, 255, 102, 1)",
        "default-grey": "rgba(243, 243, 243, 1)",
        "links": "rgba(234, 86, 112, 1)",
        "dark": "rgba(25, 26, 35, 1)",
      },
      fontSize: {
        // Fluid-типографика: плавное изменение размера текста
        "fluid-h1": ["clamp(1.875rem, 4vw, 3rem)", { lineHeight: "1.1" }],
        "fluid-h2": ["clamp(1.625rem, 3.5vw, 2.25rem)", { lineHeight: "1.2" }],
        "fluid-h3": ["clamp(1.375rem, 3vw, 1.875rem)", { lineHeight: "1.3" }],
        "fluid-lg": ["clamp(1rem, 2vw, 1.25rem)", { lineHeight: "1.5" }],
        "fluid-base": ["clamp(0.875rem, 1.5vw, 1rem)", { lineHeight: "1.5" }],
        "fluid-sm": ["clamp(0.75rem, 1.2vw, 0.875rem)", { lineHeight: "1.4" }],
        // Navbar-specific
        "fluid-nav-logo": ["clamp(1.25rem, 3vw, 1.75rem)", { lineHeight: "1.1" }],
      },
      spacing: {
        // Fluid-отступы для контейнеров и секций
        "fluid-container": "clamp(1rem, 3vw, 2rem)",
        "fluid-section": "clamp(2rem, 5vw, 4rem)",
        // Navbar-specific
        "fluid-nav-y": "clamp(0.75rem, 2vw, 1.25rem)",
        "fluid-nav-gap": "clamp(0.5rem, 1.5vw, 0.75rem)",
        "fluid-nav-link-x": "clamp(0.875rem, 2.5vw, 1.25rem)",
        "fluid-nav-link-y": "clamp(0.5rem, 1.5vw, 0.75rem)",
        "fluid-nav-btn-x": "clamp(1rem, 2.5vw, 1.5rem)",
        "fluid-nav-btn-y": "clamp(0.5rem, 1.5vw, 0.75rem)",
        "fluid-nav-gap-links": "clamp(1.5rem, 3.5vw, 2.5rem)",
        "fluid-nav-gap-menu": "clamp(1rem, 2.5vw, 1.5rem)",
        "fluid-nav-mt-btn": "clamp(0.75rem, 2vw, 1rem)",
        "fluid-section-gap": "clamp(1.5rem, 4vw, 3rem)",
        "fluid-cards-gap": "clamp(1rem, 2vw, 2.5rem)",
        "fluid-form-gap": "clamp(1.5rem, 3vw, 3rem)",
        // Button-specific (универсальные, не только для nav)
        "fluid-btn-x": "clamp(1rem, 2.5vw, 1.5rem)",
        "fluid-btn-y": "clamp(0.5rem, 1.5vw, 0.75rem)",
        "fluid-btn-lg-x": "clamp(1.25rem, 3vw, 2rem)",
        "fluid-btn-lg-y": "clamp(0.75rem, 2vw, 1rem)",
      },
      maxWidth: {
        container: "clamp(320px, 88%, 1200px)",
      },
      // Tailwind-style hamburger sizes (rem-based, fluid)
      width: {
        "fluid-icon": "clamp(1.25rem, 3.5vw, 1.5rem)",
      },
      height: {
        "fluid-icon": "clamp(1.25rem, 3.5vw, 1.5rem)",
        "fluid-logo": "clamp(2rem, 5vw, 2.5rem)",
      },
    },
  },
  plugins: [],
};
export default config;