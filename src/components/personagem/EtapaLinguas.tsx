import { linguas } from "@/data/Linguas";
import { Lingua } from "@/data/Linguas";
import { Personagem } from "./types";
import { Button } from "@/components/ui/button";

interface EtapaLinguasProps {
  personagem: Personagem;
  setPersonagem: (personagem: Personagem) => void;
  calcularTotalPD: (personagem: Personagem) => number;
}

const EtapaLinguas = ({ 
  personagem, 
  setPersonagem,
  calcularTotalPD 
}: EtapaLinguasProps) => {
  const todasLinguas = linguas.flatMap(c => c.linguas);

  const adicionarLingua = (lingua: Lingua) => {
    if (calcularTotalPD(personagem) + lingua.custoPD > 50) return;
    
    setPersonagem({
      ...personagem,
      linguasAdquiridas: [...personagem.linguasAdquiridas, lingua]
    });
  };

  const removerLingua = (lingua: Lingua) => {
    setPersonagem({
      ...personagem,
      linguasAdquiridas: personagem.linguasAdquiridas.filter(l => l.nome !== lingua.nome)
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary mb-6">Aquisição de Línguas</h2>
      
      <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-white/10">
        <h3 className="text-lg font-semibold text-primary mb-4">Língua Materna</h3>
        <div className="p-2 bg-black/50 rounded-md text-gray-300 border border-white/10">
          {personagem.linguaMaterna.nome}
        </div>
      </div>

      <div className="space-y-4">
        {linguas.map(categoria => (
          <div key={categoria.categoria} className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-white/10">
            <h3 className="text-lg font-semibold text-primary mb-4">{categoria.categoria}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoria.linguas
                .filter(l => l.nome !== personagem.linguaMaterna.nome)
                .map(lingua => {
                  const adquirida = personagem.linguasAdquiridas.some(l => l.nome === lingua.nome);
                  return (
                    <div key={lingua.nome} className="flex items-center justify-between p-3 bg-black/50 rounded-md border border-white/10">
                      <div className="text-gray-300">
                        <div className="font-medium">{lingua.nome}</div>
                      </div>
                      {adquirida ? (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          className="bg-red-400/20 hover:bg-red-400/30 border border-red-400/40 text-red-400"
                          onClick={() => removerLingua(lingua)}
                        >
                          Remover
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary"
                          onClick={() => adicionarLingua(lingua)}
                          disabled={calcularTotalPD(personagem) + lingua.custoPD > 50}
                        >
                          Adquirir
                        </Button>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EtapaLinguas;