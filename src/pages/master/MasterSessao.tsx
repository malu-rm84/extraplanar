import { MasterLayout } from "@/components/layout/MasterLayout";
import NPCNameGenerator from "@/components/ui/NPCNameGenerator";

const MasterSessao = () => {
  return (
    <MasterLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-serif font-bold">Sessão</h1>
        <p>Gerencie a sessão atual e use ferramentas rápidas.</p>
        
        <NPCNameGenerator />

        <div className="bg-card border rounded-lg p-6 mt-6">
          <p className="text-center text-muted-foreground">Nenhuma sessão ativa no momento.</p>
        </div>
      </div>
    </MasterLayout>
  );
};

export default MasterSessao;
