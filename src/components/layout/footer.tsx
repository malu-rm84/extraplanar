
import { Flame } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <Link to="/" className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-primary" />
            <span className="font-serif text-lg font-medium">Extraplanar</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Um sistema de RPG de aventuras entre planos
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 text-sm">
          <Link to="/sistema" className="hover:text-primary transition-colors">
            Sistema
          </Link>
          <Link to="/planos" className="hover:text-primary transition-colors">
            Planos
          </Link>
          <Link to="/raças" className="hover:text-primary transition-colors">
            Raças
          </Link>
          <Link to="/termos" className="hover:text-primary transition-colors">
            Termos
          </Link>
          <Link to="/privacidade" className="hover:text-primary transition-colors">
            Privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
}
