// src/components/layout/header.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, BookOpen, Users, Globe, Flame, Wand2, Sparkles } from "lucide-react";
import { auth, googleProvider } from "@/components/auth/firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useToast } from "@/components/ui/use-toast";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      
      // Redirecionar novos usuários para escolha de perfil
      if (result.user.metadata.creationTime === result.user.metadata.lastSignInTime) {
        navigate("/choose-role");
      } else {
        toast({
          title: "Login bem-sucedido",
          description: "Bem-vindo de volta ao Extraplanar RPG!",
        });
      }
    } catch (error) {
      console.error("Erro no login:", error);
      toast({
        title: "Erro no login",
        description: "Não foi possível fazer login. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrollPosition > 50 
        ? "bg-background/80 backdrop-blur-md shadow-sm border-b border-primary/10" 
        : "bg-transparent"
    }`}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Flame className="h-6 w-6 text-primary animate-pulse group-hover:opacity-0 transition-opacity duration-300" />
              <Wand2 className="h-6 w-6 text-primary absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className={`font-serif text-xl font-bold tracking-tight transition-all duration-300 ${
              scrollPosition > 50 
                ? "bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70" 
                : ""
            }`}>
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
            className="text-foreground hover:text-primary"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a 
            href="#sistema" 
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            <BookOpen className="h-4 w-4 inline mr-1" />
            Sistema
          </a>
          <a 
            href="#planos" 
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            <Globe className="h-4 w-4 inline mr-1" />
            Planos
          </a>
          <a 
            href="#racas" 
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            <Users className="h-4 w-4 inline mr-1" />
            Raças
          </a>
          <a 
            href="#afinidades" 
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            <Sparkles className="h-4 w-4 inline mr-1" />
            Afinidades
          </a>
          <Button 
            size="sm" 
            className="ml-4 bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-300"
            onClick={handleGoogleAuth}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Carregando...
              </span>
            ) : (
              'Entrar'
            )}
          </Button>
        </nav>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-primary/10 p-4 bg-background/95 backdrop-blur-md">
          <nav className="flex flex-col gap-4">
            <a 
              href="#sistema" 
              className="flex items-center gap-2 px-3 py-2 hover:bg-primary/5 rounded-md transition-colors text-foreground/80 hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              <BookOpen className="h-4 w-4" />
              Sistema
            </a>
            <a 
              href="#planos" 
              className="flex items-center gap-2 px-3 py-2 hover:bg-primary/5 rounded-md transition-colors text-foreground/80 hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              <Globe className="h-4 w-4" />
              Planos
            </a>
            <a 
              href="#racas" 
              className="flex items-center gap-2 px-3 py-2 hover:bg-primary/5 rounded-md transition-colors text-foreground/80 hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              <Users className="h-4 w-4" />
              Raças
            </a>
            <a 
              href="#afinidades" 
              className="flex items-center gap-2 px-3 py-2 hover:bg-primary/5 rounded-md transition-colors text-foreground/80 hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              <Sparkles className="h-4 w-4" />
              Afinidades
            </a>
            <div className="pt-2 mt-2 border-t border-primary/10">
              <Button 
                size="sm" 
                className="w-full justify-center bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-300"
                onClick={handleGoogleAuth}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Carregando...
                  </span>
                ) : (
                  'Entrar'
                )}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}