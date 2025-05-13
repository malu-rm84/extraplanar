
import { PlayerLayout } from "@/components/layout/PlayerLayout";

const PlayerSessao = () => {
  return (
    <PlayerLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-serif font-bold">Sessão</h1>
        <p>Gerencie a sessão atual e use ferramentas rápidas para o seu personagem.</p>
        
        <div className="bg-card border rounded-lg p-6 mt-6">
          <p className="text-center text-muted-foreground">Nenhuma sessão ativa no momento.</p>
        </div>
      </div>
    </PlayerLayout>
  );
};

export default PlayerSessao;
