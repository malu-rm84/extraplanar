import { PlayerLayout } from "@/components/layout/PlayerLayout";
import { useState, useEffect } from "react";
import { races } from "@/data/PlanosRacas";
import { Character, Item, Arma } from "../../data/character";

const planos = ["Material", "Esmeralda", "Chiclete", "Inferno", "Étereo", "Céu"];

const pericias = {
  acrobacia: "Acrobacia",
  alquimia: "Alquimia",
  atletismo: "Atletismo",
  arcanismo: "Arcanismo",
  artes: "Artes",
  atualidades: "Atualidades",
  charme: "Charme",
  ciencias: "Ciências",
  engenharia: "Engenharia",
  extraplanar: "Extraplanar",
  forja: "Forja",
  fortitude: "Fortitude",
  furtividade: "Furtividade",
  historia: "História",
  iniciativa: "Iniciativa",
  intimidacao: "Intimidação",
  intuicao: "Intuição",
  investigacao: "Investigação",
  labia: "Lábia",
  lidarAnimais: "Lidar com Animais",
  luta: "Luta",
  maosLeves: "Mãos Leves",
  medicina: "Medicina",
  natureza: "Natureza",
  navegacao: "Navegação",
  ocultismo: "Ocultismo",
  oficio: "Ofício",
  percepcao: "Percepção",
  persuasao: "Persuasão",
  pontaria: "Pontaria",
  reflexos: "Reflexos",
  religiao: "Religião",
  sobrevivencia: "Sobrevivência",
  tatica: "Tática",
  vontade: "Vontade",
};

const attributeIcons = {
  forca: "💪",
  agilidade: "🏃",
  vigor: "❤️",
  presenca: "✨",
  intelecto: "🧠",
};

const planoColors = {
  "Material": { bg: "bg-amber-100", border: "border-amber-500", text: "text-amber-800" },
  "Esmeralda": { bg: "bg-emerald-100", border: "border-emerald-500", text: "text-emerald-800" },
  "Chiclete": { bg: "bg-pink-100", border: "border-pink-500", text: "text-pink-800" },
  "Inferno": { bg: "bg-red-100", border: "border-red-500", text: "text-red-800" },
  "Étereo": { bg: "bg-purple-100", border: "border-purple-500", text: "text-purple-800" },
  "Céu": { bg: "bg-blue-100", border: "border-blue-500", text: "text-blue-800" },
};

