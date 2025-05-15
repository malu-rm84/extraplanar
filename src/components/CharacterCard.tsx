import { useState } from 'react';
import { Character } from '../data/character';
import { attributeIcons, planoColors } from '../data/constants';
import AttributeRadarChart from '../data/AttributeRadarChart';

interface CharacterCardProps {
  character: Character;
  onEdit: () => void;
  onExport: () => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  onEdit,
  onExport,
}) => {
  const [activeTab, setActiveTab] = useState<string>('atributos');
  
  const getPlanoStyle = (plano: string) => {
    return planoColors[plano as keyof typeof planoColors] || { 
      bg: "bg-gray-700", 
      border: "border-gray-600", 
      text: "text-gray-200" 
    };
  };

  const planoStyle = getPlanoStyle(character.plano);

  // Cálculo de estatísticas adicionais
  const calcularChanceCombate = () => {
    const base = character.atributos.agilidade + character.pericias?.combate || 0;
    return `${base * 10}%`;
  };

  const calcularChanceDefesa = () => {
    const base = Math.floor((character.atributos.agilidade + character.atributos.vigor) / 2);
    return `${base * 10}%`;
  };

  const renderOcupacoes = () => {
    if (character.ocupacoes.length === 0) return "Nenhuma";
    
    return character.ocupacoes
      .filter(oc => oc.nivel > 0)
      .map(oc => `${oc.nome} (${oc.nivel})`)
      .join(", ");
  };

  return (
    <div className={`bg-gray-800 rounded-lg overflow-hidden shadow-xl border-t-4 ${planoStyle.border}`}>
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{character.nome}</h2>
            <div className="flex items-center mt-1 space-x-2">
              <span className={`px-2 py-1 rounded text-xs ${planoStyle.bg} ${planoStyle.text}`}>
                {character.raca}
              </span>
              <span className={`px-2 py-1 rounded text-xs ${planoStyle.bg} ${planoStyle.text}`}>
                {character.plano}
              </span>
              <span className="text-gray-400 text-sm">{renderOcupacoes()}</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onEdit}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-500"
            >
              Editar
            </button>
            <button
              onClick={onExport}
              className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-500"
            >
              Exportar
            </button>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex border-b border-gray-700 mb-4">
            {['atributos', 'pericias', 'inventario', 'magias'].map(tab => (
              <button
                key={tab}
                className={`py-2 px-4 ${
                  activeTab === tab 
                    ? 'text-purple-300 border-b-2 border-purple-400' 
                    : 'text-gray-400'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="mt-2">
            {activeTab === 'atributos' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-3 text-purple-300">Atributos</h3>
                  <AttributeRadarChart attributes={character.atributos} plano={character.plano} />
                  
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {Object.entries(character.atributos).map(([key, value]) => (
                      <div key={key} className="bg-gray-800 p-2 rounded flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="mr-2">{attributeIcons[key as keyof typeof attributeIcons]}</span>
                          <span className="text-sm">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                        </div>
                        <span className="font-bold text-purple-300">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="bg-gray-700 p-4 rounded-lg mb-4">
                    <h3 className="text-lg font-medium mb-3 text-purple-300">Vitalidade</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(character.vitalidade).map(([key, value]) => (
                        <div key={key} className="bg-gray-800 p-2 rounded text-center">
                          <div className="text-xs text-gray-400">{key.toUpperCase()}</div>
                          <div className="text-xl font-bold mt-1">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-3 text-purple-300">Chances de Combate</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-800 p-2 rounded text-center">
                        <div className="text-xs text-gray-400">ATAQUE</div>
                        <div className="text-xl font-bold mt-1">{calcularChanceCombate()}</div>
                      </div>
                      <div className="bg-gray-800 p-2 rounded text-center">
                        <div className="text-xs text-gray-400">DEFESA</div>
                        <div className="text-xl font-bold mt-1">{calcularChanceDefesa()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pericias' && (
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-3 text-purple-300">Perícias</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(character.pericias).map(([skill, value]) => (
                    value > 0 && (
                      <div key={skill} className="bg-gray-800 p-2 rounded flex items-center justify-between">
                        <span className="text-sm">{skill}</span>
                        <span className="font-bold text-purple-300">+{value}</span>
                      </div>
                    )
                  ))}
                  {Object.keys(character.pericias).length === 0 && (
                    <p className="text-gray-400 col-span-3">Nenhuma perícia desenvolvida</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'inventario' && (
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-3 text-purple-300">Inventário</h3>
                {character.inventario.armas.length > 0 ? (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Armas</h4>
                    <div className="space-y-2">
                      {character.inventario.armas.map((arma, index) => (
                        <div key={index} className="bg-gray-800 p-3 rounded">
                          <div className="flex justify-between">
                            <span className="font-medium">{arma.nome}</span>
                            <span className="text-purple-300">{arma.dano}</span>
                          </div>
                          <div className="text-sm text-gray-400 mt-1">{arma.tipo}</div>
                          {arma.descricao && <div className="text-sm mt-1">{arma.descricao}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 mb-4">Nenhuma arma</p>
                )}

                {character.inventario.itens.length > 0 ? (
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Itens</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {character.inventario.itens.map((item, index) => (
                        <div key={index} className="bg-gray-800 p-2 rounded">
                          <div className="font-medium">{item.nome}</div>
                          <div className="text-sm text-gray-400">{item.tipo}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400">Nenhum item</p>
                )}
              </div>
            )}

            {activeTab === 'magias' && (
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-3 text-purple-300">Magias</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {character.magias.length > 0 ? (
                    character.magias.map((magia, index) => (
                      <div key={index} className="bg-gray-800 p-2 rounded">
                        <div className="text-sm">{magia}</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">Nenhuma magia aprendida</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};