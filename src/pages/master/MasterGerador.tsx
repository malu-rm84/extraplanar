import { MasterLayout } from "@/components/layout/MasterLayout";
import NPCNameGenerator from "@/components/NPCNameGenerator";
import { useEffect, useState } from "react";
import { db, auth } from "@/components/auth/firebase-config";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Planos } from "@/data/PlanosRacas";

const MasterGerador = () => {
  const [sessaoId] = useState("sessao-atual");
  const [npcsSalvos, setNpcsSalvos] = useState<any[]>([]);
  const [planoSelecionado, setPlanoSelecionado] = useState("");
  const [racasFiltradas, setRacasFiltradas] = useState<string[]>([]);

  // Criar objeto de raças a partir dos Planos
  const races = Planos.reduce((acc, plano) => {
    plano.racas.forEach((raca) => {
      acc[raca.nome] = { plano: plano.nome };
    });
    return acc;
  }, {} as { [key: string]: { plano: string } });

  // Extrair planos únicos
  const planos = Array.from(
    new Set(
      Object.values(races)
        .map((r) => r.plano)
        .filter(Boolean)
    )
  ) as string[];

  useEffect(() => {
    if (planoSelecionado) {
      const racasDoPlano = Object.keys(races)
        .filter((raca) => races[raca].plano === planoSelecionado)
        .sort();
      setRacasFiltradas(racasDoPlano);
    } else {
      setRacasFiltradas([]);
    }
  }, [planoSelecionado]);

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

  return (
    <MasterLayout>
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="text-center mb-12 pt-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Gerador de NPCs
          </h1>
          <p className="text-muted-foreground text-lg">
            Crie e gerencie personagens não jogadores para sua sessão
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-muted-foreground text-sm">Plano</label>
                <select
                  value={planoSelecionado}
                  onChange={(e) => setPlanoSelecionado(e.target.value)}
                  className="w-full bg-black/50 border border-primary/30 rounded-full px-4 py-2 text-primary focus:ring-0"
                >
                  <option value="">Todos os Planos</option>
                  {planos.map((plano) => (
                    <option key={plano} value={plano}>
                      {plano}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-muted-foreground text-sm">Raça</label>
                <select
                  disabled={!planoSelecionado}
                  className="w-full bg-black/50 border border-primary/30 rounded-full px-4 py-2 text-primary focus:ring-0 disabled:opacity-50"
                >
                  <option value="">Todas as Raças</option>
                  {racasFiltradas.map((raca) => (
                    <option key={raca} value={raca}>
                      {raca}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <NPCNameGenerator
              sessaoId={sessaoId}
              filtroRaca={racasFiltradas}
            />
          </div>

          <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 animate-fadeIn">
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
                    className="bg-black/50 p-4 rounded-lg border border-white/10"
                  >
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