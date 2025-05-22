import { 
  useState, 
  useEffect 
} from "react";
import { 
  useNavigate 
} from "react-router-dom";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Label 
} from "@/components/ui/label";
import { 
  Input 
} from "@/components/ui/input";
import { 
  Button 
} from "@/components/ui/button";
import { 
  Badge 
} from "@/components/ui/badge";
import { 
  SelectDropdown 
} from "@/utils/SelectDropdown";
import { 
  Personagem 
} from "@/components/personagem/types";
import { 
  PlayerLayout 
} from "@/components/layout/PlayerLayout";
import { 
  query, 
  collection, 
  where, 
  getDocs, 
  updateDoc, 
  doc, 
  arrayUnion,
  arrayRemove,
  onSnapshot 
} from "firebase/firestore";
import { 
  db 
} from "@/components/auth/firebase-config";
import { 
  useAuth 
} from "@/contexts/AuthContext";

interface CampanhaJogador {
  id: string;
  name: string;
  description: string;
  status: 'concluída' | 'em andamento' | 'não iniciada';
  mestreNome: string;
  participants: Array<{ 
    id: string; 
    characterId?: string; // Garantir que está definido
    name: string; 
    type: 'player' | 'character'; 
    approved: boolean;
    userId?: string;
  }>;
  sessions: Array<{ id: string; link: string }>;
  inviteLink: string;
  participantUserIds: string[];
  personagem?: Personagem;
}

const PlayerSessao = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [campanha, setCampanha] = useState<CampanhaJogador | null>(null);
  const [campanhasAprovadas, setCampanhasAprovadas] = useState<CampanhaJogador[]>([]);
  const [campanhasPendentes, setCampanhasPendentes] = useState<CampanhaJogador[]>([]);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [linkCampanha, setLinkCampanha] = useState("");
  const [pvAtual, setPvAtual] = useState(0);
  const [recursos, setRecursos] = useState<Record<string, number>>({});
  const [carregando, setCarregando] = useState(false);
  const [personagens, setPersonagens] = useState<Personagem[]>([]);
  const [carregandoPersonagens, setCarregandoPersonagens] = useState(true);
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
        alert("Erro ao carregar personagens!");
      } finally {
        setCarregandoPersonagens(false);
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

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todasCampanhas = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }) as CampanhaJogador);

      const aprovadas = todasCampanhas.filter(c => 
        c.participants.some(p => 
          p.userId === currentUser.uid && p.approved
        )
      );
      
      const pendentes = todasCampanhas.filter(c => 
        c.participants.some(p => 
          p.userId === currentUser.uid && !p.approved
        )
      );

      setCampanhasAprovadas(aprovadas);
      setCampanhasPendentes(pendentes);

      if (!campanha && aprovadas.length > 0) {
        setCampanha(aprovadas[0]);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    if (campanha?.personagem) {
      setPvAtual(calcularPVTotal(campanha.personagem));
    }
  }, [campanha]);

  const calcularPVTotal = (personagem: Personagem) => {
    return personagem.atributos.vigor.base * 2 + 10;
  };

  const entrarNaCampanha = async () => {
    try {
      setCarregando(true);
      const q = query(
        collection(db, "campanhas"),
        where("inviteLink", "==", linkCampanha)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        throw new Error("Campanha não encontrada!");
      }

      const doc = querySnapshot.docs[0];
      const campanhaData = doc.data() as CampanhaJogador;

      if (!selectedCharacterId) {
        throw new Error("Selecione um personagem!");
      }

      const personagem = personagens.find(p => p.id === selectedCharacterId);
      if (!personagem) throw new Error("Personagem não encontrado");

      const campaignRef = doc.ref;
      
      // Correção crítica: Usar characterId corretamente
      await updateDoc(campaignRef, {
        participants: arrayUnion({
          id: currentUser!.uid, // ID do usuário
          characterId: personagem.id, // ID do personagem
          name: personagem.nome,
          type: 'character',
          approved: false,
          userId: currentUser!.uid
        }),
        participantUserIds: arrayUnion(currentUser!.uid)
      });

      alert("Solicitação enviada ao mestre! Aguarde aprovação.");

    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Erro ao entrar na campanha");
    } finally {
      setCarregando(false);
      setShowJoinModal(false);
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
      alert("Você saiu da campanha com sucesso!");
    } catch (error) {
      console.error("Erro ao sair da campanha:", error);
      alert("Erro ao sair da campanha!");
    }
  };

  const handlePVChange = (valor: number) => {
    setPvAtual(prev => Math.max(0, prev + valor));
  };

  const handleRecursoChange = (recurso: string, valor: number) => {
    setRecursos(prev => ({
      ...prev,
      [recurso]: Math.max(0, (prev[recurso] || 0) + valor)
    }));
  };

  const removerItem = (index: number) => {
    if (!campanha?.personagem?.inventario) return;
    const novoInventario = [...campanha.personagem.inventario];
    novoInventario.splice(index, 1);
    
    setCampanha(prev => ({
      ...prev!,
      personagem: {
        ...prev!.personagem!,
        inventario: novoInventario
      }
    }));
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
            placeholder="https://extraplanar.com/join/campanha-123"
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
            <Button 
              variant="outline" 
              onClick={() => setShowJoinModal(false)}
              className="border-primary/30 text-gray-300 hover:bg-primary/20"
            >
              Cancelar
            </Button>
            <Button 
              onClick={entrarNaCampanha}
              disabled={!linkCampanha || carregando || !selectedCharacterId}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              {carregando ? "Carregando..." : "Solicitar Entrada"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {!campanha ? (
        <div className="flex flex-col items-center min-h-screen p-6 space-y-6">
          <div className="w-full max-w-4xl">
            <h1 className="text-3xl font-bold text-primary mb-6">Suas Campanhas</h1>

            {campanhasAprovadas.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-green-400 mb-4">
                  Campanhas Ativas
                  <Badge className="ml-2 bg-green-800/30 text-green-400">
                    {campanhasAprovadas.length}
                  </Badge>
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {campanhasAprovadas.map(c => (
                    <div 
                      key={c.id}
                      className="bg-gradient-to-br from-green-900/20 to-emerald-900/10 p-6 rounded-xl border border-green-800/30 hover:border-green-500/50 transition-all cursor-pointer"
                      onClick={() => setCampanha(c)}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-green-300">{c.name}</h3>
                        <Badge variant="outline" className="text-green-400 border-green-800/50">
                          {c.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-green-500/80 mt-2">Mestre: {c.mestreNome}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {campanhasPendentes.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-amber-400 mb-4">
                  Solicitações Pendentes
                  <Badge className="ml-2 bg-amber-800/30 text-amber-400">
                    {campanhasPendentes.length}
                  </Badge>
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {campanhasPendentes.map(c => (
                    <div 
                      key={c.id}
                      className="bg-gradient-to-br from-amber-900/20 to-yellow-900/10 p-6 rounded-xl border border-amber-800/30"
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-amber-300">{c.name}</h3>
                        <Badge variant="outline" className="text-amber-400 border-amber-800/50">
                          Aguardando Aprovação
                        </Badge>
                      </div>
                      <p className="text-sm text-amber-500/80 mt-2">Mestre: {c.mestreNome}</p>
                      <p className="text-xs text-amber-700 mt-3">
                        ⏳ Sua solicitação está em análise pelo mestre
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 text-center">
              <Button 
                onClick={() => setShowJoinModal(true)}
                className="bg-primary/90 hover:bg-primary px-8 py-5 text-lg shadow-lg transition-all"
              >
                + Entrar em Nova Campanha
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 p-4">
          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-primary">{campanha.name}</h1>
              <Button 
                onClick={sairDaCampanha}
                variant="destructive"
                className="bg-red-600/80 hover:bg-red-700/90"
              >
                Sair da Campanha
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <label className="text-gray-400">Mestre</label>
                <p className="font-medium text-white">{campanha.mestreNome}</p>
              </div>
              <div>
                <label className="text-gray-400">Status</label>
                <p className="font-medium capitalize text-white">{campanha.status}</p>
              </div>
              <div>
                <label className="text-gray-400">Sessão Ativa</label>
                {campanha.sessions?.slice(-1).map((sessao) => (
                  <a
                    key={sessao.id}
                    href={sessao.link}
                    className="text-primary underline block truncate"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {sessao.link}
                  </a>
                ))}
              </div>
            </div>
            {campanha.description && (
              <div className="mt-4">
                <label className="text-gray-400">Descrição</label>
                <p className="text-white">{campanha.description}</p>
              </div>
            )}
          </div>

          {campanha.personagem && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* ... (restante do código do personagem permanece igual) ... */}
            </div>
          )}
        </div>
      )}
    </PlayerLayout>
  );
};

export default PlayerSessao;