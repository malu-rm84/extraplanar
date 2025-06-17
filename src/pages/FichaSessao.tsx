import React, { useState, useEffect } from 'react';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer 
} from 'recharts';
import { 
  Heart, Shield, Eye, Zap, Star, Plus, Minus, 
  Sword, User, Globe, Crown, BookOpen, Dice6,
  Save, RotateCcw, Settings, Menu, X, Skull,
  Sparkles, ScrollText, Wand2, Leaf, Cross, Brain,
  Backpack,
  Package,
  Swords,
  ClipboardList,
  Languages,
  Gem
} from 'lucide-react';
import { Personagem } from '@/components/personagem/types';
import { habilidades } from '@/data/Habilidades';

interface FichaSessaoProps {
  personagem: Personagem;
}

// Função para calcular o modificador de atributo
const calcularModificador = (valor: number) => {
  return Math.floor((valor - 10) / 2);
};

// Função para obter abreviação do atributo
const getAtributoAbrev = (atributo: string) => {
  const abrevs: Record<string, string> = {
    agilidade: 'AGI',
    forca: 'FOR', 
    intelecto: 'INT',
    presenca: 'PRE',
    vigor: 'VIG'
  };
  return abrevs[atributo] || atributo;
};

// Função para obter cor do plano
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

const FichaSessao = ({ personagem }: FichaSessaoProps) => {
  const chartColor = getChartColor(personagem.plano);
  
  // Estado para controlar valores de sessão
  const [dadosSessao, setDadosSessao] = useState({
    pvAtual: personagem.pv,
    peAtual: personagem.pe,
    pdAtual: personagem.pdDisponivel,
    ppAtual: personagem.pp,
    dtAtual: personagem.dtTotal
  });


   const gradientMap: Record<string, string> = {
    red: 'from-red-600 to-red-400',
    blue: 'from-blue-600 to-blue-400',
    yellow: 'from-yellow-600 to-yellow-400',
    purple: 'from-purple-600 to-purple-400',
    green: 'from-green-600 to-green-400',
  };

  // Mapeamento de cores para bordas
  const borderColorMap: Record<string, string> = {
    red: 'border-red-500/40 hover:border-red-500/50',
    blue: 'border-blue-500/40 hover:border-blue-500/50',
    yellow: 'border-yellow-500/40 hover:border-yellow-500/50',
    purple: 'border-purple-500/40 hover:border-purple-500/50',
    green: 'border-green-500/40 hover:border-green-500/50',
  };

  // Mapeamento estático para cores de borda (sem hover)
  const staticBorderColorMap: Record<string, string> = {
    red: 'border-red-500/40',
    blue: 'border-blue-500/40',
    yellow: 'border-yellow-500/40',
    purple: 'border-purple-500/40',
    green: 'border-green-500/40',
  };

  const [abaAtiva, setAbaAtiva] = useState('stats');
  const [menuAberto, setMenuAberto] = useState(false);
  const [alteracoesPendentes, setAlteracoesPendentes] = useState(false);

  // Simula salvamento automático
  useEffect(() => {
    if (alteracoesPendentes) {
      const timer = setTimeout(() => {
        console.log('Dados salvos:', { personagem, dadosSessao });
        setAlteracoesPendentes(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [dadosSessao, alteracoesPendentes]);

  const atualizarValor = (campo: string, valor: number, max?: number) => {
  const numValue = isNaN(valor) ? 0 : valor;
    setDadosSessao(prev => {
      // Apenas DT tem limite máximo fixo (60)
      const novoValor = campo === 'dtAtual'
        ? Math.max(0, Math.min(valor, 60)) // Limita DT entre 0 e 60
        : Math.max(0, valor); // Outros recursos podem exceder o máximo inicial
      
      return {
        ...prev,
        [campo]: novoValor
      };
    });
    setAlteracoesPendentes(true);
  };

  // Calcular bônus de perícia
  const calcularBonusPericia = (periciaNome: string, pontos: number) => {
    const atributoMap: Record<string, keyof typeof personagem.atributos> = {
      "Luta": "forca",
      "Cavalgar": "agilidade",
      "Intimidação": "presenca",
      "História": "intelecto",
      "Sobrevivência": "vigor",
    };

    const atributoKey = atributoMap[periciaNome] || "forca";
    const atributoValor = personagem.atributos[atributoKey].base + 
                         personagem.atributos[atributoKey].racial;
    
    return (pontos * 2) + calcularModificador(atributoValor);
  };

  // Dados para gráficos
  const atributosRadar = [
    {
      subject: "Agilidade",
      value: personagem.atributos.agilidade.base + personagem.atributos.agilidade.racial,
      fullMark: 5
    },
    {
      subject: "Força",
      value: personagem.atributos.forca.base + personagem.atributos.forca.racial,
      fullMark: 5
    },
    {
      subject: "Intelecto",
      value: personagem.atributos.intelecto.base + personagem.atributos.intelecto.racial,
      fullMark: 5
    },
    {
      subject: "Presença",
      value: personagem.atributos.presenca.base + personagem.atributos.presenca.racial,
      fullMark: 5
    },
    {
      subject: "Vigor",
      value: personagem.atributos.vigor.base + personagem.atributos.vigor.racial,
      fullMark: 5
    }
  ];
  
  const afinidadesRadar = Object.entries(personagem.afinidades).map(([nome, nivel]) => ({
    subject: nome.charAt(0).toUpperCase() + nome.slice(1),
    value: nivel,
    fullMark: 5
  }));

  // Componente para estatísticas editáveis
    const RecursoSessao = ({ 
    label, 
    valor, 
    max, 
    maxDisplay, // Novo prop para valor a ser exibido
    onChange, 
    cor = "purple", 
    icone,
    editavel = true
  }: {
    label: string;
    valor: number;
    max?: number;
    maxDisplay?: number; // Novo prop
    onChange?: (val: number, max?: number) => void;
    cor?: string;
    icone: JSX.Element;
    editavel?: boolean;
  }) => {
    const borderClass = borderColorMap[cor] || 'border-purple-500/40 hover:border-purple-500/50';
    const staticBorderClass = staticBorderColorMap[cor] || 'border-purple-500/40';
    const gradientClass = gradientMap[cor] || 'from-purple-600 to-purple-400';

    return (
      <div className={`bg-gray-900/80 rounded-lg p-3 transition-colors ${borderClass}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {icone}
            <span className="text-sm font-bold text-gray-300">{label}</span>
          </div>
          {editavel && onChange && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onChange(valor - 1)}
                className="w-6 h-6 bg-red-600 hover:bg-red-700 rounded text-white flex items-center justify-center text-xs transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <button
                onClick={() => onChange(valor + 1)}
                className="w-6 h-6 bg-green-600 hover:bg-green-700 rounded text-white flex items-center justify-center text-xs transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {max !== undefined ? (
            <>
              <div className={`flex-1 bg-gray-800 rounded h-4 relative overflow-hidden ${staticBorderClass}`}>
                <div 
                  className={`h-full bg-gradient-to-r ${gradientClass} transition-all duration-300`}
                  style={{ 
                    // Garante que a barra não ultrapasse 100% visualmente
                    width: `${Math.min(100, (valor / max) * 100)}%` 
                  }}
                />
              </div>
              <div className="text-white font-bold min-w-[60px] text-center">
                {valor}/{maxDisplay ?? max} {/* Usa maxDisplay se existir */}
              </div>
            </>
          ) : (
            // PP agora tem barra também
            <div className="w-full flex items-center gap-3">
              <div className={`flex-1 bg-gray-800 rounded h-4 relative overflow-hidden ${staticBorderClass}`}>
                <div 
                  className={`h-full bg-gradient-to-r ${gradientClass} transition-all duration-300`}
                  style={{ 
                    // PP não tem máximo definido, usa 100% quando valor > 0
                    width: valor > 0 ? '100%' : '0%' 
                  }}
                />
              </div>
              <div className="text-white font-bold min-w-[60px] text-center">
                {valor}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Definição das abas
  const abas = [
    { 
      id: 'stats', 
      nome: 'Stats', 
      icone: <Sparkles className="w-4 h-4" />,
      mobile: 'Stats'
    },
    { 
      id: 'profissao', 
      nome: 'Profissão', 
      icone: <BookOpen className="w-4 h-4" />,
      mobile: 'Prof'
    },
    { 
      id: 'habilidades', 
      nome: 'Habilidades', 
      icone: <Wand2 className="w-4 h-4" />,
      mobile: 'Habs'
    },
    { 
        id: 'inventario', 
        nome: 'Inventário', 
        icone: <Backpack className="w-4 h-4" />,
        mobile: 'Inv'
    },
    { 
        id: 'descricao',
        nome: 'Descrição',
        icone: <ScrollText className="w-4 h-4" />,
        mobile: 'Desc'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Header */}
      <div className="bg-gray-900/90 backdrop-blur-lg border-b border-gray-700 p-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src={personagem.fotoUrl || "/api/placeholder/80/80"} 
              alt={personagem.nome}
              className="w-12 h-12 rounded-full border-2 border-purple-500 object-cover"
            />
            <div>
              <h1 className="text-xl font-bold text-purple-400">{personagem.nome}</h1>
              <p className="text-sm text-gray-400">
                {personagem.plano} - {personagem.raca} | {personagem.faixaEtaria}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {alteracoesPendentes && (
              <div className="hidden sm:flex items-center gap-1 text-yellow-400 text-sm">
                <Save className="w-4 h-4" />
                Salvando...
              </div>
            )}
            <button
              onClick={() => setMenuAberto(!menuAberto)}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              {menuAberto ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Sistema de Abas */}
      <div className="sticky top-[73px] z-30 bg-gray-900/95 backdrop-blur-lg border-b border-gray-700">
        <div className="flex overflow-x-auto scrollbar-hide">
          {abas.map((aba) => (
            <button
              key={aba.id}
              onClick={() => setAbaAtiva(aba.id)}
              className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap transition-all duration-200 border-b-2 ${
                abaAtiva === aba.id
                  ? 'text-purple-400 border-purple-400 bg-purple-400/10'
                  : 'text-gray-400 border-transparent hover:text-white hover:bg-gray-800/50'
              }`}
            >
              {aba.icone}
              <span className="hidden sm:block">{aba.nome}</span>
              <span className="sm:hidden">{aba.mobile}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo das Abas */}
      <div className="p-4 pb-20">
        {/* Aba Stats */}
        {abaAtiva === 'stats' && (
          <div className="space-y-6">
            {/* Stats Principais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <RecursoSessao
                label="PV"
                valor={dadosSessao.pvAtual}
                max={personagem.pv} // Para cálculo da barra
                onChange={(val, max) => atualizarValor('pvAtual', val, max)}
                cor="red"
                icone={<Heart className="w-4 h-4 text-red-400" />}
              />
              
              <RecursoSessao
                label="PE"
                valor={dadosSessao.peAtual}
                max={personagem.pe}
                onChange={(val, max) => atualizarValor('peAtual', val, max)}
                cor="blue"
                icone={<Zap className="w-4 h-4 text-blue-400" />}
              />
              
              <RecursoSessao
                label="PD"
                valor={dadosSessao.pdAtual}
                max={personagem.pdDisponivel}
                onChange={(val, max) => atualizarValor('pdAtual', val, max)}
                cor="yellow"
                icone={<Star className="w-4 h-4 text-yellow-400" />}
              />
              
              {/* PP agora tem barra */}
              <RecursoSessao
                label="PP"
                valor={dadosSessao.ppAtual}
                max={personagem.pp} // Máximo para cálculo da barra
                maxDisplay={personagem.pp} // Valor inicial para exibição
                onChange={(val) => atualizarValor('ppAtual', val)}
                cor="purple"
                icone={<Eye className="w-4 h-4 text-purple-400" />}
              />
              
              {/* DT com valor exibido sendo atual/inicial */}
              <RecursoSessao
                label="DT"
                valor={dadosSessao.dtAtual}
                max={60} 
                maxDisplay={personagem.dtTotal} 
                onChange={(val, max) => atualizarValor('dtAtual', val, max)}
                cor="green"
                icone={<Shield className="w-4 h-4 text-green-400" />}
              />
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Gráfico de Atributos */}
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                <h2 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Atributos
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius="80%" data={atributosRadar}>
                      <PolarGrid stroke="#4B5563" />
                      <PolarAngleAxis dataKey="subject" />
                      <Radar
                        dataKey="value"
                        stroke={chartColor}
                        fill={chartColor}
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Gráfico de Afinidades */}
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                <h2 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
                  <Wand2 className="w-5 h-5" />
                  Afinidades
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius="80%" data={afinidadesRadar}>
                      <PolarGrid stroke="#4B5563" />
                      <PolarAngleAxis dataKey="subject" />
                      <Radar
                        dataKey="value"
                        stroke={chartColor}
                        fill={chartColor}
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
              <h2 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
                <Dice6 className="w-5 h-5" />
                Ações Rápidas
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <button 
                  onClick={() => atualizarValor('pvAtual', personagem.pv, personagem.pv)}
                  className="bg-red-600 hover:bg-red-700 rounded-lg p-3 text-center transition-colors flex flex-col items-center"
                >
                  <Heart className="w-6 h-6 mx-auto mb-1" />
                  <div className="text-xs">Curar Completo</div>
                </button>
                
                <button 
                  onClick={() => atualizarValor('peAtual', personagem.pe, personagem.pe)}
                  className="bg-blue-600 hover:bg-blue-700 rounded-lg p-3 text-center transition-colors flex flex-col items-center"
                >
                  <Zap className="w-6 h-6 mx-auto mb-1" />
                  <div className="text-xs">Restaurar PE</div>
                </button>
                
                <button 
                  onClick={() => {
                    atualizarValor('pvAtual', 1, personagem.pv);
                    atualizarValor('peAtual', 0, personagem.pe);
                  }}
                  className="bg-gray-600 hover:bg-gray-700 rounded-lg p-3 text-center transition-colors flex flex-col items-center"
                >
                  <Skull className="w-6 h-6 mx-auto mb-1" />
                  <div className="text-xs">Inconsciente</div>
                </button>
                
                <button 
                  onClick={() => {
                    setDadosSessao({
                      pvAtual: personagem.pv,
                      peAtual: personagem.pe,
                      pdAtual: personagem.pdDisponivel,
                      ppAtual: personagem.pp,
                      dtAtual: personagem.dtTotal
                    });
                    setAlteracoesPendentes(true);
                  }}
                  className="bg-yellow-600 hover:bg-yellow-700 rounded-lg p-3 text-center transition-colors flex flex-col items-center"
                >
                  <RotateCcw className="w-6 h-6 mx-auto mb-1" />
                  <div className="text-xs">Reset</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Nova Aba Profissão */}
        {abaAtiva === 'profissao' && (
          <div className="space-y-6">
            {/* Seção de Perícias */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
              <h2 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Perícias
              </h2>
              <div className="space-y-4">
                {personagem.pericias?.map((categoria) => (
                  <div key={categoria.categoria}>
                    <h3 className="text-md font-semibold text-gray-300 mb-2">{categoria.categoria}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {categoria.pericias
                        .filter(pericia => pericia.pontos > 0)
                        .map((pericia, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-gray-800/30 rounded-lg p-3 hover:bg-gray-800/50 transition-colors">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-300">{pericia.nome}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white">
                                {pericia.pontos}
                              </span>
                              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs text-white">
                                +{pericia.pontos * 2}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Seção de Ocupações */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
              <h2 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Ocupações
              </h2>
              <div className="p-3">
                {personagem.ocupacoesSelecionadas?.length > 0 ? (
                  <ul className="list-disc pl-5 text-gray-300">
                    {personagem.ocupacoesSelecionadas.map((ocupacao, index) => (
                      <li key={index} className="mb-1">
                        <span className="font-medium">{ocupacao.nome}</span> 
                        <span className="text-purple-400 ml-2">(Nível {ocupacao.nivel})</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">Nenhuma ocupação selecionada</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Nova Aba Habilidades */}
        {abaAtiva === 'habilidades' && (
          <div className="space-y-6">
            {personagem.habilidadeRacial && personagem.habilidadeRacial !== 'nenhum' && (
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                <h2 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
                <Gem className="w-5 h-5" />
                Habilidade Racial
                </h2>
                <div className="p-3">
                <p className="text-white">{personagem.habilidadeRacial}</p>
                </div>
            </div>
            )}
            {/* Seção de Capacidades */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
              <h2 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Capacidades
              </h2>
              <div className="p-3">
                {personagem.capacidadesSelecionadas?.length > 0 ? (
                  <ul className="list-disc pl-5 text-gray-300">
                    {personagem.capacidadesSelecionadas.map((capacidade, index) => (
                      <li key={index} className="mb-2">
                        <div className="font-medium">{capacidade.nome}</div>
                        <div className="text-sm text-purple-400">Custo: {capacidade.custo} PD</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">Nenhuma capacidade selecionada</p>
                )}
              </div>
            </div>

            {/* Seção de Habilidades */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                <h2 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Habilidades
                </h2>
                <div className="space-y-6">
                    {personagem.habilidades && personagem.habilidades.length > 0 ? (
                    personagem.habilidades.map((categoria, index) => (
                        <div key={index} className="bg-gray-800/30 rounded-lg p-4">
                        <h3 className="text-md font-semibold text-purple-300 mb-3 border-b border-gray-700 pb-2">
                            {categoria.categoria}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {categoria.itens.map((habilidade, idx) => (
                            <div key={idx} className="border border-gray-700 rounded-lg p-3 hover:border-purple-500/50 transition-colors">
                                <div className="flex justify-between items-start">
                                <div className="font-bold text-white">{habilidade.nome}</div>
                                <div className="bg-purple-600 px-2 py-1 rounded text-xs font-bold">
                                    {habilidade.custo}
                                </div>
                                </div>
                                <div className="mt-2 text-sm text-gray-300">
                                {habilidade.descricao}
                                </div>
                                {habilidade.efeito && (
                                <div className="mt-2 text-xs text-purple-400">
                                    <span className="font-bold">Efeito:</span> {habilidade.efeito}
                                </div>
                                )}
                            </div>
                            ))}
                        </div>
                        </div>
                    ))
                    ) : (
                    <p className="text-gray-500 italic">Nenhuma habilidade adquirida</p>
                    )}
                </div>
                </div>
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                    <h2 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
                        <Languages className="w-5 h-5" />
                        Línguas
                    </h2>
                    <div className="p-3">
                        {personagem.linguaMaterna ? (
                        <div className="mb-3">
                            <div className="font-bold text-gray-300">Língua Materna:</div>
                            <div className="text-white ml-2">{personagem.linguaMaterna.nome}</div>
                        </div>
                        ) : null}
                        
                        {personagem.linguasAdquiridas?.length > 0 ? (
                        <>
                            <div className="font-bold text-gray-300 mb-2">Línguas Adquiridas:</div>
                            <ul className="list-disc pl-5 text-gray-300">
                            {personagem.linguasAdquiridas.map((lingua, index) => (
                                <li key={index} className="text-white">{lingua.nome}</li>
                            ))}
                            </ul>
                        </>
                        ) : null}
                        
                        {(!personagem.linguaMaterna && !personagem.linguasAdquiridas?.length) && (
                        <p className="text-gray-500 italic">Nenhuma língua registrada</p>
                        )}
                    </div>
                    </div>
            </div>
            )}

        {abaAtiva === 'inventario' && (
            <div className="space-y-6">
                {/* Itens Gerais */}
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold mb-4 text-purple-400 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Itens Gerais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {personagem.inventario?.geral?.map((item, index) => (
                    <div 
                        key={index}
                        className="p-3 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-colors"
                    >
                        <div className="font-bold text-white">{item.nome}</div>
                        {item.descricao && <p className="text-sm text-gray-300 mt-1">{item.descricao}</p>}
                        {item.quantidade && (
                        <div className="mt-2 text-xs text-purple-400">
                            Quantidade: {item.quantidade}
                        </div>
                        )}
                    </div>
                    ))}
                    {(!personagem.inventario?.geral || personagem.inventario.geral.length === 0) && (
                    <p className="text-gray-500 italic">Nenhum item geral</p>
                    )}
                </div>
                </div>

                {/* Armaduras */}
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold mb-4 text-purple-400 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Armaduras
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {personagem.inventario?.armaduras?.map((item, index) => (
                    <div 
                        key={index}
                        className="p-3 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-colors"
                    >
                        <div className="font-bold text-white">{item.nome}</div>
                        <div className="flex gap-3 mt-2">
                        <div className="text-sm text-blue-400">DEF: {item.defesa || '-'}</div>
                        <div className="text-sm text-gray-400">Peso: {item.peso || '-'}</div>
                        </div>
                        {item.descricao && <p className="text-sm text-gray-300 mt-2">{item.descricao}</p>}
                    </div>
                    ))}
                    {(!personagem.inventario?.armaduras || personagem.inventario.armaduras.length === 0) && (
                    <p className="text-gray-500 italic">Nenhuma armadura</p>
                    )}
                </div>
                </div>

                {/* Armas */}
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold mb-4 text-purple-400 flex items-center gap-2">
                    <Swords className="w-5 h-5" />
                    Armas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {personagem.inventario?.armas?.map((item, index) => (
                    <div 
                        key={index}
                        className="p-3 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-colors"
                    >
                        <div className="font-bold text-white">{item.nome}</div>
                        <div className="flex gap-3 mt-2">
                        <div className="text-sm text-red-400">Dano: {item.dano || '-'}</div>
                        <div className="text-sm text-gray-400">Tipo: {item.tipo || '-'}</div>
                        </div>
                        {item.descricao && <p className="text-sm text-gray-300 mt-2">{item.descricao}</p>}
                        {item.propriedades && (
                        <div className="mt-2 text-xs text-yellow-400">
                            Propriedades: {item.propriedades.join(', ')}
                        </div>
                        )}
                    </div>
                    ))}
                    {(!personagem.inventario?.armas || personagem.inventario.armas.length === 0) && (
                    <p className="text-gray-500 italic">Nenhuma arma</p>
                    )}
                </div>
                </div>

                {/* Itens Mágicos */}
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold mb-4 text-purple-400 flex items-center gap-2">
                    <Wand2 className="w-5 h-5" />
                    Itens Mágicos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {personagem.inventario?.magicos?.map((item, index) => (
                    <div 
                        key={index}
                        className="p-3 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-purple-500/50 transition-colors"
                    >
                        <div className="font-bold text-white flex items-center gap-2">
                        {item.nome} 
                        <span className="text-xs bg-purple-600 px-2 py-1 rounded">
                            {item.raridade}
                        </span>
                        </div>
                        {item.descricao && <p className="text-sm text-gray-300 mt-2">{item.descricao}</p>}
                        {item.efeito && (
                        <div className="mt-2 text-xs text-purple-400">
                            <span className="font-bold">Efeito:</span> {item.efeito}
                        </div>
                        )}
                        {item.carregamento && (
                        <div className="mt-2 text-xs text-blue-400">
                            Carregamento: {item.carregamento}
                        </div>
                        )}
                    </div>
                    ))}
                    {(!personagem.inventario?.magicos || personagem.inventario.magicos.length === 0) && (
                    <p className="text-gray-500 italic">Nenhum item mágico</p>
                    )}
                </div>
                </div>
            </div>
            )}

        {/* Aba Descrição */}
        {abaAtiva === 'descricao' && (
          <div className="space-y-6">
            {/* Aparência Física */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
              <h3 className="font-bold text-purple-400 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Aparência Física
              </h3>
              <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
                <p className="text-gray-200 whitespace-pre-line">
                  {personagem.descricaoFisica || "Nenhuma descrição física registrada."}
                </p>
              </div>
            </div>

            {/* Personalidade */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
              <h3 className="font-bold text-purple-400 mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Personalidade
              </h3>
              <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
                <p className="text-gray-200 whitespace-pre-line">
                  {personagem.personalidade || "Nenhuma descrição de personalidade registrada."}
                </p>
              </div>
            </div>

            {/* História */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
              <h3 className="font-bold text-purple-400 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                História
              </h3>
              <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
                <p className="text-gray-200 whitespace-pre-line">
                  {personagem.historia || "Nenhuma história registrada."}
                </p>
              </div>
            </div>

            {/* Observações */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
              <h3 className="font-bold text-purple-400 mb-2 flex items-center gap-2">
                <ClipboardList className="w-4 h-4" />
                Observações
              </h3>
              <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700">
                <p className="text-gray-200 whitespace-pre-line">
                  {personagem.observacoes || "Nenhuma observação registrada."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Menu Lateral */}
      {menuAberto && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setMenuAberto(false)}>
          <div className="fixed right-0 top-0 h-full w-80 bg-gray-900 border-l border-gray-700 p-4 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-purple-400">Configurações</h3>
              <button 
                onClick={() => setMenuAberto(false)}
                className="p-2 hover:bg-gray-800 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <button className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center gap-3 transition-colors">
                <Settings className="w-5 h-5 text-gray-400" />
                <span>Configurações Gerais</span>
              </button>
              
              <button 
                className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center gap-3 transition-colors"
                onClick={() => {
                  console.log('Salvando manualmente:', { personagem, dadosSessao });
                  setAlteracoesPendentes(false);
                }}
              >
                <Save className="w-5 h-5 text-gray-400" />
                <span>Salvar Manualmente</span>
              </button>
              
              <button className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center gap-3 transition-colors">
                <RotateCcw className="w-5 h-5 text-gray-400" />
                <span>Restaurar Backup</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FichaSessao;