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
  pdExcedido, // Adicione esta linha
}: BotoesNavegacaoProps) => {
  return (
    <div className="flex justify-between mt-8 gap-4">
      <Button
        variant="outline"
        onClick={irParaEtapaAnterior}
        disabled={etapaAtual === primeiraEtapa}
        className="bg-white/5 border-white/20 hover:bg-primary/20 hover:border-primary/40"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Anterior
      </Button>
      
      {etapaAtual === ultimaEtapa ? (
        <Button 
          onClick={salvarPersonagem} 
          className="bg-gradient-to-r from-primary to-purple-400 hover:from-primary/90 hover:to-purple-400/90 text-white"
        >
          <Save className="mr-2 h-5 w-5" />
          Finalizar Personagem
        </Button>
      ) : (
        <Button 
          onClick={irParaProximaEtapa} 
          className="bg-gradient-to-r from-emerald-500 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-white"
          disabled={pdExcedido} // Agora usando a prop
        >
          Próximo
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default BotoesNavegacao;