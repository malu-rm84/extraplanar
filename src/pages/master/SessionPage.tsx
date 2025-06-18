
// SessionPage.tsx
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, arrayUnion, collection, addDoc } from "firebase/firestore";
import { db } from "@/components/auth/firebase-config";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Timer, Eye, Dice6, Users, FileText, User } from "lucide-react";
import RollPage from "../RollPage";
import NotesPage from "../NotesPage";
import { useAuth } from "@/contexts/AuthContext";

export interface Session {
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
  xpAwarded?: Array<{
    date: Date;
    awards: {[key: string]: number};
  }>;
}

interface Character {
  id: string;
  name: string;
  fotoUrl?: string;
}

interface SessionPageProps {
  sessionId: string;
  onClose: () => void;
}

const SessionPage = ({ sessionId, onClose }: SessionPageProps) => {
  const { currentUser } = useAuth();
  const [session, setSession] = useState<Session | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [xpValues, setXpValues] = useState<{[key: string]: number}>({});
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [rollCount, setRollCount] = useState(0);
  const [notes, setNotes] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [activeTab, setActiveTab] = useState<'dados' | 'anotacoes'>('dados');

  useEffect(() => {
    const loadSession = async () => {
      const docRef = doc(db, "sessions", sessionId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const sessionData: Session = {
          id: docSnap.id,
          campaignId: data.campaignId,
          scheduledDate: data.scheduledDate.toDate(),
          startTime: data.startTime?.toDate(),
          endTime: data.endTime?.toDate(),
          duration: data.duration,
          diceRolls: data.diceRolls,
          notes: data.notes || '',
          status: data.status,
          mestreId: data.mestreId,
          number: data.number || 1,
          title: data.title || `Sessão ${data.number || 1}`,
          xpAwarded: data.xpAwarded || []
        };
        setSession(sessionData);
        setNotes(sessionData.notes);
        setRollCount(sessionData.diceRolls);
        if (data.campaignId) {
          const campaignRef = doc(db, "campanhas", data.campaignId);
          const campaignSnap = await getDoc(campaignRef);
          if (campaignSnap.exists()) {
            const campaignData = campaignSnap.data();
            
            // Buscar detalhes completos dos personagens usando characterId dos participantes
            const charPromises = campaignData.participants
              .filter((p: any) => p.type === 'character' && p.approved && p.characterId)
              .map(async (p: any) => {
                const charRef = doc(db, "personagens", p.characterId);
                const charSnap = await getDoc(charRef);
                if (charSnap.exists()) {
                  const charData = charSnap.data();
                  return {
                    id: p.characterId, // Usar characterId em vez de p.id
                    name: p.name,
                    fotoUrl: charData.fotoUrl || ''
                  };
                }
                return {
                  id: p.characterId,
                  name: p.name,
                  fotoUrl: ''
                };
              });

            const chars = await Promise.all(charPromises);
            setCharacters(chars);
            
            const initialXp: {[key: string]: number} = {};
            chars.forEach((char: Character) => {
              initialXp[char.id] = 0;
            });
            setXpValues(initialXp);
          }
        }
        if (data.status === 'em-andamento') {
          setIsActive(true);
          const elapsed = Math.floor((Date.now() - data.startTime.toDate().getTime()) / 1000);
          setTimer(elapsed);
        } else if (data.status === 'concluída') {
          setTimer(data.duration);
          setShowSummary(true);
        }
      }
    };
    loadSession();
  }, [sessionId]);

  const startSession = async () => {
    await updateDoc(doc(db, "sessions", sessionId), {
      status: 'em-andamento',
      startTime: new Date()
    });
    setIsActive(true);
  };

  const stopSession = async () => {
    await updateDoc(doc(db, "sessions", sessionId), {
      status: 'concluída',
      endTime: new Date(),
      duration: timer,
      diceRolls: rollCount,
      notes: notes
    });
    setIsActive(false);
    setShowSummary(true);
  };

  const saveNotes = async () => {
    try {
      await updateDoc(doc(db, "sessions", sessionId), {
        notes: notes
      });
      alert("Anotações salvas!");
    } catch (error) {
      console.error("Erro ao salvar anotações:", error);
      alert("Erro ao salvar anotações!");
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const handleRoll = (rolls: number) => {
    setRollCount(prev => prev + rolls);
  };

  const handleXpChange = (charId: string, value: string) => {
    const xp = parseInt(value) || 0;
    setXpValues(prev => ({
      ...prev,
      [charId]: xp
    }));
  };

  const distributeXP = async () => {
    if (!currentUser || !session) {
      alert("Erro: Usuário ou sessão não encontrada!");
      return;
    }

    // Validar se há PDs para distribuir
    const hasXpToDistribute = Object.values(xpValues).some(xp => xp > 0);
    if (!hasXpToDistribute) {
      alert("Nenhum PD foi definido para distribuição!");
      return;
    }

    try {
      // 1. Salvar na sessão (mantendo funcionalidade existente)
      await updateDoc(doc(db, "sessions", sessionId), {
        xpAwarded: arrayUnion({
          date: new Date(),
          awards: xpValues
        })
      });

      // 2. Criar documentos na coleção distributedPDs para cada personagem que recebeu PD
      const distributionPromises = Object.entries(xpValues)
        .filter(([_, pdAmount]) => pdAmount > 0)
        .map(([characterId, pdAmount]) => {
          return addDoc(collection(db, "distributedPDs"), {
            sessionId: sessionId,
            sessionName: session.title,
            characterId: characterId,
            pdAmount: pdAmount,
            masterId: currentUser.uid,
            dateDistributed: new Date(),
            claimed: false
          });
        });

      await Promise.all(distributionPromises);

      alert("PD distribuído com sucesso!");
      
      // Reset XP values
      const resetXp: {[key: string]: number} = {};
      characters.forEach(char => {
        resetXp[char.id] = 0;
      });
      setXpValues(resetXp);
    } catch (error) {
      console.error("Erro ao distribuir PD:", error);
      alert("Erro ao distribuir PD!");
    }
  };

  if (!session) return <div className="text-center p-8">Carregando sessão...</div>;

  const sessionDate = session.scheduledDate.toLocaleDateString('pt-BR');

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 3600).toString().padStart(2, '0')}:${Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const getLastXpDistribution = () => {
    if (!session.xpAwarded || session.xpAwarded.length === 0) return null;
    return session.xpAwarded[session.xpAwarded.length - 1];
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar menor */}
      <div className="w-60 bg-black/30 backdrop-blur-lg border-r border-white/10 p-4 space-y-4 overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Controles</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </Button>
        </div>
        {/* Timer e Status */}
        <div className="bg-black/40 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Timer className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Duração</span>
          </div>
          <div className="text-xl font-mono text-center">
            {formatTime(timer)}
          </div>
          <div className="flex gap-2 mt-3">
            {session.status === 'agendada' && (
              <Button onClick={startSession} size="sm" className="flex-1">
                Iniciar
              </Button>
            )}
            {session.status === 'em-andamento' && (
              <Button 
                variant="destructive" 
                onClick={stopSession} 
                size="sm" 
                className="flex-1"
              >
                Encerrar Sessão
              </Button>
            )}
            {session.status === 'concluída' && (
              <Button 
                variant="outline" 
                onClick={() => setShowSummary(!showSummary)}
                size="sm" 
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-1" />
                {showSummary ? 'Ocultar' : 'Ver'} Resumo
              </Button>
            )}
          </div>
        </div>
        {/* Resumo da Sessão Concluída */}
        {session.status === 'concluída' && showSummary && (
          <div className="bg-black/40 p-4 rounded-lg space-y-3">
            <h3 className="text-sm font-semibold text-primary">Resumo da Sessão</h3>
            <div className="flex items-center gap-2">
              <Dice6 className="w-4 h-4 text-blue-400" />
              <span className="text-sm">Dados rolados: {session.diceRolls}</span>
            </div>
            {getLastXpDistribution() && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-green-400" />
                  <span className="text-sm">PD Distribuído:</span>
                </div>
                <div className="space-y-2">
                  {Object.entries(getLastXpDistribution()!.awards).map(([charId, xp]) => {
                    const char = characters.find(c => c.id === charId);
                    return (
                      <div key={charId} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {/* Foto do personagem no resumo */}
                          <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden border border-white/20">
                            {char?.fotoUrl ? (
                              <img 
                                src={char.fotoUrl} 
                                alt={char.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://via.placeholder.com/40';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                <User className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <span className="text-xs truncate">{char?.name || 'Desconhecido'}</span>
                        </div>
                        <span className="text-green-400 text-sm font-medium">{xp} PD</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {session.notes && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">Anotações:</span>
                </div>
                <div className="text-xs text-muted-foreground bg-black/30 p-2 rounded max-h-20 overflow-y-auto">
                  {session.notes}
                </div>
              </div>
            )}
          </div>
        )}
        {/* Distribuir PD - Apenas para sessões ativas */}
        {session.status !== 'concluída' && (
          <div className="bg-black/40 p-4 rounded-lg">
            <h3 className="text-sm font-semibold mb-3">Distribuir PD</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {characters.map(char => (
                <div key={char.id} className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden border border-white/20">
                    {char.fotoUrl ? (
                      <img 
                        src={char.fotoUrl} 
                        alt={char.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/40';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <span className="text-xs flex-1 truncate">{char.name}</span>
                  <input
                    type="number"
                    min="0"
                    value={xpValues[char.id] || 0}
                    onChange={(e) => handleXpChange(char.id, e.target.value)}
                    className="w-16 bg-black/50 p-1 rounded text-center text-xs text-white"
                  />
                </div>
              ))}
              <Button 
                onClick={distributeXP}
                size="sm"
                className="w-full mt-2 bg-green-600 hover:bg-green-700"
              >
                Distribuir PD
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              {session.title || `Sessão ${session.number}`}
            </h1>
            <p className="text-muted-foreground">
              {sessionDate} • Status: {
                session.status === 'agendada' ? 'Agendada' :
                session.status === 'em-andamento' ? 'Em Andamento' :
                'Concluída'
              }
            </p>
          </div>
        </div>

        {/* Seção de Resumo */}
        {session.status === 'concluída' && showSummary ? (
          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold mb-4">Resumo da Sessão</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-primary mb-2">Duração</h3>
                <p className="text-lg">{formatTime(timer)}</p>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-2">Dados Rolados</h3>
                <p className="text-lg">{session.diceRolls}</p>
              </div>
              {getLastXpDistribution() && (
                <div>
                  <h3 className="font-semibold text-primary mb-2">PD Distribuído</h3>
                  <div className="space-y-2">
                    {Object.entries(getLastXpDistribution()!.awards).map(([charId, xp]) => {
                      const char = characters.find(c => c.id === charId);
                      return (
                        <div key={charId} className="flex items-center justify-between py-2 border-b border-white/10">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border border-white/20">
                              {char?.fotoUrl ? (
                                <img 
                                  src={char.fotoUrl} 
                                  alt={char.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = 'https://via.placeholder.com/40';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                  <User className="w-5 h-5 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <span className="text-sm font-medium">{char?.name || 'Desconhecido'}</span>
                          </div>
                          <span className="text-green-400 text-lg font-bold">{xp} PD</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {session.notes && (
                <div>
                  <h3 className="font-semibold text-primary mb-2">Anotações</h3>
                  <div className="bg-black/20 p-4 rounded whitespace-pre-wrap">
                    {session.notes}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Sistema de abas para sessões ativas
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="bg-black/30 backdrop-blur-lg border border-white/10">
              <TabsTrigger value="dados" className="data-[state=active]:bg-primary/20">
                <Dice6 className="w-4 h-4 mr-2" /> Dados
              </TabsTrigger>
              <TabsTrigger value="anotacoes" className="data-[state=active]:bg-primary/20">
                <FileText className="w-4 h-4 mr-2" /> Anotações
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dados">
              <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <RollPage onRoll={handleRoll} />
              </div>
            </TabsContent>
            
            <TabsContent value="anotacoes">
              <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <NotesPage 
                  role="master" 
                  collectionName="lore" 
                  foldersCollection="folders" 
                  campaignId={session.campaignId}
                />
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default SessionPage;