const PlayerPersonagens = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentCharacter, setCurrentCharacter] = useState<Character>({
    nome: "",
    raca: "",
    plano: "",
    atributos: {
      forca: 1,
      agilidade: 1,
      vigor: 1,
      presenca: 1,
      intelecto: 1,
    },
    vitalidade: {
      pv: 0,
      pe: 0,
      pp: 0,
      dt: 0,
      dp: 0,
    },
    afinidade: {
      natural: 0,
    },
    herancas: {
      magia: 0,
      influencia: 0,
      sorte: 0,
      talento: 0,
    },
    habilidades: {
      racial: "",
      origem: "",
      extras: [],
    },
    pericias: {
      acrobacia: 0,
      alquimia: 0,
      atletismo: 0,
      arcanismo: 0,
      artes: 0,
      atualidades: 0,
      charme: 0,
      ciencias: 0,
      engenharia: 0,
      extraplanar: 0,
      forja: 0,
      fortitude: 0,
      furtividade: 0,
      historia: 0,
      iniciativa: 0,
      intimidacao: 0,
      intuicao: 0,
      investigacao: 0,
      labia: 0,
      lidarAnimais: 0,
      luta: 0,
      maosLeves: 0,
      medicina: 0,
      natureza: 0,
      navegacao: 0,
      ocultismo: 0,
      oficio: 0,
      percepcao: 0,
      persuasao: 0,
      pontaria: 0,
      reflexos: 0,
      religiao: 0,
      sobrevivencia: 0,
      tatica: 0,
      vontade: 0,
    },
    inventario: {
      itens: [],
      armas: []
    },
    magias: [],
    anotacoes: "",
  });

  const [remainingPoints, setRemainingPoints] = useState(4);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPlano, setSelectedPlano] = useState("");
  const [activeTab, setActiveTab] = useState("atributos");

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

  const handleAttributeChange = (
    attribute: keyof Character['atributos'],
    value: number
  ) => {
    const currentValue = currentCharacter.atributos[attribute];
    const diff = value - currentValue;

    if (remainingPoints - diff < 0) return;
    if (value > 3) return;
    if (value < 0) return;

    const newAttributes = { ...currentCharacter.atributos, [attribute]: value };
    const hasZero = Object.values(newAttributes).some(val => val === 0);
    
    if (value > 2 && !hasZero) return;

    setCurrentCharacter(prev => ({
      ...prev,
      atributos: newAttributes
    }));

    setRemainingPoints(prev => prev - diff);
  };

  const validateCharacter = () => {
    if (!currentCharacter.nome) {
      alert("Nome do personagem é obrigatório!");
      return false;
    }
    if (remainingPoints > 0) {
      alert("Distribua todos os pontos antes de salvar!");
      return false;
    }
    return true;
  };

  const handleSaveCharacter = () => {
    if (!validateCharacter()) return;

    const newCharacter = { ...currentCharacter };
    setCharacters(prev => 
      isEditing 
        ? prev.map(c => c.nome === currentCharacter.nome ? newCharacter : c)
        : [...prev, newCharacter]
    );

    setCurrentCharacter({
      nome: "",
      raca: "",
      plano: "",
      atributos: {
        forca: 1,
        agilidade: 1,
        vigor: 1,
        presenca: 1,
        intelecto: 1,
      },
      vitalidade: {
        pv: 0,
        pe: 0,
        pp: 0,
        dt: 0,
        dp: 0,
      },
      afinidade: {
        natural: 0,
      },
      herancas: {
        magia: 0,
        influencia: 0,
        sorte: 0,
        talento: 0,
      },
      habilidades: {
        racial: "",
        origem: "",
        extras: [],
      },
      pericias: {
        acrobacia: 0,
        alquimia: 0,
        atletismo: 0,
        arcanismo: 0,
        artes: 0,
        atualidades: 0,
        charme: 0,
        ciencias: 0,
        engenharia: 0,
        extraplanar: 0,
        forja: 0,
        fortitude: 0,
        furtividade: 0,
        historia: 0,
        iniciativa: 0,
        intimidacao: 0,
        intuicao: 0,
        investigacao: 0,
        labia: 0,
        lidarAnimais: 0,
        luta: 0,
        maosLeves: 0,
        medicina: 0,
        natureza: 0,
        navegacao: 0,
        ocultismo: 0,
        oficio: 0,
        percepcao: 0,
        persuasao: 0,
        pontaria: 0,
        reflexos: 0,
        religiao: 0,
        sobrevivencia: 0,
        tatica: 0,
        vontade: 0,
      },
      inventario: {
        itens: [],
        armas: []
      },
      magias: [],
      anotacoes: "",
    });
    
    setRemainingPoints(4);
    setIsEditing(false);
    setSelectedPlano("");
    setActiveTab("atributos");
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

  const exportToMarkdown = (character: Character) => {
    const content = `# ${character.nome}
## Raça: ${character.raca}
## Plano: ${character.plano}

## Atributos
- Força: ${character.atributos.forca}
- Agilidade: ${character.atributos.agilidade}
- Vigor: ${character.atributos.vigor}
- Presença: ${character.atributos.presenca}
- Intelecto: ${character.atributos.intelecto}

## Vitalidade
- PV: ${character.vitalidade.pv}
- PE: ${character.vitalidade.pe}
- PP: ${character.vitalidade.pp}
- DT: ${character.vitalidade.dt}
- DP: ${character.vitalidade.dp}

## Habilidades
- Racial: ${character.habilidades.racial}
- Origem: ${character.habilidades.origem}
- Extras: ${character.habilidades.extras.join(", ")}

## Perícias
${Object.entries(character.pericias)
  .map(([pericia, valor]) => `- ${pericias[pericia as keyof typeof pericias]}: ${valor}`)
  .join("\n")}

## Inventário

### Armas (${character.inventario.armas.length})
${character.inventario.armas.map(arma => `
- **${arma.nome}** (${arma.tipo})
  - Dano: ${arma.dano}
  - Descrição: ${arma.descricao}
`).join("\n")}

### Itens (${character.inventario.itens.length})
${character.inventario.itens.map(item => `
- **${item.nome}** (${item.tipo})
  - Descrição: ${item.descricao}
`).join("\n")}

## Magias
${character.magias.join("\n")}

## Anotações
${character.anotacoes}
`;

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${character.nome.replace(/\s+/g, '_')}.md`;
    a.click();
  };

  const periciaCategories = {
    "Combate": ["luta", "pontaria", "reflexos", "iniciativa", "tatica", "intimidacao"],
    "Conhecimento": ["historia", "arcanismo", "ciencias", "religiao", "extraplanar", "ocultismo", "atualidades", "natureza"],
    "Social": ["labia", "persuasao", "charme", "intuicao", "lidarAnimais"],
    "Técnicas": ["alquimia", "engenharia", "forja", "medicina", "navegacao", "oficio"],
    "Aventura": ["acrobacia", "atletismo", "fortitude", "furtividade", "investigacao", "maosLeves", "percepcao", "sobrevivencia", "vontade"],
    "Arte": ["artes"]
  };

  const getPlanoStyle = (plano: string) => {
    return planoColors[plano as keyof typeof planoColors] || { bg: "bg-gray-100", border: "border-gray-500", text: "text-gray-800" };
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

  return (
    <PlayerLayout>
      <div className="bg-gray-900 text-white min-h-screen">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-gray-700 pb-4">
            <h1 className="text-3xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
              Grimório Extraplanar
            </h1>
            
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex items-center gap-2"
              >
                <span className="text-lg">+</span> Novo Personagem
              </button>
            )}
          </div>
          
          {isEditing && (
            <div className={`rounded-lg p-6 mt-6 space-y-6 bg-gray-800 shadow-xl border-2 ${
              selectedPlano && getPlanoStyle(selectedPlano).border
            }`}>
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center">
                  {isEditing ? "Editar" : "Criar"} Personagem
                  {selectedPlano && (
                    <span className={`ml-3 px-3 py-1 rounded-full text-sm ${getPlanoStyle(selectedPlano).bg} ${getPlanoStyle(selectedPlano).text}`}>
                      {selectedPlano}
                    </span>
                  )}
                </h2>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedPlano("");
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-700 p-4 rounded-lg space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Nome</label>
                        <input
                          type="text"
                          value={currentCharacter.nome}
                          onChange={(e) => setCurrentCharacter({...currentCharacter, nome: e.target.value})}
                          className="w-full p-2 bg-gray-600 border border-gray-500 rounded text-white"
                          placeholder="Nome do personagem"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Plano</label>
                        <select
                          value={selectedPlano}
                          onChange={(e) => setSelectedPlano(e.target.value)}
                          className="w-full p-2 bg-gray-600 border border-gray-500 rounded text-white"
                        >
                          <option value="">Selecione um plano</option>
                          {planos.map((plano) => (
                            <option key={plano} value={plano}>{plano}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Raça</label>
                        <select
                          value={currentCharacter.raca}
                          onChange={(e) => setCurrentCharacter({...currentCharacter, raca: e.target.value})}
                          className="w-full p-2 bg-gray-600 border border-gray-500 rounded text-white"
                          disabled={!selectedPlano}
                        >
                          <option value="">Selecione uma raça</option>
                          {Object.entries(races)
                            .filter(([_, data]) => data.plano === selectedPlano)
                            .map(([race]) => (
                              <option key={race} value={race}>{race}</option>
                            ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Habilidade Racial</label>
                        <input
                          type="text"
                          value={currentCharacter.habilidades.racial}
                          readOnly
                          className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-300"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-700 p-4 rounded-lg space-y-3">
                    <h3 className="font-bold text-lg text-purple-300">Atributos</h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(currentCharacter.atributos).map(([key, value]) => (
                        <div key={key} className="bg-gray-800 rounded-lg p-3 flex-1 min-w-[130px]">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium flex items-center gap-2">
                              <span className="text-xl">{attributeIcons[key as keyof typeof attributeIcons]}</span>
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </span>
                            <span className="text-sm text-gray-400">{value}/3</span>
                          </div>
                          <div className="flex justify-between">
                            <div className="flex">
                              {renderAttributeValue(value)}
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => 
                                  handleAttributeChange(
                                    key as keyof Character['atributos'], 
                                    Math.max(0, value - 1)
                                  )
                                }
                                className="w-6 h-6 flex items-center justify-center bg-gray-700 rounded hover:bg-gray-600"
                                disabled={value <= 0}
                              >
                                -
                              </button>
                              <button
                                onClick={() => 
                                  handleAttributeChange(
                                    key as keyof Character['atributos'], 
                                    Math.min(3, value + 1)
                                  )
                                }
                                className="w-6 h-6 flex items-center justify-center bg-gray-700 rounded hover:bg-gray-600"
                                disabled={value >= 3 || remainingPoints <= 0}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-sm text-gray-300 py-2 px-3 bg-gray-800 rounded-lg">
                      Pontos restantes: <span className="font-bold text-purple-300">{remainingPoints}</span>
                      <ul className="list-disc pl-4 mt-2 text-xs">
                        <li>Todos atributos começam com 1 ponto</li>
                        <li>Distribua mais 4 pontos</li>
                        <li>Máximo 2 pontos por atributo (3 se outro for zerado)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-700 p-4 rounded-lg space-y-3">
                    <h3 className="font-bold text-lg text-purple-300">Vitalidade</h3>
                    <div className="grid grid-cols-5 gap-3">
                      {Object.entries(currentCharacter.vitalidade).map(([key, value]) => (
                        <div key={key} className="space-y-1">
                          <label className="block text-xs font-medium text-center">{key.toUpperCase()}</label>
                          <div className={`rounded-full h-16 w-16 mx-auto flex items-center justify-center ${
                            key === 'pv' ? 'bg-red-900/50 border border-red-600' :
                            key === 'pe' ? 'bg-blue-900/50 border border-blue-600' :
                            key === 'pp' ? 'bg-purple-900/50 border border-purple-600' :
                            key === 'dt' ? 'bg-green-900/50 border border-green-600' :
                            'bg-amber-900/50 border border-amber-600'
                          }`}>
                            <input
                              type="number"
                              value={value}
                              onChange={(e) => setCurrentCharacter({
                                ...currentCharacter,
                                vitalidade: {
                                  ...currentCharacter.vitalidade,
                                  [key]: parseInt(e.target.value) || 0
                                }
                              })}
                              className="w-10 text-center bg-transparent text-2xl font-bold text-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-700 p-4 rounded-lg space-y-3">
                    <h3 className="font-bold text-lg text-purple-300">Heranças</h3>
                    <div className="grid grid-cols-4 gap-3">
                      {Object.entries(currentCharacter.herancas).map(([key, value]) => (
                        <div key={key} className="space-y-1">
                          <label className="block text-xs font-medium text-center">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                          <div className="bg-gray-800 rounded-lg p-2 text-center">
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
                              className="w-12 text-center bg-transparent text-xl font-bold text-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex border-b border-gray-700">
                  <button
                    className={`py-2 px-4 ${activeTab === 'pericias' ? 'text-purple-300 border-b-2 border-purple-400' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('pericias')}
                  >
                    Perícias
                  </button>
                  <button
                    className={`py-2 px-4 ${activeTab === 'inventario' ? 'text-purple-300 border-b-2 border-purple-400' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('inventario')}
                  >
                    Inventário
                  </button>
                  <button
                    className={`py-2 px-4 ${activeTab === 'magias' ? 'text-purple-300 border-b-2 border-purple-400' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('magias')}
                  >
                    Magias
                  </button>
                  <button
                    className={`py-2 px-4 ${activeTab === 'anotacoes' ? 'text-purple-300 border-b-2 border-purple-400' : 'text-gray-400'}`}
                    onClick={() => setActiveTab('anotacoes')}
                  >
                    Anotações
                  </button>
                </div>

                <div className="mt-4">
                  {activeTab === 'pericias' && (
                    <div className="bg-gray-800 p-4 rounded-lg">
                      {Object.entries(periciaCategories).map(([category, skills]) => (
                        <div key={category} className="mb-6">
                          <h4 className="font-medium text-purple-300 mb-3">{category}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {skills.map(skill => (
                              <div key={skill} className="flex items-center justify-between bg-gray-700 rounded p-2">
                                <span className="text-sm">{pericias[skill as keyof typeof pericias]}</span>
                                <input
                                  type="number"
                                  value={currentCharacter.pericias[skill as keyof Character['pericias']]}
                                  onChange={(e) => setCurrentCharacter({
                                    ...currentCharacter,
                                    pericias: {
                                      ...currentCharacter.pericias,
                                      [skill]: parseInt(e.target.value) || 0
                                    }
                                  })}
                                  className="w-12 bg-gray-800 p-1 rounded text-center text-white"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
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
                                placeholder="Tipo (ex: Consumível, Equipamento)"
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
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Magias</label>
                        <textarea
                          value={currentCharacter.magias.join("\n")}
                          onChange={(e) => setCurrentCharacter({
                            ...currentCharacter,
                            magias: e.target.value.split("\n")
                          })}
                          className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white h-64"
                          placeholder="Digite uma magia por linha..."
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'anotacoes' && (
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">Anotações</label>
                        <textarea
                          value={currentCharacter.anotacoes}
                          onChange={(e) => setCurrentCharacter({
                            ...currentCharacter,
                            anotacoes: e.target.value
                          })}
                          className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white h-64"
                          placeholder="Escreva suas anotações..."
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSaveCharacter}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium flex-1 hover:shadow-lg transition-all"
                >
                  Salvar Personagem
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedPlano("");
                  }}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium flex-1 hover:bg-gray-500 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {characters.length === 0 ? (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 mt-6">
                <div className="text-center">
                  <div className="text-gray-400 mb-4 text-6xl">📜</div>
                  <p className="text-center text-gray-400 text-lg">Você ainda não tem personagens criados.</p>
                  <p className="text-gray-500 mt-2">Clique em "Novo Personagem" para começar sua jornada.</p>
                </div>
              </div>
            ) : (
            characters.map((character) => (
              <div key={character.nome} className="bg-gray-800 border border-gray-700 rounded-lg p-6 mt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">{character.nome}</h3>
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        setCurrentCharacter(character);
                        setSelectedPlano(character.plano);
                        setIsEditing(true);
                        setRemainingPoints(0);
                      }}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => exportToMarkdown(character)}
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
            ))
          )}
          </div>
        </div>
      </div>
    </PlayerLayout>
  );
};

export default PlayerPersonagens;