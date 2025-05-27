
import { useState, useEffect } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";

const UserType = () => {
  const [userType, setUserType] = useState<"player" | "master">("player");
  const [masterPassword, setMasterPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useAuth();

  const MASTER_PASSWORD = "extraplanar123";

  useEffect(() => {
    if (!currentUser) navigate("/");
  }, [currentUser, navigate]);

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
      
      if (!currentUser) throw new Error("Usuário não autenticado");
      
      await setDoc(doc(db, "users", currentUser.uid), {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        role: userType,
        createdAt: new Date(),
      });

      toast({
        title: "Perfil configurado",
        description: `Você foi registrado como ${userType === 'player' ? 'Jogador' : 'Mestre'}!`,
      });

      window.location.href = `/${userType}/dashboard`;
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <Card className="bg-black/30 backdrop-blur-lg border border-white/10 rounded-xl p-8 w-full max-w-md">
          <div className="space-y-2 text-center mb-6">
            <h1 className="font-serif text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Escolha seu perfil
            </h1>
            <p className="text-muted-foreground text-sm">
              Defina seu papel no multiverso extraplanar
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <RadioGroup 
                defaultValue="player" 
                value={userType}
                onValueChange={(value: "player" | "master") => setUserType(value)}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex flex-col items-center border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/5 transition-colors group">
                  <RadioGroupItem value="player" id="player" className="sr-only" />
                  <Label htmlFor="player" className="cursor-pointer flex flex-col items-center gap-2 w-full h-full">
                    <UserCircle className="h-12 w-12 text-primary group-hover:text-primary/80 transition-colors" />
                    <span className="font-medium mt-1 text-white">Jogador</span>
                    <p className="text-xs text-center text-muted-foreground">
                      Crie personagens e participe de aventuras
                    </p>
                  </Label>
                </div>
                
                <div className="flex flex-col items-center border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/5 transition-colors group">
                  <RadioGroupItem value="master" id="master" className="sr-only" />
                  <Label htmlFor="master" className="cursor-pointer flex flex-col items-center gap-2 w-full h-full">
                    <Shield className="h-12 w-12 text-primary group-hover:text-primary/80 transition-colors" />
                    <span className="font-medium mt-1 text-white">Mestre</span>
                    <p className="text-xs text-center text-muted-foreground">
                      Crie e conduza aventuras no multiverso
                    </p>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            {userType === "master" && (
              <div className="space-y-3 bg-black/20 p-4 rounded-md border border-white/10">
                <Label htmlFor="masterPassword" className="text-white">Senha de Mestre</Label>
                <input
                  id="masterPassword"
                  type="password"
                  placeholder="Insira a senha de Mestre"
                  className="flex h-10 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  value={masterPassword}
                  onChange={(e) => setMasterPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  A senha de Mestre é necessária para acessar as funcionalidades especiais.
                </p>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-primary/20 hover:bg-primary/30 border border-primary/30 hover:border-primary/50 transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">↻</span>
                  Processando...
                </span>
              ) : "Confirmar"}
            </Button>
          </form>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserType;