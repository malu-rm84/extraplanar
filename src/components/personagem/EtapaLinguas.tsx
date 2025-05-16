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
  const linguasCompravels = todasLinguas.filter(l => 
    l.nome !== personagem.linguaMaterna.nome &&
    !personagem.linguasAdquiridas.some(la => la.nome === l.nome)
  );

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
      
      <div className="bg-white/5 p-4 rounded-lg border border-white/10">
        <h3 className="text-lg font-semibold text-primary mb-4">Língua Materna</h3>
        <div className="p-2 bg-white/10 rounded-md">
          {personagem.linguaMaterna.nome}
        </div>
      </div>

      <div className="space-y-4">
        {linguas.map(categoria => (
          <div key={categoria.categoria} className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h3 className="text-lg font-semibold text-primary mb-4">{categoria.categoria}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoria.linguas
                .filter(l => l.nome !== personagem.linguaMaterna.nome)
                .map(lingua => {
                  const adquirida = personagem.linguasAdquiridas.some(l => l.nome === lingua.nome);
                  return (
                    <div key={lingua.nome} className="flex items-center justify-between p-3 bg-white/5 rounded-md">
                      <div>
                        <div className="font-medium">{lingua.nome}</div>
                        <div className="text-sm text-gray-400">Custo: {lingua.custoPD} PD</div>
                      </div>
                      {adquirida ? (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => removerLingua(lingua)}
                        >
                          Remover
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
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