import { useState, useEffect } from "react";
import { MasterLayout } from "@/components/layout/MasterLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectDropdown } from "@/utils/SelectDropdown";
import { addDoc, collection, doc, updateDoc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/components/auth/firebase-config";
import { useAuth } from "@/contexts/AuthContext";

interface Participant {
  id: string;
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
  inviteLink: string;
  sessions: { id: string; link: string }[];
  mestreId: string;
  mestreNome: string;
  createdAt: Date;
}

const MasterCampanhas = () => {
  const { currentUser } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newStatus, setNewStatus] = useState<Campaign['status']>('não iniciada');
  const [selectedCmp, setSelectedCmp] = useState('');

  useEffect(() => {
    if (!currentUser?.uid) return;

    const q = query(
      collection(db, "campanhas"),
      where("mestreId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const campaignsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
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
      inviteLink: `${window.location.origin}/join/${crypto.randomUUID()}`,
      sessions: [],
      mestreId: currentUser.uid,
      mestreNome: currentUser.displayName || "Mestre Anônimo",
      createdAt: new Date()
    };

    try {
      await addDoc(collection(db, "campanhas"), newCampaign);
      setNewName('');
      setNewDesc('');
      setNewStatus('não iniciada');
    } catch (error) {
      console.error("Erro ao criar campanha:", error);
      alert("Erro ao criar campanha!");
    }
  };

  const approveParticipant = async (cmpId: string, pid: string) => {
    try {
      const campaignRef = doc(db, "campanhas", cmpId);
      await updateDoc(campaignRef, {
        participants: campaigns.find(c => c.id === cmpId)?.participants.map(p => 
          p.id === pid ? { ...p, approved: true } : p
        )
      });
    } catch (error) {
      console.error("Erro ao aprovar participante:", error);
    }
  };

  const createSession = async () => {
    if (!selectedCmp) return;
    
    try {
      const campaignRef = doc(db, "campanhas", selectedCmp);
      const sessionId = crypto.randomUUID();
      
      await updateDoc(campaignRef, {
        sessions: [...campaigns.find(c => c.id === selectedCmp)?.sessions || [], {
          id: sessionId,
          link: `${window.location.origin}/session/${sessionId}`
        }]
      });
    } catch (error) {
      console.error("Erro ao criar sessão:", error);
    }
  };

  return (
    <MasterLayout>
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="text-center mb-12 pt-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Gerenciar Campanhas
          </h1>
          <p className="text-muted-foreground text-lg">
            Crie, gerencie e organize suas campanhas e sessões de RPG
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Campanha</Label>
                <Input id="name" value={newName} onChange={e => setNewName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Input id="description" value={newDesc} onChange={e => setNewDesc(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <SelectDropdown id="status" value={newStatus} onChange={e => setNewStatus(e.target.value as Campaign['status'])}>
                  <option value="não iniciada">Não Iniciada</option>
                  <option value="em andamento">Em Andamento</option>
                  <option value="concluída">Concluída</option>
                </SelectDropdown>
              </div>
              <Button onClick={addCampaign}>Criar Campanha</Button>
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            {campaigns.length === 0 ? (
              <p className="text-center text-muted-foreground">Nenhuma campanha criada.</p>
            ) : (
              <div className="space-y-6">
                {campaigns.map(c => (
                  <div key={c.id} className="space-y-2">
                    <h3 className="text-xl font-semibold text-primary">{c.name} <span className="text-sm text-muted-foreground">({c.status})</span></h3>
                    <p className="text-sm text-muted-foreground">{c.description}</p>
                    <p className="text-sm"><strong>Link convite:</strong> <code>{c.inviteLink}</code></p>

                    <div>
                      <p className="font-medium">Participantes</p>
                      {c.participants.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Nenhum participante aguardando.</p>
                      ) : c.participants.map(p => (
                        <div key={p.id} className="flex items-center justify-between py-1">
                          <span className="text-sm text-muted-foreground">{p.name} ({p.type}) - {p.approved ? 'Aprovado' : 'Pendente'}</span>
                          {!p.approved && <Button size="sm" onClick={() => approveParticipant(c.id, p.id)}>Aprovar</Button>}
                        </div>
                      ))}
                    </div>

                    <div>
                      <p className="font-medium">Sessões</p>
                      {c.sessions.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Nenhuma sessão criada.</p>
                      ) : c.sessions.map(s => (
                        <a key={s.id} href={s.link} target="_blank" rel="noopener noreferrer" className="block text-sm underline">
                          {s.link}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="space-y-4">
              <Label htmlFor="select-cmp">Selecione Campanha</Label>
              <SelectDropdown id="select-cmp" value={selectedCmp} onChange={e => setSelectedCmp(e.target.value)}>
                <option value="">Escolha campanha</option>
                {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </SelectDropdown>
              <Button onClick={createSession}>Gerar Link de Sessão</Button>
            </div>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};

export default MasterCampanhas;
