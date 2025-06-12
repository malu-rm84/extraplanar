import { MasterLayout } from "@/components/layout/MasterLayout";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/components/auth/firebase-config";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Campaign } from "./MasterCampanhas";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Settings, Users, TrendingUp, Calendar, Dice6, Crown } from "lucide-react";

interface SessionData {
  duration: number;
  diceRolls: number;
  xpAwarded: Array<{
    date: Date;
    awards: { [key: string]: number };
  }>;
  scheduledDate: Date;
}

const MasterDashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCampanhas: 0,
    campanhasAtivas: 0,
    totalJogadores: 0,
    proximaSessao: null as Date | null,
  });
  const [campaignData, setCampaignData] = useState<Campaign[]>([]);
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
      icon: Crown,
      title: "XP Distribuído",
      value: 0,
      subtitle: "Carregando...",
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

        // Atualizar estatísticas
        const currentMonth = new Date().getMonth();
        const monthSessions = sessions.filter(s => 
          s.scheduledDate.getMonth() === currentMonth
        );

        const totalDice = sessions.reduce((sum, s) => sum + s.diceRolls, 0);
        const totalXP = sessions.reduce((sum, session) => {
          session.xpAwarded.forEach(distribution => {
            const awards: { [key: string]: number } = distribution.awards; // Especificar tipo aqui
            const sessionXP = Object.values(awards).reduce((a, b) => a + b, 0);
            sum += sessionXP;
          });
          return sum;
        }, 0);
        const totalTime = sessions.reduce((sum, s) => sum + s.duration, 0);

        setRotatingStats([
          {
            icon: TrendingUp,
            title: "Sessões este Mês",
            value: monthSessions.length,
            subtitle: `Total: ${monthSessions.length} sessões`,
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
            icon: Crown,
            title: "XP Distribuído",
            value: totalXP,
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

        // Calcular estatísticas de campanhas
        const uniquePlayers = new Set<string>();
        let nextSession: Date | null = null;

        campaigns.forEach(campaign => {
          campaign.participantUserIds?.forEach(id => uniquePlayers.add(id));
          if (campaign.proximaSessao && (!nextSession || campaign.proximaSessao < nextSession)) {
            nextSession = campaign.proximaSessao;
          }
        });

        setStats({
          totalCampanhas: campaigns.length,
          campanhasAtivas: campaigns.filter(c => c.status === 'em andamento').length,
          totalJogadores: uniquePlayers.size,
          proximaSessao: nextSession
        });

        setCampaignData(campaigns);
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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/95 backdrop-blur-sm border border-primary/40 p-3 rounded-lg shadow-xl">
          <p className="text-primary font-medium">{payload[0].payload.name}</p>
          <p className="text-white">Jogadores: <span className="text-primary">{payload[0].value}</span></p>
          <p className="text-white">Status: <span className="text-primary">{payload[0].payload.status}</span></p>
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

  return (
    <MasterLayout>
      <div className="max-w-6xl mx-auto px-4 pb-16">
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
            <h3 className="text-sm font-medium mb-2 text-primary">Jogadores Ativos</h3>
            <p className="text-3xl font-bold">{stats.totalJogadores}</p>
            <p className="text-sm text-muted-foreground mt-2">últimos 30 dias</p>
          </div>
          
          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-primary/30 transition-all duration-300">
            <h3 className="text-sm font-medium mb-2 text-primary">Próxima Sessão</h3>
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

        <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 mb-8 hover:border-primary/20 transition-all duration-300">
          <h3 className="text-lg font-semibold mb-4 text-primary">Distribuição de Campanhas</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaignData.map(c => ({
                name: c.name,
                players: c.participants.length,
                status: c.status
              }))}>
                <XAxis 
                  dataKey="name" 
                  stroke="#6b7280"
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af' }} />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ fill: 'rgba(147, 51, 234, 0.1)' }}
                />
                <Bar 
                  dataKey="players" 
                  fill="url(#barGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9333ea" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link 
            to="/master/personagens"
            className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-primary/50 hover:bg-black/40 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold">Gerenciar Personagens</h3>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Acesse suas fichas de personagens</p>
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