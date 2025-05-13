
import { PlayerLayout } from "@/components/layout/PlayerLayout";

const PlayerDashboard = () => {
  return (
    <PlayerLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-serif font-bold">Dashboard do Jogador</h1>
        <p>Bem-vindo ao seu painel de jogador. Gerencie seus personagens e sessões.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <div className="bg-card border rounded-lg p-4 shadow-sm">
            <h3 className="font-medium mb-2">Personagens</h3>
            <p className="text-2xl font-bold">0</p>
          </div>
          
          <div className="bg-card border rounded-lg p-4 shadow-sm">
            <h3 className="font-medium mb-2">Sessões Participadas</h3>
            <p className="text-2xl font-bold">0</p>
          </div>
          
          <div className="bg-card border rounded-lg p-4 shadow-sm">
            <h3 className="font-medium mb-2">Próxima Sessão</h3>
            <p className="text-sm text-muted-foreground">Nenhuma sessão agendada</p>
          </div>
        </div>
      </div>
    </PlayerLayout>
  );
};

export default PlayerDashboard;
