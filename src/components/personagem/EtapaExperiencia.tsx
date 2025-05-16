// EtapaExperiencia.tsx
import { useState } from "react";
import { Personagem } from "./types";
import { CategoriaExperiencia, experiencia } from "@/data/Experiencia";
import { Button } from "@/components/ui/button";
import { parsePD } from "@/utils/pdHelpers";
import { Info } from "lucide-react";

interface EtapaExperienciaProps {
  personagem: Personagem;
  setPersonagem: (personagem: Personagem) => void;
  calcularTotalPD: (personagem: Personagem) => number;
}

const EtapaExperiencia = ({ 
  personagem, 
  setPersonagem,
  calcularTotalPD 
}: EtapaExperienciaProps) => {
  const [selecoes, setSelecoes] = useState<Record<string, Set<string>>>({});

  const toggleExperiencia = (categoriaId: string, exp: string, custo: string) => {
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
    
    const novaExperiencia = experiencia.map(categoria => ({
      categoria: categoria.categoria,
      itens: categoria.itens.filter(item => 
            novoSelecoes[categoria.categoria]?.has(item.nome))
        })).filter(categoria => categoria.itens.length > 0);

    setPersonagem({
      ...personagem,
      experiencia: novaExperiencia
    });
  };

  const totalPD = Object.values(selecoes)
    .flatMap(s => Array.from(s))
    .reduce((acc, expNome) => {
      const exp = experiencia
        .flatMap(c => c.itens)
        .find(e => e.nome === expNome);
      return acc + (exp ? parsePD(exp.custo) : 0);
    }, 0);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-primary mb-6">Experiência e Habilidades</h2>

      <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
        <div className={`p-4 rounded-lg border ${
          totalPD > 45 ? "border-red-400/50 bg-red-400/10" : "border-white/10 bg-white/5"
        }`}>
          <div className="text-xl font-bold text-primary">
            Custo Total de PD em Experiência: {totalPD}
            {totalPD > 50 && <span className="text-red-400 ml-2">(Excedeu o limite!)</span>}
          </div>
          <div className="text-sm text-gray-400 mt-1">
            Pontos de Desenvolvimento gastos em experiências
          </div>
        </div>
      </div>

      {experiencia.map((categoria) => (
        <div key={categoria.categoria} className="bg-white/5 p-6 rounded-lg border border-white/10">
          <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            {categoria.categoria}
            <Info className="h-5 w-5 text-gray-400" />
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoria.itens.map((exp) => {
              const pdCusto = parsePD(exp.custo);
              const pdDisponivel = 50 - calcularTotalPD(personagem);
              const isSelecionada = selecoes[categoria.categoria]?.has(exp.nome);
              
              return (
                <Button
                    key={exp.nome}
                    variant={isSelecionada ? "default" : "outline"}
                    className={`h-auto py-4 text-left justify-start transition-all 
                        ${isSelecionada ? "bg-primary/20 border-primary/40" : "hover:bg-white/5"}
                        ${pdCusto > pdDisponivel ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => toggleExperiencia(categoria.categoria, exp.nome, exp.custo)}
                    disabled={pdCusto > pdDisponivel && !isSelecionada}
                >
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold">{exp.nome}</span>
                        <span className="text-sm bg-white/10 px-2 py-1 rounded-md ml-2 min-w-[70px] text-center">
                            {exp.custo}
                        </span>
                        </div>
                        <p className="text-sm text-gray-300 whitespace-normal break-words overflow-hidden">
                        {exp.descricao}
                        </p>
                        {exp.efeito && (
                        <div className="mt-2 text-xs text-primary whitespace-normal">
                            Efeito: {exp.efeito}
                        </div>
                        )}
                    </div>
                    </Button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EtapaExperiencia;