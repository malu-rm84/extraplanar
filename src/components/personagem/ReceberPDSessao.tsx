
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { doc, updateDoc, arrayUnion, collection, query, where, getDocs, writeBatch } from "firebase/firestore";
import { db } from "@/components/auth/firebase-config";
import { Personagem, SessionPD, DistributedPD, calcularNivelPorPD, calcularTotalPDRecebidos, calcularPP, calcularPV, calcularPE } from "./types";
import { useAuth } from "@/contexts/AuthContext";
import { Star, Gift, TrendingUp } from "lucide-react";

interface ReceberPDSessaoProps {
  personagem: Personagem;
  sessionId: string;
  sessionName: string;
  onPDReceived: () => void;
}

const convertToDate = (dateObj: Date | { toDate: () => Date } | undefined): Date | null => {
  if (!dateObj) return null;
  if (dateObj instanceof Date) {
    return dateObj;
  }
  if (typeof dateObj.toDate === 'function') {
    return dateObj.toDate();
  }
  return null;
};

export const ReceberPDSessao = ({ 
  personagem, 
  sessionId, 
  sessionName, 
  onPDReceived 
}: ReceberPDSessaoProps) => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
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
    } catch (error) {
      console.error("Erro ao buscar PDs distribuídos:", error);
    } finally {
      setLoadingDistributed(false);
    }
  };

  useEffect(() => {
    if (!jaRecebeuPD) {
      buscarPDsDistribuidos();
    }
  }, [sessionId, personagem.id]);

  const receberPDsDistribuidos = async () => {
    if (!personagem.id || !currentUser || distributedPDs.length === 0) return;
    setLoading(true);
    try {
      const batch = writeBatch(db);
      const personagemRef = doc(db, "personagens", personagem.id);
      
      // 1. Calcular total de PDs distribuídos
      const totalDistribuido = distributedPDs.reduce((acc, pd) => acc + pd.pdAmount, 0);
      
      // 2. Criar um único SessionPD com o total dos PDs distribuídos
      const novoPD: SessionPD = {
        sessionId: sessionId,
        sessionName: sessionName,
        pdAmount: totalDistribuido,
        dateReceived: new Date(),
        masterId: distributedPDs[0].masterId
      };
      
      // 3. Calcular novo total de PDs e nível
      const totalAtual = calcularTotalPDRecebidos(personagem);
      const novoTotal = totalAtual + totalDistribuido;
      const novoNivel = calcularNivelPorPD(novoTotal);
      
      // 4. Somar PDs ao pdDisponivel atual
      const novoPdDisponivel = (personagem.pdDisponivel || 0) + totalDistribuido;
      
      // 5. Calcular atributos fundamentais com o novo nível
      const personagemAtualizado = { ...personagem, nivel: novoNivel, pdDisponivel: novoPdDisponivel };
      const pp = calcularPP(personagemAtualizado);
      const pv = calcularPV(personagemAtualizado);
      const pe = calcularPE(personagemAtualizado);
      
      // 6. Atualizar o personagem com os novos dados
      batch.update(personagemRef, {
        pdSessoes: arrayUnion(novoPD),
        nivel: novoNivel,
        pdDisponivel: novoPdDisponivel,
        pp,
        pv,
        pe,
        dataAtualizacao: new Date()
      });
      
      // 7. Marcar cada PD distribuído como reclamado
      for (const distributedPD of distributedPDs) {
        if ((distributedPD as any).id) {
          const distributedRef = doc(db, "distributedPDs", (distributedPD as any).id);
          batch.update(distributedRef, { claimed: true });
        }
      }
      
      await batch.commit();
      setIsOpen(false);
      setDistributedPDs([]);
      onPDReceived();
    } catch (error) {
      console.error("Erro ao receber PDs:", error);
      alert("Erro ao receber PDs!");
    } finally {
      setLoading(false);
    }
  };

  // Se não há PDs distribuídos disponíveis, não mostrar o botão
  if (distributedPDs.length === 0 && !loadingDistributed) {
    return null;
  }

  const totalDistribuido = distributedPDs.reduce((acc, pd) => acc + pd.pdAmount, 0);
  const totalAtual = calcularTotalPDRecebidos(personagem);
  const nivelAtual = calcularNivelPorPD(totalAtual);
  const novoTotal = totalAtual + totalDistribuido;
  const novoNivel = calcularNivelPorPD(novoTotal);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 hover:border-amber-500/50 transition-all relative text-amber-200"
        disabled={loadingDistributed || distributedPDs.length === 0}
      >
        <Gift className="w-4 h-4 mr-2" />
        {loadingDistributed ? "Verificando..." : `Receber ${totalDistribuido} PDs`}
        {totalDistribuido > 0 && (
          <div className="absolute -top-1 -right-1 bg-amber-500 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {totalDistribuido}
          </div>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-black/90 border-gray-700 backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle className="text-white text-xl flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-400" />
              Receber PDs da Sessão
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              O mestre distribuiu PDs para: {personagem.nome}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <div className="text-gray-300 font-medium mb-1">Sessão</div>
              <div className="text-primary font-medium">{sessionName}</div>
            </div>

            {/* PDs Distribuídos pelo Mestre */}
            <div className="bg-amber-900/30 border border-amber-600/40 rounded-lg p-4">
              <div className="text-amber-200 font-medium flex items-center gap-2 mb-3">
                <Gift className="w-4 h-4" />
                PDs Distribuídos pelo Mestre
              </div>
              <div className="space-y-2">
                {distributedPDs.map((pd, index) => {
                  const dateDistributed = convertToDate(pd.dateDistributed);
                  
                  return (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-amber-300/80">
                        {dateDistributed ? dateDistributed.toLocaleDateString() : 'Data inválida'}
                      </span>
                      <span className="text-amber-200 font-medium">
                        +{pd.pdAmount} PD
                      </span>
                    </div>
                  );
                })}
                <div className="border-t border-amber-600/30 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-200 font-bold">Total:</span>
                    <span className="text-amber-200 font-bold text-lg">
                      +{totalDistribuido} PD
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progressão do Personagem */}
            <div className="bg-blue-900/30 border border-blue-600/40 rounded-lg p-4">
              <div className="text-blue-200 font-medium flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4" />
                Progressão do Personagem
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-300/80">Nível Atual:</span>
                  <span className="text-blue-200">Nível {nivelAtual} ({totalAtual} PD)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-300/80">PD Disponível Atual:</span>
                  <span className="text-blue-200">{personagem.pdDisponivel || 0} PD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-400">Após receber:</span>
                  <span className="text-green-400 font-medium">
                    Nível {novoNivel} ({novoTotal} PD total)
                    {novoNivel > nivelAtual && (
                      <span className="text-amber-400 font-bold ml-2">
                        ⬆️ SUBIU DE NÍVEL!
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-400">PD Disponível:</span>
                  <span className="text-green-400 font-medium">
                    {(personagem.pdDisponivel || 0) + totalDistribuido} PD
                  </span>
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
              onClick={receberPDsDistribuidos}
              disabled={loading || distributedPDs.length === 0}
              className="bg-amber-600 hover:bg-amber-600/90 text-white"
            >
              {loading ? "Recebendo..." : `Receber ${totalDistribuido} PDs`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
