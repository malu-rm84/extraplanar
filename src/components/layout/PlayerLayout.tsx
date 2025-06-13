import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
  Map,
  Dice6,
  Notebook,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/components/auth/firebase-config";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PlayerLayoutProps {
  children: React.ReactNode;
}

export function PlayerLayout({ children }: PlayerLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState({
    displayName: "",
    photoURL: "",
    role: "player"
  });
  
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!currentUser?.uid) return;

      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserProfile({
            displayName: userData.displayName || currentUser.displayName || "",
            photoURL: userData.photoURL || currentUser.photoURL || "",
            role: userData.role || "player"
          });
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      }
    };

    loadUserProfile();
  }, [currentUser]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-black to-[#0f0f1f]">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between border-b border-white/10 p-4 bg-black/30 backdrop-blur-lg">
        <Link to="/player/dashboard" className="flex items-center gap-2">
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
      <aside className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-64 bg-black/30 backdrop-blur-lg border-r border-white/10 md:fixed md:h-screen md:top-0 md:left-0`}>
        <div className="hidden md:flex items-center gap-2 p-6 border-b border-white/10">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-serif text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Extraplanar
          </span>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userProfile.photoURL} alt="User Avatar" />
            <AvatarFallback className="bg-primary/20 text-primary">
              {userProfile.displayName?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-white truncate max-w-[150px]">
              {userProfile.displayName || "Usuário"}
            </p>
            <span className="text-xs text-muted-foreground">
              {userProfile.role === "master" ? "Mestre" : "Jogador"}
            </span>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-2">
          {[
            { path: "/player/dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
            { path: "/player/criarpersonagens", icon: <User />, label: "Criar Personagens" },
            { path: "/player/personagens", icon: <User />, label: "Meus Personagens" },
            { path: "/player/notes", icon: <Notebook />, label: "Anotações" },
            { path: "/player/campanhas", icon: <Map />, label: "Campanhas" },
            { path: "/player/rolagem", icon: <Dice6 />, label: "Rolagem" },
            { path: "/player/config", icon: <Settings />, label: "Configurações" },
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
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-6 overflow-auto md:ml-64">{children}</main>
    </div>
  );
}