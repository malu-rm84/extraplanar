import { 
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer 
} from 'recharts';
import { 
  Wand2, Globe, Cross, Leaf, Skull,
  Sword, ScrollText, Brain, BookOpen, Languages,
  Crown, Zap, User, ClipboardList, Lock,
  Heart, Map, Telescope, Smile, Ghost,
  Circle, ArrowRight, Shield, Eye, Gem
} from 'lucide-react';
import { Personagem } from '@/components/personagem/types';

const getChartColor = (plano: string) => {
  switch(plano.toLowerCase()) {
    case 'material': return '#795a77';
    case 'esmeralda': return '#50c878';
    case 'chiclete': return '#ffc4d8';
    case 'céu': return '#87ceeb';
    case 'inferno': return '#b81414';
    case 'etéreo': return '#f1af09';
    default: return '#795a77';
  }
};

const calcularTotal = (base: number, racial: number) => {
  return (base || 0) + (racial || 0);
};

interface PersonagemFichaProps {
  personagem: Personagem;
}

const getAtributoIcon = (atributo: string) => {
  switch(atributo.toLowerCase()) {
    case 'agilidade': return <Sword className="h-4 w-4 text-primary" />;
    case 'força': return <Shield className="h-4 w-4 text-primary" />;
    case 'intelecto': return <BookOpen className="h-4 w-4 text-primary" />;
    case 'presença': return <User className="h-4 w-4 text-primary" />;
    case 'vigor': return <Heart className="h-4 w-4 text-primary" />;
    default: return <Circle className="h-4 w-4 text-primary" />;
  }
};

const getAfinidadeIcon = (afinidade: string) => {
  switch(afinidade.toLowerCase()) {
    case 'arcana': return <Wand2 className="h-4 w-4 text-primary" />;
    case 'cosmica': return <Globe className="h-4 w-4 text-primary" />;
    case 'divina': return <Cross className="h-4 w-4 text-primary" />;
    case 'natural': return <Leaf className="h-4 w-4 text-primary" />;
    case 'necromante': return <Skull className="h-4 w-4 text-primary" />;
    default: return <Wand2 className="h-4 w-4 text-primary" />;
  }
};

