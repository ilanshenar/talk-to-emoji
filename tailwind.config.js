/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-gentle": "bounce 2s infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      screens: {
        xs: "390px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        // Mobile-first breakpoints
        "mobile-s": "320px",
        "mobile-m": "375px",
        "mobile-l": "425px",
        tablet: "768px",
        laptop: "1024px",
        desktop: "1440px",
      },
      spacing: {
        // Safe area insets for modern mobile devices
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
        // Common mobile spacing
        "mobile-padding": "1rem",
        "mobile-margin": "0.75rem",
        "touch-target": "44px", // Apple's minimum touch target
        // Custom spacing for better mobile layouts
        18: "4.5rem",
        22: "5.5rem",
        88: "22rem",
        112: "28rem",
      },
      fontSize: {
        // Mobile-optimized font sizes
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
        // Mobile-specific font sizes
        "mobile-xs": ["0.8rem", { lineHeight: "1.2rem" }],
        "mobile-sm": ["0.9rem", { lineHeight: "1.3rem" }],
        "mobile-base": ["1rem", { lineHeight: "1.5rem" }],
        "mobile-lg": ["1.1rem", { lineHeight: "1.6rem" }],
      },
      maxWidth: {
        // Mobile-friendly max widths
        mobile: "100vw",
        "mobile-content": "calc(100vw - 2rem)",
        tablet: "768px",
      },
      minHeight: {
        // Mobile-friendly min heights
        "screen-mobile": ["100vh", "100dvh"],
        "touch-target": "44px",
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      zIndex: {
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
      },
    },
  },
  plugins: [
    // Add plugin for safe area utilities
    function ({ addUtilities, theme }) {
      const newUtilities = {
        ".pt-safe": {
          paddingTop: "env(safe-area-inset-top)",
        },
        ".pb-safe": {
          paddingBottom: "env(safe-area-inset-bottom)",
        },
        ".pl-safe": {
          paddingLeft: "env(safe-area-inset-left)",
        },
        ".pr-safe": {
          paddingRight: "env(safe-area-inset-right)",
        },
        ".p-safe": {
          padding:
            "env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)",
        },
        ".mt-safe": {
          marginTop: "env(safe-area-inset-top)",
        },
        ".mb-safe": {
          marginBottom: "env(safe-area-inset-bottom)",
        },
        ".ml-safe": {
          marginLeft: "env(safe-area-inset-left)",
        },
        ".mr-safe": {
          marginRight: "env(safe-area-inset-right)",
        },
        ".touch-manipulation": {
          touchAction: "manipulation",
        },
        ".touch-none": {
          touchAction: "none",
        },
        ".overscroll-none": {
          overscrollBehavior: "none",
        },
        ".overscroll-y-none": {
          overscrollBehaviorY: "none",
        },
        ".hardware-accelerate": {
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
