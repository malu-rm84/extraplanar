// EtapaOcupacoes.tsx
import { Personagem } from "./types";
import { ocupacoes } from "@/data/Ocupacoes";
import { useState, useRef } from 'react';

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
  const tooltipRef = useRef<HTMLDivElement>(null);

  const getAllowedMaxLevel = () => {
    if (!personagem.faixaEtaria) return 5;

    switch (personagem.faixaEtaria) {
      case "Criança":
        return 0;
      case "Adolescente":
        return 3;
      case "Adulto":
        return 4;
      case "Idoso":
      case "Caquético":
        return 3;
      default:
        return 5;
    }
  };

  const handleSelectOcupacao = (nome: string, nivel: number) => {
    const updated = [...(personagem.ocupacoesSelecionadas || [])];
    const index = updated.findIndex(o => o.nome === nome);
    const currentLevel = updated[index]?.nivel || 0;

    if (nivel === currentLevel) {
      if (index !== -1) updated.splice(index, 1);
    } else {
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
    return Math.min(nivelSelecionado + bonus, 5);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary mb-6">Ocupações</h2>
      
      {ocupacoes.map((categoria) => (
        <div key={categoria.categoria} className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-white/10">
          <h3 className="text-lg font-semibold mb-4 text-gray-300">{categoria.categoria}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoria.ocupacoes.map((ocupacao) => {
              const selected = personagem.ocupacoesSelecionadas?.find(o => o.nome === ocupacao.nome)?.nivel || 0;
              const maxAllowed = getAllowedMaxLevel();
              const isDisabled = personagem.faixaEtaria === "Criança";

              return (
                <div key={ocupacao.nome} className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-white/10">
                  <div className="group relative mb-2">
                    <div className="font-medium text-gray-300 cursor-help border-b border-dashed border-gray-500 pb-1 inline-block">
                      {ocupacao.nome}
                    </div>
                    
                    {/* Tooltip simplificado com posicionamento CSS */}
                    <div 
                      ref={tooltipRef}
                      className="absolute hidden group-hover:block z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 p-3 text-sm bg-gray-900 border border-amber-700/50 rounded-lg shadow-lg"
                    >
                      <div className="font-bold text-amber-400 mb-1">{ocupacao.nome}</div>
                      <div className="text-gray-300 mb-2 italic">
                        {ocupacao.descricao || "Descrição do efeito desta ocupação será adicionada aqui..."}
                      </div>
                    </div>
                  </div>
                  
                  {selected > 0 && (
                    <div className="text-sm text-primary mb-2">
                      Nível Efetivo: {calcularNivelEfetivo(selected)}
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map((nivel) => {
                      const nivelDisabled = isDisabled || 
                        nivel > maxAllowed || 
                        (nivel > 1 && !personagem.ocupacoesSelecionadas?.some(o => 
                          o.nome === ocupacao.nome && o.nivel >= nivel - 1));

                      return (
                        <button
                          key={nivel}
                          onClick={() => handleSelectOcupacao(ocupacao.nome, nivel)}
                          disabled={nivelDisabled}
                          className={`flex-1 min-w-[60px] p-2 rounded transition-colors ${
                            selected >= nivel
                              ? 'bg-primary/80 text-white border border-primary/40'
                              : nivelDisabled 
                                ? 'bg-gray-800/30 text-gray-500 cursor-not-allowed border border-white/10'
                                : 'bg-black/50 border border-white/10 hover:bg-primary/30 hover:border-primary/40 text-gray-300'
                          }`}
                        >
                          Nv.{nivel}
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