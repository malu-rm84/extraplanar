import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookOpen, 
  ScrollText,
  Users,
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bot,
  Map,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/components/auth/firebase-config";
import { signOut } from "firebase/auth";
import { useToast } from "@/components/ui/use-toast";

interface MasterLayoutProps {
  children: React.ReactNode;
}

export function MasterLayout({ children }: MasterLayoutProps) {
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
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-black to-[#0f0f1f]">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between border-b border-white/10 p-4 bg-black/30 backdrop-blur-lg">
        <Link to="/master/dashboard" className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-serif text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Extraplanar
          </span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          className="text-primary hover:bg-primary/20"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-64 bg-black/30 backdrop-blur-lg border-r border-white/10`}>
        <div className="hidden md:flex items-center gap-2 p-6 border-b border-white/10">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-serif text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Extraplanar
          </span>
        </div>

        <nav className="flex-grow p-4 space-y-2">
          {[
            { path: "/master/dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
            { path: "/master/campanhas", icon: <Map />, label: "Campanhas" },
            { path: "/master/notes", icon: <ScrollText />, label: "Notes" },
            { path: "/master/gerador", icon: <Bot />, label: "Gerador" },
            { path: "/master/personagens", icon: <Users />, label: "Meus Personagens" },
            { path: "/master/criarpersonagens", icon: <User />, label: "Criar Personagens" },
            { path: "/master/sistema", icon: <BookOpen />, label: "Sistema" },
            { path: "/master/players", icon: <Users />, label: "Players" },
            { path: "/master/config", icon: <Settings />, label: "Configurações" },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive(item.path)
                  ? "bg-primary/20 text-primary shadow-glow"
                  : "text-muted-foreground hover:bg-primary/20 hover:text-primary"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 bg-black/30 border-white/10 hover:bg-primary/20 hover:text-primary"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-6 overflow-auto">{children}</main>
    </div>
  );
}