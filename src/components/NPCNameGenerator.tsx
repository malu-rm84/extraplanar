import { useState, useEffect } from "react";
import { maleNames, femaleNames, surnames } from "@/data/names";
import { Button } from "@/components/ui/button";
import { RefreshCw, Check } from "lucide-react";
import { db, auth } from "@/components/auth/firebase-config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Planos } from "@/data/PlanosRacas";
import { FaixasEtarias } from "@/data/FaixaEtaria";
import { ocupacoes } from "@/data/Ocupacoes";
import { SelectDropdown } from "@/utils/SelectDropdown";

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
  const [randomSettings, setRandomSettings] = useState({
    race: true,
    age: true,
    occupation: true,
    personality: true,
    gender: true,
    name: true,
    plane: true
  });

  const [selectedGender, setSelectedGender] = useState<"male" | "female" | "any">("any");
  const [manualName, setManualName] = useState("");
  const [planoSelecionado, setPlanoSelecionado] = useState("");
  const [racasDisponiveis, setRacasDisponiveis] = useState<string[]>([]);
  
  const [npc, setNpc] = useState<NPC>({
    nome: "",
    idade: "Adulto",
    raca: "",
    ocupacao: "",
    personalidade: "",
    sessaoId,
  });

  const idades = FaixasEtarias.map(faixa => faixa.nome);
  const personalidades = [
    "Romântico", "Desastrado", "Tímido", "Mal-humorado", "Amigável",
    "Nervoso", "Extravagante", "Agressivo", "Assustador", "Estóico",
    "Caprichoso", "Arrogante"
  ];

  const todasOcupacoes = ocupacoes.flatMap(cat => cat.ocupacoes.map(o => o.nome));
  
  const planos = Array.from(new Set(Planos.map(p => p.nome)));
  

  useEffect(() => {
    if (planoSelecionado) {
      // Filtra raças APENAS do plano selecionado
      const plano = Planos.find(p => p.nome === planoSelecionado);
      setRacasDisponiveis(plano?.racas.map(r => r.nome) || []);
    } else {
      // Mostra todas as raças de todos os planos (sem duplicatas)
      const todasRacasUnicas = [...new Set(Planos.flatMap(p => p.racas.map(r => r.nome)))];
      setRacasDisponiveis(todasRacasUnicas.sort());
    }
  }, [planoSelecionado]);

  const generateName = (gender: "male" | "female" | "any") => {
    let selectedGender = gender;
    if (gender === "any") selectedGender = Math.random() > 0.5 ? "male" : "female";
    const nameList = selectedGender === "male" ? maleNames : femaleNames;
    const firstName = nameList[Math.floor(Math.random() * nameList.length)];
    const lastName = surnames[Math.floor(Math.random() * surnames.length)];
    return `${firstName} ${lastName}`;
  };

  const handleGenerate = () => {
    const newNPC = {
      ...npc,
      nome: randomSettings.name ? generateName(selectedGender) : manualName,
      raca: randomSettings.race ? 
        (filtroRaca?.[Math.floor(Math.random() * filtroRaca.length)] ||
        (racasDisponiveis[Math.floor(Math.random() * racasDisponiveis.length)] || "Humano")
      ) : 
      npc.raca,
      idade: randomSettings.age ? 
        idades[Math.floor(Math.random() * idades.length)] : 
        npc.idade,
      ocupacao: randomSettings.occupation ?
        todasOcupacoes[Math.floor(Math.random() * todasOcupacoes.length)] || "Mercador" :
        npc.ocupacao,
      personalidade: randomSettings.personality ?
        personalidades[Math.floor(Math.random() * personalidades.length)] :
        npc.personalidade
    };

    setNpc(newNPC);
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Gênero</label>
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={randomSettings.gender}
                  onChange={(e) => setRandomSettings({...randomSettings, gender: e.target.checked})}
                  className="accent-primary w-4 h-4"
                />
                <SelectDropdown
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value as any)}
                  disabled={randomSettings.gender}
                  className="h-10"
                >
                  <option value="any">Qualquer</option>
                  <option value="male">Masculino</option>
                  <option value="female">Feminino</option>
                </SelectDropdown>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Nome</label>
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={randomSettings.name}
                  onChange={(e) => setRandomSettings({...randomSettings, name: e.target.checked})}
                  className="accent-primary w-4 h-4"
                />
                <input
                  type="text"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  disabled={randomSettings.name}
                  placeholder="Digite o nome"
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-primary placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Plano</label>
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={randomSettings.plane}
                  onChange={(e) => setRandomSettings({...randomSettings, plane: e.target.checked})}
                  className="accent-primary w-4 h-4"
                />
                <SelectDropdown
                  value={planoSelecionado}
                  onChange={(e) => setPlanoSelecionado(e.target.value)}
                  disabled={randomSettings.plane}
                  className="h-10"
                >
                  <option value="">Todos os Planos</option>
                  {planos.map((plano) => (
                    <option key={plano} value={plano}>{plano}</option>
                  ))}
                </SelectDropdown>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Raça</label>
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={randomSettings.race}
                  onChange={(e) => setRandomSettings({...randomSettings, race: e.target.checked})}
                  className="accent-primary w-4 h-4"
                />
                <SelectDropdown
                  value={npc.raca}
                  onChange={(e) => setNpc({...npc, raca: e.target.value})}
                  disabled={randomSettings.race}
                  className="h-10"
                >
                  <option value="">Selecione Raça</option>
                  {racasDisponiveis.map((raca) => (
                    <option key={raca} value={raca}>{raca}</option>
                  ))}
                </SelectDropdown>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Idade</label>
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={randomSettings.age}
                  onChange={(e) => setRandomSettings({...randomSettings, age: e.target.checked})}
                  className="accent-primary w-4 h-4"
                />
                <SelectDropdown
                  value={npc.idade}
                  onChange={(e) => setNpc({...npc, idade: e.target.value})}
                  disabled={randomSettings.age}
                  className="h-10"
                >
                  <option value="">Selecione Idade</option>
                  {idades.map((idade) => (
                    <option key={idade} value={idade}>{idade}</option>
                  ))}
                </SelectDropdown>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Ocupação</label>
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={randomSettings.occupation}
                  onChange={(e) => setRandomSettings({...randomSettings, occupation: e.target.checked})}
                  className="accent-primary w-4 h-4"
                />
                <SelectDropdown
                  value={npc.ocupacao}
                  onChange={(e) => setNpc({...npc, ocupacao: e.target.value})}
                  disabled={randomSettings.occupation}
                  className="h-10"
                >
                  <option value="">Selecione Ocupação</option>
                  {todasOcupacoes.map((ocup) => (
                    <option key={ocup} value={ocup}>{ocup}</option>
                  ))}
                </SelectDropdown>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Personalidade</label>
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={randomSettings.personality}
                  onChange={(e) => setRandomSettings({...randomSettings, personality: e.target.checked})}
                  className="accent-primary w-4 h-4"
                />
                <SelectDropdown
                  value={npc.personalidade}
                  onChange={(e) => setNpc({...npc, personalidade: e.target.value})}
                  disabled={randomSettings.personality}
                  className="h-10"
                >
                  <option value="">Selecione Personalidade</option>
                  {personalidades.map((pers) => (
                    <option key={pers} value={pers}>{pers}</option>
                  ))}
                </SelectDropdown>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <Button
              onClick={handleGenerate}
              className="bg-primary/20 hover:bg-primary/30 border border-primary/30 px-6"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Gerar NPC
            </Button>
            
            <Button
              onClick={saveNPC}
              className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-500 border border-emerald-500/30 px-6"
              disabled={!npc.nome}
            >
              <Check className="mr-2 h-4 w-4" />
              Salvar NPC
            </Button>
          </div>
        </div>

        <div className="bg-black/50 p-6 rounded-xl border border-white/10 h-fit sticky top-6">
          <h3 className="text-xl font-semibold text-primary mb-4">Pré-visualização</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground min-w-[100px]">Nome:</span>
              <span className="text-primary font-medium">{npc.nome || "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground min-w-[100px]">Raça:</span>
              <span className="text-primary">{npc.raca || "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground min-w-[100px]">Idade:</span>
              <span className="text-primary">{npc.idade || "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground min-w-[100px]">Ocupação:</span>
              <span className="text-primary">{npc.ocupacao || "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground min-w-[100px]">Personalidade:</span>
              <span className="text-primary">{npc.personalidade || "-"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NPCNameGenerator;