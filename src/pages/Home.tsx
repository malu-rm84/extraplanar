// src/pages/Home.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "@/components/auth/firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  Flame,
  BookOpen,
  Users,
  Compass,
  FileText,
  Download,
  Search,
  Globe,
  Sparkles,
  Wand2,
  Cloud,
  Zap,
  Leaf,
  Skull
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface PlaneBadgeProps {
  children: React.ReactNode;
  plane: string;
  className?: string;
}

// Define planes
const planes = [
  {
    name: "Material",
    description: "O plano principal onde a maioria das raças vive. Um mundo semelhante ao nosso, com diversas paisagens e civilizações.",
    color: "gray",
    icon: <Globe className="h-6 w-6 text-white/90" />,
    imageClass: "bg-gradient-to-br from-gray-200 to-gray-500",
    lore: "",
  },
  {
    name: "Esmeralda",
    description: "Um plano selvagem e natural, repleto de magia elemental da terra e floresta.",
    color: "green",
    icon: <Leaf className="h-6 w-6 text-white/90" />,
    imageClass: "bg-gradient-to-br from-emerald-300 to-green-600",
    lore: "Há muito tempo Oberon e Titânia criaram o Plano Esmeralda com poderes de magia natural, originando feéricos, elfos e druidas.",
  },
  {
    name: "Chiclete",
    description: "Um plano vibrante e caótico, onde tudo tem tons de rosa e regras excêntricas.",
    color: "pink",
    icon: <Sparkles className="h-6 w-6 text-white/90" />,
    imageClass: "bg-gradient-to-br from-pink-300 to-fuchsia-600",
    lore: "O Plano Chiclete nasceu da imaginação pura, onde criaturas doces e pegajosas coexistem em harmonia.",
  },
  {
    name: "Inferno",
    description: "Plano de fogo e destruição, habitado por demônios e lava incandescente.",
    color: "red",
    icon: <Flame className="h-6 w-6 text-white/90" />,
    imageClass: "bg-gradient-to-br from-orange-500 to-red-700",
    lore: "Após a Guerra de Ânimos, as chamas do Inferno consumiram mundos menores, criando fortalezas de obsidiana.",
  },
  {
    name: "Céu",
    description: "Um reino etéreo de nuvens e luz, onde anjos e aves gigantes dominam o horizonte.",
    color: "blue",
    icon: <Cloud className="h-6 w-6 text-white/90" />,
    imageClass: "bg-gradient-to-br from-sky-300 to-blue-500",
    lore: "Dizem que quem alcança o Plano Céu ouve cantos de harpas celestiais e vê constelações vivas.",
  },
  {
    name: "Etéreo",
    description: "Dimensão mística entre os planos, repleta de energia arcana.",
    color: "purple",
    icon: <Zap className="h-6 w-6 text-white/90" />,
    imageClass: "bg-gradient-to-br from-indigo-400 to-violet-600",
    lore: "O Éter é a passagem de almas e feitiços, conectando todos os planos conhecidos.",
  },
  {
    name: "Elysium",
    description: "É um plano consciente, um jardim místico com diferentes níveis.",
    color: "yellow",
    icon: <Zap className="h-6 w-6 text-white/90" />,
    imageClass: "bg-gradient-to-r from-amber-200 to-yellow-500",
    lore: "Alguns dizem que dragões e outras criaturas místicas são de lá, mas ninguém sabe como ir para lá ou o que encontrará lá.",
  },
];

