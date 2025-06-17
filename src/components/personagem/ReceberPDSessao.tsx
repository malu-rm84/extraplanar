
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { doc, updateDoc, arrayUnion, collection, query, where, getDocs, writeBatch } from "firebase/firestore";
import { db } from "@/components/auth/firebase-config";
import { Personagem, SessionPD, DistributedPD, calcularNivelPorPD, calcularTotalPDRecebidos } from "./types";
import { useAuth } from "@/contexts/AuthContext";
import { Star, Gift, AlertCircle } from "lucide-react";

interface ReceberPDSessaoProps {
  personagem: Personagem;
  sessionId: string;
  sessionName: string;
  onPDReceived: () => void;
}

export const ReceberPDSessao = ({ 
  personagem, 
  sessionId, 
  sessionName, 
  onPDReceived 
}: ReceberPDSessaoProps) => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [pdAmount, setPdAmount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [distributedPDs, setDistributedPDs] = useState<DistributedPD[]>([]);
  const [loadingDistributed, setLoadingDistributed] = useState(false);

  // Verificar se já recebeu PD desta sessão
  const jaRecebeuPD = personagem.pdSessoes?.some(pd => pd.sessionId === sessionId);

  // Buscar PDs distribuídos pelo mestre para este personagem e sessão
  const buscarPDsDistribuidos = async () => {
    if (!personagem.id) return;
    
    setLoadingDistributed(true);
    try {
      const distributedQuery = query(
        collection(db, "distributedPDs"),
        where("sessionId", "==", sessionId),
        where("characterId", "==", personagem.id),
        where("claimed", "==", false)
      );
      
      const querySnapshot = await getDocs(distributedQuery);
      const pds: DistributedPD[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as DistributedPD;
        pds.push({ ...data, id: doc.id } as any);
      });
      
      setDistributedPDs(pds);
      
      // Se houver PDs distribuídos, usar a soma como valor padrão
      if (pds.length > 0) {
        const totalDistribuido = pds.reduce((acc, pd) => acc + pd.pdAmount, 0);
        setPdAmount(totalDistribuido);
      }
    } catch (error) {
      console.error("Erro ao buscar PDs distribuídos:", error);
    } finally {
      setLoadingDistributed(false);
    }
  };

  useEffect(() => {
    if (isOpen && !jaRecebeuPD) {
      buscarPDsDistribuidos();
    }
  }, [isOpen, sessionId, personagem.id]);

  const receberPD = async () => {
    if (!personagem.id || !currentUser || pdAmount <= 0) return;

    setLoading(true);
    try {
      const novoPD: SessionPD = {
        sessionId,
        sessionName,
        pdAmount,
        dateReceived: new Date(),
        masterId: currentUser.uid
      };

      const batch = writeBatch(db);

      // Atualizar o personagem
      const personagemRef = doc(db, "personagens", personagem.id);
      batch.update(personagemRef, {
        pdSessoes: arrayUnion(novoPD),
        nivel: calcularNivelPorPD(calcularTotalPDRecebidos(personagem) + pdAmount),
        dataAtualizacao: new Date()
      });

      // Marcar PDs distribuídos como reclamados
      for (const distributedPD of distributedPDs) {
        if ((distributedPD as any).id) {
          const distributedRef = doc(db, "distributedPDs", (distributedPD as any).id);
          batch.update(distributedRef, { claimed: true });
        }
      }

      await batch.commit();

      setIsOpen(false);
      setPdAmount(1);
      setDistributedPDs([]);
      onPDReceived();
    } catch (error) {
      console.error("Erro ao adicionar PD:", error);
      alert("Erro ao adicionar PD!");
    } finally {
      setLoading(false);
    }
  };

  if (jaRecebeuPD) {
    const pdRecebido = personagem.pdSessoes?.find(pd => pd.sessionId === sessionId);
    return (
      <div className="bg-green-900/30 border border-green-600/40 rounded-lg p-3 text-center">
        <div className="text-green-400 font-medium flex items-center justify-center gap-2">
          <Star className="w-4 h-4" />
          PD já recebido: +{pdRecebido?.pdAmount}
        </div>
        <div className="text-xs text-green-300/80 mt-1">
          {pdRecebido?.dateReceived.toLocaleDateString()}
        </div>
      </div>
    );
  }

  const totalAtual = calcularTotalPDRecebidos(personagem);
  const nivelAtual = calcularNivelPorPD(totalAtual);
  const novoTotal = totalAtual + pdAmount;
  const novoNivel = calcularNivelPorPD(novoTotal);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-primary/20 hover:bg-primary/30 border border-primary/30 hover:border-primary/50 transition-all relative"
      >
        <Star className="w-4 h-4 mr-2" />
        Receber PD da Sessão
        {distributedPDs.length > 0 && (
          <div className="absolute -top-1 -right-1 bg-amber-500 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            !
          </div>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-black/90 border-gray-700 backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">
              Receber PD da Sessão
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Adicionar PD de desenvolvimento para: {personagem.nome}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Sessão</Label>
              <div className="text-primary font-medium">{sessionName}</div>
            </div>

            {/* Mostrar PDs distribuídos pelo mestre */}
            {loadingDistributed ? (
              <div className="bg-blue-900/30 border border-blue-600/40 rounded-lg p-4">
                <div className="text-blue-200 font-medium flex items-center gap-2">
                  <Star className="w-4 h-4 animate-spin" />
                  Verificando PDs distribuídos pelo mestre...
                </div>
              </div>
            ) : distributedPDs.length > 0 ? (
              <div className="bg-amber-900/30 border border-amber-600/40 rounded-lg p-4">
                <div className="text-amber-200 font-medium flex items-center gap-2 mb-2">
                  <Gift className="w-4 h-4" />
                  PDs Distribuídos pelo Mestre
                </div>
                <div className="space-y-1">
                  {distributedPDs.map((pd, index) => (
                    <div key={index} className="text-sm text-amber-300/80">
                      +{pd.pdAmount} PD - {new Date(pd.dateDistributed).toLocaleDateString()}
                    </div>
                  ))}
                  <div className="text-amber-200 font-medium mt-2">
                    Total: +{distributedPDs.reduce((acc, pd) => acc + pd.pdAmount, 0)} PD
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900/30 border border-gray-600/40 rounded-lg p-4">
                <div className="text-gray-400 font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Nenhum PD distribuído pelo mestre encontrado
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Você pode inserir manualmente se necessário
                </div>
              </div>
            )}
            
            <div>
              <Label htmlFor="pdAmount" className="text-gray-300">
                Quantidade de PD
              </Label>
              <Input
                id="pdAmount"
                type="number"
                min="1"
                max="20"
                value={pdAmount}
                onChange={(e) => setPdAmount(parseInt(e.target.value) || 1)}
                className="bg-black/50 border-white/10 text-gray-200 focus:border-primary/40"
              />
            </div>

            <div className="bg-blue-900/30 border border-blue-600/40 rounded-lg p-4">
              <div className="text-blue-200 font-medium">Progressão do Personagem</div>
              <div className="text-sm text-blue-300/80 mt-2 space-y-1">
                <div>Nível Atual: {nivelAtual} ({totalAtual} PD total)</div>
                <div className="text-green-400">
                  Após receber: Nível {novoNivel} ({novoTotal} PD total)
                  {novoNivel > nivelAtual && (
                    <span className="text-amber-400 font-bold ml-2">
                      ⬆️ SUBIU DE NÍVEL!
                    </span>
                  )}
                </div>
                <div className="text-xs text-blue-400 mt-2">
                  Próximo nível: {Math.ceil(novoTotal / 10) * 10} PD 
                  (faltam {Math.ceil(novoTotal / 10) * 10 - novoTotal} PD)
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="border-primary/30 text-gray-300 hover:bg-primary/20 hover:text-primary"
            >
              Cancelar
            </Button>
            <Button 
              onClick={receberPD}
              disabled={loading || pdAmount <= 0}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              {loading ? "Salvando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
