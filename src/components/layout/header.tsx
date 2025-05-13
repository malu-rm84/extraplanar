
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, BookOpen, Flame } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-primary animate-glow" />
            <span className="font-serif text-xl font-bold tracking-tight">
              Extraplanar
            </span>
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/sistema" className="text-sm font-medium hover:text-primary transition-colors">
            Sistema
          </Link>
          <Link to="/planos" className="text-sm font-medium hover:text-primary transition-colors">
            Planos
          </Link>
          <Link to="/raças" className="text-sm font-medium hover:text-primary transition-colors">
            Raças
          </Link>
          <Link to="/login" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
            <User className="h-4 w-4" />
            Login
          </Link>
          <Link to="/register">
            <Button size="sm" className="mystic-button">
              Registrar
            </Button>
          </Link>
        </nav>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t p-4">
          <nav className="flex flex-col gap-4">
            <Link 
              to="/sistema" 
              className="flex items-center gap-2 px-2 py-1 hover:bg-secondary rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <BookOpen className="h-4 w-4" />
              Sistema
            </Link>
            <Link 
              to="/planos" 
              className="flex items-center gap-2 px-2 py-1 hover:bg-secondary rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Flame className="h-4 w-4" />
              Planos
            </Link>
            <Link 
              to="/raças" 
              className="flex items-center gap-2 px-2 py-1 hover:bg-secondary rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <User className="h-4 w-4" />
              Raças
            </Link>
            <hr className="my-2" />
            <Link 
              to="/login" 
              className="flex items-center gap-2 px-2 py-1 hover:bg-secondary rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <User className="h-4 w-4" />
              Login
            </Link>
            <Link 
              to="/register"
              onClick={() => setIsMenuOpen(false)}
            >
              <Button className="w-full mystic-button">
                Registrar
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
