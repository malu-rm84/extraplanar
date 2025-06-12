// PlayerCampanhas.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlayerLayout } from "@/components/layout/PlayerLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectDropdown } from "@/utils/SelectDropdown";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Personagem } from "@/components/personagem/types";
import { query, collection, where, getDocs, updateDoc, doc, arrayUnion, arrayRemove, onSnapshot, addDoc } from "firebase/firestore";
import { db } from "@/components/auth/firebase-config";
import { useAuth } from "@/contexts/AuthContext";

interface CampanhaJogador {
  id: string;
  name: string;
  description: string;
  status: 'concluída' | 'em andamento' | 'não iniciada';
  mestreNome: string;
  participants: Array<{ 
    id: string; 
    characterId?: string;
    name: string; 
    type: 'player' | 'character'; 
    approved: boolean;
    userId?: string;
  }>;
  sessions: Array<{ id: string; link: string; data: Date }>;
  inviteLink: string;
  participantUserIds: string[];
  personagem?: Personagem;
  proximaSessao?: Date;
}

const PlayerCampanhas = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [campanha, setCampanha] = useState<CampanhaJogador | null>(null);
  const [campanhasAprovadas, setCampanhasAprovadas] = useState<CampanhaJogador[]>([]);
  const [campanhasPendentes, setCampanhasPendentes] = useState<CampanhaJogador[]>([]);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [linkCampanha, setLinkCampanha] = useState("");
  const [personagens, setPersonagens] = useState<Personagem[]>([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState("");

  useEffect(() => {
    const carregarPersonagens = async () => {
      if (!currentUser) return;
      
      try {
        const q = query(
          collection(db, "personagens"),
          where("criadoPor", "==", currentUser.uid)
        );
        const snapshot = await getDocs(q);
        const dados = snapshot.docs.map(doc => ({
          ...doc.data() as Personagem,
          id: doc.id
        }));
        setPersonagens(dados);
      } catch (error) {
        console.error("Erro ao carregar personagens:", error);
      }
    };

    carregarPersonagens();
  }, [currentUser]);

useEffect(() => {
  if (!currentUser?.uid) return;

  const q = query(
    collection(db, "campanhas"),
    where("participantUserIds", "array-contains", currentUser.uid)
  );

  const unsubscribe = onSnapshot(q, async (snapshot) => {
    const todasCampanhas = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        status: data.status,
        mestreNome: data.mestreNome,
        participants: data.participants,
        inviteLink: data.inviteLink,
        participantUserIds: data.participantUserIds,
        proximaSessao: data.proximaSessao?.toDate() || null,
        sessions: data.sessions?.map((s: any) => ({
          ...s,
          data: s.data?.toDate()
        })) || []
      } as CampanhaJogador;
    });

    // Filtrar campanhas aprovadas e pendentes
    const novasAprovadas = todasCampanhas.filter(c => 
      c.participants.some(p => 
        p.userId === currentUser.uid && p.approved
      )
    );
    
    const novasPendentes = todasCampanhas.filter(c => 
      c.participants.some(p => 
        p.userId === currentUser.uid && !p.approved
      )
    );

    // Criar pastas para campanhas aprovadas
    try {
      for (const campanha of novasAprovadas) {
        // Verificar se a pasta raiz já existe
        const folderQuery = query(
          collection(db, "folders"),
          where("campaignId", "==", campanha.id),
          where("userId", "==", currentUser.uid),
          where("parentFolderId", "==", null)
        );

        const folderSnapshot = await getDocs(folderQuery);
        
        if (folderSnapshot.empty) {
          // Criar pasta raiz da campanha
          const newFolderRef = await addDoc(collection(db, "folders"), {
            name: campanha.name,
            userId: currentUser.uid,
            campaignId: campanha.id,
            parentFolderId: null,
            createdAt: new Date()
          });

          // Criar nota inicial na pasta
          await addDoc(collection(db, "lore"), {
            title: "Bem-vindo à Campanha",
            content: `# ${campanha.name}\n\n**Mestre:** ${campanha.mestreNome}\n\nComece a registrar suas anotações aqui!`,
            folderId: newFolderRef.id,
            userId: currentUser.uid,
            campaignId: campanha.id,
            createdAt: new Date()
          });
        }
      }
    } catch (error) {
      console.error("Erro ao criar estrutura de pastas:", error);
    }

    // Atualizar estados
    setCampanhasAprovadas(novasAprovadas);
    setCampanhasPendentes(novasPendentes);
    
    // Manter a campanha selecionada se ainda existir
    if (!campanha && novasAprovadas.length > 0) {
      setCampanha(novasAprovadas[0]);
    }
  });

  return () => unsubscribe();
}, [currentUser]); // Removida a dependência de campanhasAprovadas para evitar loops

  const entrarNaCampanha = async () => {
    try {
      const q = query(
        collection(db, "campanhas"),
        where("inviteLink", "==", linkCampanha)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) throw new Error("Campanha não encontrada!");

      const doc = querySnapshot.docs[0];
      const personagem = personagens.find(p => p.id === selectedCharacterId);
      if (!personagem) throw new Error("Personagem não encontrado");

      await updateDoc(doc.ref, {
        participants: arrayUnion({
          id: currentUser!.uid,
          characterId: personagem.id,
          name: personagem.nome,
          type: 'character',
          approved: false,
          userId: currentUser!.uid
        }),
        participantUserIds: arrayUnion(currentUser!.uid)
      });

      alert("Solicitação enviada ao mestre! Aguarde aprovação.");
      setShowJoinModal(false);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Erro ao entrar na campanha");
    }
  };

  const sairDaCampanha = async () => {
    if (!currentUser || !campanha) return;

    try {
      const campaignRef = doc(db, "campanhas", campanha.id);
      await updateDoc(campaignRef, {
        participants: campanha.participants.filter(p => p.userId !== currentUser.uid),
        participantUserIds: arrayRemove(currentUser.uid)
      });
      setCampanha(null);
    } catch (error) {
      console.error("Erro ao sair da campanha:", error);
    }
  };

  return (
    <PlayerLayout>
      <Dialog open={showJoinModal} onOpenChange={setShowJoinModal}>
        <DialogContent className="bg-black/90 border-gray-700 backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Entrar na Campanha</DialogTitle>
            <DialogDescription className="text-gray-300">
              Insira o link de convite da campanha
            </DialogDescription>
          </DialogHeader>
          
          <Input
            value={linkCampanha}
            onChange={(e) => setLinkCampanha(e.target.value)}
            placeholder="Link de convite"
            className="bg-black/50 border-gray-600 text-white"
          />

          <div className="space-y-2">
            <Label className="text-gray-300">Selecione um Personagem</Label>
            <SelectDropdown 
              value={selectedCharacterId} 
              onChange={(e) => setSelectedCharacterId(e.target.value)}
              className="bg-black/50 border-gray-600 text-white"
            >
              <option value="">Escolha um personagem</option>
              {personagens.map(p => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </SelectDropdown>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowJoinModal(false)}>
              Cancelar
            </Button>
            <Button onClick={entrarNaCampanha} disabled={!linkCampanha || !selectedCharacterId}>
              Solicitar Entrada
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="text-center mb-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Minhas Campanhas
            </h1>
            <div className="flex gap-4 items-center">
              <Button onClick={() => setShowJoinModal(true)}
                size="lg"
                className="bg-primary/20 hover:bg-primary/30 border border-primary/30 hover:border-primary/50 transition-all shadow-glow hover:shadow-glow-lg"
              >
                + Nova Campanha
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {campanhasAprovadas.length > 0 && (
            <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold mb-4 text-primary">Campanhas Ativas</h2>
              {campanhasAprovadas.map(c => (
                <div 
                  key={c.id} 
                  className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-primary/30 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">
                          {c.name}
                        </h3>
                      </div>
                      
                      <p className="text-muted-foreground mb-4">
                        {c.description}
                      </p>
                      
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        
                        {c.proximaSessao && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Próxima Sessão:</span>
                            <span className="text-green-400">
                              {c.proximaSessao.toLocaleDateString('pt-BR', {
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
                      onClick={() => navigate(`/campanha/${c.id}`)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {campanhasPendentes.length > 0 && (
            <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold mb-4 text-amber-400">Solicitações Pendentes</h2>
              {campanhasPendentes.map(c => (
                <div key={c.id} className="space-y-2 mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-amber-300">{c.name}</h3>
                      <p className="text-sm text-amber-500/80">Mestre: {c.mestreNome}</p>
                    </div>
                    <Badge variant="outline" className="text-amber-400">
                      Pendente
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PlayerLayout>
  );
};

export default PlayerCampanhas;