import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EtapaAtributosProps {
  personagem: any;
  setPersonagem: (personagem: any) => void;
}

const EtapaAtributos = ({ personagem, setPersonagem }: EtapaAtributosProps) => {
  const atualizarAtributo = (atributo: string, valor: number) => {
    setPersonagem({
      ...personagem,
      atributos: {
        ...personagem.atributos,
        [atributo]: valor
      }
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary mb-6">Atributos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {['forca', 'destreza', 'constituicao'].map((atributo) => (
            <div key={atributo} className="bg-white/5 p-4 rounded-lg border border-white/10">
              <Label className="block text-lg font-medium mb-3 text-gray-300 capitalize">{atributo}</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={personagem.atributos[atributo]}
                  onChange={(e) => atualizarAtributo(atributo, parseInt(e.target.value))}
                  className="bg-white/10 border-none text-lg text-center w-20"
                />
                <div className="text-lg font-semibold text-primary">
                  Mod: {Math.floor((personagem.atributos[atributo] - 10) / 2)}
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                {{
                  forca: 'Potência física, capacidade de carga e combate corpo-a-corpo',
                  destreza: 'Agilidade, reflexos, equilíbrio e precisão',
                  constituicao: 'Saúde, resistência e vigor físico'
                }[atributo]}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {['inteligencia', 'sabedoria', 'carisma'].map((atributo) => (
            <div key={atributo} className="bg-white/5 p-4 rounded-lg border border-white/10">
              <Label className="block text-lg font-medium mb-3 text-gray-300 capitalize">{atributo}</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={personagem.atributos[atributo]}
                  onChange={(e) => atualizarAtributo(atributo, parseInt(e.target.value))}
                  className="bg-white/10 border-none text-lg text-center w-20"
                />
                <div className="text-lg font-semibold text-primary">
                  Mod: {Math.floor((personagem.atributos[atributo] - 10) / 2)}
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                {{
                  inteligencia: 'Raciocínio, memória e capacidade de aprendizado',
                  sabedoria: 'Percepção, intuição e força de vontade',
                  carisma: 'Personalidade, liderança e influência social'
                }[atributo]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EtapaAtributos;