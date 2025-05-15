import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Character } from './character';

interface AttributeRadarChartProps {
  attributes: Character['atributos'];
  plano?: string;
}

const AttributeRadarChart = ({ attributes, plano = "" }: AttributeRadarChartProps) => {
  // Transformar os atributos em um formato adequado para o Recharts
  const attributeData = [
    { subject: 'Força', value: attributes.forca, fullMark: 5 },
    { subject: 'Agilidade', value: attributes.agilidade, fullMark: 5 },
    { subject: 'Vigor', value: attributes.vigor, fullMark: 5 },
    { subject: 'Presença', value: attributes.presenca, fullMark: 5 },
    { subject: 'Intelecto', value: attributes.intelecto, fullMark: 5 },
  ];

  // Definir cores baseadas no plano do personagem
  const getRadarColor = () => {
    switch(plano) {
      case 'Aether': return '#8B5CF6'; // Roxo
      case 'Gehenna': return '#EF4444'; // Vermelho
      case 'Elísio': return '#10B981'; // Verde
      case 'Sombria': return '#4B5563'; // Cinza escuro
      case 'Celeste': return '#3B82F6'; // Azul
      default: return '#8B5CF6'; // Roxo como padrão
    }
  };

  return (
    <ResponsiveContainer width="100%" height={250}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={attributeData}>
        <PolarGrid stroke="#4B5563" />
        <PolarAngleAxis 
          dataKey="subject" 
          tick={{ fill: '#9CA3AF', fontSize: 12 }}
        />
        <Radar
          name="Atributos"
          dataKey="value"
          stroke={getRadarColor()}
          fill={getRadarColor()}
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default AttributeRadarChart;