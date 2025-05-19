import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Personagem } from "@/components/personagem/types";
import { PlayerLayout } from "@/components/layout/PlayerLayout";
import { query, collection, where, getDocs } from "firebase/firestore";
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
    name: string; 
    type: 'player' | 'character'; 
    approved: boolean 
  }>;
  sessions: Array<{ id: string; link: string }>;
  inviteLink: string;
  personagem?: Personagem;
}

const PlayerSessao = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [campanha, setCampanha] = useState<CampanhaJogador | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(true);
  const [linkCampanha, setLinkCampanha] = useState("");
  const [pvAtual, setPvAtual] = useState(0);
  const [recursos, setRecursos] = useState<Record<string, number>>({});
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const carregarPersonagem = () => {
      const personagemSalvo = JSON.parse(localStorage.getItem('personagens') || '[]');
      if (personagemSalvo.length > 0 && campanha) {
        setPvAtual(calcularPVTotal(personagemSalvo[0]));
      }
    };
    
    if (campanha) carregarPersonagem();
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
      const personagens = JSON.parse(localStorage.getItem('personagens') || '[]');

      if (!personagens.length) {
        throw new Error("Nenhum personagem encontrado!");
      }

      setCampanha({
        id: doc.id,
        ...doc.data() as CampanhaJogador,
        personagem: personagens[0]
      });
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Erro ao entrar na campanha");
    } finally {
      setCarregando(false);
      setShowJoinModal(false);
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
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="border-primary/30 text-gray-300 hover:bg-primary/20"
            >
              Cancelar
            </Button>
            <Button 
              onClick={entrarNaCampanha}
              disabled={!linkCampanha || carregando}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              {carregando ? "Carregando..." : "Entrar na Campanha"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {campanha && (
        <div className="space-y-6 p-4">
          {/* Cabeçalho da Campanha */}
          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h1 className="text-3xl font-bold mb-2 text-primary">{campanha.name}</h1>
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
                {campanha.sessions.slice(-1).map((sessao) => (
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

          {/* Conteúdo do Personagem */}
          {campanha.personagem && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Seção de Status */}
              <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 space-y-4">
                <h2 className="text-xl font-bold text-primary">Status</h2>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">PV Atual</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePVChange(-1)}
                        className="text-white border-gray-600"
                      >
                        -
                      </Button>
                      <span className="font-mono text-white">
                        {pvAtual}/{calcularPVTotal(campanha.personagem)}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePVChange(1)}
                        className="text-white border-gray-600"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  {Object.entries(recursos).map(([nome, valor]) => (
                    <div key={nome} className="flex justify-between items-center">
                      <span className="text-gray-300">{nome}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRecursoChange(nome, -1)}
                          className="text-white border-gray-600"
                        >
                          -
                        </Button>
                        <span className="font-mono text-white">{valor}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRecursoChange(nome, 1)}
                          className="text-white border-gray-600"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Atributos e Perícias */}
              <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 space-y-4">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-primary">Atributos</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(campanha.personagem.atributos).map(([nome, valores]) => (
                      <div key={nome} className="flex justify-between">
                        <span className="text-gray-300 capitalize">{nome}</span>
                        <span className="font-mono text-white">{valores.base + valores.racial}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-primary">Perícias</h2>
                  <div className="space-y-2">
                    {campanha.personagem.pericias?.flatMap(c => c.pericias)
                      .filter(p => p.pontos && p.pontos > 0)
                      .map((pericia, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-gray-300">{pericia.nome}</span>
                          <span className="font-mono text-white">{pericia.pontos}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Inventário e Recursos */}
              <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 space-y-4">
                <h2 className="text-xl font-bold text-primary">Inventário</h2>
                <div className="space-y-2">
                  {campanha.personagem.inventario?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <span className="text-gray-300">{item.nome}</span>
                        <span className="text-gray-500 ml-2">x{item.quantidade || 1}</span>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removerItem(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Remover
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </PlayerLayout>
  );
};

export default PlayerSessao;