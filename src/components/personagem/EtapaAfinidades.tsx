
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

const calcularPDDisponiveis = (personagem: Personagem) => {
  const totalRecebidos = (personagem.pdIniciais || 50) + 
    (personagem.pdSessoes?.reduce((acc, session) => acc + session.pdAmount, 0) || 0);
  const totalGastos = personagem.pdGastos || 0;
  return totalRecebidos - totalGastos;
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
    const pdDisponiveis = calcularPDDisponiveis(personagem);
    const novoPDGasto = (personagem.pdGastos || 0) + diferencaPD;
    
    if (novoPDGasto <= (personagem.pdIniciais || 50) + (personagem.pdSessoes?.reduce((acc, s) => acc + s.pdAmount, 0) || 0)) {
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
  
  const pdDisponiveis = calcularPDDisponiveis(personagem);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary mb-6">Afinidades Mágicas</h2>
        <div className="text-right">
          <div className="text-lg font-bold text-primary">
            PD Disponíveis: {pdDisponiveis}
          </div>
          <div className="text-sm text-gray-400">
            Nível: {personagem.nivel} | Total PD: {(personagem.pdIniciais || 50) + (personagem.pdSessoes?.reduce((acc, s) => acc + s.pdAmount, 0) || 0)}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {afinidades.map(({ chave, nome, desc }) => (
          <div key={chave} className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-white/10">
            <Label className="block text-lg font-medium mb-3 text-gray-300">{nome}</Label>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                min="0"
                max="5"
                value={personagem.afinidades[chave]}
                onChange={(e) => atualizarAfinidade(chave, parseInt(e.target.value))}
                className="bg-black/50 border-white/10 text-gray-200 focus:border-primary/40 focus:ring-primary text-center w-20"
              />
              <div className="flex flex-col">
                <div className="text-md font-bold text-yellow-400">
                  Nível: {personagem.afinidades[chave]}
                </div>
                <div className="text-sm text-amber-300">
                  Custo: {getCustoAcumulado(personagem.afinidades[chave])} PD
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-2">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EtapaAfinidades;
