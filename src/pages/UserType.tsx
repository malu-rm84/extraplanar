
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Shield, UserCircle } from "lucide-react";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/components/auth/firebase-config";

const UserType = () => {
  const [userType, setUserType] = useState("player");
  const [masterPassword, setMasterPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Master password would be managed by admin, hardcoded for demo
  const MASTER_PASSWORD = "extraplanar123";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userType === "master" && masterPassword !== MASTER_PASSWORD) {
      toast({
        title: "Senha incorreta",
        description: "A senha de Mestre está incorreta.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const user = auth.currentUser;
      
      if (!user) {
        toast({
          title: "Erro de autenticação",
          description: "Você não está autenticado. Por favor, faça login.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }
      
      // Save user role in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: userType,
        createdAt: new Date(),
      });

      toast({
        title: "Perfil configurado",
        description: `Você foi registrado como ${userType === 'player' ? 'Jogador' : 'Mestre'}!`,
      });

      // Redirect to appropriate dashboard
      if (userType === "master") {
        navigate("/master/dashboard");
      } else {
        navigate("/player/dashboard");
      }
    } catch (error) {
      console.error("Erro ao definir tipo de usuário:", error);
      toast({
        title: "Erro",
        description: "Não foi possível definir o tipo de usuário. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="mystic-card max-w-md mx-auto w-full">
          <div className="space-y-2 text-center">
            <h1 className="font-serif text-2xl font-semibold tracking-tight">
              Escolha seu perfil
            </h1>
            <p className="text-sm text-muted-foreground">
              Defina seu papel no multiverso extraplanar
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="space-y-3">
              <RadioGroup 
                defaultValue="player" 
                value={userType}
                onValueChange={setUserType}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex flex-col items-center border rounded-lg p-4 cursor-pointer hover:bg-secondary/50 transition-colors">
                  <RadioGroupItem value="player" id="player" className="sr-only" />
                  <Label htmlFor="player" className="cursor-pointer flex flex-col items-center gap-2 w-full h-full">
                    <UserCircle className="h-12 w-12" />
                    <span className="font-medium mt-1">Jogador</span>
                    <p className="text-xs text-center text-muted-foreground">
                      Crie personagens e participe de aventuras
                    </p>
                  </Label>
                </div>
                
                <div className="flex flex-col items-center border rounded-lg p-4 cursor-pointer hover:bg-secondary/50 transition-colors">
                  <RadioGroupItem value="master" id="master" className="sr-only" />
                  <Label htmlFor="master" className="cursor-pointer flex flex-col items-center gap-2 w-full h-full">
                    <Shield className="h-12 w-12" />
                    <span className="font-medium mt-1">Mestre</span>
                    <p className="text-xs text-center text-muted-foreground">
                      Crie e conduza aventuras no multiverso
                    </p>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            {userType === "master" && (
              <div className="space-y-2 bg-secondary/20 p-4 rounded-md border">
                <Label htmlFor="masterPassword">Senha de Mestre</Label>
                <input
                  id="masterPassword"
                  type="password"
                  placeholder="Insira a senha de Mestre"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={masterPassword}
                  onChange={(e) => setMasterPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  A senha de Mestre é necessária para acessar as funcionalidades especiais.
                </p>
              </div>
            )}
            
            <Button type="submit" className="w-full mystic-button" disabled={isLoading}>
              {isLoading ? "Processando..." : "Confirmar"}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserType;
