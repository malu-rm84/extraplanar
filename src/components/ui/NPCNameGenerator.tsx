// src/components/NPCNameGenerator.tsx

import React, { useState } from 'react';
import { maleNames, femaleNames, surnames } from '../../data/names';

const getRandomElement = (array: string[]) => {
  return array[Math.floor(Math.random() * array.length)];
};

const NPCNameGenerator = () => {
  const [npcList, setNpcList] = useState<string[]>([]);
  const [generatedName, setGeneratedName] = useState<string | null>(null);

  const generateName = () => {
    const gender = Math.random() < 0.5 ? 'male' : 'female';
    const firstName = gender === 'male' ? getRandomElement(maleNames) : getRandomElement(femaleNames);
    const surname = getRandomElement(surnames);
    const newName = `${firstName} ${surname}`;
    
    setNpcList([...npcList, newName]);
    setGeneratedName(newName);
  };

  const closePopup = () => {
    setGeneratedName(null);
  };

  return (
    <div className="npc-name-generator">
      <h2 className="text-xl font-bold">Gerador de Nomes de NPCs</h2>
      <button onClick={generateName} className="mt-4 p-2 bg-blue-500 text-white rounded">
        Gerar Nome
      </button>

      {generatedName && (
        <div className="popup fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-bold">Nome Gerado:</h3>
            <p className="text-xl">{generatedName}</p>
            <button onClick={closePopup} className="mt-4 p-2 bg-red-500 text-white rounded">
              Fechar
            </button>
          </div>
        </div>
      )}

      <h3 className="mt-6 text-lg font-bold">NPCs Gerados:</h3>
      <ul className="list-disc pl-5">
        {npcList.map((npc, index) => (
          <li key={index}>{npc}</li>
        ))}
      </ul>
    </div>
  );
};

export default NPCNameGenerator;
