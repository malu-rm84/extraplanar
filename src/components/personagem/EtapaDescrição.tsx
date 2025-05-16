import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface EtapaDescricaoProps {
  personagem: any;
  setPersonagem: (personagem: any) => void;
}

const EtapaDescricao = ({ personagem, setPersonagem }: EtapaDescricaoProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary mb-6">Descrição do Personagem</h2>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-4">
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <Label className="text-gray-300">Descrição Física</Label>
            <Textarea
              value={personagem.descricaoFisica || ''}
              onChange={(e) => setPersonagem({
                ...personagem,
                descricaoFisica: e.target.value
              })}
              className="mt-2 bg-white/10 border-none text-gray-200 h-32"
              placeholder="Descreva a aparência física do personagem..."
            />
          </div>

          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <Label className="text-gray-300">Personalidade</Label>
            <Textarea
              value={personagem.personalidade || ''}
              onChange={(e) => setPersonagem({
                ...personagem,
                personalidade: e.target.value
              })}
              className="mt-2 bg-white/10 border-none text-gray-200 h-32"
              placeholder="Descreva a personalidade e maneirismos..."
            />
          </div>

          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <Label className="text-gray-300">História</Label>
            <Textarea
              value={personagem.historia || ''}
              onChange={(e) => setPersonagem({
                ...personagem,
                historia: e.target.value
              })}
              className="mt-2 bg-white/10 border-none text-gray-200 h-48"
              placeholder="Conte a história de vida do personagem..."
            />
          </div>

          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <Label className="text-gray-300">Observações</Label>
            <Textarea
              value={personagem.observacoes || ''}
              onChange={(e) => setPersonagem({
                ...personagem,
                observacoes: e.target.value
              })}
              className="mt-2 bg-white/10 border-none text-gray-200 h-32"
              placeholder="Anotações adicionais e características únicas..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EtapaDescricao;