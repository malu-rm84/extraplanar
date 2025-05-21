import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Personagem } from "./types";
import { pericias, Pericia } from "@/data/Pericias";

interface EtapaPericiasProps {
  personagem: Personagem;
  setPersonagem: (personagem: Personagem) => void;
  calcularTotalPD: (personagem: Personagem) => number;
}

const EtapaPericias = ({ 
  personagem, 
  setPersonagem,
  calcularTotalPD 
}: EtapaPericiasProps) => {
  const getPontosPericia = (periciaNome: string) => {
    if (!personagem.pericias) return 0;
    return personagem.pericias
      .flatMap(categoria => categoria.pericias)
      .find((p: Pericia) => p.nome === periciaNome)?.pontos || 0;
  };
  
  const atualizarPericia = (periciaNome: string, pontos: number) => {
    const novoValor = Math.min(5, Math.max(0, isNaN(pontos) ? 0 : pontos));
    
    const periciasAtualizadas = pericias.map(categoria => ({
      ...categoria,
      pericias: categoria.pericias.map(pericia => ({
        ...pericia,
        pontos: pericia.nome === periciaNome ? novoValor : getPontosPericia(pericia.nome)
      }))
    }));

    const custoPericias = periciasAtualizadas
      .flatMap(c => c.pericias)
      .reduce((acc, p) => acc + (p.custoPD * (p.pontos || 0)), 0);

    const pdAtual = calcularTotalPD(personagem);
    const pdSemPericias = pdAtual - (personagem.pericias?.flatMap(c => c.pericias)
      .reduce((acc, p) => acc + (p.custoPD * (p.pontos || 0)), 0)) || 0;
    
    if (pdSemPericias + custoPericias <= 50) {
      setPersonagem({
        ...personagem,
        pericias: periciasAtualizadas
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary mb-6">Perícias</h2>
      
      <div className="space-y-8">
        {pericias.map((categoria) => (
          <div key={categoria.categoria} className="space-y-4">
            <h3 className="text-xl font-semibold text-primary border-b border-white/10 pb-2">
              {categoria.categoria}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoria.pericias.map((pericia) => {
                const pontos = getPontosPericia(pericia.nome);
                const bonusTotal = pontos * 2;
                
                return (
                  <div 
                    key={pericia.nome} 
                    className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-white/10"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <Label className="block text-lg font-medium text-gray-300">
                          {pericia.nome}
                        </Label>
                        <span className="text-sm text-gray-400">
                          Atributo: {pericia.atributo}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-primary font-semibold">
                          {pericia.custoPD} PD/ponto
                        </div>
                        <div className="text-sm text-green-400">
                          Bônus: +{bonusTotal}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Input
                        type="number"
                        min="0"
                        max="5"
                        value={pontos}
                        onChange={(e) => 
                          atualizarPericia(pericia.nome, parseInt(e.target.value))
                        }
                        className="bg-black/50 border-white/10 text-gray-200 focus:border-primary/40 focus:ring-primary text-center w-20"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-400">
                          {pericia.descricao}
                        </p>
                      </div>
                    </div>
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

export default EtapaPericias;