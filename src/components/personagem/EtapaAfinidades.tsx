import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Personagem } from "./types";

interface EtapaAfinidadesProps {
  personagem: Personagem;
  setPersonagem: (personagem: Personagem) => void;
  calcularTotalPD: (personagem: Personagem) => number;
}

interface AfinidadeConfig {
  chave: keyof Personagem['afinidades'];
  nome: string;
  desc: string;
}

const getCustoAcumulado = (nivel: number) => {
  return (nivel * (nivel + 1)) / 2;
};

const EtapaAfinidades = ({ 
  personagem, 
  setPersonagem,
  calcularTotalPD 
}: EtapaAfinidadesProps) => {
  const afinidades: AfinidadeConfig[] = [
    { chave: 'arcana', nome: 'Arcana', desc: 'Magia arcana e artefatos' },
    { chave: 'cosmica', nome: 'Cósmica', desc: 'Energias cósmicas e dimensões' },
    { chave: 'divina', nome: 'Divina', desc: 'Poder sagrado e milagres' },
    { chave: 'natural', nome: 'Natural', desc: 'Elementos naturais' },
    { chave: 'necromante', nome: 'Necromante', desc: 'Manipulação da morte' }
  ];

  const atualizarAfinidade = (afinidade: keyof Personagem['afinidades'], valor: number) => {
    const novoValor = Math.min(5, Math.max(0, isNaN(valor) ? 0 : valor));
    
    // Calcula a diferença de PD
    const pdAtual = getCustoAcumulado(personagem.afinidades[afinidade]);
    const pdNovo = getCustoAcumulado(novoValor);
    const diferencaPD = pdNovo - pdAtual;

    // Verifica o limite total de PD
    if (calcularTotalPD(personagem) + diferencaPD <= 50) {
      setPersonagem({
        ...personagem,
        afinidades: {
          ...personagem.afinidades,
          [afinidade]: novoValor
        }
      });
    }
  };

  const totalPD = afinidades.reduce((acc, { chave }) => 
    acc + getCustoAcumulado(personagem.afinidades[chave]), 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary mb-6">Afinidades Mágicas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {afinidades.map(({ chave, nome, desc }) => (
          <div key={chave} className="bg-white/5 p-4 rounded-lg border border-white/10">
            <Label className="block text-lg font-medium mb-3 text-gray-300">{nome}</Label>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                min="0"
                max="5"
                value={personagem.afinidades[chave]}
                onChange={(e) => atualizarAfinidade(chave, parseInt(e.target.value))}
                className="bg-white/10 border-none text-lg text-center w-20"
              />
              <div className="flex flex-col">
                <div className="text-lg font-semibold text-primary">
                  PD: {getCustoAcumulado(personagem.afinidades[chave])}
                </div>
                <div className="text-md font-bold text-yellow-400">
                  Nível: {personagem.afinidades[chave]}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-2">{desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
        <div className={`p-4 rounded-lg border ${
          totalPD > 45 ? "border-red-400/50 bg-red-400/10" : "border-white/10 bg-white/5"
        }`}>
          <div className="text-xl font-bold text-primary">
            Custo Total de PD: {totalPD}
            {totalPD > 50 && <span className="text-red-400 ml-2">(Excedeu o limite!)</span>}
          </div>
          <div className="text-sm text-gray-400 mt-1">
            (Pontos Desenvolvimento gastos nas afinidades mágicas)
          </div>
        </div>
      </div>
    </div>
  );
};

export default EtapaAfinidades;