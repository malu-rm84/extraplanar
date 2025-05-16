import { Personagem } from "./types";
import { ocupacoes } from "@/data/Ocupacoes";
import { FaixasEtarias } from "@/data/FaixaEtaria";

interface EtapaOcupacoesProps {
  personagem: Personagem;
  setPersonagem: (personagem: Personagem) => void;
}

const getBonusNiveis = (faixaEtaria: string) => {
  if (faixaEtaria === "Adulto") return 1;
  if (faixaEtaria === "Idoso" || faixaEtaria === "Caquético") return 2;
  return 0;
};

const EtapaOcupacoes = ({ personagem, setPersonagem }: EtapaOcupacoesProps) => {
  const getAllowedMaxLevel = () => {
    if (!personagem.faixaEtaria) return 3;

    switch (personagem.faixaEtaria) {
      case "Criança":
        return 0;
      case "Adolescente":
        return 2;
      case "Adulto":
        return 2; // Pode selecionar até nível 2 (2+1=3)
      case "Idoso":
      case "Caquético":
        return 1; // Pode selecionar até nível 1 (1+2=3)
      default:
        return 3;
    }
  };

  const handleSelectOcupacao = (nome: string, nivel: number) => {
    const updated = [...(personagem.ocupacoesSelecionadas || [])];
    const index = updated.findIndex(o => o.nome === nome);
    const currentLevel = updated[index]?.nivel || 0;

    // Toggle desmarcar
    if (nivel === currentLevel) {
      if (index !== -1) updated.splice(index, 1);
    } else {
      // Verificar pré-requisitos
      if (nivel > 1 && !updated.some(o => o.nome === nome && o.nivel >= nivel - 1)) {
        return;
      }

      if (index === -1) {
        updated.push({ nome, nivel });
      } else {
        updated[index].nivel = nivel;
      }
    }

    setPersonagem({ ...personagem, ocupacoesSelecionadas: updated });
  };

  const calcularNivelEfetivo = (nivelSelecionado: number) => {
    const bonus = getBonusNiveis(personagem.faixaEtaria || "");
    return Math.min(nivelSelecionado + bonus, 3);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary mb-6">Ocupações</h2>
      
      {ocupacoes.map((categoria) => (
        <div key={categoria.categoria} className="bg-white/5 p-4 rounded-lg border border-white/10">
          <h3 className="text-lg font-semibold mb-4">{categoria.categoria}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoria.ocupacoes.map((ocupacao) => {
              const selected = personagem.ocupacoesSelecionadas?.find(o => o.nome === ocupacao.nome)?.nivel || 0;
              const maxAllowed = getAllowedMaxLevel();
              const isDisabled = personagem.faixaEtaria === "Criança";

              // Calcular custo cumulativo
              const custoCumulativo = [0, ocupacao.nivel1, ocupacao.nivel1 + ocupacao.nivel2, 
                ocupacao.nivel1 + ocupacao.nivel2 + ocupacao.nivel3];

              return (
                <div key={ocupacao.nome} className="bg-white/5 p-4 rounded border border-white/10">
                  <div className="font-medium mb-2">
                    {ocupacao.nome}
                    {selected > 0 && (
                      <span className="ml-2 text-sm text-primary">
                        (Nível Efetivo: {calcularNivelEfetivo(selected)})
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3].map((nivel) => {
                      const nivelDisabled = isDisabled || 
                        nivel > maxAllowed || 
                        (nivel > 1 && !personagem.ocupacoesSelecionadas?.some(o => 
                          o.nome === ocupacao.nome && o.nivel >= nivel - 1));

                      return (
                        <button
                          key={nivel}
                          onClick={() => handleSelectOcupacao(ocupacao.nome, nivel)}
                          disabled={nivelDisabled}
                          className={`flex-1 p-2 rounded ${
                            selected >= nivel
                              ? 'bg-primary text-white'
                              : nivelDisabled 
                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                : 'bg-gray-800 hover:bg-primary/20'
                          }`}
                        >
                          Nv.{nivel} (PD: {custoCumulativo[nivel]})
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EtapaOcupacoes;