import { useState, useEffect } from "react";
import { Character, Item, Arma, Ocupacao } from "./character";
import { races } from "./racas";
import { planos, pericias, attributeIcons, planoColors, periciaCategories, occupationCategories } from "./constants";

const attributeCosts = [0, 1, 2, 4, 7, 11];
const affinityCosts = [0, 1, 3, 6, 10, 15];

export const CharacterForm = ({
  character,
  onSave,
  onCancel,
}: {
  character: Character;
  onSave: (character: Character) => void;
  onCancel: () => void;
}) => {
  const [currentCharacter, setCurrentCharacter] = useState<Character>(character);
  const [totalPD, setTotalPD] = useState(15);
  const [selectedPlano, setSelectedPlano] = useState(character.plano);
  const [activeTab, setActiveTab] = useState("atributos");
  const [faixaEtaria, setFaixaEtaria] = useState("");

  useEffect(() => {
    if (currentCharacter.raca) {
      const raceData = races[currentCharacter.raca];
      setCurrentCharacter(prev => ({
        ...prev,
        plano: raceData.plano,
        habilidades: {
          ...prev.habilidades,
          racial: raceData.habilidadeRacial
        }
      }));
    }
  }, [currentCharacter.raca]);

  useEffect(() => {
    const vigor = currentCharacter.atributos.vigor;
    const bonusEtaria = getFaixaEtariaBonus(faixaEtaria);
    
    setCurrentCharacter(prev => ({
      ...prev,
      vitalidade: {
        ...prev.vitalidade,
        pv: 10 + vigor + bonusEtaria,
        pe: 1 + vigor + bonusEtaria
      }
    }));
  }, [currentCharacter.atributos.vigor, faixaEtaria]);

  const handleAttributeChange = (attribute: keyof Character['atributos'], value: number) => {
    const currentValue = currentCharacter.atributos[attribute];
    const pdCost = attributeCosts[value] - attributeCosts[currentValue];
    
    if (pdCost > totalPD || value < 0 || value > 5) return;

    setCurrentCharacter(prev => ({
      ...prev,
      atributos: { ...prev.atributos, [attribute]: value }
    }));
    
    setTotalPD(prev => prev - pdCost);
  };

  const handleAffinityChange = (affinity: keyof Character['afinidade'], level: number) => {
    const currentLevel = currentCharacter.afinidade[affinity];
    const pdCost = affinityCosts[level] - affinityCosts[currentLevel];

    if (pdCost > totalPD || level < 0 || level > 5) return;

    setCurrentCharacter(prev => ({
      ...prev,
      afinidade: { ...prev.afinidade, [affinity]: level }
    }));

    setTotalPD(prev => prev - pdCost);
  };

  const updateOccupationLevel = (nome: string, nivel: number) => {
    const ocupacao = currentCharacter.ocupacoes.find(oc => oc.nome === nome);
    const pdCost = (nivel - (ocupacao?.nivel || 0)) * 3;

    if (pdCost > totalPD || nivel < 0 || nivel > 5) return;

    const newOcupacoes = ocupacao
      ? currentCharacter.ocupacoes.map(oc => oc.nome === nome ? { ...oc, nivel } : oc)
      : [...currentCharacter.ocupacoes, { nome, categoria: "", nivel, custoPD: pdCost }];

    setCurrentCharacter(prev => ({
      ...prev,
      ocupacoes: newOcupacoes
    }));

    setTotalPD(prev => prev - pdCost);
  };

  const getFaixaEtariaBonus = (etaria: string) => {
    // Implementar lógica específica de faixa etária
    return etaria === "Adulto" ? 2 : 1; // Exemplo
  };

  const getAttributeForSkill = (skill: string) => {
    const skillMap: Record<string, string> = {
      "luta": "forca",
      "pontaria": "agilidade",
      "arcanismo": "intelecto",
      // Adicionar mapeamento completo
    };
    return skillMap[skill] || "presenca";
  };

  const validateCharacter = () => {
      if (!currentCharacter.nome) {
        alert("Nome do personagem é obrigatório!");
        return false;
      }
      if (totalPD > 0) {
        alert("Gaste todos os PD antes de salvar!");
        return false;
      }
      return true;
    };

  const updateItem = (index: number, field: keyof Item, value: string) => {
    const newItems = [...currentCharacter.inventario.itens];
    newItems[index] = { ...newItems[index], [field]: value };
    setCurrentCharacter(prev => ({
      ...prev,
      inventario: { ...prev.inventario, itens: newItems }
    }));
  };

  const addItem = () => {
    if (currentCharacter.inventario.itens.length < 10) {
      setCurrentCharacter(prev => ({
        ...prev,
        inventario: {
          ...prev.inventario,
          itens: [...prev.inventario.itens, { nome: '', tipo: '', descricao: '' }]
        }
      }));
    }
  };

  const removeItem = (index: number) => {
    const newItems = currentCharacter.inventario.itens.filter((_, i) => i !== index);
    setCurrentCharacter(prev => ({
      ...prev,
      inventario: { ...prev.inventario, itens: newItems }
    }));
  };

  const updateArma = (index: number, field: keyof Arma, value: string) => {
    const newArmas = [...currentCharacter.inventario.armas];
    newArmas[index] = { ...newArmas[index], [field]: value };
    setCurrentCharacter(prev => ({
      ...prev,
      inventario: { ...prev.inventario, armas: newArmas }
    }));
  };

  const addArma = () => {
    if (currentCharacter.inventario.armas.length < 2) {
      setCurrentCharacter(prev => ({
        ...prev,
        inventario: {
          ...prev.inventario,
          armas: [...prev.inventario.armas, { nome: '', tipo: '', descricao: '', dano: '' }]
        }
      }));
    }
  };

  const removeArma = (index: number) => {
    const newArmas = currentCharacter.inventario.armas.filter((_, i) => i !== index);
    setCurrentCharacter(prev => ({
      ...prev,
      inventario: { ...prev.inventario, armas: newArmas }
    }));
  };

  const renderAttributeValue = (value: number) => {
    const stars = [];
    for (let i = 0; i < 3; i++) {
      stars.push(
        <span key={i} className={`text-xl ${i < value ? "text-yellow-500" : "text-gray-300"}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  const getPlanoStyle = (plano: string) => {
    return planoColors[plano as keyof typeof planoColors] || { bg: "bg-gray-100", border: "border-gray-500", text: "text-gray-800" };
  };

  return (
    <div className={`rounded-lg p-6 mt-6 space-y-6 bg-gray-800 shadow-xl border-2 ${
      selectedPlano && planoColors[selectedPlano as keyof typeof planoColors]?.border
    }`}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          {currentCharacter.nome ? "Editando" : "Criando"} Personagem
          {selectedPlano && (
            <span className={`ml-3 px-3 py-1 rounded-full text-sm ${
              planoColors[selectedPlano as keyof typeof planoColors]?.bg
            } ${planoColors[selectedPlano as keyof typeof planoColors]?.text}`}>
              {selectedPlano}
            </span>
          )}
        </h2>
        <div className="flex items-center gap-4">
          <div className="bg-gray-700 p-2 rounded-lg">
            <span className="text-purple-300">PD Restantes: </span>
            <span className="font-bold text-xl text-white">{totalPD}</span>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-white">✕</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Seção Esquerda */}
        <div className="space-y-4">
          <div className="bg-gray-700 p-4 rounded-lg space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Nome</label>
                <input
                  type="text"
                  value={currentCharacter.nome}
                  onChange={(e) => setCurrentCharacter({...currentCharacter, nome: e.target.value})}
                  className="w-full p-2 bg-gray-600 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Faixa Etária</label>
                <select
                  value={faixaEtaria}
                  onChange={(e) => setFaixaEtaria(e.target.value)}
                  className="w-full p-2 bg-gray-600 rounded text-white"
                >
                  <option value="">Selecione</option>
                  <option value="Jovem">Jovem</option>
                  <option value="Adulto">Adulto</option>
                  <option value="Idoso">Idoso</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg space-y-3">
            <h3 className="font-bold text-lg text-purple-300">Atributos</h3>
            {Object.entries(currentCharacter.atributos).map(([key, value]) => (
              <div key={key} className="bg-gray-800 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{attributeIcons[key as keyof typeof attributeIcons]}</span>
                    <span className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  </div>
                  <span className="text-gray-400">Nível {value}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4, 5].map(level => (
                      <button
                        key={level}
                        onClick={() => handleAttributeChange(key as keyof Character['atributos'], level)}
                        className={`w-8 h-8 rounded ${
                          value >= level ? 'bg-purple-600' : 'bg-gray-600'
                        } ${level === value ? 'ring-2 ring-purple-400' : ''}`}
                        disabled={attributeCosts[level] - attributeCosts[value] > totalPD}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">
                    Custo: {attributeCosts[value]} PD
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-700 p-4 rounded-lg space-y-3">
            <h3 className="font-bold text-lg text-purple-300">Afinidades</h3>
            {Object.keys(currentCharacter.afinidade).map(affinity => (
              <div key={affinity} className="bg-gray-800 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">
                    {affinity.charAt(0).toUpperCase() + affinity.slice(1)}
                  </span>
                  <span className="text-gray-400">
                    Nível {currentCharacter.afinidade[affinity as keyof typeof currentCharacter.afinidade]}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4, 5].map(level => (
                      <button
                        key={level}
                        onClick={() => handleAffinityChange(
                          affinity as keyof Character['afinidade'], 
                          level
                        )}
                        className={`w-8 h-8 rounded ${
                          currentCharacter.afinidade[affinity as keyof typeof currentCharacter.afinidade] >= level 
                            ? 'bg-purple-600' 
                            : 'bg-gray-600'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">
                    Custo: {affinityCosts[currentCharacter.afinidade[
                      affinity as keyof typeof currentCharacter.afinidade
                    ]]} PD
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seção Direita */}
        <div className="space-y-4">
          <div className="bg-gray-700 p-4 rounded-lg space-y-3">
            <h3 className="font-bold text-lg text-purple-300">Vitalidade</h3>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(currentCharacter.vitalidade).map(([key, value]) => (
                <div key={key} className="bg-gray-800 p-3 rounded text-center">
                  <div className="text-sm text-gray-300 mb-1">{key.toUpperCase()}</div>
                  <div className="text-2xl font-bold text-purple-400">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg space-y-3">
            <h3 className="font-bold text-lg text-purple-300">Heranças</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(currentCharacter.herancas).map(([key, value]) => (
                <div key={key} className="bg-gray-800 p-3 rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </span>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => setCurrentCharacter({
                        ...currentCharacter,
                        herancas: {
                          ...currentCharacter.herancas,
                          [key]: parseInt(e.target.value) || 0
                        }
                      })}
                      className="w-16 bg-gray-700 text-center rounded text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Abas Inferiores */}
      <div className="mt-6">
        <div className="flex border-b border-gray-700">
          {['pericias', 'ocupacoes', 'inventario', 'magias', 'extras'].map(tab => (
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

        <div className="mt-4">
          {activeTab === 'pericias' && (
            <div className="bg-gray-800 p-4 rounded-lg grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(periciaCategories).map(([category, skills]) => (
                <div key={category} className="mb-4">
                  <h4 className="text-purple-300 mb-2">{category}</h4>
                  {skills.map(skill => (
                    <div key={skill} className="bg-gray-700 p-2 rounded mb-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-sm">{pericias[skill as keyof typeof pericias]}</span>
                          <span className="text-xs text-gray-400 ml-2">
                            ({getAttributeForSkill(skill)})
                          </span>
                        </div>
                        <input
                          type="number"
                          value={currentCharacter.pericias[skill] || 0}
                          onChange={(e) => setCurrentCharacter({
                            ...currentCharacter,
                            pericias: {
                              ...currentCharacter.pericias,
                              [skill]: parseInt(e.target.value) || 0
                            }
                          })}
                          className="w-16 bg-gray-800 text-center rounded text-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'ocupacoes' && (
            <div className="bg-gray-800 p-4 rounded-lg">
              {Object.entries(occupationCategories).map(([category, occs]) => (
                <div key={category} className="mb-6">
                  <h4 className="text-purple-300 mb-3">{category}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {occs.map(oc => {
                      const ocupacao = currentCharacter.ocupacoes.find(o => o.nome === oc);
                      return (
                        <div key={oc} className="bg-gray-700 p-3 rounded">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm">{oc}</span>
                            <span className="text-xs text-gray-400">Nível {ocupacao?.nivel || 0}</span>
                          </div>
                          <div className="flex gap-1">
                            {[0, 1, 2, 3, 4, 5].map(level => (
                              <button
                                key={level}
                                onClick={() => updateOccupationLevel(oc, level)}
                                className={`w-8 h-8 rounded ${
                                  (ocupacao?.nivel || 0) >= level 
                                    ? 'bg-purple-600' 
                                    : 'bg-gray-600'
                                }`}
                              >
                                {level}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'extras' && (
            <div className="bg-gray-800 p-4 rounded-lg grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-purple-300 mb-2">Línguas</h4>
                <textarea
                  value={currentCharacter.linguas?.join('\n') || ''}
                  onChange={(e) => setCurrentCharacter({
                    ...currentCharacter,
                    linguas: e.target.value.split('\n')
                  })}
                  className="w-full bg-gray-700 text-white p-2 rounded"
                  rows={6}
                />
              </div>
              <div>
                <h4 className="text-purple-300 mb-2">Capacidades</h4>
                <textarea
                  value={currentCharacter.capacidades?.join('\n') || ''}
                  onChange={(e) => setCurrentCharacter({
                    ...currentCharacter,
                    capacidades: e.target.value.split('\n')
                  })}
                  className="w-full bg-gray-700 text-white p-2 rounded"
                  rows={6}
                />
              </div>
            </div>
          )}

          {activeTab === 'inventario' && (
            <div className="bg-gray-800 p-4 rounded-lg space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-purple-300">Armas (Máximo 2)</h4>
                {currentCharacter.inventario.armas.map((arma, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        value={arma.nome}
                        onChange={(e) => updateArma(index, 'nome', e.target.value)}
                        placeholder="Nome da arma"
                        className="bg-gray-600 p-2 rounded text-white"
                      />
                      <input
                        value={arma.tipo}
                        onChange={(e) => updateArma(index, 'tipo', e.target.value)}
                        placeholder="Tipo (ex: Espada, Arco)"
                        className="bg-gray-600 p-2 rounded text-white"
                      />
                    </div>
                    <input
                      value={arma.dano}
                      onChange={(e) => updateArma(index, 'dano', e.target.value)}
                      placeholder="Dano (ex: 1d8+3)"
                      className="bg-gray-600 p-2 rounded w-full text-white"
                    />
                    <textarea
                      value={arma.descricao}
                      onChange={(e) => updateArma(index, 'descricao', e.target.value)}
                      placeholder="Descrição"
                      className="bg-gray-600 p-2 rounded w-full text-white"
                    />
                    <button
                      onClick={() => removeArma(index)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remover Arma
                    </button>
                  </div>
                ))}
                <button
                  onClick={addArma}
                  disabled={currentCharacter.inventario.armas.length >= 2}
                  className="bg-gray-700 hover:bg-gray-600 p-2 rounded disabled:opacity-50 text-white w-full"
                >
                  + Adicionar Arma
                </button>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-purple-300">Itens (Máximo 10)</h4>
                {currentCharacter.inventario.itens.map((item, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        value={item.nome}
                        onChange={(e) => updateItem(index, 'nome', e.target.value)}
                        placeholder="Nome do item"
                        className="bg-gray-600 p-2 rounded text-white"
                      />
                      <input
                        value={item.tipo}
                        onChange={(e) => updateItem(index, 'tipo', e.target.value)}
                        placeholder="Tipo (ex: Poção, Ferramenta)"
                        className="bg-gray-600 p-2 rounded text-white"
                      />
                    </div>
                    <textarea
                      value={item.descricao}
                      onChange={(e) => updateItem(index, 'descricao', e.target.value)}
                      placeholder="Descrição"
                      className="bg-gray-600 p-2 rounded w-full text-white"
                    />
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remover Item
                    </button>
                  </div>
                ))}
                <button
                  onClick={addItem}
                  disabled={currentCharacter.inventario.itens.length >= 10}
                  className="bg-gray-700 hover:bg-gray-600 p-2 rounded disabled:opacity-50 text-white w-full"
                >
                  + Adicionar Item
                </button>
              </div>
            </div>
          )}

          {activeTab === 'magias' && (
            <div className="bg-gray-800 p-4 rounded-lg space-y-4">
              <textarea
                value={currentCharacter.magias.join('\n')}
                onChange={(e) =>
                  setCurrentCharacter({
                    ...currentCharacter,
                    magias: e.target.value.split('\n'),
                  })
                }
                rows={8}
                className="w-full bg-gray-700 text-white p-3 rounded resize-none"
                placeholder="Insira uma magia por linha"
              />
            </div>
          )}

          {activeTab === 'anotacoes' && (
            <div className="bg-gray-800 p-4 rounded-lg space-y-4">
              <textarea
                value={currentCharacter.anotacoes}
                onChange={(e) =>
                  setCurrentCharacter({
                    ...currentCharacter,
                    anotacoes: e.target.value,
                  })
                }
                rows={10}
                className="w-full bg-gray-700 text-white p-3 rounded resize-none"
                placeholder="Anotações do personagem..."
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white"
        >
          Cancelar
        </button>
        <button
          onClick={() => validateCharacter() && onSave(currentCharacter)}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded text-white"
        >
          Salvar Personagem
        </button>
      </div>
    </div>
  );
};