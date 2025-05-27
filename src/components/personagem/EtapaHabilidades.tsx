import { useState } from "react";
import { Personagem } from "./types";
import { CategoriaHabilidades, habilidades, Habilidades } from "@/data/Habilidades";
import { Button } from "@/components/ui/button";
import { parsePD } from "@/utils/pdHelpers";
import { Info } from "lucide-react";

interface EtapaHabilidadesProps {
  personagem: Personagem;
  setPersonagem: (personagem: Personagem) => void;
  calcularTotalPD: (personagem: Personagem) => number;
}

const EtapaHabilidades = ({ 
  personagem, 
  setPersonagem,
  calcularTotalPD 
}: EtapaHabilidadesProps) => {
  const [selecoes, setSelecoes] = useState<Record<string, Set<string>>>({});

  const togglehabilidades = (categoriaId: string, exp: string, custo: string) => {
    const novoSelecoes = { ...selecoes };
    const pdCusto = parsePD(custo);
    
    if (!novoSelecoes[categoriaId]) {
      novoSelecoes[categoriaId] = new Set();
    }

    const categoriaSelecoes = novoSelecoes[categoriaId];
    
    if (categoriaSelecoes.has(exp)) {
      categoriaSelecoes.delete(exp);
    } else if (pdCusto <= (50 - calcularTotalPD(personagem))) {
      categoriaSelecoes.add(exp);
    }

    setSelecoes(novoSelecoes);
    
    const novaHabilidade = habilidades.map(categoria => ({
      categoria: categoria.categoria,
      itens: categoria.itens.filter(item => 
            novoSelecoes[categoria.categoria]?.has(item.nome))
        })).filter(categoria => categoria.itens.length > 0);

    setPersonagem({
      ...personagem,
      habilidades: novaHabilidade
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary mb-6">Habilidades</h2>

      {habilidades.map((categoria) => (
        <div key={categoria.categoria} className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-white/10">
          <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
            {categoria.categoria}
            <Info className="h-4 w-4 text-gray-400" />
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoria.itens.map((exp) => {
              const pdCusto = parsePD(exp.custo);
              const pdDisponivel = 50 - calcularTotalPD(personagem);
              const isSelecionada = selecoes[categoria.categoria]?.has(exp.nome);
              
              return (
                <button
                    key={exp.nome}
                    onClick={() => togglehabilidades(categoria.categoria, exp.nome, exp.custo)}
                    disabled={pdCusto > pdDisponivel && !isSelecionada}
                    className={`p-4 text-left rounded-lg border transition-all 
                        ${isSelecionada 
                          ? 'border-primary/40 bg-primary/20' 
                          : 'border-white/10 hover:border-primary/30 bg-black/50'}
                        ${pdCusto > pdDisponivel ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-gray-300">{exp.nome}</span>
                          <span className="text-sm bg-black/30 px-2 py-1 rounded-md ml-2 min-w-[70px] text-center text-primary">
                            {exp.custo}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 whitespace-normal">
                          {exp.descricao}
                        </p>
                        {exp.efeito && (
                        <div className="mt-2 text-xs text-primary/80 whitespace-normal">
                            {exp.efeito}
                        </div>
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

export default EtapaHabilidades;