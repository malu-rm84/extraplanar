import React from 'react';

interface Etapa {
  id: string;
  nome: string;
}

interface BarraProgressoCriacaoProps {
  etapas: readonly Etapa[] | Etapa[];
  etapaAtual: string;
  setEtapaAtual: (etapa: string) => void;
}

const BarraProgressoCriacao = ({ etapas, etapaAtual, setEtapaAtual }: BarraProgressoCriacaoProps) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between text-sm mb-4">
        {etapas.map((etapa) => (
          <button
            key={etapa.id}
            className={`px-4 py-2 rounded-lg transition-all ${
              etapaAtual === etapa.id
                ? 'bg-primary/20 text-primary font-semibold shadow-glow'
                : 'text-gray-300 hover:bg-white/5'
            }`}
            onClick={() => setEtapaAtual(etapa.id)}
          >
            {etapa.nome}
          </button>
        ))}
      </div>
      <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-purple-400"
          style={{
            width: `${(
              ((etapas.findIndex(etapa => etapa.id === etapaAtual) + 1) /
                etapas.length) *
              100
            )}%`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default BarraProgressoCriacao;