import { PlayerLayout } from "@/components/layout/PlayerLayout";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/components/auth/firebase-config";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Sword,
  Calendar,
  Trophy,
  Dice6,
  Heart,
  Shield,
  Star,
  BookOpen,
  Users,
  Zap
} from "lucide-react";

interface Character {
  id: string;
  name: string;
  class: string;
  level: number;
  hp: number;
  maxHp: number;
  createdAt: Date;
}

interface Campaign {
  id: string;
  name: string;
  participants: string[];
  status: string;
  proximaSessao?: Date | null;
  sessions: Array<{ id: string; link: string; data: Date }>;
}

const PlayerDashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPersonagens: 0,
    sessoesParticipadas: 0,
    proximaSessao: null as Date | null,
    campanhasAtivas: 0,
    nivelMedio: 0,
    xpTotal: 0
  });
  const [characters, setCharacters] = useState<Character[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [rotatingStatIndex, setRotatingStatIndex] = useState(0);

  // Estatísticas rotativas para o jogador (baseadas em dados reais)
  const rotatingStats = [
    {
      icon: Dice6,
      title: "Sessões",
      value: stats.sessoesParticipadas,
      subtitle: "participadas",
      color: "text-blue-400"
    },
    {
      icon: Trophy,
      title: "Campanhas Ativas",
      value: stats.campanhasAtivas,
      subtitle: "em andamento",
      color: "text-yellow-400"
    },
    {
      icon: Zap,
      title: "XP Total",
      value: stats.xpTotal,
      subtitle: "acumulada",
      color: "text-green-400"
    },
    {
      icon: Star,
      title: "Nível Médio",
      value: stats.nivelMedio,
      subtitle: "dos personagens",
      color: "text-purple-400"
    }
  ];

  useEffect(() => {
    const fetchPlayerData = async () => {
      if (!currentUser?.uid) return;

      try {
        // Carregar personagens usando o campo correto 'criadoPor'
        const charQuery = query(
          collection(db, "personagens"),
          where("criadoPor", "==", currentUser.uid)
        );
        const charSnap = await getDocs(charQuery);
        const playerCharacters = charSnap.docs.map(doc => {
          const data = doc.data() as any;
          return {
            id: doc.id,
            name: data.nome,
            class: data.classe,
            level: data.nivel || 1,
            hp: data.hp || 0,
            maxHp: data.maxHp || 0,
            createdAt: (data.dataCriacao as any)?.toDate() || new Date()
          } as Character;
        });

        // Carregar campanhas onde o jogador participa
        const campQuery = query(
          collection(db, "campanhas"),
          where("participantUserIds", "array-contains", currentUser.uid)
        );
        const campSnap = await getDocs(campQuery);
        const playerCampaigns = campSnap.docs.map(doc => {
          const data = doc.data() as any;
          return {
            id: doc.id,
            name: data.name,
            participants: data.participantUserIds,
            status: data.status,
            proximaSessao: data.proximaSessao?.toDate() || null,
            sessions:
              data.sessions?.map((s: any) => ({
                id: s.id,
                link: s.link,
                data: s.data.toDate()
              })) || []
          } as Campaign;
        });

        // Estatísticas reais
        const activeCampaigns = playerCampaigns.filter(
          c => c.status === "em andamento"
        );
        const nextSession =
          activeCampaigns
            .flatMap(c => (c.proximaSessao ? [c.proximaSessao] : []))
            .sort((a, b) => a.getTime() - b.getTime())[0] || null;
        const averageLevel = playerCharacters.length
          ? Math.round(
              playerCharacters.reduce((sum, char) => sum + char.level, 0) /
                playerCharacters.length
            )
          : 0;
        const totalXp = playerCharacters.reduce(
          (sum, char) => sum + char.level * 300,
          0
        );
        const totalSessions = playerCampaigns.reduce(
          (sum, c) => sum + c.sessions.length,
          0
        );

        setStats({
          totalPersonagens: playerCharacters.length,
          sessoesParticipadas: totalSessions,
          proximaSessao: nextSession,
          campanhasAtivas: activeCampaigns.length,
          nivelMedio: averageLevel,
          xpTotal: totalXp
        });

        setCharacters(playerCharacters);
        setCampaigns(playerCampaigns);
      } catch (error) {
        console.error("Erro ao carregar dados do jogador:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [currentUser]);

  // Rotacionar estatísticas a cada 4 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingStatIndex(prev => (prev + 1) % rotatingStats.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [rotatingStats.length]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      return (
        <div className="bg-black/95 backdrop-blur-sm border border-primary/40 p-3 rounded-lg shadow-xl">
          <p className="text-primary font-medium">{payload[0].name}</p>
          <p className="text-white">
            Valor: <span className="text-primary">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <PlayerLayout>
        <div className="max-w-6xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 bg-black/30 rounded-xl" />
            ))}
          </div>
        </div>
      </PlayerLayout>
    );
  }

  const currentRotatingStat = rotatingStats[rotatingStatIndex];
  const IconComponent = currentRotatingStat.icon;

  // Dados para o gráfico de personagens por classe
  const classData = characters.reduce((acc: any[], char) => {
    const existing = acc.find(item => item.name === char.class);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: char.class, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = ["#9333ea", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  // Dados para gráfico de progressão de nível
  const levelProgressData = characters.map(char => ({
    name: char.name,
    level: char.level,
    hp: char.maxHp ? Math.round((char.hp / char.maxHp) * 100) : 0
  }));

  return (
    <PlayerLayout>
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="text-center mb-12 pt-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            Dashboard do Aventureiro
          </h1>
          <p className="text-muted-foreground text-lg">
            Acompanhe sua jornada épica e conquistas
          </p>
        </div>

        {/* Estatísticas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-primary/30 transition-all duration-300">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium text-primary">Personagens</h3>
            </div>
            <p className="text-3xl font-bold">{stats.totalPersonagens}</p>
            <p className="text-sm text-muted-foreground mt-2">
              nível médio: {stats.nivelMedio}
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-primary/30 transition-all duration-300">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium text-primary">Sessões</h3>
            </div>
            <p className="text-3xl font-bold">{stats.sessoesParticipadas}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {stats.campanhasAtivas} campanhas ativas
            </p>
          </div>

          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-primary/30 transition-all duration-300">
            <div className="flex items-center gap-2 mb-2">
              <Sword className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium text-primary">
                Próxima Aventura
              </h3>
            </div>
            {stats.proximaSessao ? (
              <>
                <p className="text-xl font-bold">
                  {stats.proximaSessao.toLocaleDateString("pt-BR", {
                    weekday: "short"
                  })}
                </p>
                <p className="text-2xl font-bold text-primary">
                  {stats.proximaSessao.toLocaleDateString("pt-BR")}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhuma sessão agendada
              </p>
            )}
          </div>

          {/* Card de Estatística Rotativa */}
          <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-lg rounded-xl p-6 border border-primary/20 hover:border-primary/40 transition-all duration-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-blue-500/5 animate-pulse"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <IconComponent
                  className={`h-4 w-4 ${currentRotatingStat.color}`}
                />
                <h3 className="text-sm font-medium text-primary">
                  {currentRotatingStat.title}
                </h3>
              </div>
              <p
                className={`text-3xl font-bold ${currentRotatingStat.color} transition-all duration-500`}
              >
                {currentRotatingStat.value}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {currentRotatingStat.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 mb-8">
          <h3 className="text-lg font-semibold mb-4 text-primary">Ações Rápidas</h3>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              variant="outline"
              className="bg-black/20 border-primary/30 hover:bg-primary/10"
            >
              <Link to="/player/personagens">Criar Personagem</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="bg-black/20 border-primary/30 hover:bg-primary/10"
            >
              <Link to="/player/campanhas">Buscar Campanha</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="bg-black/20 border-primary/30 hover:bg-primary/10"
            >
              <Link to="/player/diario">Abrir Diário</Link>
            </Button>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Distribuição por Classe */}
          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-primary/20 transition-all duration-300">
            <h3 className="text-lg font-semibold mb-4 text-primary">
              Personagens por Classe
            </h3>
            <div className="h-64">
              {classData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={classData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {classData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>Crie seu primeiro personagem para ver os dados</p>
                </div>
              )}
            </div>
          </div>

          {/* Progressão de Personagens */}
          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-primary/20 transition-all duration-300">
            <h3 className="text-lg font-semibold mb-4 text-primary">
              Progressão dos Personagens
            </h3>
            <div className="h-64">
              {levelProgressData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={levelProgressData}>
                    <XAxis
                      dataKey="name"
                      stroke="#6b7280"
                      tick={{ fontSize: 12, fill: "#9ca3af" }}
                    />
                    <YAxis stroke="#6b7280" tick={{ fill: "#9ca3af" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="level"
                      stroke="#9333ea"
                      strokeWidth={3}
                      dot={{ fill: "#9333ea", strokeWidth: 2, r: 6 }}
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
        </div>

        {/* Personagens Ativos */}
        {characters.length > 0 && (
          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 mb-8">
            <h3 className="text-lg font-semibold mb-4 text-primary">
              Seus Personagens
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {characters.slice(0, 6).map(character => (
                <div
                  key={character.id}
                  className="bg-black/20 rounded-lg p-4 border border-white/5 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">
                      {character.name}
                    </h4>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                      Nv. {character.level}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {character.class}
                  </p>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-400" />
                    <div className="flex-1 bg-black/30 rounded-full h-2">
                      <div
                        className="bg-red-400 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: character.maxHp
                            ? `${(character.hp / character.maxHp) * 100}%`
                            : "0%"
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {character.hp}/{character.maxHp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Links Rápidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/player/personagens"
            className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-primary/50 hover:bg-black/40 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <User className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold">Meus Personagens</h3>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Gerencie suas fichas e equipamentos
            </p>
          </Link>

          <Link
            to="/player/campanhas"
            className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-primary/50 hover:bg-black/40 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold">Campanhas</h3>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Participe de aventuras épicas
            </p>
          </Link>

          <Link
            to="/player/diario"
            className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-primary/50 hover:bg-black/40 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold">Diário de Aventuras</h3>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Registre suas conquistas e memórias
            </p>
          </Link>
        </div>
      </div>
    </PlayerLayout>
  );
};

export default PlayerDashboard;