export const PersonagemFicha = ({ personagem }: PersonagemFichaProps) => {
  const chartColor = getChartColor(personagem.plano);
  
  const atributosRadar = [
    {
      subject: "Agilidade",
      value: calcularTotal(personagem.atributos.agilidade.base, personagem.atributos.agilidade.racial),
      fullMark: 5
    },
    {
      subject: "Força",
      value: calcularTotal(personagem.atributos.forca.base, personagem.atributos.forca.racial),
      fullMark: 5
    },
    {
      subject: "Intelecto",
      value: calcularTotal(personagem.atributos.intelecto.base, personagem.atributos.intelecto.racial),
      fullMark: 5
    },
    {
      subject: "Presença",
      value: calcularTotal(personagem.atributos.presenca.base, personagem.atributos.presenca.racial),
      fullMark: 5
    },
    {
      subject: "Vigor",
      value: calcularTotal(personagem.atributos.vigor.base, personagem.atributos.vigor.racial),
      fullMark: 5
    }
  ];
  
  const afinidadesRadar = Object.entries(personagem.afinidades).map(([nome, nivel]) => ({
    subject: nome.charAt(0).toUpperCase() + nome.slice(1),
    value: nivel,
    fullMark: 5
  }));

  const renderIcono = (categoria: string) => {
    switch(categoria) {
      case 'ATRIBUTOS': return <Sword className="h-4 w-4 text-primary" />;
      case 'AFINIDADES': return <Wand2 className="h-4 w-4 text-primary" />;
      case 'PERÍCIAS': return <ScrollText className="h-4 w-4 text-primary" />;
      case 'DESCRIÇÃO': return <BookOpen className="h-4 w-4 text-primary" />;
      case 'LÍNGUAS': return <Languages className="h-4 w-4 text-primary" />;
      case 'OCUPAÇÕES': return <Crown className="h-4 w-4 text-primary" />;
      case 'CAPACIDADES': return <Zap className="h-4 w-4 text-primary" />;
      default: return <Circle className="h-4 w-4 text-primary" />;
    }
  };

  const getPericiaIcon = (categoria: string) => {
    switch(categoria.toLowerCase()) {
      case 'combate': return <Sword className="h-4 w-4 text-primary" />;
      case 'conhecimento': return <BookOpen className="h-4 w-4 text-primary" />;
      case 'exploração': return <Map className="h-4 w-4 text-primary" />;
      case 'magia': return <Telescope className="h-4 w-4 text-primary" />;
      case 'social': return <Smile className="h-4 w-4 text-primary" />;
      default: return <Ghost className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-black/70 text-gray-200 border border-primary/30 rounded-xl shadow-lg backdrop-blur-md
                    print:bg-[#0a0a0a] print:border-primary/30 print:shadow-xl">
      <div className="border-b border-primary/50 bg-gradient-to-r from-black/80 to-primary/20 p-4 flex items-center justify-between rounded-t-xl
                      print:bg-gradient-to-r print:from-[#1a1a1a] print:to-[#2e1b3b]">
        <div className="flex-1">
          <h1 className="text-4xl font-semibold text-center mb-1 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent font-serif
                         print:bg-clip-text print:text-transparent print:from-[#9333ea] print:to-[#d8b4fe]">
            {personagem.nome}
          </h1>
          <div className="flex justify-center space-x-4 text-lg text-gray-300 print:text-gray-300">
            <span><strong className="text-primary/90 print:text-[#9333ea]">Raça:</strong> {personagem.raca}</span>
            <span><strong className="text-primary/90 print:text-[#9333ea]">Plano:</strong> {personagem.plano}</span>
            <span><strong className="text-primary/90 print:text-[#9333ea]">Idade:</strong> {personagem.faixaEtaria}</span>
            <span><strong className="text-primary/90 print:text-[#9333ea]">Habil. Racial:</strong> {personagem.habilidadeRacial}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 p-4 print:p-4 print:gap-4">
        {/* Atributos */}
        <div className="col-span-6 border border-primary/30 rounded-lg bg-black/50 backdrop-blur-sm shadow-lg
                        print:bg-[#161616] print:border-primary/40">
          <div className="bg-gradient-to-r from-primary/80 to-primary/40 py-1 px-2 text-center font-bold rounded-t-lg flex justify-center items-center space-x-2
                          print:bg-gradient-to-r print:from-[#9333ea]/80 print:to-[#9333ea]/40">
            {renderIcono('ATRIBUTOS')}
            <span className="print:text-primary">ATRIBUTOS</span>
          </div>
          <div className="p-2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius="80%" data={atributosRadar}>
                <PolarGrid stroke="#4B5563" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={(props) => {
                    const { x, y, payload } = props;
                    return (
                      <g transform={`translate(${x},${y})`}>
                        <foreignObject x={-12} y={-12} width={24} height={24}>
                          <div className="flex items-center justify-center">
                            {getAtributoIcon(payload.value)}
                          </div>
                        </foreignObject>
                      </g>
                    );
                  }}
                />
                <Radar
                  dataKey="value"
                  stroke={chartColor}
                  fill={chartColor}
                  fillOpacity={0.6}
                  className="print:stroke-[color:var(--chart-color)] print:fill-[color:var(--chart-color)]/20"
                  style={{ '--chart-color': chartColor } as React.CSSProperties}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-5 gap-1 p-2 text-center border-t border-gray-700 print:border-primary/20">
            {Object.entries(personagem.atributos).map(([attr, values]) => (
              <div key={attr} className="text-center">
                <div className="font-bold uppercase text-xs text-primary flex items-center justify-center gap-1">
                  <span>{attr.charAt(0).toUpperCase() + attr.slice(1)}</span>
                </div>
                <div className="border border-primary/40 rounded-lg bg-black/40 py-1 text-white 
                               print:bg-[#212121] print:border-primary/30">
                  {calcularTotal(values.base, values.racial)}
                </div>
                <div className="text-xs mt-1 print:text-gray-400">
                  <span className="text-gray-400">Base: {values.base}</span>
                  {values.racial > 0 && (
                    <span className="text-emerald-400"> +{values.racial}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Afinidades */}
        <div className="col-span-6 border border-primary/30 rounded-lg bg-black/50 backdrop-blur-sm shadow-lg
                        print:bg-[#161616] print:border-primary/40">
          <div className="bg-gradient-to-r from-primary/80 to-primary/40 py-1 px-2 text-center font-bold rounded-t-lg flex justify-center items-center space-x-2
                          print:bg-gradient-to-r print:from-[#9333ea]/80 print:to-[#9333ea]/40">
            {renderIcono('AFINIDADES')}
            <span className="print:text-primary">AFINIDADES</span>
          </div>
          <div className="p-2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius="80%" data={afinidadesRadar}>
                <PolarGrid stroke="#4B5563" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={(props) => {
                    const { x, y, payload } = props;
                    return (
                      <g transform={`translate(${x},${y})`}>
                        <foreignObject x={-12} y={-12} width={24} height={24}>
                          <div className="flex items-center justify-center">
                            {getAfinidadeIcon(payload.value)}
                          </div>
                        </foreignObject>
                      </g>
                    );
                  }}
                />
                <Radar
                  dataKey="value"
                  stroke={chartColor}
                  fill={chartColor}
                  fillOpacity={0.6}
                  className="print:stroke-[color:var(--chart-color)] print:fill-[color:var(--chart-color)]/20"
                  style={{ '--chart-color': chartColor } as React.CSSProperties}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-5 gap-1 p-2 text-center border-t border-gray-700 print:border-primary/20">
            {Object.entries(personagem.afinidades).map(([afinidade, nivel]) => (
              <div key={afinidade} className="flex flex-col items-center">
                <div className="font-bold uppercase text-xs text-primary flex items-center gap-1">
                  <span>{afinidade.charAt(0).toUpperCase() + afinidade.slice(1)}</span>
                </div>
                <div className="border border-primary/40 rounded-lg bg-black/40 py-1 px-3 text-white 
                               print:bg-[#212121] print:border-primary/30">
                  {nivel}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Perícias */}
        <div className="col-span-6 border border-primary/30 rounded-lg bg-black/50 backdrop-blur-sm shadow-lg
                        print:bg-[#161616] print:border-primary/40">
          <div className="bg-gradient-to-r from-primary/80 to-primary/40 py-1 px-2 text-center font-bold rounded-t-lg flex justify-center items-center space-x-2
                          print:bg-gradient-to-r print:from-[#9333ea]/80 print:to-[#9333ea]/40">
            {renderIcono('PERÍCIAS')}
            <span className="print:text-primary">PERÍCIAS</span>
          </div>
          <div className="p-3 space-y-4">
            {personagem.pericias && personagem.pericias.map((categoria, index) => (
              <div key={index} className="print:break-inside-avoid">
                <h3 className="font-bold text-primary/90 border-b border-gray-700 pb-1 mb-2 flex items-center gap-2
                              print:border-primary/20">
                  {getPericiaIcon(categoria.categoria)}
                  {categoria.categoria}
                </h3>
                <table className="w-full">
                  <tbody>
                    {categoria.pericias
                      .filter(pericia => pericia.pontos > 0)
                      .map((pericia, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-black/30 print:bg-[#212121]/50' : ''}>
                          <td className="py-1 px-2 flex items-center gap-2">
                            {pericia.nome}
                          </td>
                          <td className="w-12 text-center">
                            <div className="inline-flex items-center justify-center w-8 h-8 border border-primary/40 rounded-full bg-black/40 text-white 
                                          print:bg-[#212121] print:border-primary/30">
                              {pericia.pontos}
                            </div>
                          </td>
                          <td>
                            <div className="text-xs mt-1">
                              <span className="text-emerald-400"> +{pericia.pontos * 2}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ))}
            {(!personagem.pericias || personagem.pericias.length === 0 || 
              !personagem.pericias.some(cat => cat.pericias.some(p => p.pontos > 0))) && (
              <p className="text-gray-500 italic">Nenhuma perícia adquirida</p>
            )}
          </div>
        </div>

        {/* Ocupações e Capacidades */}
        <div className="col-span-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1 border border-primary/30 rounded-lg bg-black/50 backdrop-blur-sm shadow-lg
                            print:bg-[#161616] print:border-primary/40">
              <div className="bg-gradient-to-r from-primary/80 to-primary/40 py-1 px-2 text-center font-bold rounded-t-lg flex justify-center items-center space-x-2
                              print:bg-gradient-to-r print:from-[#9333ea]/80 print:to-[#9333ea]/40">
                {renderIcono('OCUPAÇÕES')}
                <span className="print:text-primary">OCUPAÇÕES</span>
              </div>
              <div className="p-3">
                {personagem.ocupacoesSelecionadas?.length > 0 ? (
                  <ul className="list-disc pl-5 text-gray-300">
                    {personagem.ocupacoesSelecionadas.map((ocupacao, index) => (
                      <li key={index}>
                        {ocupacao.nome} <span className="text-primary">(Nível {ocupacao.nivel})</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">Nenhuma ocupação selecionada</p>
                )}
              </div>
            </div>

            <div className="col-span-1 border border-primary/30 rounded-lg bg-black/50 backdrop-blur-sm shadow-lg
                            print:bg-[#161616] print:border-primary/40">
              <div className="bg-gradient-to-r from-primary/80 to-primary/40 py-1 px-2 text-center font-bold rounded-t-lg flex justify-center items-center space-x-2
                              print:bg-gradient-to-r print:from-[#9333ea]/80 print:to-[#9333ea]/40">
                {renderIcono('CAPACIDADES')}
                <span className="print:text-primary">CAPACIDADES</span>
              </div>
              <div className="p-3">
                {personagem.capacidadesSelecionadas?.length > 0 ? (
                  <ul className="list-disc pl-5 text-gray-300">
                    {personagem.capacidadesSelecionadas.map((capacidade, index) => (
                      <li key={index}>
                        {capacidade.nome} <span className="text-primary/80">(Custo: {capacidade.custo} PD)</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">Nenhuma capacidade selecionada</p>
                )}
              </div>
            </div>
          </div>

          {/* Línguas */}
          <div className="border border-primary/30 rounded-lg bg-black/50 backdrop-blur-sm shadow-lg
                          print:bg-[#161616] print:border-primary/40">
            <div className="bg-gradient-to-r from-primary/80 to-primary/40 py-1 px-2 text-center font-bold rounded-t-lg flex justify-center items-center space-x-2
                            print:bg-gradient-to-r print:from-[#9333ea]/80 print:to-[#9333ea]/40">
              {renderIcono('LÍNGUAS')}
              <span className="print:text-primary">LÍNGUAS</span>
            </div>
            <div className="p-3">
              {personagem.linguaMaterna && (
                <div className="mb-2">
                  <span className="font-bold text-primary/90">Materna:</span> {personagem.linguaMaterna.nome}
                </div>
              )}
              {personagem.linguasAdquiridas && personagem.linguasAdquiridas.length > 0 && (
                <div>
                  <span className="font-bold text-primary/90">Adquiridas:</span>
                  <ul className="list-disc pl-5 text-gray-300">
                    {personagem.linguasAdquiridas.map((lingua, index) => (
                      <li key={index}>{lingua.nome}</li>
                    ))}
                  </ul>
                </div>
              )}
              {(!personagem.linguaMaterna && (!personagem.linguasAdquiridas || personagem.linguasAdquiridas.length === 0)) && (
                <p className="text-gray-500 italic">Nenhuma língua adquirida</p>
              )}
            </div>
          </div>
        </div>

        {/* Descrição */}
        <div className="col-span-12 border border-primary/30 rounded-lg bg-black/50 backdrop-blur-sm shadow-lg
                        print:bg-[#161616] print:border-primary/40">
          <div className="bg-gradient-to-r from-primary/80 to-primary/40 py-1 px-2 text-center font-bold rounded-t-lg flex justify-center items-center space-x-2
                          print:bg-gradient-to-r print:from-[#9333ea]/80 print:to-[#9333ea]/40">
            {renderIcono('DESCRIÇÃO')}
            <span className="print:text-primary">DESCRIÇÃO</span>
          </div>
          <div className="p-3 space-y-4">
            {personagem.descricaoFisica && (
              <div className="print:break-inside-avoid">
                <h3 className="font-bold text-primary/90 border-b border-gray-700 pb-1 mb-2 flex items-center
                              print:border-primary/20">
                  <User className="mr-2 h-4 w-4 text-primary" />
                  Aparência Física
                </h3>
                <p className="text-sm text-gray-300">{personagem.descricaoFisica}</p>
              </div>
            )}
            
            {personagem.personalidade && (
              <div className="print:break-inside-avoid">
                <h3 className="font-bold text-primary/90 border-b border-gray-700 pb-1 mb-2 flex items-center
                              print:border-primary/20">
                  <Brain className="mr-2 h-4 w-4 text-primary" />
                  Personalidade
                </h3>
                <p className="text-sm text-gray-300">{personagem.personalidade}</p>
              </div>
            )}
            
            {personagem.historia && (
              <div className="print:break-inside-avoid">
                <h3 className="font-bold text-primary/90 border-b border-gray-700 pb-1 mb-2 flex items-center
                              print:border-primary/20">
                  <BookOpen className="mr-2 h-4 w-4 text-primary" />
                  História
                </h3>
                <p className="text-sm text-gray-300">{personagem.historia}</p>
              </div>
            )}

            {personagem.observacoes && (
              <div className="print:break-inside-avoid">
                <h3 className="font-bold text-primary/90 border-b border-gray-700 pb-1 mb-2 flex items-center
                              print:border-primary/20">
                  <ClipboardList className="mr-2 h-4 w-4 text-primary" />
                  Observações
                </h3>
                <p className="text-sm text-gray-300">{personagem.observacoes}</p>
              </div>
            )}

            {(!personagem.descricaoFisica && !personagem.personalidade && !personagem.historia && !personagem.observacoes) && (
              <p className="text-gray-500 italic">Nenhuma descrição fornecida</p>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-primary/30 py-3 bg-gradient-to-r from-black/80 to-primary/20 rounded-b-xl
                      print:bg-gradient-to-r print:from-[#1a1a1a] print:to-[#2e1b3b]">
        <div className="flex justify-center items-center space-x-4">
          <div className="text-primary/80 text-sm"><Shield className="h-4 w-4" /></div>
          <div className="text-primary/90 text-sm">✧ Sistema Extraplanar ✧</div>
          <div className="text-primary/80 text-sm"><Shield className="h-4 w-4" /></div>
        </div>
      </div>

      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 1cm;
          }

          body {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            background: #0a0a0a !important;
          }

          .text-primary {
            color: #9333ea !important;
          }

          .bg-gradient-to-r {
            background-image: linear-gradient(to right, var(--tw-gradient-stops)) !important;
          }

          svg {
            color: inherit !important;
          }

          .recharts-polar-grid-angle line {
            stroke: #333 !important;
          }

          .recharts-radar-polygon {
            stroke: var(--chart-color) !important;
            fill: var(--chart-color) !important;
            fill-opacity: 0.2 !important;
          }
        }
      `}</style>
    </div>
  );
};