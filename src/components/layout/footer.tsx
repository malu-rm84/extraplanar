// src/components/layout/footer.tsx
import { Flame, Wand2, Github, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-primary/10 py-8 md:py-10 bg-background/80 backdrop-blur-sm relative z-10">
      <div className="container flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Sparkles className="h-5 w-5 text-primary group-hover:opacity-0 transition-opacity duration-300" />
              <Wand2 className="h-5 w-5 text-primary absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="font-serif text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Extraplanar</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Sistema de RPG Multidimensional
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-sm">
          <a 
            href="#sistema" 
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Sistema
          </a>
          <a 
            href="#planos" 
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Planos
          </a>
          <a 
            href="#racas" 
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Raças
          </a>
          <a 
            href="#afinidades" 
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Afinidades
          </a>
        </div>
        <div className="flex items-center gap-4">
          <a 
            href="#" 
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Github"
          >
            <Github className="h-5 w-5" />
          </a>
          <span className="text-xs text-muted-foreground">
            &copy; 2025 Extraplanar RPG
          </span>
        </div>
      </div>
    </footer>
  );
}