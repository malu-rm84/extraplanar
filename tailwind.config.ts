
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
        serif: ["Cinzel", "Playfair Display", "serif"],
        sans: ["Crimson Text", "Inter", "sans-serif"],
        medieval: ["Uncial Antiqua", "serif"],
        script: ["Tangerine", "cursive"],
      },
      colors: {
        // Cores temáticas medievais fantásticas
        border: "hsl(30 20% 25%)", // Tom de pergaminho escuro
        input: "hsl(45 30% 85%)", // Pergaminho claro para inputs
        ring: "hsl(45 80% 50%)", // Dourado mágico
        background: "hsl(25 25% 8%)", // Fundo de pergaminho antigo escuro
        foreground: "hsl(45 20% 85%)", // Texto cor de tinta sépia
        primary: {
          DEFAULT: "hsl(45 80% 55%)", // Dourado mágico
          foreground: "hsl(25 15% 15%)",
        },
        secondary: {
          DEFAULT: "hsl(25 15% 20%)", // Couro escuro
          foreground: "hsl(45 20% 80%)",
        },
        muted: {
          DEFAULT: "hsl(30 15% 15%)", // Sombra de pergaminho
          foreground: "hsl(45 15% 60%)",
        },
        accent: {
          DEFAULT: "hsl(15 40% 25%)", // Vermelho sépia
          foreground: "hsl(45 20% 85%)",
        },
        destructive: {
          DEFAULT: "hsl(0 60% 40%)",
          foreground: "hsl(45 20% 85%)",
        },
        // Cores mágicas especiais
        magic: {
          arcane: "hsl(260 70% 60%)", // Roxo arcano
          divine: "hsl(45 80% 70%)", // Dourado divino
          nature: "hsl(120 40% 50%)", // Verde natural
          fire: "hsl(15 80% 55%)", // Fogo vermelho-laranja
          ice: "hsl(200 60% 65%)", // Azul gélido
        },
        // Planos com tons medievais
        plane: {
          material: "#8B7355", // Bronze antigo
          emerald: "#4A7C59", // Verde esmeralda escuro
          inferno: "#B85450", // Vermelho infernal
          ethereal: "#7B68EE", // Púrpura etéreo
          astral: "#4682B4", // Azul astral
        },
        card: {
          DEFAULT: "hsl(30 20% 12%)",
          foreground: "hsl(45 20% 85%)",
        },
      },
      borderRadius: {
        lg: "8px",
        md: "6px",
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
          "50%": { transform: "translateY(-8px)" },
        },
        "glow": {
          "0%, 100%": { 
            opacity: "0.8",
            textShadow: "0 0 10px currentColor"
          },
          "50%": { 
            opacity: "1",
            textShadow: "0 0 20px currentColor, 0 0 30px currentColor"
          },
        },
        "flicker": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 3s ease-in-out infinite",
        "flicker": "flicker 4s ease-in-out infinite",
        "shimmer": "shimmer 3s ease-in-out infinite",
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, hsl(45 80% 55%) 0%, hsl(35 70% 45%) 100%)',
        'parchment': 'radial-gradient(circle at 50% 50%, hsl(45 30% 92%) 0%, hsl(40 25% 88%) 100%)',
        'ancient-paper': 'linear-gradient(135deg, hsl(40 35% 85%) 0%, hsl(35 30% 80%) 50%, hsl(30 25% 75%) 100%)',
      },
      boxShadow: {
        'magical': '0 4px 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)',
        'ancient': '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'mystical': '0 0 20px rgba(123, 104, 238, 0.4), 0 4px 15px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/typography')
  ],
} satisfies Config;
