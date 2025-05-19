import { useState } from "react";
import { MasterLayout } from "@/components/layout/MasterLayout";
import { Button } from "@/components/ui/button";

const diceTypes = [4, 6, 8, 10, 12, 20];

const MasterRoll = () => {
  const [lastRoll, setLastRoll] = useState<{ sides: number; result: number } | null>(null);

  const rollDie = (sides: number) => {
    const result = Math.floor(Math.random() * sides) + 1;
    setLastRoll({ sides, result });
  };

  return (
    <MasterLayout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6 text-primary">Roll de Dados</h1>
        {lastRoll && (
          <div className="mb-8 p-6 bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 text-center">
            <p className="text-lg text-muted-foreground">
              Você rolou um <span className="font-semibold text-primary">d{lastRoll.sides}</span> e tirou:
            </p>
            <p className="mt-2 text-5xl font-bold text-white">{lastRoll.result}</p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {diceTypes.map((sides) => (
            <Button
              key={sides}
              onClick={() => rollDie(sides)}
              className="w-full py-6 bg-black/20 hover:bg-primary/30 border border-white/10 rounded-xl shadow-lg flex flex-col items-center justify-center"
            >
              <span className="text-xl font-medium text-primary">d{sides}</span>
              <span className="mt-1 text-sm text-muted-foreground">Roll</span>
            </Button>
          ))}
        </div>
      </div>
    </MasterLayout>
  );
};

export default MasterRoll;
