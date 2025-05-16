// src/pages/Home.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { auth, googleProvider } from "@/components/auth/firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PlaneBadge } from "@/components/ui/plane-badge";
import { Flame, BookOpen, Users, Star, Compass, FileText, Bookmark, Globe, UsersIcon, Search } from "lucide-react";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      await signInWithPopup(auth, googleProvider);
      toast({
        title: isLogin ? "Login bem-sucedido" : "Registro bem-sucedido",
        description: "Bem-vindo ao Extraplanar RPG!",
      });
      navigate("/user-type");
    } catch (error) {
      console.error(`Erro no ${isLogin ? 'login' : 'registro'}:`, error);
      toast({
        title: `Erro no ${isLogin ? 'login' : 'registro'}`,
        description: `Não foi possível ${isLogin ? 'fazer login' : 'se registrar'}. Tente novamente.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Seção Hero */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-block">
                  <PlaneBadge plane="ethereal" className="animate-float">
                    <Flame className="h-3.5 w-3.5 mr-1" />
                    Sistema de RPG
                  </PlaneBadge>
                </div>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Extraplanar
                  <span className="text-primary block">Aventuras entre mundos</span>
                </h1>
                <p className="text-lg text-muted-foreground md:text-xl max-w-[600px]">
                  Explore planos místicos de existência, crie personagens únicos e 
                  embarque em aventuras que transcendem os limites da realidade.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button asChild size="lg" className="mystic-button">
                    <Link to="#features">
                      <Flame className="mr-2 h-4 w-4" />
                      Começar Aventura
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="#sistema">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Conhecer o Sistema
                    </Link>
                  </Button>
                </div>
              </div>
              
              {/* Card de Autenticação */}
              <div className="mystic-card max-w-sm mx-auto w-full p-6">
                <div className="space-y-2 text-center mb-6">
                  <h2 className="font-serif text-2xl font-semibold">
                    {isLogin ? "Portal de Acesso" : "Criar Nova Conta"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {isLogin 
                      ? "Entre na sua conta para acessar o multiverso extraplanar"
                      : "Registre-se para explorar o multiverso extraplanar"}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                >
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
                      <svg
                        className="h-4 w-4 mr-2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      {isLogin ? "Entrar com Google" : "Registrar com Google"}
                    </>
                  )}
                </Button>

                <div className="mt-6 text-center text-sm">
                  {isLogin ? (
                    <>
                      Ainda não tem uma conta?{" "}
                      <button 
                        onClick={() => setIsLogin(false)}
                        className="text-primary hover:underline cursor-pointer"
                      >
                        Registre-se
                      </button>
                    </>
                  ) : (
                    <>
                      Já tem uma conta?{" "}
                      <button
                        onClick={() => setIsLogin(true)}
                        className="text-primary hover:underline cursor-pointer"
                      >
                        Faça login
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-8 mt-16">
              <div className="flex flex-col items-center text-center space-y-2 p-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Flame className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">5 Planos Místicos</h3>
                <p className="text-sm text-muted-foreground">Material, Esmeralda, Inferno, Etéreo e Astral</p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-2 p-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">12+ Raças</h3>
                <p className="text-sm text-muted-foreground">Com habilidades únicas e histórias ricas</p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-2 p-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Sistema Intuitivo</h3>
                <p className="text-sm text-muted-foreground">Fácil de aprender, rico em possibilidades</p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-2 p-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Exportável</h3>
                <p className="text-sm text-muted-foreground">Compatível com Obsidian para suas anotações</p>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Funcionalidades */}
        <section id="features" className="py-16 md:py-24 bg-secondary/30">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 max-w-3xl mx-auto mb-12">
              <div className="mx-auto w-fit">
                <PlaneBadge plane="emerald">
                  <Compass className="h-3.5 w-3.5 mr-1" />
                  Funcionalidades
                </PlaneBadge>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
                Ferramentas para Mestres e Jogadores
              </h2>
              <p className="text-muted-foreground">
                Tudo o que você precisa para gerenciar suas aventuras e personagens em um só lugar
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Gerenciamento de Mesas */}
              <div className="mystic-card plane-ethereal">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <UsersIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-medium">Gerenciador de Mesas</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Crie e gerencie suas mesas de jogo, adicione jogadores por e-mail e mantenha suas anotações organizadas.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span>Convites por e-mail</span>
                  </li>
                  {/* ... outros itens ... */}
                </ul>
              </div>

              {/* Outras funcionalidades... */}
            </div>
          </div>
        </section>

        {/* Seção de Planos */}
        <section id="planos" className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 max-w-3xl mx-auto mb-12">
              <div className="mx-auto w-fit">
                <PlaneBadge plane="material">
                  <Globe className="h-3.5 w-3.5 mr-1" />
                  Multiverso
                </PlaneBadge>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
                Explore os Planos de Existência
              </h2>
              <p className="text-muted-foreground">
                Cada plano tem suas próprias raças, regras e histórias para descobrir
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Cards de planos... */}
            </div>

            <div className="mt-16 p-6 bg-secondary/20 rounded-lg max-w-3xl mx-auto">
              <h3 className="font-serif text-2xl font-semibold mb-4 text-center">O Complexo Esmeralda</h3>
              {/* História do plano... */}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}