import { PlayerLayout } from "@/components/layout/PlayerLayout";
import { useState } from "react";
import { Character } from "../../data/character";
import { CharacterForm } from "../../data/CharacterForm";
import { CharacterCard } from "../../components/ui/CharacterCard";
import { exportToMarkdown } from "../../utils/exportUtils";

const defaultCharacter: Character = {
  nome: "",
  raca: "",
  plano: "",
  linguas: [],
  capacidades: [],
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
    arcana: 0,
    cosmica: 0,
    divina: 0,
    natural: 0,
    necromante: 0,
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
  faixaEtaria: "",
  pericias: {} as Record<string, number>,
  inventario: {
    itens: [],
    armas: []
  },
  magias: [],
  anotacoes: "",
  ocupacoes: [],
};

const PlayerPersonagens = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const handleSaveCharacter = (character: Character) => {
    setCharacters(prev => 
      prev.some(c => c.nome === character.nome) 
        ? prev.map(c => c.nome === character.nome ? character : c)
        : [...prev, character]
    );
    setIsEditing(false);
    setSelectedCharacter(null);
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
                onClick={() => {
                  setSelectedCharacter(defaultCharacter);
                  setIsEditing(true);
                }}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex items-center gap-2"
              >
                <span className="text-lg">+</span> Novo Personagem
              </button>
            )}
          </div>

          {isEditing ? (
            <CharacterForm
              character={selectedCharacter || defaultCharacter}
              onSave={handleSaveCharacter}
              onCancel={() => {
                setIsEditing(false);
                setSelectedCharacter(null);
              }}
            />
          ) : (
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
                  <CharacterCard
                    key={character.nome}
                    character={character}
                    onEdit={() => {
                      setSelectedCharacter(character);
                      setIsEditing(true);
                    }}
                    onExport={() => exportToMarkdown(character)}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </PlayerLayout>
  );
};

export default PlayerPersonagens;