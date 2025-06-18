import { Personagem } from "./types";
import { calcularPP, calcularPV, calcularPE, calcularNivelPorPD, calcularTotalPDRecebidos, calcularPVMaximo } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EtapaPontosFundamentaisProps {
  personagem: Personagem;
  setPersonagem: (personagem: Personagem) => void;
  calcularTotalPD: (personagem: Personagem) => number;
  pdDisponivel: number;
}

const EtapaPontosFundamentais = ({ 
  personagem, 
  setPersonagem, 
  calcularTotalPD,
  pdDisponivel
}: EtapaPontosFundamentaisProps) => {
  // 1. Calcular custos parciais
  const custoAtributos = calcularTotalPD(personagem);
  
  // CORREÇÃO: Custo linear (2 PD por ponto)
  const custoPP = 2 * (personagem.ppComprados || 0);
  
  // CORREÇÃO: Custo linear (2 PD por ponto)
  const custoPV = 2 * (personagem.pvComprados || 0);

  // CORREÇÃO: Limites máximos (cada ponto custa 2 PD)
  const maxPPCompravel = Math.max(0, Math.floor(pdDisponivel / 2));
  const maxPVCompravel = Math.max(0, Math.floor(pdDisponivel / 2));

  // 4. Calcular nível atual do personagem
  const totalPDPersonagem = calcularTotalPDRecebidos(personagem);
  const nivelAtual = calcularNivelPorPD(totalPDPersonagem);

  const handlePPCompradosChange = (valor: number) => {
    const novoPP = Math.max(0, Math.min(valor, maxPPCompravel));
    setPersonagem({
      ...personagem,
      ppComprados: novoPP
    });
  };

  const pvMaximo = calcularPVMaximo(nivelAtual);

  const pvAtual = calcularPV(personagem);
  const pvNoLimite = pvAtual >= pvMaximo;

  // Nova função para PV comprados
  const handlePVCompradosChange = (valor: number) => {
    const pvAtualComprados = personagem.pvComprados || 0;
    const novoPV = Math.max(0, Math.min(valor, maxPVCompravel));
    
    // Calcular o PV total que o personagem teria com esse novo valor
    const personagemTemp = {
      ...personagem,
      pvComprados: novoPV
    };
    const novoPVTotal = calcularPV(personagemTemp);
    
    // Permitir diminuir mesmo se estiver no limite
    // Bloquear apenas se tentar aumentar além do limite
    if (novoPVTotal > pvMaximo && novoPV > pvAtualComprados) {
      return; // Bloqueia aumentos que excedam o limite
    }
    
    // Se for redução ou não exceder o limite, atualiza
    setPersonagem(personagemTemp);
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

        {/* Nível do Personagem */}
        <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-white/10">
          <Label className="block text-lg font-medium mb-3 text-gray-300">Nível do Personagem</Label>
          <div className="text-2xl font-bold text-center text-amber-400">
            Nível {nivelAtual}
          </div>
          <p className="text-sm text-gray-400 mt-2 text-center">
            {totalPDPersonagem} PD total • {nivelAtual === 0 ? 'Precisa de 50 PD para nível 1' : `Próximo nível: ${50 + (nivelAtual * 10)} PD`}
          </p>
        </div>

        {/* Percepção Passiva (PP) Comprados */}
        <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-white/10">
          <Label className="block text-lg font-medium mb-3 text-gray-300">
            Percepção Passiva (PP)
          </Label>
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
                Total PP: {calcularPP(personagem)}
              </div>
              <div className="text-sm text-green-400">
                Custo: {custoPP} PD
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            PP = 10 + Vigor ({personagem.atributos.vigor.base + personagem.atributos.vigor.racial}) + PP comprados
          </p>
        </div>

        {/* Pontos de Vida (PV) Comprados */}
        <div className={`bg-black/30 backdrop-blur-sm p-4 rounded-lg border ${
          pvNoLimite 
            ? "border-yellow-500/50 glow-yellow" 
            : "border-white/10"
        }`}>
          <Label className="block text-lg font-medium mb-3 text-gray-300">
            Pontos de Vida (PV) Comprados
          </Label>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              min="0"
              max={maxPVCompravel}
              value={personagem.pvComprados || 0}
              onChange={(e) => handlePVCompradosChange(Number(e.target.value))}
              className={`bg-black/50 text-gray-200 focus:border-primary/40 focus:ring-primary text-center w-20 ${
                pvNoLimite 
                  ? "border-yellow-500/50" // Mantém a borda amarela
                  : "border-white/10"
              }`}
            />
            <div className="flex flex-col">
              <div className="text-md font-bold text-yellow-400">
                Total PV: {pvAtual}
                {pvNoLimite && (
                  <span className="ml-2 text-xs bg-yellow-900/50 text-yellow-300 px-2 py-1 rounded-full">
                    !
                  </span>
                )}
              </div>
              <div className="text-sm text-green-400">
                Custo: {custoPV} PD
              </div>
            </div>
          </div>
          
          {/* Aviso de limite */}
          {pvNoLimite && (
            <div className="mt-3 p-3 bg-yellow-900/30 border border-yellow-800/50 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-yellow-300 font-medium">Limite máximo de PV atingido</p>
                  <p className="text-yellow-500 text-sm mt-1">
                    No nível {nivelAtual}, o máximo de PV permitido é {pvMaximo}. 
                    Você pode reduzir os PV comprados ou subir de nível para aumentar o limite.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <p className="text-sm text-gray-400 mt-2">
            PV = 10 + Vigor + Bônus Etário + PV comprados
          </p>
        </div>

        {/* Pontos de Experiência (PE) */}
        <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-white/10">
          <Label className="block text-lg font-medium mb-3 text-gray-300">Pontos de Esforço (PE)</Label>
          <div className="text-2xl font-bold text-center text-primary">
            {calcularPE(personagem)}
          </div>
          <p className="text-sm text-gray-400 mt-2">
            1 + Vigor + {personagem.faixaEtaria ? 'Bônus Etário' : 'Selecione Faixa Etária'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EtapaPontosFundamentais;