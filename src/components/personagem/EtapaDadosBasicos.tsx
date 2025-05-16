import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Planos, MAPEAMENTO_ATRIBUTOS } from "@/data/PlanosRacas";
import { FaixasEtarias } from "@/data/FaixaEtaria";
import { linguas } from "@/data/Linguas";
import { Lingua } from "@/data/Linguas";

interface EtapaDadosBasicosProps {
  personagem: any;
  setPersonagem: (personagem: any) => void;
}

const EtapaDadosBasicos = ({ personagem, setPersonagem }: EtapaDadosBasicosProps) => {
  const racasDoPlanoSelecionado = Planos.find(p => p.nome.toLowerCase() === personagem.plano?.toLowerCase())?.racas || [];
  
  const handleSelecionarRaca = (racaNome: string) => {
    const racaSelecionada = racasDoPlanoSelecionado.find(r => r.nome === racaNome);
    const novosAtributos = { ...personagem.atributos };

    // Resetar bônus
    Object.keys(novosAtributos).forEach((atributo) => {
      novosAtributos[atributo as keyof typeof novosAtributos].racial = 0;
    });

    // Aplicar bônus usando chave normalizada
    if (racaSelecionada?.atributo && racaSelecionada.atributo !== 'nenhum') {
      const atributoKey = racaSelecionada.atributo
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") as keyof typeof novosAtributos;

      if (novosAtributos[atributoKey]) {
        novosAtributos[atributoKey].racial = 1;
      }
    }

    const linguaMaterna = linguas
      .flatMap(c => c.linguas)
      .find(l => l.nome === racaSelecionada?.linguaMaterna);

    setPersonagem({
      ...personagem,
      raca: racaNome,
      habilidadeRacial: racaSelecionada?.habilidade || '',
      linguaMaterna: linguaMaterna || {} as Lingua, // Definir a língua materna
      atributos: novosAtributos
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary mb-6">Dados Básicos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <Label className="text-gray-300">Nome do Personagem</Label>
            <Input
              value={personagem.nome}
              onChange={(e) => setPersonagem({...personagem, nome: e.target.value})}
              className="mt-2 bg-white/10 border-none text-gray-200"
              placeholder="Nome do seu personagem"
            />
          </div>

          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <Label className="text-gray-300">Plano de Origem</Label>
            <select
              value={personagem.plano}
              onChange={(e) => setPersonagem({
                ...personagem, 
                plano: e.target.value,
                raca: '',
                habilidadeRacial: ''
              })}
              className="w-full mt-2 bg-white/10 rounded-md p-2 text-gray-200 border-none"
            >
              <option value="">Selecione um plano</option>
              {Planos.map((plano) => (
                <option key={plano.nome} value={plano.nome.toLowerCase()}>
                  {plano.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <Label className="text-gray-300">Faixa Etária</Label>
            <select
              value={personagem.faixaEtaria}
              onChange={(e) => {
                const newFaixa = e.target.value;
                const faixa = FaixasEtarias.find(f => f.nome === newFaixa);
                
                setPersonagem(prev => {
                  let newOcupacoes = prev.ocupacoesSelecionadas || [];
                  
                  if (faixa) {
                    // Determinar nível máximo permitido
                    let maxLevel = 3;
                    if (faixa.nome === "Criança") maxLevel = 0;
                    else if (faixa.nome === "Adolescente") maxLevel = 2;
                    else if (faixa.bonus.includes("Aumenta um nível")) maxLevel = 2;
                    else if (faixa.bonus.includes("Ganha dois níveis")) maxLevel = 1;

                    // Filtrar ocupações inválidas
                    newOcupacoes = newOcupacoes.filter(o => o.nivel <= maxLevel);
                    if (maxLevel === 0) newOcupacoes = [];
                  }

                  return {
                    ...prev,
                    faixaEtaria: newFaixa,
                    ocupacoesSelecionadas: newOcupacoes
                  };
                });
              }}
              className="w-full mt-2 bg-white/10 rounded-md p-2 text-gray-200 border-none"
            >
              <option value="">Selecione uma faixa etária</option>
              {FaixasEtarias.map((faixa) => (
                <option key={faixa.nome} value={faixa.nome}>
                  {faixa.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <Label className="text-gray-300">Raça</Label>
            <select
              value={personagem.raca}
              onChange={(e) => handleSelecionarRaca(e.target.value)}
              className="w-full mt-2 bg-white/10 rounded-md p-2 text-gray-200 border-none"
              disabled={!personagem.plano}
            >
              <option value="">Selecione primeiro um plano</option>
              {racasDoPlanoSelecionado.map((raca) => {
                const atributoKey = raca.atributo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                const atributoDisplay = MAPEAMENTO_ATRIBUTOS[raca.atributo]?.nome || '';

                return (
                  <option key={raca.nome} value={raca.nome}>
                    {raca.nome}
                    {atributoDisplay && ` (+1 ${atributoDisplay})`}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <Label className="text-gray-300">Habilidade da Raça</Label>
            <div className="mt-2 p-2 bg-white/10 rounded-md text-gray-300 min-h-[40px]">
              {personagem.habilidadeRacial || "Nenhuma habilidade especial"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EtapaDadosBasicos;
