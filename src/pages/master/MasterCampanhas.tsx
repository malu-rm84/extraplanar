import { useState, useEffect } from "react";
import { MasterLayout } from "@/components/layout/MasterLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectDropdown } from "@/utils/SelectDropdown";
import { 
  addDoc, collection, doc, onSnapshot, 
  query, where 
} from "firebase/firestore";
import { db } from "@/components/auth/firebase-config";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import CampaignDetailPage from "./CampaingDetailPage";

interface Participant {
  id: string;
  characterId?: string;
  name: string;
  type: 'player' | 'character';
  approved: boolean;
  userId?: string;
}

export interface Campaign {
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
  sessoes?: string[];
}

const MasterCampanhas = () => {
  const { currentUser } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newStatus, setNewStatus] = useState<Campaign['status']>('não iniciada');
  const [filterStatus, setFilterStatus] = useState<Campaign['status']>('em andamento');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

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
        createdAt: doc.data().createdAt.toDate(),
        proximaSessao: doc.data().proximaSessao?.toDate() || null,
        sessoes: doc.data().sessoes || []
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
      
      // Criar pasta da campanha
      const folderRef = await addDoc(collection(db, "folders"), {
        name: newCampaign.name,
        userId: currentUser.uid,
        campaignId: campaignRef.id,
        parentFolderId: null
      });
      
      // Criar nota inicial
      await addDoc(collection(db, "lore"), {
        title: `Notas de ${newCampaign.name}`,
        content: `# Campanha: ${newCampaign.name}\n## Descrição\n${newCampaign.description}\n## Status\n${newCampaign.status}`,
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

  const filteredCampaigns = campaigns.filter(c => c.status === filterStatus);

  const getStatusBadgeColor = (status: Campaign['status']) => {
    switch (status) {
      case 'em andamento':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'não iniciada':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'concluída':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatStatus = (status: Campaign['status']) => {
    switch (status) {
      case 'em andamento':
        return 'Em Andamento';
      case 'não iniciada':
        return 'Não Iniciada';
      case 'concluída':
        return 'Concluída';
      default:
        return status;
    }
  };

  // Se uma campanha está selecionada, mostrar a página de detalhes
  if (selectedCampaignId) {
    return (
      <MasterLayout>
        <CampaignDetailPage 
          campaignId={selectedCampaignId}
          onBack={() => setSelectedCampaignId(null)}
        />
      </MasterLayout>
    );
  }

  return (
    <MasterLayout>
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {/* Modal de Criar Campanha */}
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
                  placeholder="Digite o nome da campanha"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Input 
                  id="description" 
                  value={newDesc} 
                  onChange={e => setNewDesc(e.target.value)} 
                  placeholder="Breve descrição da campanha"
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
              <Button onClick={addCampaign} disabled={!newName.trim()}>
                Criar Campanha
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Cabeçalho */}
        <div className="text-center mb-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Minhas Campanhas
            </h1>
            <div className="flex gap-4 items-center">
              <div className="bg-black/30 backdrop-blur-lg rounded-lg p-2 border border-white/10">
                <SelectDropdown 
                  value={filterStatus} 
                  onChange={e => setFilterStatus(e.target.value as Campaign['status'])}
                  className="bg-transparent border-none text-white"
                >
                  <option value="em andamento">Em Andamento</option>
                  <option value="não iniciada">Não Iniciadas</option>
                  <option value="concluída">Concluídas</option>
                </SelectDropdown>
              </div>
              <Button 
                onClick={() => setShowCreateModal(true)}
                size="lg"
                className="bg-primary/20 hover:bg-primary/30 border border-primary/30 hover:border-primary/50 transition-all shadow-glow hover:shadow-glow-lg"
              >
                + Nova Campanha
              </Button>
            </div>
          </div>
        </div>
        
        {/* Lista de Campanhas */}
        <div className="space-y-4">
          {filteredCampaigns.length === 0 ? (
            <div className="bg-black/30 backdrop-blur-lg rounded-xl p-12 border border-white/10 text-center">
              <p className="text-muted-foreground text-lg">
                Nenhuma campanha {filterStatus === 'em andamento' ? 'em andamento' : 
                filterStatus === 'não iniciada' ? 'não iniciada' : 'concluída'} encontrada.
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                Que tal criar uma nova campanha?
              </p>
            </div>
          ) : (
            filteredCampaigns.map(campaign => (
              <div 
                key={campaign.id} 
                className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-primary/30 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">
                        {campaign.name}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(campaign.status)}`}>
                        {formatStatus(campaign.status)}
                      </span>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">
                      {campaign.description}
                    </p>
                    
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Participantes:</span>
                        <span className="text-primary">
                          {campaign.participants.filter(p => p.approved).length}
                        </span>
                      </div>
                      
                      {campaign.proximaSessao && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Próxima Sessão:</span>
                          <span className="text-green-400">
                            {campaign.proximaSessao.toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => setSelectedCampaignId(campaign.id)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MasterLayout>
  );
};

export default MasterCampanhas;