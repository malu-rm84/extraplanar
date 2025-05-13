
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlaneBadge } from "@/components/ui/plane-badge";
import { Globe, Bookmark, BookOpen } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const planes = [
  {
    name: "Material",
    description: "O plano principal onde a maioria das raças vive. Um mundo semelhante ao nosso, com diversas paisagens e civilizações.",
    color: "material",
    image: "bg-gradient-to-br from-slate-300 to-slate-500",
  },
  {
    name: "Esmeralda",
    description: "Um plano selvagem e natural, repleto de magia elemental da terra e floresta. Lar de Elfos, Feéricos e outras criaturas mágicas.",
    color: "emerald",
    image: "bg-gradient-to-br from-green-300 to-green-500",
    lore: "A muito tempo atrás, dois seres primordiais, Oberon e Titânia, deram vida ao Plano Esmeralda. Juntos, criaram um lindo lugar e originaram uma raça de seres chamados de Feéricos. Aquele reino antigo formou o maior império que o universo já viu. Os dois deuses tiveram um filho, Puck, que havia herdado o melhor dos dois. Após anos de negligência e conflitos, uma guerra dividiu os Feéricos em dois: Fadas, seguidores de Titânia, e Elfos, seguidores de Oberon. Baba Yaga, a Mãe das Bruxas, junto com suas três filhas, Oberon e Puck conspiraram para derrubar Titânia. Com a vitória, os elfos tomaram o plano esmeralda, dividindo o antigo reino das fadas entre as filhas de Baba Yaga."
  },
  {
    name: "Inferno",
    description: "Plano de fogo e destruição, onde demônios e outras criaturas ardentes habitam fortalezas de obsidiana e lava.",
    color: "inferno",
    image: "bg-gradient-to-br from-red-300 to-red-500",
    lore: "Após a grande guerra do Plano Esmeralda, os elfos expandiram seu domínio e colonizaram partes do Inferno. Este plano é dominado pelo calor extremo e habitado por criaturas que se adaptaram a viver em condições mortais para a maioria dos seres."
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
              {plane.lore && (
                <Accordion type="single" collapsible className="mb-4">
                  <AccordionItem value="lore">
                    <AccordionTrigger className="text-sm">
                      <span className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-2" />
                        História do Plano
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground">{plane.lore}</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
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

        <div className="mt-16 p-6 bg-secondary/20 rounded-lg max-w-3xl mx-auto">
          <h3 className="font-serif text-2xl font-semibold mb-4 text-center">O Complexo Esmeralda</h3>
          <p className="text-muted-foreground mb-4">
            A muito tempo atrás, 2 seres primordiais deram vida a um local, onde eles chamaram de Plano Esmeralda. 
            Oberon e Titânia, juntos, criaram um lindo lugar, e originaram uma raça de seres chamados de Feéricos.
          </p>
          <p className="text-muted-foreground mb-4">
            Aquele reino antigo formou o maior império que o universo já viu, maior mesmo que o próprio céu. 
            Os deuses celestiais os invejavam, e nada podiam fazer a respeito, pois seus poderes mágicos 
            originaram a magia natural por si própria.
          </p>
          <p className="text-muted-foreground mb-4">
            O império foi dividido após uma guerra entre Oberon e Titânia, que separou os Feéricos em dois grupos: 
            Fadas (seguidores de Titânia) e Elfos (seguidores de Oberon). O filho do casal divino, Puck, 
            incapaz de escolher um lado na guerra, retirou-se para a "Floresta da Terra de Ninguém".
          </p>
          <p className="text-muted-foreground">
            Com a ajuda de Baba Yaga, a Mãe das Bruxas, e suas três filhas (Bavlorna, Scabatha e Endelyn), 
            Oberon e Puck conspiraram para derrubar Titânia. Após sua vitória, os elfos dividiram o antigo reino 
            das fadas entre as filhas de Baba Yaga e expandiram seu império para o plano material e o inferno.
          </p>
        </div>
      </div>
    </section>
  );
}
