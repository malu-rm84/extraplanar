// SessionPage.tsx
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/components/auth/firebase-config";
import { Button } from "@/components/ui/button";
import { Timer, Save } from "lucide-react";
import RollPage from "../RollPage";

export interface Session {
  id: string;
  campaignId: string;
  scheduledDate: Date;
  startTime?: Date;
  endTime?: Date;
  duration: number;
  diceRolls: number;
  xpAwarded: number;
  notes: string;
  status: 'agendada' | 'em-andamento' | 'concluída';
  mestreId: string;
}

interface SessionPageProps {
  sessionId: string;
  onClose: () => void;
}

const SessionPage = ({ sessionId, onClose }: SessionPageProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [rollCount, setRollCount] = useState(0);

  useEffect(() => {
    const loadSession = async () => {
      const docRef = doc(db, "sessions", sessionId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSession({
          id: docSnap.id,
          campaignId: data.campaignId,
          scheduledDate: data.scheduledDate.toDate(),
          startTime: data.startTime?.toDate(),
          endTime: data.endTime?.toDate(),
          duration: data.duration,
          diceRolls: data.diceRolls,
          xpAwarded: data.xpAwarded,
          notes: data.notes,
          status: data.status,
          mestreId: data.mestreId
        });
        
        if (data.status === 'em-andamento') {
          setIsActive(true);
          const elapsed = Math.floor((Date.now() - data.startTime.toDate().getTime()) / 1000);
          setTimer(elapsed);
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
      diceRolls: rollCount
    });
    setIsActive(false);
    onClose();
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

  const awardXP = async (amount: number) => {
    await updateDoc(doc(db, "sessions", sessionId), {
      xpAwarded: arrayUnion(amount)
    });
  };

  if (!session) return <div className="text-center p-8">Carregando sessão...</div>;

  return (
    <div className="p-6 space-y-8 h-full overflow-y-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sessão {sessionId.slice(0, 5)}</h1>
        <Button 
          variant="ghost" 
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          Fechar
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2 bg-black/30 p-4 rounded-lg">
            <Timer className="text-primary" />
            <span className="text-xl font-mono">
              {Math.floor(timer / 3600).toString().padStart(2, '0')}:
              {Math.floor((timer % 3600) / 60).toString().padStart(2, '0')}:
              {(timer % 60).toString().padStart(2, '0')}
            </span>
          </div>
          {!isActive && <Button onClick={startSession}>Iniciar Sessão</Button>}
          {isActive && <Button variant="destructive" onClick={stopSession}>Encerrar Sessão</Button>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black/30 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Controles</h3>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="PD para distribuir"
                className="bg-black/50 p-2 rounded flex-1 text-white"
                onChange={(e) => awardXP(Number(e.target.value))}
              />
              <Button variant="outline">
                <Save className="mr-2" />
                Salvar PD
              </Button>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <RollPage onRoll={handleRoll} />
        </div>
      </div>
    </div>
  );
};

export default SessionPage;