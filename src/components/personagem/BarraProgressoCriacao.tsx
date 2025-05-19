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
  const etapaAtualIndex = etapas.findIndex(etapa => etapa.id === etapaAtual);
  
  return (
    <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-4">
      <div className="flex items-center mb-4">
        {/* Barra de Progresso Vertical ao lado do título */}
        <div className="relative h-16 w-2 bg-black/50 rounded-full overflow-hidden mr-4">
          <div
            className="absolute top-0 left-0 w-2 bg-gradient-to-b from-primary to-purple-400 rounded-full"
            style={{
              height: `${((etapaAtualIndex + 1) / etapas.length) * 100}%`
            }}
          ></div>
        </div>
        
        <div>
          <h3 className="text-primary font-bold text-xl">Etapas</h3>
          <div className="text-sm text-gray-400">
            Progresso: {Math.round(((etapaAtualIndex + 1) / etapas.length) * 100)}%
          </div>
        </div>
      </div>
      
      {/* Lista de Etapas - sem scroll */}
      <div className="space-y-2">
        {etapas.map((etapa, index) => (
          <button
            key={etapa.id}
            className={`p-3 text-left rounded-lg transition-all flex items-center w-full ${
              etapaAtual === etapa.id
                ? 'bg-primary/20 text-primary font-semibold shadow-glow'
                : 'text-gray-300 hover:bg-white/5'
            }`}
            onClick={() => setEtapaAtual(etapa.id)}
          >
            <div className={`flex items-center justify-center min-w-6 h-6 rounded-full mr-3 
              ${etapaAtual === etapa.id ? 'bg-primary text-black font-bold' : 
                index <= etapaAtualIndex ? 'bg-primary/40 text-white' : 'bg-gray-800 text-gray-400'}`}
            >
              {index + 1}
            </div>
            {etapa.nome}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BarraProgressoCriacao;