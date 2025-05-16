import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Personagem } from "./types";

interface EtapaAtributosProps {
  personagem: Personagem;
  setPersonagem: (personagem: Personagem) => void;
}

interface AtributoConfig {
  chave: keyof Personagem['atributos'];
  nome: string;
  desc: string;
}

const getCustoAcumuladoPD = (valor: number) => {
  const custosIncrementais = [0, 1, 2, 4, 7, 11];
  return custosIncrementais.slice(0, valor + 1).reduce((a, b) => a + b, 0);
};

const EtapaAtributos = ({ personagem, setPersonagem }: EtapaAtributosProps) => {
  const atributos: AtributoConfig[] = [
    { chave: 'agilidade', nome: 'Agilidade', desc: 'Reflexos e movimentos ágeis' },
    { chave: 'forca', nome: 'Força', desc: 'Resistência física e saúde' },
    { chave: 'intelecto', nome: 'Intelecto', desc: 'Conhecimento e raciocínio' },
    { chave: 'presenca', nome: 'Presença', desc: 'Capacidade física bruta' },
    { chave: 'vigor', nome: 'Vigor', desc: 'Carisma e influência social' }
  ];

  const atualizarAtributo = (atributo: keyof Personagem['atributos'], valor: number) => {
    const racial = personagem.atributos[atributo].racial || 0;
    const maxBase = 5 - racial; // Ensure base + racial ≤ 5
    const novoValor = Math.min(maxBase, Math.max(0, isNaN(valor) ? 0 : valor));

    const pdAtual = getCustoAcumuladoPD(personagem.atributos[atributo].base);
    const pdNovo = getCustoAcumuladoPD(novoValor);
    const pdTotal = totalPD - pdAtual + pdNovo;

    if (pdTotal <= 50) {
      setPersonagem({
        ...personagem,
        atributos: {
          ...personagem.atributos,
          [atributo]: {
            ...personagem.atributos[atributo],
            base: novoValor
          }
        }
      });
    }
  };

  const totalPD = atributos.reduce((acc, { chave }) => 
    acc + getCustoAcumuladoPD(personagem.atributos[chave].base || 0), 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary mb-6">Atributos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {atributos.slice(0, 3).map(({ chave, nome, desc }) => (
            <div key={chave} className="bg-white/5 p-4 rounded-lg border border-white/10">
              <Label className="block text-lg font-medium mb-3 text-gray-300">{nome}</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  min="0"
                  max="5"
                  value={personagem.atributos[chave].base ?? 0}
                  onChange={(e) => atualizarAtributo(chave, parseInt(e.target.value))}
                  className="bg-white/10 border-none text-lg text-center w-20"
                />
                <div className="flex flex-col">
                  <div className="text-lg font-semibold text-primary">
                    PD: {getCustoAcumuladoPD(personagem.atributos[chave].base)}
                  </div>
                  <div className="text-sm text-green-400">
                    Bônus Racial: +{personagem.atributos[chave].racial}
                  </div>
                  <div className="text-md font-bold text-yellow-400">
                    Total: {personagem.atributos[chave].base + personagem.atributos[chave].racial}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-2">{desc}</p>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {atributos.slice(3).map(({ chave, nome, desc }) => (
            <div key={chave} className="bg-white/5 p-4 rounded-lg border border-white/10">
              <Label className="block text-lg font-medium mb-3 text-gray-300">{nome}</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  min="0"
                  max="5"
                  value={personagem.atributos[chave].base ?? 0}
                  onChange={(e) => atualizarAtributo(chave, parseInt(e.target.value))}
                  className="bg-white/10 border-none text-lg text-center w-20"
                />
                <div className="flex flex-col">
                  <div className="text-lg font-semibold text-primary">
                    PD: {getCustoAcumuladoPD(personagem.atributos[chave].base)}
                  </div>
                  <div className="text-sm text-green-400">
                    Bônus Racial: +{personagem.atributos[chave].racial}
                  </div>
                  <div className="text-md font-bold text-yellow-400">
                    Total: {personagem.atributos[chave].base + personagem.atributos[chave].racial}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-2">{desc}</p>
            </div>
          ))}
        </div>
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
            (Pontos Desenvolvimento gastos nos atributos base)
          </div>
        </div>
      </div>
    </div>
  );
};

export default EtapaAtributos;