import { useState, useEffect } from "react";
import { MasterLayout } from "@/components/layout/MasterLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectDropdown } from "@/utils/SelectDropdown";
import { addDoc, collection, doc, updateDoc, onSnapshot, query, where, getDocs, arrayUnion, deleteDoc, arrayRemove, limit, orderBy } from "firebase/firestore";
import { db } from "@/components/auth/firebase-config";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Copy } from 'lucide-react';

interface Participant {
  id: string;
  characterId?: string;
  name: string;
  type: 'player' | 'character';
  approved: boolean;
  userId?: string;
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: 'concluída' | 'em andamento' | 'não iniciada';
  participants: Participant[];
  participantUserIds: string[];
  inviteLink: string;
  mestreId: string;
  mestreNome: string;
  createdAt: Date;
  proximaSessao?: Date;
  sessoes?: Session[];
}

interface Session {
  id: string;
  number: number;
  date: Date;
  title: string;
  content: string;
  folderId: string;
  userId: string;
}

const MasterCampanhas = () => {
  const { currentUser } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newStatus, setNewStatus] = useState<Campaign['status']>('não iniciada');
  const [selectedCmp, setSelectedCmp] = useState('');
  const [novaSessaoData, setNovaSessaoData] = useState('');
  const [filterStatus, setFilterStatus] = useState<Campaign['status']>('em andamento');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (!currentUser?.uid) return;

    const q = query(
      collection(db, "campanhas"),
      where("mestreId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const campaignsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore Timestamp to JS Date
        createdAt: doc.data().createdAt.toDate(),
        proximaSessao: doc.data().proximaSessao?.toDate() || null
      })) as Campaign[];
      setCampaigns(campaignsData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const addCampaign = async () => {
    if (!currentUser) return;

    const newCampaign = {
      name: newName,
      description: newDesc,
      status: newStatus,
      participants: [],
      participantUserIds: [],
      inviteLink: `${window.location.origin}/join/${crypto.randomUUID()}`,
      mestreId: currentUser.uid,
      mestreNome: currentUser.displayName || "Mestre Anônimo",
      createdAt: new Date()
    };

    try {
      const campaignRef = await addDoc(collection(db, "campanhas"), newCampaign);
      const folderRef = await addDoc(collection(db, "folders"), {
        name: newCampaign.name,
        userId: currentUser.uid,
        campaignId: campaignRef.id,
        parentFolderId: null
      });

      await addDoc(collection(db, "lore"), {
        title: `Notas de ${newCampaign.name}`,
        content: `# Campanha: ${newCampaign.name}\n\n## Descrição\n${newCampaign.description}\n\n## Status\n${newCampaign.status}`,
        folderId: folderRef.id,
        userId: currentUser.uid
      });

      setNewName('');
      setNewDesc('');
      setNewStatus('não iniciada');
      setShowCreateModal(false);
    } catch (error) {
      console.error("Erro ao criar campanha:", error);
      alert("Erro ao criar campanha!");
    }
  };

  const updateCampaign = async () => {
    if (!editingCampaign) return;

    try {
      const campaignRef = doc(db, "campanhas", editingCampaign.id);
      await updateDoc(campaignRef, {
        name: editingCampaign.name,
        description: editingCampaign.description,
        status: editingCampaign.status
      });
      setShowEditModal(false);
    } catch (error) {
      console.error("Erro ao atualizar campanha:", error);
      alert("Erro ao atualizar campanha!");
    }
  };

  const approveParticipant = async (cmpId: string, pid: string) => {
    try {
      const campaignRef = doc(db, "campanhas", cmpId);
      const campaign = campaigns.find(c => c.id === cmpId);
      const participant = campaign?.participants.find(p => p.id === pid);

      if (!participant?.userId) throw new Error("ID do usuário não encontrado");

      // 1. Atualizar status de aprovação
      await updateDoc(campaignRef, {
        participants: campaign?.participants.map(p => 
          p.id === pid ? { ...p, approved: true } : p
        )
      });

      // 2. Criar pasta para o jogador
      const playerFolderRef = await addDoc(collection(db, "folders"), {
        name: campaign?.name || "Nova Campanha",
        userId: participant.userId,
        campaignId: cmpId,
        createdAt: new Date()
      });

      // 3. Criar nota inicial na pasta
      await addDoc(collection(db, "lore"), {
        title: "Notas Iniciais",
        content: `# Bem-vindo à campanha ${campaign?.name}\n\n**Mestre:** ${campaign?.mestreNome}\n\nComece a registrar suas anotações aqui!`,
        folderId: playerFolderRef.id,
        userId: participant.userId,
        campaignId: cmpId,
        createdAt: new Date()
      });

    } catch (error) {
      console.error("Erro na aprovação:", error);
      alert("Erro ao criar estrutura de notas: " + (error as Error).message);
    }
  };

  const deleteCampaign = async (campaignId: string) => {
    try {
      await deleteDoc(doc(db, "campanhas", campaignId));
      alert("Campanha excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir campanha:", error);
      alert("Erro ao excluir campanha!");
    }
  };

  const removeParticipant = async (cmpId: string, pid: string) => {
    try {
      const campaignRef = doc(db, "campanhas", cmpId);
      const campaign = campaigns.find(c => c.id === cmpId);
      
      if (campaign) {
        await updateDoc(campaignRef, {
          participants: campaign.participants.filter(p => p.id !== pid),
          participantUserIds: arrayRemove(...campaign.participants
            .filter(p => p.id === pid)
            .map(p => p.userId || ''))
        });
      }
    } catch (error) {
      console.error("Erro ao remover participante:", error);
    }
  };

  const agendarSessao = async (campaignId: string) => {
    try {
      if (!novaSessaoData) {
        alert("Selecione uma data válida!");
        return;
      }

      // Converter e ajustar timezone
      const dataSessao = new Date(novaSessaoData);
      const timezoneOffset = dataSessao.getTimezoneOffset() * 60000;
      const adjustedDate = new Date(dataSessao.getTime() - timezoneOffset);

      if (isNaN(adjustedDate.getTime())) {
        throw new Error("Data inválida");
      }

      // Obter pasta da campanha
      const foldersQuery = query(
        collection(db, "folders"),
        where("campaignId", "==", campaignId),
        where("userId", "==", currentUser?.uid)
      );
      
      const folderSnapshot = await getDocs(foldersQuery);
      if (folderSnapshot.empty) {
        throw new Error("Pasta da campanha não encontrada!");
      }
      const folderId = folderSnapshot.docs[0].id;

      // Determinar número da próxima sessão
      const sessionsQuery = query(
        collection(db, "lore"),
        where("campaignId", "==", campaignId),
        orderBy("number", "desc"),
        limit(1)
      );

      const sessionsSnapshot = await getDocs(sessionsQuery);
      let nextNumber = 1;
      
      if (!sessionsSnapshot.empty) {
        const lastSession = sessionsSnapshot.docs[0].data() as Session;
        nextNumber = lastSession.number + 1;
      }

      // Formatar data para exibição
      const formattedDate = adjustedDate.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });

      // Criar documento da sessão
      const sessionRef = await addDoc(collection(db, "lore"), {
        title: `Sessão ${nextNumber} - ${formattedDate}`,
        content: `# Sessão ${nextNumber}\n\n## Data\n${formattedDate}`,
        folderId: folderId,
        userId: currentUser?.uid,
        campaignId: campaignId,
        number: nextNumber,
        date: adjustedDate
      });

      // Atualizar campanha com nova data
      await updateDoc(doc(db, "campanhas", campaignId), {
        proximaSessao: adjustedDate
      });

      alert(`Sessão ${nextNumber} agendada para ${formattedDate}!`);
      setNovaSessaoData(''); // Limpar campo de input

    } catch (error) {
      console.error("Erro ao agendar sessão:", error);
      alert(error instanceof Error ? error.message : "Erro ao agendar sessão!");
    }
  };

  const deleteSessao = async (campaignId: string, sessionId: string) => {
    try {
      await deleteDoc(doc(db, "lore", sessionId));
      await updateDoc(doc(db, "campanhas", campaignId), {
        proximaSessao: null
      });
      alert("Sessão removida com sucesso!");
    } catch (error) {
      console.error("Erro ao remover sessão:", error);
      alert("Erro ao remover sessão!");
    }
  };

  const editarSessao = async (session: Session, newDate: Date) => {
    try {
      const formattedDate = newDate.toLocaleDateString('pt-BR');
      const newTitle = `Sessão ${session.number} - ${formattedDate}`;

      await updateDoc(doc(db, "lore", session.id), {
        title: newTitle,
        date: newDate,
        content: `# Sessão ${session.number}\n\n## Data\n${formattedDate}`
      });

      alert("Sessão atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao editar sessão:", error);
      alert("Erro ao atualizar sessão!");
    }
  };

  const filteredCampaigns = campaigns.filter(c => c.status === filterStatus);

  const updateCampaignInviteLink = async (campaignId: string, newLink: string) => {
    try {
      const campaignRef = doc(db, "campanhas", campaignId);
      await updateDoc(campaignRef, { inviteLink: newLink });
      alert("Link de convite atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar link:", error);
      alert("Erro ao atualizar link de convite.");
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Link copiado para a área de transferência!");
    } catch (err) {
      console.error("Falha ao copiar texto: ", err);
      alert("Erro ao copiar link!");
    }
  };

  return (
    <MasterLayout>
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {/* Modal de Criação */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="bg-black/90 border-gray-700 backdrop-blur-lg">
            <DialogHeader>
              <DialogTitle className="text-white text-xl">Nova Campanha</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Campanha</Label>
                <Input 
                  id="name" 
                  value={newName} 
                  onChange={e => setNewName(e.target.value)} 
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Input 
                  id="description" 
                  value={newDesc} 
                  onChange={e => setNewDesc(e.target.value)} 
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <SelectDropdown 
                  value={newStatus} 
                  onChange={e => setNewStatus(e.target.value as Campaign['status'])}
                >
                  <option value="não iniciada">Não Iniciada</option>
                  <option value="em andamento">Em Andamento</option>
                  <option value="concluída">Concluída</option>
                </SelectDropdown>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancelar
              </Button>
              <Button onClick={addCampaign}>
                Criar Campanha
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Edição */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="bg-black/90 border-gray-700 backdrop-blur-lg">
            <DialogHeader>
              <DialogTitle className="text-white text-xl">Editar Campanha</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editName">Nome da Campanha</Label>
                <Input 
                  id="editName" 
                  value={editingCampaign?.name || ''} 
                  onChange={e => setEditingCampaign(prev => prev ? {...prev, name: e.target.value} : null)} 
                />
              </div>
              <div>
                <Label htmlFor="editDesc">Descrição</Label>
                <Input 
                  id="editDesc" 
                  value={editingCampaign?.description || ''} 
                  onChange={e => setEditingCampaign(prev => prev ? {...prev, description: e.target.value} : null)} 
                />
              </div>
              <div>
                <Label htmlFor="editStatus">Status</Label>
                <SelectDropdown 
                  value={editingCampaign?.status || 'não iniciada'} 
                  onChange={e => setEditingCampaign(prev => prev ? {...prev, status: e.target.value as Campaign['status']} : null)}
                >
                  <option value="não iniciada">Não Iniciada</option>
                  <option value="em andamento">Em Andamento</option>
                  <option value="concluída">Concluída</option>
                </SelectDropdown>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancelar
              </Button>
              <Button onClick={updateCampaign}>
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="text-center mb-12 pt-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Gerenciar Campanhas
          </h1>
          <div className="flex justify-center gap-4 mb-4">
            <Button onClick={() => setShowCreateModal(true)}>
              + Nova Campanha
            </Button>
            <SelectDropdown 
              value={filterStatus} 
              onChange={e => setFilterStatus(e.target.value as Campaign['status'])}
            >
              <option value="em andamento">Em Andamento</option>
              <option value="não iniciada">Não Iniciadas</option>
              <option value="concluída">Concluídas</option>
            </SelectDropdown>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            {filteredCampaigns.length === 0 ? (
              <p className="text-center text-muted-foreground">Nenhuma campanha encontrada.</p>
            ) : (
              <div className="space-y-6">
                {filteredCampaigns.map(c => (
                  <div key={c.id} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-primary">{c.name}</h3>
                        <p className="text-sm text-muted-foreground">{c.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => {
                            setEditingCampaign(c);
                            setShowEditModal(true);
                          }}
                        >
                          Editar
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteCampaign(c.id)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <div className="mt-4">
                        <Label>Link de Convite</Label>
                        <div className="flex gap-2 mt-2 items-center">
                          <span className="text-sm text-muted-foreground">{c.inviteLink}</span>
                          <Copy 
                            onClick={() => copyToClipboard(c.inviteLink)}
                            className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary"
                          />
                        </div>
                      </div>
                      <p className="font-medium">Participantes</p>
                      {c.participants.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Nenhum participante</p>
                      ) : (
                        c.participants.map(p => (
                          <div key={p.id} className="flex items-center justify-between py-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {p.name} ({p.type === 'character' ? 'Personagem' : 'Player'}) - {p.approved ? 'Aprovado' : 'Pendente'}
                              </span>
                              {p.approved && p.type === 'character' && (
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="text-primary hover:text-primary/80"
                                  onClick={() => window.open(`/master/personagens/${p.characterId}`, '_blank')}
                                >
                                  Ver Ficha
                                </Button>
                              )}
                            </div>
                            <div className="flex gap-2">
                              {!p.approved && (
                                <Button size="sm" onClick={() => approveParticipant(c.id, p.id)}>
                                  Aprovar
                                </Button>
                              )}
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => removeParticipant(c.id, p.id)}
                              >
                                Remover
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="mt-4">
                      <Label>Agendar Próxima Sessão</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          type="datetime-local"
                          value={novaSessaoData}
                          min={new Date().toISOString().slice(0, 16)}
                          onChange={(e) => setNovaSessaoData(e.target.value)}
                          className="bg-black/50 border-gray-600 text-white"
                        />
                        <Button 
                          onClick={() => agendarSessao(c.id)}
                          className="bg-primary hover:bg-primary/90"
                        >
                          Agendar
                        </Button>
                      </div>
                      {c.proximaSessao && (
                        <div className="flex items-center gap-2 mt-2">
                          <p className="text-sm text-green-400">
                            Próxima sessão: {new Date(c.proximaSessao).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <Button
                            variant="link"
                            size="sm"
                            className="text-red-500 hover:text-red-400"
                            onClick={async () => {
                              try {
                                // Buscar a sessão mais recente diretamente do Firestore
                                const sessionsQuery = query(
                                  collection(db, "lore"),
                                  where("campaignId", "==", c.id),
                                  orderBy("number", "desc"),
                                  limit(1)
                                );
                                
                                const querySnapshot = await getDocs(sessionsQuery);
                                if (!querySnapshot.empty) {
                                  const latestSession = querySnapshot.docs[0];
                                  deleteSessao(c.id, latestSession.id);
                                }
                              } catch (error) {
                                console.error("Erro ao buscar sessão:", error);
                              }
                            }}
                          >
                            Remover Agendamento
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};

export default MasterCampanhas;