// src/pages/Login.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { auth, googleProvider } from "@/components/auth/firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      await signInWithPopup(auth, googleProvider);
      toast({
        title: "Login bem-sucedido",
        description: "Bem-vindo ao Extraplanar RPG!",
      });
      navigate("/user-type");
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="mystic-card max-w-sm w-full p-6">
          <div className="space-y-2 text-center mb-6">
            <h2 className="font-serif text-2xl font-semibold">Portal de Acesso</h2>
            <p className="text-sm text-muted-foreground">
              Entre na sua conta para acessar o multiverso extraplanar
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleAuth}
            disabled={isLoading}
          >
            {/* Mesmo conteúdo do botão Google do Home.tsx */}
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Carregando...
              </span>
            ) : (
              <>
                {/* Ícone do Google */}
                Entrar com Google
              </>
            )}
          </Button>

          <div className="mt-6 text-center text-sm">
            Não tem uma conta?{" "}
            <Link to="/" className="text-primary hover:underline">
              Crie uma conta
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}