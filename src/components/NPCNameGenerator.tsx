import { useState } from "react";
import { maleNames, femaleNames, surnames } from "@/data/names";
import { Button } from "@/components/ui/button";
import { RefreshCw, Check } from "lucide-react";
import { db, auth } from "@/components/auth/firebase-config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Planos } from "@/data/PlanosRacas";

interface NPC {
  id?: string;
  nome: string;
  idade: string;
  raca: string;
  ocupacao: string;
  personalidade: string;
  sessaoId: string;
}

interface NPCNameGeneratorProps {
  sessaoId: string;
  filtroRaca?: string[];
}

const NPCNameGenerator = ({ sessaoId, filtroRaca }: NPCNameGeneratorProps) => {
  // Criar objeto de raças a partir dos Planos
  const races = Planos.reduce((acc, plano) => {
    plano.racas.forEach((raca) => {
      acc[raca.nome] = { plano: plano.nome };
    });
    return acc;
  }, {} as { [key: string]: { plano: string } });

  const [npc, setNpc] = useState<NPC>({
    nome: "",
    idade: "Adulto",
    raca: "",
    ocupacao: "",
    personalidade: "",
    sessaoId,
  });

  const idades = ["Criança", "Jovem", "Adulto", "Idoso"];
  const personalidades = [
    "Romântico", "Desastrado", "Tímido", "Mal-humorado", "Amigável",
    "Nervoso", "Extravagante", "Agressivo", "Assustador", "Estóico",
    "Caprichoso", "Arrogante"
  ];

  const generateName = () => {
    const gender = Math.random() > 0.5 ? maleNames : femaleNames;
    const firstName = gender[Math.floor(Math.random() * gender.length)];
    const lastName = surnames[Math.floor(Math.random() * surnames.length)];
    return `${firstName} ${lastName}`;
  };

  const handleGenerate = () => {
    const occupations = Array.from(
      document.querySelectorAll('#jobs-table td')
    ).map((td) => td.textContent).filter(Boolean) as string[];
    
    const randomOccupation = occupations[Math.floor(Math.random() * occupations.length)] || "Mercador";
    const randomPersonality = personalidades[Math.floor(Math.random() * personalidades.length)];

    setNpc({
      ...npc,
      nome: generateName(),
      ocupacao: randomOccupation,
      personalidade: randomPersonality,
      raca: npc.raca || filtroRaca?.[0] || "Humano"
    });
  };

  const saveNPC = async () => {
    try {
      await addDoc(collection(db, "npcs"), {
        ...npc,
        userId: auth.currentUser?.uid,
        createdAt: serverTimestamp()
      });
      handleGenerate();
    } catch (error) {
      console.error("Erro ao salvar NPC:", error);
    }
  };

  const racasDisponiveis = filtroRaca?.length ? filtroRaca : Object.keys(races).sort();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <select
              value={npc.raca}
              onChange={(e) => setNpc({...npc, raca: e.target.value})}
              className="bg-black/50 border border-primary/30 rounded-full px-4 py-2 text-primary"
            >
              <option value="">Selecione a Raça</option>
              {racasDisponiveis.map((raca) => (
                <option key={raca} value={raca}>{raca}</option>
              ))}
            </select>

            <select
              value={npc.idade}
              onChange={(e) => setNpc({...npc, idade: e.target.value})}
              className="bg-black/50 border border-primary/30 rounded-full px-4 py-2 text-primary"
            >
              {idades.map((idade) => (
                <option key={idade} value={idade}>{idade}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleGenerate}
              className="bg-primary/20 hover:bg-primary/30 border border-primary/30"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Gerar NPC
            </Button>
            
            <Button
              onClick={saveNPC}
              className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-500 border border-emerald-500/30"
              disabled={!npc.nome}
            >
              <Check className="mr-2 h-4 w-4" />
              Salvar NPC
            </Button>
          </div>
        </div>

        <div className="bg-black/50 p-4 rounded-lg border border-white/10">
          <h3 className="text-lg font-bold text-primary mb-2">{npc.nome}</h3>
          <div className="text-sm space-y-1">
            <p><span className="text-muted-foreground">Raça:</span> {npc.raca}</p>
            <p><span className="text-muted-foreground">Idade:</span> {npc.idade}</p>
            <p><span className="text-muted-foreground">Ocupação:</span> {npc.ocupacao}</p>
            <p><span className="text-muted-foreground">Personalidade:</span> {npc.personalidade}</p>
          </div>
        </div>
      </div>

      {/* Tabela oculta de ocupações */}
      <table id="jobs-table" className="hidden">
        <tbody>
          <tr>
            <td>Guarda</td><td>Mercador</td><td>Ferreiro</td><td>Curandeiro</td>
            <td>Bardo</td><td>Ladrão</td><td>Fazendeiro</td><td>Alquimista</td>
            <td>Armeiro</td><td>Pescador</td><td>Erudito</td><td>Caçador</td>
            <td>Soldado</td><td>Artista</td><td>Sacerdote</td><td>Explorador</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default NPCNameGenerator;