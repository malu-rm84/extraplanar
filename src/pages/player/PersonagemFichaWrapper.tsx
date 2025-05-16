import { useParams } from "react-router-dom";
import { PlayerLayout } from "@/components/layout/PlayerLayout";
import { Button } from "@/components/ui/button";
import { PersonagemFicha } from "../PersonagemFicha";

export const PersonagemFichaWrapper = () => {
  const { id } = useParams<{ id: string }>();
  const personagens = JSON.parse(localStorage.getItem('personagens') || '[]');
  const personagem = personagens[Number(id)];

  if (!personagem) return <div>Personagem não encontrado</div>;

  return (
    <PlayerLayout>
      <div className="container mx-auto p-4">
        <Button 
          onClick={() => window.print()}
          className="no-print mb-4 bg-primary text-white"
        >
          Imprimir Ficha
        </Button>
        <PersonagemFicha personagem={personagem} />
      </div>
    </PlayerLayout>
  );
};