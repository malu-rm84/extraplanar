
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
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
        serif: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        // Cores base ajustadas para melhor contraste
        border: "hsl(240 6% 25%)", // Bordas mais visíveis
        input: "hsl(0 0% 95%)", // Inputs mais claros
        ring: "hsl(250 82% 60%)", // Anel de foco mais vibrante
        background: "hsl(240 10% 8%)", // Fundo levemente mais claro
        foreground: "hsl(0 0% 90%)", // Texto principal mais brilhante
        primary: {
          DEFAULT: "hsl(250 82% 60%)", // Roxo mais vibrante
          foreground: "hsl(0 0% 100%)",
        },
        secondary: {
          DEFAULT: "hsl(240 5% 26%)", // Secundário mais claro
          foreground: "hsl(0 0% 90%)",
        },
        muted: {
          DEFAULT: "hsl(240 6% 20%)", // Fundo muted mais claro
          foreground: "hsl(0 0% 70%)", // Texto muted mais legível
        },
        // Novas cores para suportar os componentes
        gray: {
          300: "hsl(0 0% 80%)",
          400: "hsl(0 0% 70%)",
          800: "hsl(240 8% 12%)",
        },
        // Extensões para transparências
        'primary/20': "hsla(250 82% 60% / 0.2)",
        'white/5': "hsla(0 0% 100% / 0.05)",
        'white/10': "hsla(0 0% 100% / 0.1)",
        // Planos com novas tonalidades
        plane: {
          material: "#A8ABBF", // Mais claro
          emerald: "#6EED92", // Mais vibrante
          inferno: "#FF5C6C", // Menos saturado
          ethereal: "#9D7AFF", // Mais suave
          astral: "#3FB4FF", // Azul mais claro
        },
        card: {
          DEFAULT: "rgb(var(--card) / <alpha-value>)", // Permite usar opacidade
          foreground: "rgb(var(--card-foreground) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "4px",
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
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "glow": {
          "0%, 100%": { opacity: "0.8" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 3s ease-in-out infinite",
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, hsl(250 82% 60%) 0%, hsl(270 70% 50%) 100%)',
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/typography')
  ],
} satisfies Config;