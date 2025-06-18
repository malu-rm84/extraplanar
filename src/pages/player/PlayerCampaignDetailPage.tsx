// PlayerCampaignDetailPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PlayerLayout } from "@/components/layout/PlayerLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db } from "@/components/auth/firebase-config";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft,
  Calendar,
  Users,
  User,
  Award,
  Copy,
  Link,
} from "lucide-react";

interface UserProfile {
  displayName: string;
  photoURL: string;
  email: string;
}

interface Participant {
  id: string;
  characterId?: string;
  name: string;
  type: "player" | "character";
  approved: boolean;
  userId?: string;
  userProfile?: UserProfile;
}

interface Session {
  id: string;
  campaignId: string;
  scheduledDate: Date;
  title: string;
  status: "agendada" | "em-andamento" | "concluída";
  xpAwarded?: Array<{
    date: Date;
    awards: { [key: string]: number };
  }>;
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  mestreId: string;
  mestreNome: string;
  mestreFoto: string;
  participants: Participant[];
}

export const PlayerCampaignDetailPage = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [playerCharacter, setPlayerCharacter] = useState<Participant | null>(
    null
  );
  const [userProfiles, setUserProfiles] = useState<
    Record<string, UserProfile>
  >({});
  const [copySuccess, setCopySuccess] = useState(false);
  const [totalPDNaCampanha, setTotalPDNaCampanha] = useState(0);

  // Buscar perfis de usuários
  const fetchUserProfiles = async (userIds: string[]) => {
    if (userIds.length === 0) return;
    try {
      const usersQuery = query(
        collection(db, "users"),
        where("uid", "in", userIds)
      );
      const snapshot = await getDocs(usersQuery);
      const profiles: Record<string, UserProfile> = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        profiles[data.uid] = {
          displayName: data.displayName,
          photoURL: data.photoURL,
          email: data.email,
        };
      });
      setUserProfiles(profiles);
    } catch (error) {
      console.error("Erro ao buscar perfis:", error);
    }
  };

  useEffect(() => {
    if (!campaignId || !currentUser) return;

    // Calcular total de PDs
    const calcularTotalPDs = (sessionsList: Session[]) => {
      if (!sessionsList.length || !currentUser) return 0;
      
      return sessionsList
        .filter((s) => s.status === "concluída")
        .reduce((acc, session) => {
          if (!session.xpAwarded || session.xpAwarded.length === 0) return acc;
          
          let sessionXp = 0;
          session.xpAwarded.forEach((distribution) => {
            const xp = distribution.awards[currentUser.uid] || 0;
            sessionXp += xp;
          });
          
          return acc + sessionXp;
        }, 0);
    };

    // Carregar campanha
    const unsubscribeCampaign = onSnapshot(
      doc(db, "campanhas", campaignId),
      async (campaignDoc) => {
        if (campaignDoc.exists()) {
          const data = campaignDoc.data();
          // Buscar perfil do mestre
          let mestreFoto = "";
          try {
            const mestreDoc = await getDoc(doc(db, "users", data.mestreId));
            if (mestreDoc.exists()) {
              const userData = mestreDoc.data() as UserProfile;
              mestreFoto = userData.photoURL || "";
            }
          } catch (error) {
            console.error("Erro ao buscar foto do mestre:", error);
          }
          const campaignData: Campaign = {
            id: campaignDoc.id,
            name: data.name,
            description: data.description,
            mestreId: data.mestreId,
            mestreNome: data.mestreNome,
            mestreFoto,
            participants: data.participants || [],
          };
          setCampaign(campaignData);
          // Encontrar o personagem do jogador atual
          const playerChar = campaignData.participants.find(
            (p) =>
              p.userId === currentUser.uid &&
              p.type === "character" &&
              p.approved
          );
          setPlayerCharacter(playerChar || null);
          // Coletar IDs de usuários para buscar perfis
          const userIds = [
            data.mestreId,
            ...campaignData.participants
              .filter((p) => p.userId)
              .map((p) => p.userId as string),
          ].filter((id, index, self) => id && self.indexOf(id) === index);
          fetchUserProfiles(userIds);
        }
      }
    );

    // Carregar sessões
    const sessionsQuery = query(
      collection(db, "sessions"),
      where("campaignId", "==", campaignId),
      orderBy("scheduledDate", "desc")
    );
    const unsubscribeSessions = onSnapshot(sessionsQuery, (snapshot) => {
      const sessionsData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          campaignId: data.campaignId,
          scheduledDate: data.scheduledDate.toDate(),
          title: data.title,
          status: data.status,
          xpAwarded: data.xpAwarded || [],
        } as Session;
      });
      setSessions(sessionsData);
      setTotalPDNaCampanha(calcularTotalPDs(sessionsData)); // Atualiza total de PDs
      setLoading(false);
    });

    return () => {
      unsubscribeCampaign();
      unsubscribeSessions();
    };
  }, [campaignId, currentUser]);

  const getPlayerXpForSession = (session: Session): number => {
    if (!currentUser) return 0;
    if (!session.xpAwarded || session.xpAwarded.length === 0) return 0;
    let totalXp = 0;
    session.xpAwarded.forEach((distribution) => {
      const xp = distribution.awards[currentUser.uid] || 0;
      totalXp += xp;
    });
    return totalXp;
  };

  const copyCampaignLink = async () => {
    const campaignLink = `${window.location.origin}/campanha/${campaignId}`;
    try {
      await navigator.clipboard.writeText(campaignLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("Erro ao copiar link:", error);
      alert("Erro ao copiar link da campanha!");
    }
  };

  if (loading) {
    return (
      <PlayerLayout>
        <div className="text-center p-8">Carregando...</div>
      </PlayerLayout>
    );
  }

  if (!campaign) {
    return (
      <PlayerLayout>
        <div className="text-center p-8">Campanha não encontrada.</div>
      </PlayerLayout>
    );
  }

  const approvedPlayers = campaign.participants.filter((p) => p.approved);
  const pastSessions = sessions.filter((s) => s.status === "concluída");
  const upcomingSessions = sessions.filter((s) => s.status !== "concluída");

  return (
    <PlayerLayout>
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {/* Cabeçalho */}
        <div className="pt-8 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/player/campanhas")}
            className="mb-4 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Campanhas
          </Button>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                {campaign.name}
              </h1>
              <p className="text-muted-foreground text-lg mb-4">
                {campaign.description}
              </p>
              {/* Mestre com foto */}
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  {campaign.mestreFoto ? (
                    <img
                      src={campaign.mestreFoto}
                      alt={campaign.mestreNome}
                      className="w-10 h-10 rounded-full object-cover border-2 border-primary"
                    />
                  ) : (
                    <div className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center border-2 border-primary">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
                    <Award className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-400">Mestre</p>
                  <p className="text-white font-medium">{campaign.mestreNome}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lista de Jogadores */}
          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Jogadores</h2>
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">
                {approvedPlayers.length}
              </span>
            </div>
            <div className="space-y-4">
              {campaign.participants
                .filter(
                  (p) =>
                    p.approved &&
                    p.type === "character" &&
                    p.userId
                )
                .map((participant) => {
                  const userProfile = userProfiles[participant.userId!];
                  return (
                    <div
                      key={participant.id}
                      className="bg-black/40 rounded-lg p-4 flex items-center gap-4 hover:bg-black/60 transition-colors"
                    >
                      {/* Foto do usuário */}
                      {userProfile?.photoURL ? (
                        <img
                          src={userProfile.photoURL}
                          alt={userProfile.displayName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="bg-gray-700 rounded-full w-12 h-12 flex items-center justify-center">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                      <div className="flex-1">
                        {/* Apelido do usuário */}
                        <h4 className="font-semibold text-white">
                          {userProfile?.displayName || "Usuário"}
                        </h4>
                        {/* Nome do personagem */}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            Personagem:
                          </span>
                          <Badge
                            variant="secondary"
                            className="text-primary"
                          >
                            {participant.name}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          {/* Sessões */}
          <div className="space-y-8">
            {/* Sessões Futuras */}
            <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-bold">Próximas Sessões</h2>
              </div>
              {upcomingSessions.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nenhuma sessão agendada.
                </p>
              ) : (
                <div className="space-y-4">
                  {upcomingSessions.map((session) => {
                    return (
                      <div
                        key={session.id}
                        className="bg-black/40 rounded-lg p-4"
                      >
                        <h3 className="font-semibold text-white mb-2">
                          {session.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {session.scheduledDate.toLocaleString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <Button
                          onClick={() =>
                            navigate(`/sessao/${session.id}`)
                          }
                          variant="outline"
                          className="text-green-400 border-green-400 hover:bg-green-400/10"
                        >
                          Entrar na Sessão
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {/* Sessões Passadas */}
            <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-gray-400" />
                <h2 className="text-2xl font-bold">Sessões Anteriores</h2>
              </div>
              {pastSessions.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Nenhuma sessão anterior.
                </p>
              ) : (
                <div className="space-y-4">
                  {pastSessions.map((session) => {
                    const playerXp = getPlayerXpForSession(session);
                    return (
                      <div
                        key={session.id}
                        className="bg-black/40 rounded-lg p-4"
                      >
                        <h3 className="font-semibold text-white mb-2">
                          {session.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-1">
                          {session.scheduledDate.toLocaleString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        {/* Exibir PDs mesmo se for zero */}
                        <div className="flex items-center gap-2 text-yellow-400">
                          <Award className="w-4 h-4" />
                          <span>PDs recebidos: {playerXp}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Estatísticas da Campanha */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {sessions.filter((s) => s.status === "concluída").length}
            </div>
            <div className="text-muted-foreground">Sessões Concluídas</div>
          </div>
          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {sessions.filter((s) => s.status === "agendada").length}
            </div>
            <div className="text-muted-foreground">Sessões Agendadas</div>
          </div>
          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {approvedPlayers.length}
            </div>
            <div className="text-muted-foreground">Jogadores Ativos</div>
          </div>
          {/* Novo card: PDs Recebidos */}
          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {totalPDNaCampanha}
            </div>
            <div className="text-muted-foreground">PDs Recebidos</div>
          </div>
        </div>
      </div>
    </PlayerLayout>
  );
};

export default PlayerCampaignDetailPage;