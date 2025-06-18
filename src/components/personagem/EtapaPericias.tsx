import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
  // Obter PD investido em perícias (novo campo que precisará ser adicionado ao tipo Personagem)
  const pdInvestidoPericias = personagem.pdInvestidoPericias || 0;
  const pontosPericiasDisponiveis = pdInvestidoPericias * 2;
  
  const getPontosPericia = (periciaNome: string) => {
    if (!personagem.pericias) return 0;
    return personagem.pericias
      .flatMap(categoria => categoria.pericias)
      .find((p: Pericia) => p.nome === periciaNome)?.pontos || 0;
  };
  
  // Calcular total de pontos já distribuídos
  const pontosPericiasGastos = personagem.pericias?.flatMap(c => c.pericias)
    .reduce((acc, p) => acc + (p.pontos || 0), 0) || 0;
  
  const pontosPericiasRestantes = pontosPericiasDisponiveis - pontosPericiasGastos;
  
  const alterarPDInvestido = (novoPD: number) => {
    const pdValido = Math.max(0, isNaN(novoPD) ? 0 : novoPD);
    
    // Verificar se há PD suficiente disponível
    const pdAtual = calcularTotalPD(personagem);
    const pdSemPericias = pdAtual - pdInvestidoPericias;
    
    if (pdSemPericias + pdValido <= 50) {
      // Resetar todas as perícias se diminuir o investimento
      const novosPontosTotais = pdValido * 2;
      const pontosAtualmente = pontosPericiasGastos;
      
      let periciasAtualizadas = personagem.pericias || [];
      
      // Se reduzir os pontos disponíveis, precisamos ajustar as perícias
      if (novosPontosTotais < pontosAtualmente) {
        periciasAtualizadas = pericias.map(categoria => ({
          ...categoria,
          pericias: categoria.pericias.map(pericia => ({
            ...pericia,
            pontos: 0
          }))
        }));
      }
      
      setPersonagem({
        ...personagem,
        pdInvestidoPericias: pdValido,
        pericias: periciasAtualizadas
      });
    }
  };
  
  const atualizarPericia = (periciaNome: string, pontos: number) => {
    const novoValor = Math.min(5, Math.max(0, isNaN(pontos) ? 0 : pontos));
    const pontosAtuais = getPontosPericia(periciaNome);
    const diferenca = novoValor - pontosAtuais;
    
    // Verificar se há pontos suficientes
    if (diferenca > pontosPericiasRestantes) {
      return; // Não permitir se não houver pontos suficientes
    }
    
    const periciasAtualizadas = pericias.map(categoria => ({
      ...categoria,
      pericias: categoria.pericias.map(pericia => ({
        ...pericia,
        pontos: pericia.nome === periciaNome ? novoValor : getPontosPericia(pericia.nome)
      }))
    }));

    setPersonagem({
      ...personagem,
      pericias: periciasAtualizadas
    });
  };

  const resetarPericias = () => {
    const periciasResetadas = pericias.map(categoria => ({
      ...categoria,
      pericias: categoria.pericias.map(pericia => ({
        ...pericia,
        pontos: 0
      }))
    }));

    setPersonagem({
      ...personagem,
      pericias: periciasResetadas
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary mb-6">Perícias</h2>
      
      {/* Seção de Investimento de PD */}
      <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-primary/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <h3 className="text-xl font-semibold text-primary mb-2">
              Investimento em Perícias
            </h3>
            <p className="text-gray-400 text-sm">
              Cada PD investido gera 2 pontos de perícia para distribuir
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <Label className="text-sm text-gray-400">PD Investido</Label>
              <Input
                type="number"
                min="0"
                value={pdInvestidoPericias}
                onChange={(e) => alterarPDInvestido(parseInt(e.target.value))}
                className="bg-black/50 border-white/10 text-gray-200 focus:border-primary/40 focus:ring-primary text-center w-20 mt-1"
              />
            </div>
            
            <div className="text-center">
              <Label className="text-sm text-gray-400">Pontos Gerados</Label>
              <div className="text-2xl font-bold text-green-400 mt-1">
                {pontosPericiasDisponiveis}
              </div>
            </div>
            
            <div className="text-center">
              <Label className="text-sm text-gray-400">Pontos Restantes</Label>
              <div className={`text-2xl font-bold mt-1 ${
                pontosPericiasRestantes >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {pontosPericiasRestantes}
              </div>
            </div>
          </div>
        </div>
        
        {pontosPericiasGastos > 0 && (
          <div className="flex justify-end">
            <Button
              onClick={resetarPericias}
              variant="outline"
              size="sm"
              className="border-red-400/30 text-red-400 hover:bg-red-400/20 hover:border-red-400/50"
            >
              Resetar Todas as Perícias
            </Button>
          </div>
        )}
      </div>
      
      {/* Lista de Perícias */}
      {pontosPericiasDisponiveis > 0 && (
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
                          <div className="text-sm text-green-400">
                            Bônus: +{bonusTotal}
                          </div>
                          <div className="text-xs text-gray-500">
                            (2 por ponto)
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm text-gray-400">Pontos:</Label>
                          <Input
                            type="number"
                            min="0"
                            max="5"
                            value={pontos}
                            onChange={(e) => 
                              atualizarPericia(pericia.nome, parseInt(e.target.value))
                            }
                            className="bg-black/50 border-white/10 text-gray-200 focus:border-primary/40 focus:ring-primary text-center w-16"
                            disabled={pontos === 0 && pontosPericiasRestantes === 0}
                          />
                        </div>
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
      )}
      
      {/* Mensagem quando não há pontos investidos */}
      {pontosPericiasDisponiveis === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400 text-lg">
            Invista PD em perícias para começar a distribuir pontos
          </p>
        </div>
      )}
      
      {/* Aviso se exceder pontos */}
      {pontosPericiasRestantes < 0 && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400 text-center">
            ⚠️ Você distribuiu mais pontos do que o disponível! 
            Ajuste a distribuição ou invista mais PD.
          </p>
        </div>
      )}
    </div>
  );
};

export default EtapaPericias;