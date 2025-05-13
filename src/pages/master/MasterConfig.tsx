
import { MasterLayout } from "@/components/layout/MasterLayout";

const MasterConfig = () => {
  return (
    <MasterLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-serif font-bold">Configurações</h1>
        <p>Gerencie suas preferências e configurações.</p>
        
        <div className="bg-card border rounded-lg p-6 mt-6">
          <p className="text-muted-foreground">Configurações do perfil de Mestre</p>
        </div>
      </div>
    </MasterLayout>
  );
};

export default MasterConfig;
