// RollPage.tsx
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DieType = 'D4' | 'D6' | 'D8' | 'D10' | 'D12' | 'D20' | 'D100';

interface Die {
  id: string;
  type: DieType;
  value: number;
  rolling: boolean;
}

interface RollHistoryEntry {
  dice: Array<{ type: DieType; value: number }>;
  total: number;
  timestamp: Date;
}

export default function RollPage() {
  const [dice, setDice] = useState<Die[]>([]);
  const [total, setTotal] = useState(0);
  const [isRollingAll, setIsRollingAll] = useState(false);
  const [history, setHistory] = useState<RollHistoryEntry[]>([]);
  const [bonus, setBonus] = useState(0);

  const addDie = (type: DieType) => {
    setDice(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        type,
        value: 0,
        rolling: false
      }
    ]);
  };

  const removeDie = (id: string) => {
    setDice(prev => prev.filter(die => die.id !== id));
  };

  const rollAll = () => {
    if (isRollingAll) return;
    setIsRollingAll(true);

    setDice(prev => prev.map(die => ({ ...die, rolling: true })));

    setTimeout(() => {
      setDice(prev => {
        const newDice = prev.map(die => {
          const dieNumber = parseInt(die.type.replace(/D/gi, ''), 10) || 20;
          const max = Math.max(1, dieNumber);
          
          return {
            ...die,
            value: Math.floor(Math.random() * max) + 1,
            rolling: false
          };
        });
        
        const validBonus = Number.isNaN(bonus) ? 0 : bonus;
        const newTotal = newDice.reduce((sum, d) => sum + (d.value || 0), 0) + validBonus;
        
        setHistory(prevHistory => [
          { 
            dice: newDice.map(({ type, value }) => ({ 
              type, 
              value: value || 0
            })), 
            total: newTotal,
            timestamp: new Date() 
          },
          ...prevHistory
        ]);
        
        return newDice;
      });
      setIsRollingAll(false);
    }, 1000);
  };

  useEffect(() => {
    const validBonus = Number.isNaN(bonus) ? 0 : bonus;
    const sum = dice.reduce((acc, die) => acc + (die.value || 0), 0);
    setTotal(sum + validBonus);
  }, [dice, bonus]);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
        Rolagem de Dados
      </h1>

      {/* Dice Selector */}
      <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
        {(['D4', 'D6', 'D8', 'D10', 'D12', 'D20', 'D100'] as DieType[]).map((type) => (
          <button
            key={type}
            onClick={() => addDie(type)}
            className="relative flex items-center justify-center p-2 hover:scale-105 transition-transform group"
          >
            <img 
              src={`${import.meta.env.BASE_URL}dices/D${type.slice(1)}.png`}
              alt={type}
              className="h-24 w-24 filter drop-shadow-dice transition-transform hover:scale-110"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-black mix-blend-hard-light">
                {type.slice(1)}
              </span>
            </div>
            <Plus className="h-6 w-6 text-primary absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>

      {/* Dice Pool */}
      <div className="min-h-[300px]">
        <div className="p-6 rounded-xl bg-white/20 backdrop-blur-sm h-48 flex items-center justify-center">
          <div className="flex flex-wrap gap-6 justify-center items-center">
            {dice.map((die) => (
              <div 
                key={die.id} 
                onClick={() => removeDie(die.id)}
                className={cn(
                  "relative flex items-center justify-center cursor-pointer",
                  die.rolling && 'animate-dice-roll'
                )}
              >
                <img 
                  src={`${import.meta.env.BASE_URL}dices/D${die.type.slice(1)}.png`}
                  alt={die.type} 
                  className="h-24 w-24 filter drop-shadow-dice transition-transform hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-black mix-blend-hard-light">
                    {die.rolling ? '' : (die.value || '')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="space-y-2">
            <p className="text-muted-foreground">Bônus</p>
            <input
              type="number"
              value={bonus}
              onChange={(e) => {
                const value = Number(e.target.value);
                setBonus(Number.isNaN(value) ? 0 : value);
              }}
              className="w-24 px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-primary"
            />
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground">Total</p>
            <div className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              {total}
            </div>
          </div>
        </div>

        <Button
          onClick={rollAll}
          disabled={isRollingAll || dice.length === 0}
          size="lg"
          className="w-full md:w-auto bg-primary/20 hover:bg-primary/30 border border-primary/30 hover:border-primary/50 transition-all shadow-glow hover:shadow-glow-lg"
        >
          {isRollingAll ? "Rolando..." : "Rolar Todos"}
        </Button>
      </div>

      {/* Roll History */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-primary">Histórico</h2>
        <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
          {history.map((entry, index) => (
            <div 
              key={index} 
              className="p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">
                  {entry.timestamp.toLocaleTimeString()}
                </span>
                <span className="text-lg font-bold text-primary">
                  {entry.total}
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {entry.dice.map((die, dieIndex) => (
                  <div key={dieIndex} className="relative h-12 w-12">
                    <img 
                      src={`${import.meta.env.BASE_URL}dices/D${die.type.slice(1)}.png`} 
                      alt={die.type} 
                      className="h-full w-full filter drop-shadow-dice"
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-black">
                      {die.value || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}