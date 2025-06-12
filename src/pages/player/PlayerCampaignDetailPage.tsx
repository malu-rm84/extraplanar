// PlayerCampaignDetailPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  doc, getDoc, onSnapshot, updateDoc, collection, 
  query, where, orderBy 
} from "firebase/firestore";
import { db } from "@/components/auth/firebase-config";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Calendar, Users, User, Check, X, Award } from "lucide-react";

interface Participant {
  id: string;
  characterId?: string;
  name: string;
  type: 'player' | 'character';
  approved: boolean;
  userId?: string;
}

interface Session {
  id: string;
  campaignId: string;
  scheduledDate: Date;
  title: string;
  status: 'agendada' | 'em-andamento' | 'concluída';
  xpAwarded?: Array<{
    date: Date;
    awards: {[key: string]: number};
  }>;
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  mestreNome: string;
  participants: Participant[];
}

export const PlayerCampaignDetailPage = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [playerCharacter, setPlayerCharacter] = useState<Participant | null>(null);

  useEffect(() => {
    if (!campaignId || !currentUser) return;

    // Carregar campanha
    const unsubscribeCampaign = onSnapshot(doc(db, "campanhas", campaignId), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const campaignData: Campaign = {
          id: doc.id,
          name: data.name,
          description: data.description,
          mestreNome: data.mestreNome,
          participants: data.participants || []
        };
        setCampaign(campaignData);

        // Encontrar o personagem do jogador atual
        const playerChar = campaignData.participants.find(p => 
          p.userId === currentUser.uid && p.type === 'character' && p.approved
        );
        setPlayerCharacter(playerChar || null);
      }
    });

    // Carregar sessões
    const sessionsQuery = query(
      collection(db, "sessions"),
      where("campaignId", "==", campaignId),
      orderBy("scheduledDate", "desc")
    );
    const unsubscribeSessions = onSnapshot(sessionsQuery, (snapshot) => {
      const sessionsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          campaignId: data.campaignId,
          scheduledDate: data.scheduledDate.toDate(),
          title: data.title,
          status: data.status,
          xpAwarded: data.xpAwarded || []
        } as Session;
      });
      setSessions(sessionsData);
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
    session.xpAwarded.forEach(distribution => {
      // Usar ID do usuário como chave
      const xp = distribution.awards[currentUser.uid] || 0;
      totalXp += xp;
    });
    
    return totalXp;
  };

  if (loading) {
    return <div className="text-center p-8">Carregando...</div>;
  }

  if (!campaign) {
    return <div className="text-center p-8">Campanha não encontrada.</div>;
  }

  // CORREÇÃO AQUI: Usar status em vez de data
  const upcomingSessions = sessions.filter(s => s.status !== 'concluída');
  const pastSessions = sessions.filter(s => s.status === 'concluída');

  return (
    <div className="max-w-6xl mx-auto px-4 pb-16">
      <div className="pt-8 mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              {campaign.name}
            </h1>
            <p className="text-muted-foreground text-lg mb-4">
              {campaign.description}
            </p>
            <p className="text-gray-400">
              Mestre: {campaign.mestreNome}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lista de Jogadores */}
        <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Jogadores</h2>
          </div>

          <div className="space-y-3">
            {campaign.participants
              .filter(p => p.approved)
              .map(participant => (
                <div 
                  key={participant.id}
                  className="bg-black/40 rounded-lg p-4 flex items-center gap-3 hover:bg-black/60 transition-colors"
                >
                  <div className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">
                      {participant.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {participant.type === 'character' ? 'Personagem' : 'Jogador'}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Sessões Futuras */}
        <div className="space-y-8">
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
                {upcomingSessions.map(session => {
                  return (
                    <div 
                      key={session.id}
                      className="bg-black/40 rounded-lg p-4"
                    >
                      <h3 className="font-semibold text-white mb-2">
                        {session.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {session.scheduledDate.toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
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
                {pastSessions.map(session => {
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
                        {session.scheduledDate.toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
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
    </div>
  );
};