import { Construction } from "lucide-react";

interface EtapaEmDesenvolvimentoProps {
  titulo: string;
}

const EtapaEmDesenvolvimento = ({ titulo }: EtapaEmDesenvolvimentoProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary mb-6">{titulo}</h2>
      <div className="bg-white/5 p-8 rounded-xl border-2 border-dashed border-primary/30 text-center">
        <Construction className="w-16 h-16 text-primary mx-auto mb-4" />
        <p className="text-xl text-gray-300 font-medium">
          Seção em construção
        </p>
        <p className="text-gray-400 mt-2">
          Nossos artífices dimensionais estão trabalhando nisto!
        </p>
      </div>
    </div>
  );
};

export default EtapaEmDesenvolvimento;