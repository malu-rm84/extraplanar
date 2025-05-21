import { useState, useEffect } from "react";
import { MasterLayout } from "@/components/layout/MasterLayout";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

// Interface para os tipos de dados
interface DiceType {
  sides: number;
  shape: string;
  color: string;
}

const diceTypes: DiceType[] = [
  { sides: 4, shape: "polygon", color: "from-emerald-500 to-cyan-500" },
  { sides: 6, shape: "square", color: "from-blue-500 to-indigo-500" },
  { sides: 8, shape: "octagon", color: "from-violet-500 to-purple-500" },
  { sides: 10, shape: "pentagon", color: "from-fuchsia-500 to-pink-500" },
  { sides: 12, shape: "dodecagon", color: "from-rose-500 to-red-500" },
  { sides: 20, shape: "star", color: "from-amber-500 to-yellow-500" }, // Alterado
  { sides: 100, shape: "circle", color: "from-orange-500 to-amber-500" } // Novo
];

const MasterRoll = () => {
  const [lastRoll, setLastRoll] = useState<{ sides: number; result: number; color: string } | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [rollHistory, setRollHistory] = useState<Array<{ sides: number; result: number; timestamp: Date }>>([]);

  const rollDie = (sides: number, color: string) => {
    setIsRolling(true);
    
    // Array para armazenar números aleatórios durante a animação
    const animationResults: number[] = [];
    
    // Gerar alguns números aleatórios para a animação
    for (let i = 0; i < 10; i++) {
      animationResults.push(Math.floor(Math.random() * sides) + 1);
    }
    
    // Final result
    const finalResult = Math.floor(Math.random() * sides) + 1;
    
    // Simulando a animação com setTimeout
    let counter = 0;
    const animationSpeed = 50; // ms
    
    const animationInterval = setInterval(() => {
      setLastRoll({ sides, result: animationResults[counter % animationResults.length], color });
      counter++;
      
      if (counter >= 10) {
        clearInterval(animationInterval);
        setLastRoll({ sides, result: finalResult, color });
        setIsRolling(false);
        
        // Adicionar ao histórico
        setRollHistory(prev => [{
          sides,
          result: finalResult,
          timestamp: new Date()
        }, ...prev.slice(0, 9)]); // Manter apenas os 10 últimos resultados
      }
    }, animationSpeed);
  };

  // Componente para o dado
 const DiceShape = ({ sides, shape, color }: DiceType) => {
  let shapeClass = "";
  
  switch (shape) {
    case "polygon":
      shapeClass = "clip-path-triangle";
      break;
    case "square":
      shapeClass = "rounded-lg";
      break;
    case "octagon":
      shapeClass = "clip-path-octagon";
      break;
    case "pentagon":
      shapeClass = "clip-path-pentagon";
      break;
    case "dodecagon":
      shapeClass = "clip-path-dodecagon";
      break;
    case "star": // Novo caso
      shapeClass = "clip-path-complex";
      break;
    case "circle":
      shapeClass = "rounded-full";
      break;
    default:
      shapeClass = "rounded-lg";
  }

    return (
      <div 
        className={`w-24 h-24 flex items-center justify-center bg-gradient-to-br ${color} ${shapeClass} shadow-glow transition-transform duration-300 hover:scale-105`}
      >
        <div className="text-3xl font-bold text-white flex items-center justify-center">
          {sides}
        </div>
      </div>
    );
  };

  return (
    <MasterLayout>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent flex items-center justify-center gap-3">
            Rolagem de Dados
          </h1>
          <p className="text-muted-foreground text-lg">
            Teste a sorte com uma rolagem aleatória de dados
          </p>
        </div>

        {/* Área de rolagem atual */}
        <div className={`mb-12 p-8 bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 text-center relative overflow-hidden transition-all duration-500 ${isRolling ? 'shadow-glow-xl' : ''}`}>
          {lastRoll ? (
            <>
              <div className={`absolute inset-0 bg-gradient-to-br ${lastRoll.color} opacity-10`}></div>
              <p className="text-lg text-muted-foreground relative z-10">
                Você rolou um <span className="font-semibold text-primary">d{lastRoll.sides}</span> e obteve:
              </p>
              <div className={`mt-4 text-8xl font-bold bg-gradient-to-br ${lastRoll.color} bg-clip-text text-transparent transition-all duration-300 ${isRolling ? 'scale-110' : ''}`}>
                {lastRoll.result}
              </div>
              <div className={`absolute inset-0 border border-primary/30 rounded-xl transition-opacity duration-300 ${isRolling ? 'opacity-100' : 'opacity-0'}`}></div>
              <div className={`mt-4 flex justify-center gap-2 transition-opacity duration-300 ${isRolling ? 'opacity-0' : 'opacity-100'}`}>
                <Button 
                  onClick={() => rollDie(lastRoll.sides, lastRoll.color)}
                  className="bg-black/40 hover:bg-primary/30 border border-white/10"
                >
                  Rolar Novamente
                </Button>
              </div>
            </>
          ) : (
            <p className="text-xl text-muted-foreground py-16">
              Selecione um dado abaixo para começar a rolar
            </p>
          )}
        </div>

        {/* Grid de dados disponíveis */}
        <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-primary text-center">Escolha seu Dado</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 justify-items-center">
            {diceTypes.map((dice) => (
              <div key={dice.sides} className="flex flex-col items-center gap-3">
                <button
                  onClick={() => rollDie(dice.sides, dice.color)}
                  className="transform transition hover:scale-110 hover:rotate-6 focus:outline-none"
                  disabled={isRolling}
                >
                  <DiceShape sides={dice.sides} shape={dice.shape} color={dice.color} />
                </button>
                <span className="text-muted-foreground font-medium">D{dice.sides}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Histórico de rolagens */}
        {rollHistory.length > 0 && (
          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-bold mb-4 text-primary">Histórico de Rolagens</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {rollHistory.map((roll, index) => (
                <div 
                  key={index} 
                  className="bg-black/40 p-3 rounded-lg border border-white/10 flex items-center justify-between"
                >
                  <span className="text-sm text-muted-foreground">D{roll.sides}</span>
                  <span className="text-2xl font-bold text-primary">{roll.result}</span>
                  <span className="text-xs text-muted-foreground">
                    {roll.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CSS específico para as formas dos dados */}
      <style>{`
        .shadow-glow {
          box-shadow: 0 0 15px rgba(124, 58, 237, 0.5);
        }
        
        .shadow-glow-xl {
          box-shadow: 0 0 30px rgba(124, 58, 237, 0.7);
        }
        
        .clip-path-triangle {
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }
        
        .clip-path-octagon {
          clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
        }
        
        .clip-path-pentagon {
          clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
        }
        
        .clip-path-dodecagon {
          clip-path: polygon(
            25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%
          );
        }

        .clip-path-complex {
          clip-path: polygon(
            20% 0%, 80% 0%, 
            100% 20%, 100% 80%, 
            80% 100%, 20% 100%, 
            0% 80%, 0% 20%, 
            20% 0%, 50% 15%,
            80% 0%, 100% 20%,
            85% 50%, 100% 80%,
            80% 100%, 50% 85%,
            20% 100%, 0% 80%,
            15% 50%, 0% 20%
          );
        }
      `}</style>
    </MasterLayout>
  );
};

export default MasterRoll;