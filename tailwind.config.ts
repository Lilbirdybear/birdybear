import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        ixd: "hsl(var(--ixd))",
        "three-d": "hsl(var(--three-d))",
        game: "hsl(var(--game))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(30px) rotateX(10deg)" },
          to: { opacity: "1", transform: "translateY(0) rotateX(0deg)" },
        },
        "scan-line": {
          from: { transform: "translateY(-100%)" },
          to: { transform: "translateY(100vh)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0) rotateY(0deg)" },
          "50%": { transform: "translateY(-12px) rotateY(3deg)" },
        },
        "float-reverse": {
          "0%, 100%": { transform: "translateY(0) rotateX(0deg)" },
          "50%": { transform: "translateY(-8px) rotateX(2deg)" },
        },
        "rotate-y": {
          from: { transform: "rotateY(-8deg) scale(0.95)", opacity: "0" },
          to: { transform: "rotateY(0deg) scale(1)", opacity: "1" },
        },
        "slide-in-3d": {
          from: { transform: "perspective(1000px) translateZ(-200px) rotateY(-15deg)", opacity: "0" },
          to: { transform: "perspective(1000px) translateZ(0) rotateY(0deg)", opacity: "1" },
        },
        "tilt-in": {
          from: { transform: "perspective(800px) rotateX(20deg) translateY(40px)", opacity: "0" },
          to: { transform: "perspective(800px) rotateX(0deg) translateY(0)", opacity: "1" },
        },
        "depth-pulse": {
          "0%, 100%": { transform: "translateZ(0)", boxShadow: "0 0 30px hsl(var(--primary) / 0.1)" },
          "50%": { transform: "translateZ(20px)", boxShadow: "0 0 60px hsl(var(--primary) / 0.25)" },
        },
        "parallax-drift": {
          "0%": { transform: "translate3d(0, 0, 0) rotateZ(0deg)" },
          "25%": { transform: "translate3d(5px, -10px, 20px) rotateZ(0.5deg)" },
          "50%": { transform: "translate3d(-3px, -5px, 10px) rotateZ(-0.3deg)" },
          "75%": { transform: "translate3d(2px, -8px, 15px) rotateZ(0.2deg)" },
          "100%": { transform: "translate3d(0, 0, 0) rotateZ(0deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
        "scan-line": "scan-line 8s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "float-reverse": "float-reverse 5s ease-in-out infinite",
        "rotate-y": "rotate-y 0.8s ease-out forwards",
        "slide-in-3d": "slide-in-3d 1s ease-out forwards",
        "tilt-in": "tilt-in 0.7s ease-out forwards",
        "depth-pulse": "depth-pulse 4s ease-in-out infinite",
        "parallax-drift": "parallax-drift 12s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
