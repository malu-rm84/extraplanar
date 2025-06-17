// PlayerSessionPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PlayerLayout } from "@/components/layout/PlayerLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  doc, getDoc, onSnapshot, collection, 
  query, where, getDocs 
} from "firebase/firestore";
import { db } from "@/components/auth/firebase-config";
import { useAuth } from "@/contexts/AuthContext";
import { Timer, Users, Dice6, User, FileText } from "lucide-react";
import RollPage from "../RollPage";
import FichaSessao from "../FichaSessao";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Personagem } from '@/components/personagem/types';
import { ReceberPDSessao } from "@/components/personagem/ReceberPDSessao";

interface Session {
  id: string;
  campaignId: string;
  scheduledDate: Date;
  title: string;
  status: 'agendada' | 'em-andamento' | 'concluída';
  startTime?: Date;
  duration?: number;
  number?: number;
}

interface Participant {
  id: string;
  characterId?: string;
  name: string;
  type: 'player' | 'character';
  approved: boolean;
  userId?: string;
}

interface Character {
  id: string;
  name: string;
  fotoUrl?: string;
  userId?: string;
}

interface UserProfile {
  displayName: string;
  photoURL: string;
  email: string;
  uid: string;
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  mestreId: string;
  mestreNome: string;
  participants: Participant[];
}

interface CharacterData {
  fotoUrl?: string;
}

const PlayerSessionPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [session, setSession] = useState<Session | null>(null);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [userProfiles, setUserProfiles] = useState<Record<string, UserProfile>>({});
  const [activeTab, setActiveTab] = useState<'dados' | 'ficha' | 'jogadores'>('dados');
  const [playerCharacter, setPlayerCharacter] = useState<Personagem | null>(null);
  const [timer, setTimer] = useState(0);

  // Formatar tempo
  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 3600).toString().padStart(2, '0')}:${Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

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
      snapshot.forEach(doc => {
        const data = doc.data();
        profiles[data.uid] = {
          displayName: data.displayName,
          photoURL: data.photoURL,
          email: data.email,
          uid: data.uid
        };
      });
      setUserProfiles(profiles);
    } catch (error) {
      console.error("Erro ao buscar perfis:", error);
    }
  };

  const recarregarPersonagem = async () => {
    if (!playerCharacter?.id) return;
    
    try {
      const charRef = doc(db, "personagens", playerCharacter.id);
      const charSnap = await getDoc(charRef);
      if (charSnap.exists()) {
        const charData = charSnap.data() as Personagem;
        setPlayerCharacter({ id: playerCharacter.id, ...charData });
      }
    } catch (error) {
      console.error("Erro ao recarregar personagem:", error);
    }
  };

  useEffect(() => {
    if (!sessionId || !currentUser) return;

    // Carregar sessão
    const sessionRef = doc(db, "sessions", sessionId);
    const unsubscribeSession = onSnapshot(sessionRef, async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const sessionData: Session = {
          id: snapshot.id,
          campaignId: data.campaignId,
          scheduledDate: data.scheduledDate.toDate(),
          title: data.title || `Sessão ${data.number || 1}`,
          status: data.status,
          startTime: data.startTime?.toDate(),
          duration: data.duration
        };
        setSession(sessionData);

        // Se a sessão estiver ativa, iniciar o timer
        if (data.status === 'em-andamento') {
          const startTime = data.startTime?.toDate().getTime() || Date.now();
          const elapsed = Math.floor((Date.now() - startTime) / 1000);
          setTimer(elapsed);
        } else if (data.status === 'concluída') {
          setTimer(data.duration || 0);
        }

        // Carregar campanha
        if (data.campaignId) {
          const campaignRef = doc(db, "campanhas", data.campaignId);
          const campaignSnap = await getDoc(campaignRef);
          if (campaignSnap.exists()) {
            const campaignData = campaignSnap.data() as Campaign;
            setCampaign({
              id: campaignSnap.id,
              name: campaignData.name,
              description: campaignData.description,
              mestreId: campaignData.mestreId,
              mestreNome: campaignData.mestreNome,
              participants: campaignData.participants || []
            });
            setParticipants(campaignData.participants || []);

            // Encontrar o personagem do jogador atual
            const playerChar = campaignData.participants.find((p: any) => 
              p.userId === currentUser.uid && p.type === 'character' && p.approved
            );
            
            // Carregar detalhes do personagem do jogador
            if (playerChar?.characterId) {
                const charRef = doc(db, "personagens", playerChar.characterId);
                const charSnap = await getDoc(charRef);
                if (charSnap.exists()) {
                    const charData = charSnap.data() as Personagem;
                    // Add ID to character data
                    setPlayerCharacter({ id: playerChar.characterId, ...charData });
                }
            }

            // Carregar todos os personagens
            const charPromises = campaignData.participants
              .filter((p: any) => p.type === 'character' && p.approved && p.characterId)
              .map(async (p: any) => {
                const charRef = doc(db, "personagens", p.characterId);
                const charSnap = await getDoc(charRef);
                if (charSnap.exists()) {
                  const charData = charSnap.data() as CharacterData;
                  return {
                    id: p.characterId,
                    name: p.name,
                    fotoUrl: charData.fotoUrl,
                    userId: p.userId
                  };
                }
                return null;
              });

            const chars = (await Promise.all(charPromises)).filter(Boolean) as Character[];
            setCharacters(chars);

            // Coletar IDs de usuários para buscar perfis
            const userIds = [
              campaignData.mestreId,
              ...chars.map(c => c.userId).filter(Boolean) as string[]
            ];
            fetchUserProfiles(userIds);
          }
        }
      }
    });

    return () => unsubscribeSession();
  }, [sessionId, currentUser]);

  if (!session || !campaign) {
    return (
      <PlayerLayout>
        <div className="text-center p-8">Carregando sessão...</div>
      </PlayerLayout>
    );
  }

  const sessionDate = session.scheduledDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const approvedPlayers = participants.filter(p => 
    p.approved && p.type === 'character' && p.userId
  );

  return (
    <PlayerLayout>
      {/* Barra Superior */}
      <div className="sticky top-0 z-10 bg-black/30 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="flex flex-col gap-4">
          {/* Linha 1: Título e botões */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">{session.title}</h1>
              <Badge variant="outline">
                {session.status === 'agendada' && 'Agendada'}
                {session.status === 'em-andamento' && 'Em Andamento'}
                {session.status === 'concluída' && 'Concluída'}
              </Badge>
              
              {/* Botão de receber PD */}
              {playerCharacter && session && session.status === 'concluída' && (
                <ReceberPDSessao
                  personagem={playerCharacter}
                  sessionId={sessionId!}
                  sessionName={session.title}
                  onPDReceived={recarregarPersonagem}
                />
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {session.status !== 'agendada' && (
                <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-md">
                  <Timer className="w-4 h-4" />
                  <span className="font-mono">{formatTime(timer)}</span>
                </div>
              )}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate(-1)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </Button>
            </div>
          </div>
          
          {/* Linha 2: Abas e informações */}
          <div className="flex justify-between items-center">
            <Tabs 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as any)}
            >
              <TabsList className="bg-black/40 backdrop-blur-lg border border-white/10">
                <TabsTrigger value="dados" className="data-[state=active]:bg-primary/20">
                  <Dice6 className="w-4 h-4 mr-2" /> Dados
                </TabsTrigger>
                <TabsTrigger value="ficha" className="data-[state=active]:bg-primary/20">
                  <FileText className="w-4 h-4 mr-2" /> Ficha
                </TabsTrigger>
                <TabsTrigger value="jogadores" className="data-[state=active]:bg-primary/20">
                  <Users className="w-4 h-4 mr-2" /> Jogadores
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="text-sm text-muted-foreground">
              {sessionDate} • Campanha: {campaign.name}
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'dados' && (
          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <RollPage />
          </div>
        )}

        {activeTab === 'ficha' && playerCharacter && (
          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <FichaSessao personagem={playerCharacter} />
          </div>
        )}

        {activeTab === 'jogadores' && (
          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5" />
              <h2 className="text-xl font-bold">Jogadores da Sessão</h2>
              <Badge variant="secondary" className="ml-2">
                {approvedPlayers.length}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {approvedPlayers.map(participant => {
                const character = characters.find(c => c.id === participant.characterId);
                const userProfile = participant.userId ? userProfiles[participant.userId] : undefined;
                
                return (
                  <div 
                    key={participant.id}
                    className="bg-black/40 rounded-xl p-4 flex items-center gap-4 hover:bg-black/60 transition-colors"
                  >
                    {userProfile?.photoURL ? (
                      <img 
                        src={userProfile.photoURL} 
                        alt={userProfile.displayName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="bg-gray-700 rounded-full w-12 h-12 flex items-center justify-center">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {userProfile?.displayName || "Jogador"}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {character?.name || participant.name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </PlayerLayout>
  );
};

export default PlayerSessionPage;
