import { MasterLayout } from "@/components/layout/MasterLayout";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "@/components/auth/firebase-config";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Campaign } from "./MasterCampanhas";
import { Link } from "react-router-dom";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend, 
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Settings, Users, TrendingUp, Calendar, Dice6, Star, Activity } from "lucide-react";
import { calcularTotalPDRecebidos } from "@/components/personagem/types";

interface SessionData {
  duration: number;
  diceRolls: number;
  xpAwarded: Array<{
    date: Date;
    awards: { [key: string]: number };
  }>;
  scheduledDate: Date;
}

interface CharacterData {
  id: string;
  nome: string;
  raca: string;
  nivel: number;
  pdTotal: number;
}

const MasterDashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCampanhas: 0,
    campanhasAtivas: 0,
    totalJogadores: 0,
    proximaSessao: null as Date | null,
    totalPDDistribuido: 0,
    nivelMedioJogadores: 0
  });
  const [campaignData, setCampaignData] = useState<Campaign[]>([]);
  const [charactersData, setCharactersData] = useState<CharacterData[]>([]);
  const [sessionsData, setSessionsData] = useState<SessionData[]>([]);
  const [rotatingStatIndex, setRotatingStatIndex] = useState(0);
  const [rotatingStats, setRotatingStats] = useState([
    {
      icon: TrendingUp,
      title: "Sessões este Mês",
      value: 0,
      subtitle: "Carregando...",
      color: "text-green-400"
    },
    {
      icon: Dice6,
      title: "Dados Rolados",
      value: 0,
      subtitle: "Carregando...",
      color: "text-blue-400"
    },
    {
      icon: Star,
      title: "PD Distribuído",
      value: 0,
      subtitle: "total acumulado",
      color: "text-yellow-400"
    },
    {
      icon: Calendar,
      title: "Tempo Jogado",
      value: "0h 0m",
      subtitle: "Carregando...",
      color: "text-purple-400"
    }
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser?.uid) return;

      try {
        // Buscar campanhas
        const campaignsQuery = query(
          collection(db, "campanhas"),
          where("mestreId", "==", currentUser.uid)
        );
        const campaignsSnapshot = await getDocs(campaignsQuery);
        const campaigns = campaignsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
          proximaSessao: doc.data().proximaSessao?.toDate() || null
        })) as Campaign[];

        // Buscar sessões
        const sessionsQuery = query(
          collection(db, "sessions"),
          where("mestreId", "==", currentUser.uid)
        );
        const sessionsSnapshot = await getDocs(sessionsQuery);
        const sessions = sessionsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            duration: data.duration || 0,
            diceRolls: data.diceRolls || 0,
            xpAwarded: data.xpAwarded || [],
            scheduledDate: data.scheduledDate.toDate()
          };
        });

        // Buscar personagens das campanhas
        const allCharacterIds = new Set<string>();
        campaigns.forEach(campaign => {
          campaign.participants
            .filter(p => p.type === 'character' && p.characterId)
            .forEach(p => allCharacterIds.add(p.characterId));
        });

        const characters: CharacterData[] = [];
        for (const charId of allCharacterIds) {
          const charDoc = await getDoc(doc(db, "personagens", charId));
          if (charDoc.exists()) {
            const data = charDoc.data();
            characters.push({
              id: charDoc.id,
              nome: data.nome,
              raca: data.raca,
              nivel: data.nivel || 1,
              pdTotal: calcularTotalPDRecebidos({
                pdIniciais: data.pdIniciais ?? 0,
                pdSessoes: data.pdSessoes ?? []
              })
            });
          }
        }

        // Calcular estatísticas
        const currentMonth = new Date().getMonth();
        const monthSessions = sessions.filter(s => 
          s.scheduledDate.getMonth() === currentMonth
        );

        const totalDice = sessions.reduce((sum, s) => sum + s.diceRolls, 0);
        
        // Calcular PD distribuído
        const totalPD = sessions.reduce((sum, session) => {
          session.xpAwarded.forEach(distribution => {
            const awards: { [key: string]: number } = distribution.awards;
            const sessionPD = Object.values(awards).reduce((a, b) => a + b, 0);
            sum += sessionPD;
          });
          return sum;
        }, 0);
        
        const totalTime = sessions.reduce((sum, s) => sum + s.duration, 0);
        const averageLevel = characters.length
          ? Math.round(characters.reduce((sum, char) => sum + char.nivel, 0) / characters.length)
          : 0;

        // Estatísticas de campanhas
        const uniquePlayers = new Set<string>();
        let nextSession: Date | null = null;

        campaigns.forEach(campaign => {
          campaign.participantUserIds?.forEach(id => uniquePlayers.add(id));
          if (campaign.proximaSessao && (!nextSession || campaign.proximaSessao < nextSession)) {
            nextSession = campaign.proximaSessao;
          }
        });

        setRotatingStats([
          {
            icon: TrendingUp,
            title: "Sessões este Mês",
            value: monthSessions.length,
            subtitle: `Total: ${sessions.length} sessões`,
            color: "text-green-400"
          },
          {
            icon: Dice6,
            title: "Dados Rolados",
            value: totalDice,
            subtitle: "desde o início",
            color: "text-blue-400"
          },
          {
            icon: Star,
            title: "PD Distribuído",
            value: totalPD,
            subtitle: "total acumulado",
            color: "text-yellow-400"
          },
          {
            icon: Calendar,
            title: "Tempo Jogado",
            value: `${Math.floor(totalTime / 3600)}h ${Math.floor((totalTime % 3600) / 60)}m`,
            subtitle: "tempo total",
            color: "text-purple-400"
          }
        ]);

        setStats({
          totalCampanhas: campaigns.length,
          campanhasAtivas: campaigns.filter(c => c.status === 'em andamento').length,
          totalJogadores: uniquePlayers.size,
          proximaSessao: nextSession,
          totalPDDistribuido: totalPD,
          nivelMedioJogadores: averageLevel
        });

        setCampaignData(campaigns);
        setCharactersData(characters);
        setSessionsData(sessions);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingStatIndex((prev) => (prev + 1) % rotatingStats.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [rotatingStats]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-sm border border-primary/40 p-3 rounded-lg shadow-xl">
          {label && <p className="text-gray-300 text-sm mb-1">{label}</p>}
          {payload.map((item: any, index: number) => (
            <p key={index} className="text-white text-sm">
              <span style={{ color: item.color }} className="font-medium">
                {item.name || item.dataKey}:
              </span>{' '}
              <span className="text-primary font-semibold">{item.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <MasterLayout>
        <div className="max-w-6xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 bg-black/30 rounded-xl" />
            ))}
          </div>
        </div>
      </MasterLayout>
    );
  }

  const currentRotatingStat = rotatingStats[rotatingStatIndex];
  const IconComponent = currentRotatingStat.icon;

  // Cores mais consistentes e modernas
  const COLORS = {
    primary: '#9333ea',
    success: '#10b981',
    warning: '#f59e0b',
    info: '#3b82f6',
    danger: '#ef4444',
    secondary: '#6b7280'
  };

  // Dados para gráficos
  const campaignStatusData = [
    { 
      name: 'Ativas', 
      value: stats.campanhasAtivas,
      color: COLORS.success
    },
    { 
      name: 'Não Iniciadas', 
      value: campaignData.filter(c => c.status === 'não iniciada').length,
      color: COLORS.warning
    },
    { 
      name: 'Concluídas', 
      value: campaignData.filter(c => c.status === 'concluída').length,
      color: COLORS.info
    }
  ];

  // Dados para gráfico de personagens por raça com cores
  const raceData = charactersData.reduce((acc: any[], char) => {
    const existing = acc.find(item => item.name === char.raca);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ 
        name: char.raca, 
        value: 1,
        fill: `hsl(${Math.random() * 360}, 70%, 60%)`
      });
    }
    return acc;
  }, []);

  // Dados para gráfico de atividade ao longo do tempo (últimos 6 meses)
  const activityData = (() => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
      const monthSessions = sessionsData.filter(s => 
        s.scheduledDate.getMonth() === date.getMonth() && 
        s.scheduledDate.getFullYear() === date.getFullYear()
      );
      
      const totalPD = monthSessions.reduce((sum, session) => {
        session.xpAwarded.forEach(distribution => {
          const awards: { [key: string]: number } = distribution.awards;
          const sessionPD = Object.values(awards).reduce((a, b) => a + b, 0);
          sum += sessionPD;
        });
        return sum;
      }, 0);

      months.push({
        month: monthName,
        sessoes: monthSessions.length,
        pd: totalPD,
        tempo: Math.round(monthSessions.reduce((sum, s) => sum + s.duration, 0) / 3600)
      });
    }
    
    return months;
  })();

  // Dados para radar chart de estatísticas gerais
  const radarData = [
    { subject: 'Campanhas', A: stats.totalCampanhas, fullMark: Math.max(stats.totalCampanhas, 10) },
    { subject: 'Jogadores', A: stats.totalJogadores, fullMark: Math.max(stats.totalJogadores, 20) },
    { subject: 'Sessões', A: sessionsData.length, fullMark: Math.max(sessionsData.length, 50) },
    { subject: 'Personagens', A: charactersData.length, fullMark: Math.max(charactersData.length, 30) },
    { subject: 'Nível Médio', A: stats.nivelMedioJogadores, fullMark: 20 },
    { subject: 'PD (x10)', A: Math.floor(stats.totalPDDistribuido / 10), fullMark: Math.max(Math.floor(stats.totalPDDistribuido / 10), 100) }
  ];

  // Dados de distribuição de níveis
  const levelDistribution = charactersData.reduce((acc: any[], char) => {
    const levelRange = `Nível ${Math.floor((char.nivel - 1) / 5) * 5 + 1}-${Math.floor((char.nivel - 1) / 5) * 5 + 5}`;
    const existing = acc.find(item => item.name === levelRange);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: levelRange, value: 1 });
    }
    return acc;
  }, []);

  return (
    <MasterLayout>
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="text-center mb-12 pt-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Dashboard do Mestre
          </h1>
          <p className="text-muted-foreground text-lg">
            Visão geral das suas campanhas e atividades
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-primary/30 transition-all duration-300">
            <h3 className="text-sm font-medium mb-2 text-primary">Campanhas Totais</h3>
            <p className="text-3xl font-bold">{stats.totalCampanhas}</p>
            <p className="text-sm text-muted-foreground mt-2">{stats.campanhasAtivas} ativas</p>
          </div>
          
          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-primary/30 transition-all duration-300">
            <h3 className="text-sm font-medium mb-2 text-primary">Jogadores</h3>
            <p className="text-3xl font-bold">{stats.totalJogadores}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Nível médio: {stats.nivelMedioJogadores}
            </p>
          </div>
          
          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-primary/30 transition-all duration-300">
            <h3 className="text-sm font-medium mb-2 text-primary">
              Próxima Sessão
            </h3>
            {stats.proximaSessao ? (
              <>
                <p className="text-xl font-bold">
                  {stats.proximaSessao.toLocaleDateString('pt-BR', { weekday: 'short' })}
                </p>
                <p className="text-2xl font-bold text-primary">
                  {stats.proximaSessao.toLocaleDateString('pt-BR')}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma sessão agendada</p>
            )}
          </div>

          <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-lg rounded-xl p-6 border border-primary/20 hover:border-primary/40 transition-all duration-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 animate-pulse"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <IconComponent className={`h-4 w-4 ${currentRotatingStat.color}`} />
                <h3 className="text-sm font-medium text-primary">{currentRotatingStat.title}</h3>
              </div>
              <p className={`text-3xl font-bold ${currentRotatingStat.color} transition-all duration-500`}>
                {currentRotatingStat.value}
              </p>
              <p className="text-sm text-muted-foreground mt-2">{currentRotatingStat.subtitle}</p>
            </div>
          </div>
        </div>

        <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 mb-8">
          <h3 className="text-lg font-semibold mb-4 text-primary">Ações Rápidas</h3>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline" className="bg-black/20 border-primary/30 hover:bg-primary/10">
              <Link to="/master/campanhas">Nova Campanha</Link>
            </Button>
            <Button asChild variant="outline" className="bg-black/20 border-primary/30 hover:bg-primary/10">
              <Link to="/master/gerador">Gerar NPC</Link>
            </Button>
            <Button asChild variant="outline" className="bg-black/20 border-primary/30 hover:bg-primary/10">
              <Link to="/master/notes">Adicionar Nota</Link>
            </Button>
          </div>
        </div>

        {/* Gráficos principais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {/* Status das Campanhas */}
          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-primary/20 transition-all duration-300">
            <h3 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Status das Campanhas
            </h3>
            <div className="h-64">
              {campaignStatusData.some(d => d.value > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={campaignStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => percent > 5 ? `${name}` : ''}
                    >
                      {campaignStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>Nenhuma campanha encontrada</p>
                </div>
              )}
            </div>
          </div>

          {/* Personagens por Raça */}
          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-primary/20 transition-all duration-300">
            <h3 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
              <Users className="h-5 w-5" />
              Personagens por Raça
            </h3>
            <div className="h-64">
              {raceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={raceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis 
                      dataKey="name" 
                      stroke="#6b7280"
                      tick={{ fontSize: 11, fill: "#9ca3af" }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis stroke="#6b7280" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="value" 
                      fill={COLORS.primary}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>Nenhum personagem encontrado</p>
                </div>
              )}
            </div>
          </div>

          {/* Estatísticas Gerais - Radar Chart */}
          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-primary/20 transition-all duration-300">
            <h3 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Visão Geral
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#9ca3af', fontSize: 11 }}
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 'dataMax']} 
                    tick={{ fill: '#6b7280', fontSize: 10 }}
                  />
                  <Radar
                    name="Estatísticas"
                    dataKey="A"
                    stroke={COLORS.primary}
                    fill={COLORS.primary}
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Gráficos de atividade */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Atividade ao Longo do Tempo */}
          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-primary/20 transition-all duration-300">
            <h3 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Atividade Mensal
            </h3>
            <div className="h-64">
              {activityData.some(d => d.sessoes > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <XAxis
                      dataKey="month"
                      stroke="#6b7280"
                      tick={{ fontSize: 12, fill: "#9ca3af" }}
                    />
                    <YAxis stroke="#6b7280" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
                    <Area
                      type="monotone"
                      dataKey="sessoes"
                      name="Sessões"
                      stackId="1"
                      stroke={COLORS.success}
                      fill={COLORS.success}
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="tempo"
                      name="Horas"
                      stackId="2"
                      stroke={COLORS.info}
                      fill={COLORS.info}
                      fillOpacity={0.4}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>Nenhuma atividade registrada</p>
                </div>
              )}
            </div>
          </div>

          {/* Distribuição de Níveis */}
          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-primary/20 transition-all duration-300">
            <h3 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
              <Star className="h-5 w-5" />
              Distribuição de Níveis
            </h3>
            <div className="h-64">
              {levelDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={levelDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill={COLORS.warning}
                      dataKey="value"
                      label={({ name, percent }) => percent > 10 ? name : ''}
                    >
                      {levelDistribution.map((_, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`hsl(${45 + index * 30}, 70%, ${60 - index * 10}%)`} 
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>Nenhum personagem encontrado</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progressão Detalhada de Personagens */}
        <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 mb-8 hover:border-primary/20 transition-all duration-300">
          <h3 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
            <Dice6 className="h-5 w-5" />
            Progressão dos Personagens
          </h3>
          <div className="h-80">
            {charactersData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charactersData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <XAxis
                    dataKey="nome"
                    stroke="#6b7280"
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="#6b7280" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
                  <Line
                    type="monotone"
                    dataKey="nivel"
                    name="Nível"
                    stroke={COLORS.primary}
                    strokeWidth={3}
                    dot={{ fill: COLORS.primary, strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, fill: COLORS.primary }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pdTotal"
                    name="PD Total"
                    stroke={COLORS.info}
                    strokeWidth={3}
                    dot={{ fill: COLORS.info, strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, fill: COLORS.info }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Seus personagens aparecerão aqui</p>
              </div>
            )}
          </div>
        </div>

        {/* Cards de navegação */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link 
            to="/master/personagens"
            className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-primary/50 hover:bg-black/40 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold">Gerenciar Personagens</h3>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {charactersData.length} personagens ativos
            </p>
          </Link>

          <Link 
            to="/master/notes"
            className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-primary/50 hover:bg-black/40 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold">Notas da Campanha</h3>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Acesse suas anotações e lore</p>
          </Link>

          <Link 
            to="/master/config"
            className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-primary/50 hover:bg-black/40 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <Settings className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold">Configurações</h3>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Personalize sua experiência</p>
          </Link>
        </div>
      </div>
    </MasterLayout>
  );
};

export default MasterDashboard;