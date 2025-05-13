
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlaneBadge } from "@/components/ui/plane-badge";
import { Globe, Bookmark } from "lucide-react";

const planes = [
  {
    name: "Material",
    description: "O plano principal onde a maioria das raças vive. Um mundo semelhante ao nosso, com diversas paisagens e civilizações.",
    color: "material",
    image: "bg-gradient-to-br from-slate-300 to-slate-500",
  },
  {
    name: "Esmeralda",
    description: "Um plano selvagem e natural, repleto de magia elemental da terra e floresta. Lar de fadas e seres arbóreos.",
    color: "emerald",
    image: "bg-gradient-to-br from-green-300 to-green-500",
  },
  {
    name: "Inferno",
    description: "Plano de fogo e destruição, onde demônios e outras criaturas ardentes habitam fortalezas de obsidiana e lava.",
    color: "inferno",
    image: "bg-gradient-to-br from-red-300 to-red-500",
  },
  {
    name: "Etéreo",
    description: "Dimensão mística que serve como passagem entre planos. Repleta de energia arcana e seres feitos de pura magia.",
    color: "ethereal",
    image: "bg-gradient-to-br from-purple-300 to-purple-500",
  },
  {
    name: "Astral",
    description: "Vasto oceano cósmico entre os planos, onde o tempo e espaço são conceitos fluidos. Lar de entidades celestiais.",
    color: "astral",
    image: "bg-gradient-to-br from-blue-300 to-blue-500",
  },
];

export function PlanesSection() {
  return (
    <section className="py-16 md:py-24">
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
          {planes.map((plane) => (
            <div 
              key={plane.name} 
              className={`mystic-card plane-${plane.color as "material" | "emerald" | "inferno" | "ethereal" | "astral"}`}
            >
              <div className={`w-full h-32 rounded-md mb-4 flex items-center justify-center ${plane.image}`}>
                <h3 className="font-serif text-2xl font-semibold text-white shadow-sm">
                  {plane.name}
                </h3>
              </div>
              <p className="text-muted-foreground mb-4">
                {plane.description}
              </p>
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" className="text-primary" asChild>
                  <Link to={`/planos/${plane.name.toLowerCase()}`}>
                    <Bookmark className="mr-2 h-4 w-4" />
                    Explorar plano
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
