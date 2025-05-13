
import { MasterLayout } from "@/components/layout/MasterLayout";

const MasterPlayers = () => {
  return (
    <MasterLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-serif font-bold">Players e Personagens</h1>
        <p>Gerencie jogadores e seus personagens.</p>
        
        <div className="bg-card border rounded-lg p-6 mt-6">
          <p className="text-center text-muted-foreground">Nenhum jogador encontrado.</p>
        </div>
      </div>
    </MasterLayout>
  );
};

export default MasterPlayers;
