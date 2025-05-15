
import { MasterLayout } from "@/components/layout/MasterLayout";

const MasterCampanhas = () => {
  return (
    <MasterLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-serif font-bold">Campanhas</h1>
        <p>Gerencie suas Campanhas de RPG e campanhas.</p>
        
        <div className="bg-card border rounded-lg p-6 mt-6">
          <p className="text-center text-muted-foreground">Você ainda não tem Campanhas criadas.</p>
        </div>
      </div>
    </MasterLayout>
  );
};

export default MasterCampanhas;
