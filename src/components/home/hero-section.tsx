
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlaneBadge } from "@/components/ui/plane-badge";
import { Flame, BookOpen, Users, Star } from "lucide-react";

export function HeroSection() {
  return (
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
                <Link to="/register">
                  <Flame className="mr-2 h-4 w-4" />
                  Começar Aventura
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/sistema">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Conhecer o Sistema
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative group">
            <div className="bg-gradient-to-br from-primary/30 via-secondary/50 to-accent/20 rounded-lg p-1 backdrop-blur">
              <div className="aspect-video relative overflow-hidden rounded-md bg-muted/60 backdrop-blur flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-background/80 via-background/50 to-background/30 backdrop-blur-sm"></div>
                <div className="relative z-10 text-center p-8 space-y-4">
                  <Flame className="mx-auto h-16 w-16 text-primary animate-glow" />
                  <h3 className="font-serif text-2xl font-semibold">Multiverso Extraplanar</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Um sistema dinâmico de regras que se adapta à sua imaginação e estilo de jogo.
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -z-10 -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
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
  );
}
