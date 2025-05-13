
import { MasterLayout } from "@/components/layout/MasterLayout";

const MasterMesas = () => {
  return (
    <MasterLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-serif font-bold">Mesas</h1>
        <p>Gerencie suas mesas de RPG e campanhas.</p>
        
        <div className="bg-card border rounded-lg p-6 mt-6">
          <p className="text-center text-muted-foreground">Você ainda não tem mesas criadas.</p>
        </div>
      </div>
    </MasterLayout>
  );
};

export default MasterMesas;
