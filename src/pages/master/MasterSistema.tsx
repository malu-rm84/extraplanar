
import { MasterLayout } from "@/components/layout/MasterLayout";

const MasterSistema = () => {
  return (
    <MasterLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-serif font-bold">Sistema</h1>
        <p>Regras e mecânicas do sistema Extraplanar RPG.</p>
        
        <div className="bg-card border rounded-lg p-6 mt-6">
          <div className="space-y-4">
            <h3 className="text-xl font-medium">O Complexo Esmeralda</h3>
            <p>
              A muito tempo atrás, 2 seres primordiais deram vida a um local, onde eles chamaram de Plano Esmeralda. 
              Oberon e Titânia, juntos, criaram um lindo lugar, e originaram uma raça de seres chamados de Feéricos.
            </p>
            <p>
              Aquele reino antigo formou o maior império que o universo já viu, maior mesmo que o próprio céu, 
              os deuses celestiais os invejavam, e nada podiam fazer a respeito, pois seus poderes mágicos 
              originaram a magia natural por si própria.
            </p>
            <p>
              O império foi dividido após uma guerra entre Oberon e Titânia, que separou os Feéricos em dois grupos: 
              Fadas (seguidores de Titânia) e Elfos (seguidores de Oberon).
            </p>
            <p>
              Com a ajuda de Baba Yaga, a Mãe das Bruxas, e suas três filhas (Bavlorna, Scabatha e Endelyn), 
              Oberon e Puck conspiraram para derrubar Titânia. Após sua vitória, os elfos dividiram o antigo reino 
              das fadas entre as filhas de Baba Yaga e expandiram seu império para o plano material e o inferno.
            </p>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};

export default MasterSistema;
