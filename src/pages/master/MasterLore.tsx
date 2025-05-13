
import { MasterLayout } from "@/components/layout/MasterLayout";

const MasterLore = () => {
  return (
    <MasterLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-serif font-bold">Lore</h1>
        <p>Gerencie o conteúdo e história do seu mundo.</p>
        
        <div className="bg-card border rounded-lg p-6 mt-6">
          <p className="text-center text-muted-foreground">Adicione conteúdo de lore para seu mundo.</p>
        </div>
      </div>
    </MasterLayout>
  );
};

export default MasterLore;