// Define affinities
const affinities = [
  {
    name: "Natural",
    description: "Ligada a elementos naturais",
    icon: <Leaf className="h-6 w-6 text-white/90" />,
    imageClass: "bg-gradient-to-br from-emerald-300 to-green-600",
  },
  {
    name: "Arcana",
    description: "Magia arcana e artefatos",
    icon: <Wand2 className="h-6 w-6 text-white/90" />,
    imageClass: "bg-gradient-to-br from-pink-300 to-fuchsia-600",
  },
  {
    name: "Necromante",
    description: "Manipulação da morte",
    icon: <Skull className="h-6 w-6 text-white/90" />,
    imageClass: "bg-gradient-to-br from-orange-500 to-red-700",
  },
  {
    name: "Divina",
    description: "Poder sagrado e milagres",
    icon: <Zap className="h-6 w-6 text-white/90" />,
    imageClass: "bg-gradient-to-br from-sky-300 to-blue-500",
  },
  {
    name: "Cósmica",
    description: "Energias cósmicas e dimensões",
    icon: <Sparkles className="h-6 w-6 text-white/90" />,
    imageClass: "bg-gradient-to-r from-amber-200 to-yellow-500",
  },
];

// Badge component
function PlaneBadge({ children, plane, className }: PlaneBadgeProps) {
  const planeColors = {
    material: "bg-gradient-to-r from-indigo-400 to-violet-600",
    emerald: "bg-gradient-to-r from-emerald-400 to-green-600",
    bubblegum: "bg-gradient-to-r from-pink-400 to-fuchsia-600",
    inferno: "bg-gradient-to-r from-orange-400 to-red-600",
    sky: "bg-gradient-to-r from-sky-300 to-blue-600",
    ethereal: "bg-gradient-to-r from-amber-300 to-yellow-600",
    elysium: "bg-gradient-to-r from-amber-300 to-yellow-600",
  };

  return (
    <span 
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${planeColors[plane] || planeColors.ethereal} ${className || ""}`}
    >
      {children}
    </span>
  );
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [activeTab, setActiveTab] = useState("planos");
  const { toast } = useToast();
  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      
      // Redirecionar novos usuários
      if (result.user.metadata.creationTime === result.user.metadata.lastSignInTime) {
        navigate("/choose-role");
      } else {
        toast({ 
          title: isLogin ? "Login bem-sucedido" : "Registro bem-sucedido", 
          description: "Bem-vindo ao Extraplanar RPG!" 
        });
      }
    } catch (error) {
      console.error(`Erro no ${isLogin ? 'login' : 'registro'}:`, error);
      toast({ 
        title: `Erro no ${isLogin ? 'login' : 'registro'}`, 
        description: `Não foi possível ${isLogin ? 'fazer login' : 'se registrar'}. Tente novamente.`, 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Animated background with particles */}
      <div className="fixed inset-0 bg-background z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80" />
        {Array.from({ length: 20 }).map((_, index) => (
          <div
            key={index}
            className="absolute rounded-full bg-primary/10 animate-float"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          />
        ))}
      </div>
      
      <Header />
      
      <main className="flex-grow relative z-10">
        {/* Hero + Auth Section */}
        <section id="inicio" className="py-16 md:py-24 relative overflow-hidden">
          <div className="container px-4 md:px-6 grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <PlaneBadge plane="ethereal" className="animate-pulse">
                <Flame className="h-3.5 w-3.5 mr-1" />Sistema de RPG
              </PlaneBadge>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Extraplanar
                <span className="block text-foreground">Aventuras entre mundos</span>
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl max-w-[600px]">
                Explore planos místicos, crie personagens únicos e embarque em aventuras épicas em um universo de possibilidades ilimitadas.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  asChild 
                  size="lg" 
                  className="relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground transition-all duration-300 shadow-lg hover:shadow-primary/25 hover:scale-[1.02]"
                >
                  <a href="#planos">
                    <Sparkles className="mr-2 h-4 w-4" />Começar Aventura
                  </a>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="border-primary/20 hover:border-primary/50 transition-all duration-300"
                >
                  <a href="#sistema">
                    <BookOpen className="mr-2 h-4 w-4" />Conhecer o Sistema
                  </a>
                </Button>
              </div>
            </div>
            
            <div className="max-w-sm mx-auto w-full p-6 rounded-2xl backdrop-blur-sm bg-background/30 border border-primary/20 shadow-lg hover:shadow-primary/10 transition-all duration-300">
              <div className="space-y-2 text-center mb-6">
                <h2 className="font-serif text-2xl font-semibold">{isLogin ? 'Acesso ao Multiverso' : 'Criação de Conta'}</h2>
                <p className="text-sm text-muted-foreground">{isLogin ? 'Entre com Google para explorar os planos' : 'Registre-se para começar sua aventura'}</p>
              </div>
              <Button 
                variant="outline" 
                className="w-full mb-4 bg-background/50 backdrop-blur-sm hover:bg-background/70 border-primary/20 hover:border-primary/40 transition-all duration-300" 
                onClick={handleGoogleAuth} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Carregando...
                  </span>
                ) : (
                  <>
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                    </svg>
                    {isLogin ? 'Entrar com Google' : 'Registrar com Google'}
                  </>
                )}
              </Button>
              <div className="mt-6 text-center text-sm">
                {isLogin ? (
                  <>
                    Novo viajante? <button onClick={handleGoogleAuth} className="text-primary hover:underline">Crie uma conta</button>
                  </>
                ) : (
                  <>
                    Já tem conta? <button onClick={handleGoogleAuth} className="text-primary hover:underline">Faça login</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* Affinities Section */}
        <section id="afinidades" className="py-16 md:py-12">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 max-w-3xl mx-auto mb-12">
              <PlaneBadge plane="emerald">
                <Wand2 className="h-3.5 w-3.5 mr-1" />Afinidades
              </PlaneBadge>
              <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
                Descubra sua Afinidade Mágica
              </h2>
              <p className="text-muted-foreground">
                A fonte de poder que guiará seu personagem através dos planos
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {affinities.map((affinity) => (
                <div 
                  key={affinity.name}
                  className={`relative group rounded-xl ${affinity.imageClass} p-4 h-32 flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="relative z-10 flex justify-between">
                    <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm">
                      {affinity.icon}
                    </div>
                  </div>
                  <div className="relative z-10">
                    <h3 className="font-serif text-lg font-semibold text-white">{affinity.name}</h3>
                    <p className="text-xs text-white/80">{affinity.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Tabs for Features and Planes */}
        <section id="conteudo" className="py-16 md:py-24 bg-secondary/5 backdrop-blur-sm">
          <div className="container px-4 md:px-6">
            <div className="flex justify-center mb-8">
              <div className="inline-flex rounded-lg border border-primary/20 p-1 bg-background/50 backdrop-blur-sm">
                <button
                  onClick={() => setActiveTab("planos")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === "planos"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground/80 hover:text-foreground"
                  }`}
                >
                  <Globe className="h-4 w-4 inline mr-1" /> Planos
                </button>
                <button
                  onClick={() => setActiveTab("sistema")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === "sistema"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground/80 hover:text-foreground"
                  }`}
                >
                  <BookOpen className="h-4 w-4 inline mr-1" /> Sistema
                </button>
              </div>
            </div>

            {/* Planes Tab Content */}
            <div className={activeTab === "planos" ? "block" : "hidden"} id="planos">
              <div className="text-center space-y-4 max-w-3xl mx-auto mb-12">
                <PlaneBadge plane="material">
                  <Globe className="h-3.5 w-3.5 mr-1" />
                  Multiverso
                </PlaneBadge>
                <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
                  Explore os Planos de Existência
                </h2>
                <p className="text-muted-foreground">
                  Cada plano tem suas próprias raças, regras e histórias para descobrir
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {planes.map((plane) => (
                  <div
                    key={plane.name}
                    className="group rounded-xl overflow-hidden bg-background/80 backdrop-blur-sm border border-primary/10 hover:border-primary/30 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className={`w-full h-40 ${plane.imageClass} relative`}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-4 left-4 p-2 rounded-full bg-white/10 backdrop-blur-sm">
                        {plane.icon}
                      </div>
                      <h3 className="absolute bottom-4 left-4 font-serif text-2xl font-semibold text-white">
                        {plane.name}
                      </h3>
                    </div>
                    <div className="p-4">
                      <p className="text-muted-foreground mb-4">
                        {plane.description}
                      </p>
                      {plane.lore && (
                        <Accordion type="single" collapsible className="mb-2">
                          <AccordionItem value="lore" className="border-primary/10">
                            <AccordionTrigger className="text-sm py-2 hover:no-underline">
                              <span className="flex items-center text-primary/80 hover:text-primary">
                                <BookOpen className="h-4 w-4 mr-2" />
                                História do Plano
                              </span>
                            </AccordionTrigger>
                            <AccordionContent>
                              <p className="text-sm text-muted-foreground pl-6 border-l border-primary/10">
                                {plane.lore}
                              </p>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features Tab Content */}
            <div className={activeTab === "sistema" ? "block" : "hidden"} id="sistema">
              <div className="text-center space-y-4 max-w-3xl mx-auto mb-12">
                <PlaneBadge plane="ethereal">
                  <Compass className="h-3.5 w-3.5 mr-1" />Funcionalidades
                </PlaneBadge>
                <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
                  Ferramentas para Mestres e Jogadores
                </h2>
                <p className="text-muted-foreground">
                  Tudo o que você precisa para gerenciar suas aventuras e personagens em um só lugar
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Gerenciador de Mesas */}
                <div className="group rounded-xl overflow-hidden bg-background/80 backdrop-blur-sm border border-primary/10 hover:border-primary/30 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-serif text-xl font-medium">Gerenciador de Mesas</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Crie e gerencie suas mesas de jogo, adicione jogadores por links e mantenha suas anotações organizadas.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground/90">
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">•</span> Convites por link
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">•</span> Anotações colaborativas
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">•</span> Acesso centralizado às fichas dos jogadores
                    </li>
                  </ul>
                </div>
                
                {/* Fichas de Personagem */}
                <div className="group rounded-xl overflow-hidden bg-background/80 backdrop-blur-sm border border-primary/10 hover:border-primary/30 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-serif text-xl font-medium">Fichas de Personagem</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Crie e edite fichas detalhadas com atributos, inventário e habilidades especiais.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground/90">
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">•</span> Preenchimento automático por raça
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">•</span> Sistema de atributos e habilidades
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">•</span> Exportação para Markdown
                    </li>
                  </ul>
                </div>
                
                {/* Criador de NPCs */}
                <div className="group rounded-xl overflow-hidden bg-background/80 backdrop-blur-sm border border-primary/10 hover:border-primary/30 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Compass className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-serif text-xl font-medium">Criador de NPCs</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Gere NPCs e vilões memoráveis com personalização completa de características.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground/90">
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">•</span> Gerador de nomes por raça
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">•</span> Personalização de atributos
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">•</span> Associação automática à mesa
                    </li>
                  </ul>
                </div>
                
                {/* Sistema de Lore */}
                <div className="group rounded-xl overflow-hidden bg-background/80 backdrop-blur-sm border border-primary/10 hover:border-primary/30 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-serif text-xl font-medium">Sistema de Lore</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Organize regras, histórias e descrições de planos para consulta imediata.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground/90">
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">•</span> Organização por planos e facções
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">•</span> Regras completas e histórico
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">•</span> Anotações vinculadas a eventos
                    </li>
                  </ul>
                </div>
                
                {/* Exportação para Obsidian */}
                <div className="group rounded-xl overflow-hidden bg-background/80 backdrop-blur-sm border border-primary/10 hover:border-primary/30 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Download className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-serif text-xl font-medium">Exportação</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Exporte seus dados em Markdown para outros editores.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground/90">
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">•</span> Formato Markdown compatível
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">•</span> Tags e links integrados
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">•</span> Backup e versionamento local
                    </li>
                  </ul>
                </div>
                
                {/* Sistema de Busca */}
                <div className="group rounded-xl overflow-hidden bg-background/80 backdrop-blur-sm border border-primary/10 hover:border-primary/30 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Search className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-serif text-xl font-medium">Sistema de Busca</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Encontre rapidamente o que precisar com filtros avançados.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground/90">
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">•</span> Busca por plano, raça e palavra-chave
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">•</span> Resultados instantâneos
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2 text-primary">•</span> Destaques de termos e favoritos
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Race Showcase Section */}
        <section id="racas" className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="text-center space-y-4 max-w-3xl mx-auto mb-12">
              <PlaneBadge plane="bubblegum">
                <Users className="h-3.5 w-3.5 mr-1" />Diversidade
              </PlaneBadge>
              <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
                +40 Raças Jogáveis
              </h2>
              <p className="text-muted-foreground">
                De elfos ancestrais a criaturas interplanares únicas, encontre a raça perfeita para sua história
              </p>
            </div>
            
            <div className="relative">
              <div className="flex overflow-x-auto pb-8 -mx-4 px-4 space-x-4 scrollbar-hide snap-x">
                {[
                  { name: "Elfo", plane: "Material", image: "bg-gradient-to-br from-gray-300 to-gray-500" },
                  { name: "Fada", plane: "Esmeralda", image: "bg-gradient-to-br from-emerald-300 to-green-600" },
                  { name: "Chiclete", plane: "Chiclete", image: "bg-gradient-to-br from-pink-300 to-pink-600" },
                  { name: "Diabrete", plane: "Inferno", image: "bg-gradient-to-br from-orange-500 to-red-700" },
                  { name: "Anjo", plane: "Céu", image: "bg-gradient-to-br from-sky-300 to-blue-500" },
                  { name: "Fantasma", plane: "Etéreo", image: "bg-gradient-to-br from-indigo-400 to-violet-600" },
                  { name: "Dragão", plane: "Elysium", image: "bg-gradient-to-r from-amber-200 to-yellow-500" },
                ].map((race, index) => (
                  <div 
                    key={index}
                    className="flex-none w-72 h-48 rounded-xl overflow-hidden snap-center shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className={`h-full w-full relative ${race.image}`}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-4 text-white">
                        <h3 className="font-serif text-2xl font-semibold">{race.name}</h3>
                        <p className="text-sm text-white/80">Plano de origem: {race.plane}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute right-4 bottom-2 text-sm">
                <span className="text-muted-foreground">Deslize para ver mais</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <PlaneBadge plane="ethereal" className="animate-pulse">
                <Wand2 className="h-3.5 w-3.5 mr-1" />Portal Aberto
              </PlaneBadge>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Pronto para cruzar os planos?
              </h2>
              <p className="text-lg text-muted-foreground">
                Crie sua conta agora e comece a explorar os diferentes planos de existência do Extraplanar RPG. Sua aventura multiversal aguarda!
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground transition-all duration-300 shadow-lg hover:shadow-primary/25 hover:scale-[1.02]"
                  onClick={() => setIsLogin(false)}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Criar Conta Gratuita
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary/20 hover:border-primary/50 transition-all duration-300"
                  asChild
                >
                  <a href="#planos">
                    <Globe className="mr-2 h-4 w-4" />
                    Explorar Planos
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating navigation indicators */}
      <div className={`fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 transition-opacity duration-300 ${scrollPosition > 200 ? 'opacity-100' : 'opacity-0'}`}>
        {['inicio', 'afinidades', 'conteudo', 'racas'].map((section, index) => (
          <a
            key={section}
            href={`#${section}`}
            className="w-2 h-2 rounded-full bg-primary/30 hover:bg-primary/80 transition-all duration-300"
            title={section.charAt(0).toUpperCase() + section.slice(1)}
          ></a>
        ))}
      </div>
      
      <Footer />
    </div>
  );
}