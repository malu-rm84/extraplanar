import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Personagem } from '@/components/personagem/types';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface PersonagemFichaProps {
  personagem: Personagem;
}

export const PersonagemFicha = ({ personagem }: PersonagemFichaProps) => {
  // Dados para atributos
  const dadosAtributos = {
    labels: ['Agilidade', 'Força', 'Intelecto', 'Presença', 'Vigor'],
    datasets: [{
      label: 'Valores',
      data: [
        personagem.atributos.agilidade.base + personagem.atributos.agilidade.racial,
        personagem.atributos.forca.base + personagem.atributos.forca.racial,
        personagem.atributos.intelecto.base + personagem.atributos.intelecto.racial,
        personagem.atributos.presenca.base + personagem.atributos.presenca.racial,
        personagem.atributos.vigor.base + personagem.atributos.vigor.racial,
      ],
      backgroundColor: 'rgba(99, 102, 241, 0.2)',
      borderColor: '#6366f1',
      borderWidth: 2,
    }]
  };

  // Dados para afinidades
  const dadosAfinidades = {
    labels: ['Arcana', 'Cósmica', 'Divina', 'Natural', 'Necromante'],
    datasets: [{
      label: 'Níveis',
      data: Object.values(personagem.afinidades),
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      borderColor: '#10b981',
      borderWidth: 2,
    }]
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 print:p-8">
      {/* Cabeçalho */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">{personagem.nome}</h1>
        <p className="text-xl text-gray-600">{personagem.raca} do Plano {personagem.plano}</p>
      </div>

      {/* Atributos */}
      <section className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Atributos</h2>
        <div className="w-full max-w-xs mx-auto">
          <Radar data={dadosAtributos} />
        </div>
      </section>

      {/* Afinidades */}
      <section className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Afinidades</h2>
        <div className="w-full max-w-xs mx-auto">
          <Radar data={dadosAfinidades} />
        </div>
      </section>

      {/* Perícias */}
      {personagem.pericias?.map(categoria => (
        categoria.pericias.some(p => p.pontos > 0) && (
          <section key={categoria.categoria} className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-3">{categoria.categoria}</h3>
            <div className="grid grid-cols-2 gap-2">
              {categoria.pericias
                .filter(p => p.pontos > 0)
                .map(p => (
                  <div key={p.nome} className="flex justify-between border-b pb-1">
                    <span>{p.nome}</span>
                    <span className="font-semibold">{p.pontos}</span>
                  </div>
                ))}
            </div>
          </section>
        )
      ))}

      {/* Descrição */}
      <section className="bg-white p-6 rounded-lg shadow-sm mt-8">
        <h2 className="text-2xl font-bold mb-4">Descrição</h2>
        {personagem.descricaoFisica && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Aparência Física</h3>
            <p className="text-gray-700">{personagem.descricaoFisica}</p>
          </div>
        )}
        {personagem.historia && (
          <div>
            <h3 className="font-semibold mb-2">História</h3>
            <p className="text-gray-700">{personagem.historia}</p>
          </div>
        )}
      </section>

      <style>{`
        @media print {
          body { 
            -webkit-print-color-adjust: exact;
            background: white !important;
          }
          .no-print { display: none; }
          .print-section { 
            page-break-inside: avoid;
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </div>
  );
};