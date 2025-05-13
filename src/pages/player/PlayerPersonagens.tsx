
import { PlayerLayout } from "@/components/layout/PlayerLayout";

const PlayerPersonagens = () => {
  return (
    <PlayerLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-serif font-bold">Meus Personagens</h1>
        <p>Crie e gerencie seus personagens.</p>
        
        <div className="bg-card border rounded-lg p-6 mt-6">
          <p className="text-center text-muted-foreground">Você ainda não tem personagens criados.</p>
        </div>
      </div>
    </PlayerLayout>
  );
};

export default PlayerPersonagens;
