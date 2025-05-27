import { Personagem } from "./types";
import { FaixasEtarias } from "@/data/FaixaEtaria";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EtapaPontosFundamentaisProps {
  personagem: Personagem;
  setPersonagem: (personagem: Personagem) => void;
  calcularTotalPD: (personagem: Personagem) => number;
}

const calcularPP = (personagem: Personagem) => {
  const vigorTotal = personagem.atributos.vigor.base + personagem.atributos.vigor.racial;
  return 10 + vigorTotal + (personagem.ppComprados || 0);
};

const calcularPV = (personagem: Personagem) => {
  const vigorTotal = personagem.atributos.vigor.base + personagem.atributos.vigor.racial;
  const faixa = FaixasEtarias.find(f => f.nome === personagem.faixaEtaria);
  return 10 + vigorTotal + (faixa?.bonusPV || 0);
};

const calcularPE = (personagem: Personagem) => {
  const vigorTotal = personagem.atributos.vigor.base + personagem.atributos.vigor.racial;
  const faixa = FaixasEtarias.find(f => f.nome === personagem.faixaEtaria);
  return 1 + vigorTotal + (faixa?.bonusPE || 0);
};

const EtapaPontosFundamentais = ({ personagem, setPersonagem, calcularTotalPD }: EtapaPontosFundamentaisProps) => {
  const pdDisponivel = 50 - calcularTotalPD(personagem);
  const maxPPCompravel = Math.floor(pdDisponivel / 2);

  const handlePPCompradosChange = (valor: number) => {
    const novoValor = Math.max(0, Math.min(valor, maxPPCompravel));
    setPersonagem({
      ...personagem,
      ppComprados: novoValor
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary mb-6">Pontos Fundamentais</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PD Disponíveis */}
        <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-white/10">
          <Label className="block text-lg font-medium mb-3 text-gray-300">PD Disponíveis</Label>
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold w-full text-center">
              <span className={pdDisponivel >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                {pdDisponivel}
              </span>
              <span className="text-gray-400 text-sm ml-2">/50</span>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-2">Pontos de Desenvolvimento restantes</p>
        </div>

        {/* Percepção Passiva (PP) */}
        <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-white/10">
          <Label className="block text-lg font-medium mb-3 text-gray-300">Percepção Passiva (PP)</Label>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              min="0"
              max={maxPPCompravel}
              value={personagem.ppComprados || 0}
              onChange={(e) => handlePPCompradosChange(Number(e.target.value))}
              className="bg-black/50 border-white/10 text-gray-200 focus:border-primary/40 focus:ring-primary text-center w-20"
            />
            <div className="flex flex-col">
              <div className="text-md font-bold text-yellow-400">
                Total: {calcularPP(personagem)}
              </div>
              <div className="text-sm text-green-400">
                Custo: {(personagem.ppComprados || 0) * 2} PD
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            10 + Vigor ({personagem.atributos.vigor.base + personagem.atributos.vigor.racial}) + PP comprados
          </p>
        </div>

        {/* Pontos de Vida (PV) */}
        <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-white/10">
          <Label className="block text-lg font-medium mb-3 text-gray-300">Pontos de Vida (PV)</Label>
          <div className="text-2xl font-bold text-center text-primary">
            {calcularPV(personagem)}
          </div>
          <p className="text-sm text-gray-400 mt-2">
            10 + Vigor + {personagem.faixaEtaria ? 'Bônus Etário' : 'Selecione Faixa Etária'}
          </p>
        </div>

        {/* Pontos de Experiência (PE) */}
        <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-white/10">
          <Label className="block text-lg font-medium mb-3 text-gray-300">Pontos de Experiência (PE)</Label>
          <div className="text-2xl font-bold text-center text-primary">
            {calcularPE(personagem)}
          </div>
          <p className="text-sm text-gray-400 mt-2">
            1 + Vigor + {personagem.faixaEtaria ? 'Bônus Etário' : 'Selecione Faixa Etária'}
          </p>
        </div>

        {/* Defesa Total (DT) */}
        <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-white/10">
          <Label className="block text-lg font-medium mb-3 text-gray-300">Defesa Total (DT)</Label>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              value={personagem.dtTotal || 0}
              onChange={(e) => setPersonagem({
                ...personagem,
                dtTotal: parseInt(e.target.value) || 0
              })}
              className="bg-black/50 border-white/10 text-gray-200 focus:border-primary/40 focus:ring-primary text-center w-20"
            />
            <div className="text-sm text-gray-400">
              Valor normalmente entre 10-20
            </div>
          </div>
        </div>

        {/* Defesa Passiva (DP) */}
        <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-white/10">
          <Label className="block text-lg font-medium mb-3 text-gray-300">Defesa Passiva (DP)</Label>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              value={personagem.dtPassiva || 0}
              onChange={(e) => setPersonagem({
                ...personagem,
                dtPassiva: parseInt(e.target.value) || 0
              })}
              className="bg-black/50 border-white/10 text-gray-200 focus:border-primary/40 focus:ring-primary text-center w-20"
            />
            <div className="text-sm text-gray-400">
              Valor normalmente entre 5-15
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EtapaPontosFundamentais;