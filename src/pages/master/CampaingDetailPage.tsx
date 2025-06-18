import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  doc, getDoc, updateDoc, collection, addDoc, 
  onSnapshot, query, where, deleteDoc, arrayRemove, getDocs
} from "firebase/firestore";
import { db } from "@/components/auth/firebase-config";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Users, Calendar, Play, Edit, Trash2, UserMinus, Eye, Check, X, Copy, Link, User } from "lucide-react";
import SessionPage from "./SessionPage";
import type { Campaign } from "./MasterCampanhas";

interface UserProfile {
  displayName: string;
  photoURL: string;
  email: string;
}

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
  startTime?: Date;
  endTime?: Date;
  duration: number;
  diceRolls: number;
  notes: string;
  status: 'agendada' | 'em-andamento' | 'concluída';
  mestreId: string;
  number: number;
  title: string;
}

interface CampaignDetailPageProps {
  campaignId: string;
  onBack: () => void;
}

const CampaignDetailPage = ({ campaignId, onBack }: CampaignDetailPageProps) => {
  const { currentUser } = useAuth();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [userProfiles, setUserProfiles] = useState<Record<string, UserProfile>>({});
  const [copySuccess, setCopySuccess] = useState(false)

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
          email: data.email
        };
      });
      setUserProfiles(profiles);
    } catch (error) {
      console.error("Erro ao buscar perfis:", error);
    }
  };

  useEffect(() => {
    if (!campaignId) return;
    // Carregar campanha
    const unsubscribeCampaign = onSnapshot(doc(db, "campanhas", campaignId), async (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const campaignData = {
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          proximaSessao: data.proximaSessao?.toDate() || null,
          sessoes: data.sessoes || []
        } as Campaign;
        setCampaign(campaignData);
        
        // Coletar IDs de usuários para buscar perfis
        const userIds = [
          data.mestreId,
          ...campaignData.participants
            .filter(p => p.userId)
            .map(p => p.userId as string)
        ].filter((id, index, self) => id && self.indexOf(id) === index);
        
        fetchUserProfiles(userIds);
      }
    });

    // Carregar sessões
    const sessionsQuery = query(
      collection(db, "sessions"),
      where("campaignId", "==", campaignId)
    );
    const unsubscribeSessions = onSnapshot(sessionsQuery, (snapshot) => {
      const sessionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        scheduledDate: doc.data().scheduledDate.toDate(),
        startTime: doc.data().startTime?.toDate(),
        endTime: doc.data().endTime?.toDate()
      })) as Session[];
      setSessions(sessionsData.sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime()));
    });

    return () => {
      unsubscribeCampaign();
      unsubscribeSessions();
    };
  }, [campaignId]);

  const approveParticipant = async (participantId: string) => {
    if (!campaign || !currentUser) return;
    try {
      const participant = campaign.participants.find(p => p.id === participantId);
      if (!participant?.userId) throw new Error("ID do usuário não encontrado");
      
      // Atualizar status de aprovação
      await updateDoc(doc(db, "campanhas", campaignId), {
        participants: campaign.participants.map(p => 
          p.id === participantId ? { ...p, approved: true } : p
        )
      });
      
      // Criar pasta para o jogador
      const playerFolderRef = await addDoc(collection(db, "folders"), {
        name: campaign.name || "Nova Campanha",
        userId: participant.userId,
        campaignId: campaignId,
        createdAt: new Date()
      });
      
      // Criar nota inicial
      await addDoc(collection(db, "lore"), {
        title: "Notas Iniciais",
        content: `# Bem-vindo à campanha ${campaign.name}
**Mestre:** ${campaign.mestreNome}
Comece a registrar suas anotações aqui!`,
        folderId: playerFolderRef.id,
        userId: participant.userId,
        campaignId: campaignId,
        createdAt: new Date()
      });
    } catch (error) {
      console.error("Erro na aprovação:", error);
      alert("Erro ao aprovar jogador: " + (error as Error).message);
    }
  };

  const rejectParticipant = async (participantId: string) => {
    if (!campaign || !currentUser) return;
    const confirmReject = window.confirm("Tem certeza que deseja rejeitar este jogador?");
    if (!confirmReject) return;
    
    try {
      const participantToReject = campaign.participants.find(p => p.id === participantId);
      if (!participantToReject) return;
      
      await updateDoc(doc(db, "campanhas", campaignId), {
        participants: arrayRemove(participantToReject),
        participantUserIds: arrayRemove(participantToReject.userId)
      });
    } catch (error) {
      console.error("Erro ao rejeitar jogador:", error);
      alert("Erro ao rejeitar jogador!");
    }
  };

  const removePlayer = async (participantId: string) => {
    if (!campaign || !currentUser) return;
    const confirmRemove = window.confirm("Tem certeza que deseja remover este jogador?");
    if (!confirmRemove) return;
    
    try {
      const participantToRemove = campaign.participants.find(p => p.id === participantId);
      if (!participantToRemove) return;
      
      await updateDoc(doc(db, "campanhas", campaignId), {
        participants: arrayRemove(participantToRemove),
        participantUserIds: arrayRemove(participantToRemove.userId)
      });
    } catch (error) {
      console.error("Erro ao remover jogador:", error);
      alert("Erro ao remover jogador!");
    }
  };

  const copyCampaignLink = async () => {
    if (!campaign) return; // Adicione esta verificação
    try {
      await navigator.clipboard.writeText(campaign.inviteLink); // Use inviteLink da campanha
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("Erro ao copiar link:", error);
      alert("Erro ao copiar link da campanha!");
    }
  };

  const viewCharacterSheet = (characterId: string) => {
    window.open(`/master/personagens/${characterId}`, '_blank');
  };

  const createOrUpdateSession = async () => {
    if (!sessionTitle.trim() || !sessionDate || !sessionTime || !currentUser) return;
    const scheduledDateTime = new Date(`${sessionDate}T${sessionTime}`);
    
    try {
      if (editingSession) {
        // Atualizar sessão existente
        await updateDoc(doc(db, "sessions", editingSession.id), {
          title: sessionTitle,
          scheduledDate: scheduledDateTime
        });
      } else {
        // Criar nova sessão
        const nextNumber = Math.max(...sessions.map(s => s.number), 0) + 1;
        await addDoc(collection(db, "sessions"), {
          campaignId,
          title: sessionTitle,
          scheduledDate: scheduledDateTime,
          status: 'agendada',
          mestreId: currentUser.uid,
          number: nextNumber,
          duration: 0,
          diceRolls: 0,
          notes: ''
        });
      }
      setShowSessionModal(false);
      setEditingSession(null);
      setSessionTitle('');
      setSessionDate('');
      setSessionTime('');
    } catch (error) {
      console.error("Erro ao salvar sessão:", error);
      alert("Erro ao salvar sessão!");
    }
  };

  const deleteSession = async (sessionId: string) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir esta sessão?");
    if (!confirmDelete) return;
    
    try {
      await deleteDoc(doc(db, "sessions", sessionId));
    } catch (error) {
      console.error("Erro ao excluir sessão:", error);
      alert("Erro ao excluir sessão!");
    }
  };

  const startEditSession = (session: Session) => {
    setEditingSession(session);
    setSessionTitle(session.title);
    setSessionDate(session.scheduledDate.toISOString().split('T')[0]);
    setSessionTime(session.scheduledDate.toTimeString().slice(0, 5));
    setShowSessionModal(true);
  };

  const openSessionModal = () => {
    setEditingSession(null);
    setSessionTitle('');
    setSessionDate('');
    setSessionTime('');
    setShowSessionModal(true);
  };

  const getStatusBadgeColor = (status: Session['status']) => {
    switch (status) {
      case 'em-andamento':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'agendada':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'concluída':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatStatus = (status: Session['status']) => {
    switch (status) {
      case 'em-andamento': return 'Em Andamento';
      case 'agendada': return 'Agendada';
      case 'concluída': return 'Concluída';
      default: return status;
    }
  };

  // Se uma sessão está ativa, mostrar a página da sessão
  if (activeSessionId) {
    return (
      <SessionPage 
        sessionId={activeSessionId}
        onClose={() => setActiveSessionId(null)}
      />
    );
  }

  if (!campaign) {
    return <div className="text-center p-8">Carregando campanha...</div>;
  }

  const approvedPlayers = campaign.participants.filter(p => p.approved);
  const pendingPlayers = campaign.participants.filter(p => !p.approved);

  return (
    <div className="max-w-6xl mx-auto px-4 pb-16">
      {/* Modal de Sessão */}
      <Dialog open={showSessionModal} onOpenChange={setShowSessionModal}>
        <DialogContent className="bg-black/90 border-gray-700 backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">
              {editingSession ? 'Editar Sessão' : 'Nova Sessão'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="sessionTitle">Título da Sessão</Label>
              <Input 
                id="sessionTitle" 
                value={sessionTitle} 
                onChange={e => setSessionTitle(e.target.value)} 
                placeholder="Ex: Sessão 1 - O Início da Aventura"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sessionDate">Data</Label>
                <Input 
                  id="sessionDate" 
                  type="date"
                  value={sessionDate} 
                  onChange={e => setSessionDate(e.target.value)} 
                />
              </div>
              <div>
                <Label htmlFor="sessionTime">Horário</Label>
                <Input 
                  id="sessionTime" 
                  type="time"
                  value={sessionTime} 
                  onChange={e => setSessionTime(e.target.value)} 
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSessionModal(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={createOrUpdateSession} 
              disabled={!sessionTitle.trim() || !sessionDate || !sessionTime}
            >
              {editingSession ? 'Atualizar' : 'Criar'} Sessão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cabeçalho */}
      <div className="pt-8 mb-8">
        <Button 
          variant="ghost" 
          onClick={onBack}
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
          </div>
          {/* Link da Campanha */}
          <div className="flex items-center gap-2 bg-black/30 backdrop-blur-lg rounded-lg p-3 border border-white/10">
            <Link className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Link da Campanha</span>
            <Button 
              size="sm" 
              variant="outline"
              onClick={copyCampaignLink}
              className="ml-2"
            >
              <Copy className="w-4 h-4 mr-1" />
              {copySuccess ? 'Copiado!' : 'Copiar'}
            </Button>
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
          
          {/* Jogadores Pendentes */}
          {pendingPlayers.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-yellow-400">Pendentes de Aprovação</h3>
              <div className="space-y-3">
                {pendingPlayers.map(participant => {
                  const userProfile = userProfiles[participant.userId!];
                  return (
                    <div 
                      key={participant.id}
                      className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {userProfile?.photoURL ? (
                            <img 
                              src={userProfile.photoURL} 
                              alt={userProfile.displayName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center">
                              <User className="w-5 h-5" />
                            </div>
                          )}
                          <div>
                            <h4 className="font-semibold text-white">
                              {userProfile?.displayName || "Usuário"}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {participant.type === 'character' ? `Personagem: ${participant.name}` : 'Jogador'}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {participant.type === 'character' && participant.characterId && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => viewCharacterSheet(participant.characterId!)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            onClick={() => approveParticipant(participant.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => rejectParticipant(participant.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Jogadores Aprovados */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Jogadores Aprovados</h3>
            <div className="space-y-3">
              {approvedPlayers.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhum jogador aprovado ainda.
                </p>
              ) : (
                approvedPlayers.map(participant => {
                  const userProfile = userProfiles[participant.userId!];
                  return (
                    <div 
                      key={participant.id}
                      className="bg-black/40 rounded-lg p-4 flex items-center justify-between hover:bg-black/60 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {userProfile?.photoURL ? (
                          <img 
                            src={userProfile.photoURL} 
                            alt={userProfile.displayName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center">
                            <User className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold text-white">
                            {userProfile?.displayName || "Usuário"}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {participant.type === 'character' ? `${participant.name}` : 'Jogador'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {participant.type === 'character' && participant.characterId && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => viewCharacterSheet(participant.characterId!)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => removePlayer(participant.id)}
                        >
                          <UserMinus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Gerenciar Sessões */}
        <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Sessões</h2>
            </div>
            <Button onClick={openSessionModal} className="bg-primary hover:bg-primary/90">
              + Nova Sessão
            </Button>
          </div>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {sessions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhuma sessão agendada ainda.
              </p>
            ) : (
              sessions.map(session => (
                <div 
                  key={session.id}
                  className="bg-black/40 rounded-lg p-4 hover:bg-black/60 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white">
                          {session.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(session.status)}`}>
                          {formatStatus(session.status)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {session.scheduledDate.toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {session.status === 'agendada' && (
                      <Button 
                        size="sm" 
                        onClick={() => setActiveSessionId(session.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Iniciar Sessão
                      </Button>
                    )}
                    {/* Adicionado botão para entrar em sessões em andamento */}
                    {session.status === 'em-andamento' && (
                      <Button 
                        size="sm" 
                        onClick={() => setActiveSessionId(session.id)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Entrar na Sessão
                      </Button>
                    )}
                    {session.status === 'concluída' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setActiveSessionId(session.id)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver Detalhes
                      </Button>
                    )}
                    {session.status !== 'concluída' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => startEditSession(session)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => deleteSession(session.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Estatísticas da Campanha */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 text-center">
          <div className="text-3xl font-bold text-primary mb-2">
            {sessions.filter(s => s.status === 'concluída').length}
          </div>
          <div className="text-muted-foreground">Sessões Concluídas</div>
        </div>
        <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">
            {sessions.filter(s => s.status === 'agendada').length}
          </div>
          <div className="text-muted-foreground">Sessões Agendadas</div>
        </div>
        <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">
            {approvedPlayers.length}
          </div>
          <div className="text-muted-foreground">Jogadores Ativos</div>
        </div>
        <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-2">
            {pendingPlayers.length}
          </div>
          <div className="text-muted-foreground">Pendentes</div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailPage;