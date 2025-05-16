import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Save } from "lucide-react";

interface BotoesNavegacaoProps {
  etapaAtual: string;
  primeiraEtapa: string;
  ultimaEtapa: string;
  irParaEtapaAnterior: () => void;
  irParaProximaEtapa: () => void;
  salvarPersonagem: () => void;
  pdExcedido: boolean;
}

const BotoesNavegacao = ({
  etapaAtual,
  primeiraEtapa,
  ultimaEtapa,
  irParaEtapaAnterior,
  irParaProximaEtapa,
  salvarPersonagem,
  pdExcedido,
}: BotoesNavegacaoProps) => {
  return (
    <div className="flex flex-col space-y-4 mt-6">
      {etapaAtual !== ultimaEtapa && (
        <Button 
          onClick={irParaProximaEtapa} 
          className="w-full bg-gradient-to-r from-emerald-500 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-white rounded-lg py-3"
          disabled={pdExcedido}
        >
          Próxima Etapa
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      )}
      
      {etapaAtual === ultimaEtapa && (
        <Button 
          onClick={salvarPersonagem} 
          className="w-full bg-gradient-to-r from-primary to-purple-400 hover:from-primary/90 hover:to-purple-400/90 text-white rounded-lg py-3"
          disabled={pdExcedido}
        >
          <Save className="mr-2 h-5 w-5" />
          Finalizar Personagem
        </Button>
      )}
      
      {etapaAtual !== primeiraEtapa && (
        <Button
          variant="outline"
          onClick={irParaEtapaAnterior}
          className="w-full bg-black/50 border-white/10 hover:bg-primary/20 hover:border-primary/40 rounded-lg py-3 text-gray-300"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Etapa Anterior
        </Button>
      )}
    </div>
  );
};

export default BotoesNavegacao;