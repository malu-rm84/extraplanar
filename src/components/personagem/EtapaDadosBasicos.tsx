import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Planos } from "@/data/PlanosRacas";
import { FaixasEtarias } from "@/data/FaixaEtaria";

interface EtapaDadosBasicosProps {
  personagem: any;
  setPersonagem: (personagem: any) => void;
}

const EtapaDadosBasicos = ({ personagem, setPersonagem }: EtapaDadosBasicosProps) => {
  const racasDoPlanoSelecionado = Planos.find(p => p.nome.toLowerCase() === personagem.plano?.toLowerCase())?.racas || [];

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
                raca: '' // Reset raça ao mudar plano
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
              onChange={(e) => setPersonagem({...personagem, faixaEtaria: e.target.value})}
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
              onChange={(e) => setPersonagem({...personagem, raca: e.target.value})}
              className="w-full mt-2 bg-white/10 rounded-md p-2 text-gray-200 border-none"
              disabled={!personagem.plano}
            >
              <option value="">Selecione primeiro um plano</option>
              {racasDoPlanoSelecionado.map((raca) => (
                <option key={raca.nome} value={raca.nome}>
                  {raca.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EtapaDadosBasicos;