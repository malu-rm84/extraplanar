import { MasterLayout } from "@/components/layout/MasterLayout";
import NPCNameGenerator from "@/components/NPCNameGenerator";
import { useEffect, useState } from "react";
import { db, auth } from "@/components/auth/firebase-config";
import { collection, query, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { Planos } from "@/data/PlanosRacas";
import { SelectDropdown } from "@/utils/SelectDropdown";

const MasterGerador = () => {
  const [sessaoId] = useState("sessao-atual");
  const [npcsSalvos, setNpcsSalvos] = useState<any[]>([]);
  

  useEffect(() => {
    if (!auth.currentUser?.uid) return;

    const q = query(
      collection(db, "npcs"),
      where("sessaoId", "==", sessaoId),
      where("userId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const npcs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNpcsSalvos(npcs);
    });

    return () => unsubscribe();
  }, [sessaoId]);

  const handleDeleteNPC = async (npcId: string) => {
    try {
      await deleteDoc(doc(db, "npcs", npcId));
    } catch (error) {
      console.error("Erro ao excluir NPC:", error);
    }
  };

  return (
    <MasterLayout>
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {/* Cabeçalho ajustado */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pt-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Gerador de NPC
            </h1>
            <p className="text-muted-foreground text-lg">
              Crie e gerencie personagens não jogadores para sua sessão
            </p>
          </div>
        </div>
      

        <div className="max-w-6xl mx-auto px-4 pb-16">
          <NPCNameGenerator
            sessaoId={sessaoId}
          />

          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 animate-fadeIn mt-8">
            <h2 className="text-xl font-bold mb-4 text-primary">
              NPCs Gerados
            </h2>
            {npcsSalvos.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">
                Nenhum NPC criado nesta sessão
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {npcsSalvos.map((npc) => (
                  <div
                    key={npc.id}
                    className="bg-black/50 p-4 rounded-lg border border-white/10 relative group"
                  >
                    <button
                      onClick={() => handleDeleteNPC(npc.id)}
                      className="absolute -top-2 -right-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 p-1.5 rounded-full border border-red-500/30 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <h3 className="text-lg font-bold text-primary">
                      {npc.nome}
                    </h3>
                    <div className="text-sm space-y-1 mt-2">
                      <p>
                        <span className="text-muted-foreground">Raça:</span>{" "}
                        {npc.raca}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Idade:</span>{" "}
                        {npc.idade}
                      </p>
                      <p>
                        <span className="text-muted-foreground">
                          Ocupação:
                        </span>{" "}
                        {npc.ocupacao}
                      </p>
                      <p>
                        <span className="text-muted-foreground">
                          Personalidade:
                        </span>{" "}
                        {npc.personalidade}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};

export default MasterGerador;