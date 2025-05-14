import { Character } from "../../data/character";

export const CharacterCard = ({
  character,
  onEdit,
  onExport,
}: {
  character: Character;
  onEdit: () => void;
  onExport: () => void;
}) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mt-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">{character.nome}</h3>
        <div className="space-x-2">
          <button
            onClick={onEdit}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Editar
          </button>
          <button
            onClick={onExport}
            className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
          >
            Exportar
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p><strong>Raça:</strong> {character.raca}</p>
          <p><strong>Plano:</strong> {character.plano}</p>
          <p><strong>PV:</strong> {character.vitalidade.pv}</p>
        </div>
        <div>
          <p><strong>Habilidade Racial:</strong> {character.habilidades.racial}</p>
          <p><strong>Armas:</strong> {character.inventario.armas.length}</p>
          <p><strong>Itens:</strong> {character.inventario.itens.length}</p>
        </div>
      </div>
    </div>
  );
};