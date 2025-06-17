
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/components/auth/firebase-config";
import { Personagem, SessionPD } from "./types";
import { useAuth } from "@/contexts/AuthContext";
import { Star } from "lucide-react";

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

  // Verificar se já recebeu PD desta sessão
  const jaRecebeuPD = personagem.pdSessoes?.some(pd => pd.sessionId === sessionId);

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

      const personagemRef = doc(db, "personagens", personagem.id);
      await updateDoc(personagemRef, {
        pdSessoes: arrayUnion(novoPD),
        dataAtualizacao: new Date()
      });

      setIsOpen(false);
      setPdAmount(1);
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

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-primary/20 hover:bg-primary/30 border border-primary/30 hover:border-primary/50 transition-all"
      >
        <Star className="w-4 h-4 mr-2" />
        Receber PD da Sessão
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
            
            <div>
              <Label htmlFor="pdAmount" className="text-gray-300">
                Quantidade de PD
              </Label>
              <Input
                id="pdAmount"
                type="number"
                min="1"
                max="10"
                value={pdAmount}
                onChange={(e) => setPdAmount(parseInt(e.target.value) || 1)}
                className="bg-black/50 border-white/10 text-gray-200 focus:border-primary/40"
              />
            </div>

            <div className="bg-amber-900/30 border border-amber-600/40 rounded-lg p-4">
              <div className="text-amber-200 font-medium">Informações do Personagem</div>
              <div className="text-sm text-amber-300/80 mt-2 space-y-1">
                <div>Nível Atual: {personagem.nivel}</div>
                <div>Total de PD: {(personagem.pdIniciais || 50) + (personagem.pdSessoes?.reduce((acc, pd) => acc + pd.pdAmount, 0) || 0)}</div>
                <div className="text-green-400">
                  Após receber: {(personagem.pdIniciais || 50) + (personagem.pdSessoes?.reduce((acc, pd) => acc + pd.pdAmount, 0) || 0) + pdAmount} PD
                  (Nível {Math.floor(((personagem.pdIniciais || 50) + (personagem.pdSessoes?.reduce((acc, pd) => acc + pd.pdAmount, 0) || 0) + pdAmount) / 10)})
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
