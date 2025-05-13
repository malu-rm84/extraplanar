
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
  FileText,
  UserCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/components/auth/firebase-config";
import { signOut } from "firebase/auth";
import { useToast } from "@/components/ui/use-toast";

interface PlayerLayoutProps {
  children: React.ReactNode;
}

export function PlayerLayout({ children }: PlayerLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logout realizado",
        description: "Você saiu da sua conta."
      });
      navigate("/login");
    } catch (error) {
      console.error("Erro ao sair:", error);
      toast({
        title: "Erro ao sair",
        description: "Não foi possível realizar o logout.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between border-b p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Link to="/player/dashboard" className="flex items-center gap-2">
          <UserCircle className="h-6 w-6 text-primary" />
          <span className="font-serif text-xl font-bold">Extraplanar</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar - Desktop always visible, Mobile conditional */}
      <aside className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-64 bg-secondary/20 border-r`}>
        <div className="hidden md:flex items-center gap-2 p-6 border-b">
          <UserCircle className="h-6 w-6 text-primary" />
          <span className="font-serif text-xl font-bold">Extraplanar</span>
        </div>

        <nav className="flex-grow p-4 space-y-2">
          <Link
            to="/player/dashboard"
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              isActive("/player/dashboard")
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary/50"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          
          <Link
            to="/player/personagens"
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              isActive("/player/personagens")
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary/50"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            <User className="h-5 w-5" />
            <span>Personagens</span>
          </Link>
          
          <Link
            to="/player/sessao"
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              isActive("/player/sessao")
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary/50"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            <FileText className="h-5 w-5" />
            <span>Sessão</span>
          </Link>
          
          <Link
            to="/player/config"
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              isActive("/player/config")
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary/50"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            <Settings className="h-5 w-5" />
            <span>Configurações</span>
          </Link>
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-6">{children}</main>
    </div>
  );
}
