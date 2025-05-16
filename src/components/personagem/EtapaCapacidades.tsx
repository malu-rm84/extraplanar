// EtapaCapacidades.tsx
import { Capacidade, CategoriaCapacidades, capacidades } from "@/data/Capacidades";
import { Personagem } from "./types";

interface EtapaCapacidadesProps {
  personagem: Personagem;
  setPersonagem: (personagem: Personagem) => void;
  calcularTotalPD: (personagem: Personagem) => number;
}

const EtapaCapacidades = ({ personagem, setPersonagem, calcularTotalPD }: EtapaCapacidadesProps) => {
  const obterOcupacoesSelecionadas = () => {
    return personagem.ocupacoesSelecionadas?.map(o => o.nome) || [];
  };

  const calcularCustoCapacidade = (capacidade: Capacidade) => {
    const ocupacoes = obterOcupacoesSelecionadas();
    const temProfissaoRelacionada = capacidade.profissoesRelacionadas.some(
      p => ocupacoes.includes(p)
    );
    return temProfissaoRelacionada ? capacidade.custoProfissional : capacidade.custoPadrao;
  };

  const toggleCapacidade = (capacidade: Capacidade) => {
    const custo = calcularCustoCapacidade(capacidade);
    const novasCapacidades = [...(personagem.capacidadesSelecionadas || [])];
    const index = novasCapacidades.findIndex(c => c.nome === capacidade.nome);

    if (index === -1) {
      if (calcularTotalPD(personagem) + custo > 50) return;
      novasCapacidades.push({ nome: capacidade.nome, custo });
    } else {
      novasCapacidades.splice(index, 1);
    }

    setPersonagem({ ...personagem, capacidadesSelecionadas: novasCapacidades });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary mb-6">Capacidades</h2>
      
      {capacidades.map((categoria: CategoriaCapacidades) => (
        <div 
          key={categoria.categoria} 
          className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-white/10"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-300">{categoria.categoria}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoria.capacidades.map((capacidade: Capacidade) => {
              const custo = calcularCustoCapacidade(capacidade);
              const selecionada = personagem.capacidadesSelecionadas?.some(c => c.nome === capacidade.nome);
              const pdRestantes = 50 - calcularTotalPD(personagem);

              return (
                <button
                  key={capacidade.nome}
                  onClick={() => toggleCapacidade(capacidade)}
                  disabled={!selecionada && (pdRestantes < custo)}
                  className={`p-4 text-left rounded-lg border transition-all 
                    ${selecionada 
                      ? 'border-primary bg-primary/20 hover:bg-primary/30' 
                      : 'bg-black/50 border-white/10 hover:border-primary/30 hover:bg-black/70'}
                    ${!selecionada && (pdRestantes < custo) 
                      ? 'opacity-50 cursor-not-allowed hover:bg-black/50' 
                      : ''}`
                  }
                >
                  <div className="font-medium mb-2 text-gray-300">{capacidade.nome}</div>
                  <div className="text-sm text-gray-400">
                    <span>Custo: {custo} PD</span>
                    {custo === capacidade.custoProfissional && (
                      <span className="ml-2 text-emerald-400 text-xs">(Desconto Profissional)</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EtapaCapacidades;