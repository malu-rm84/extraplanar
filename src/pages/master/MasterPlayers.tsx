import { MasterLayout } from "@/components/layout/MasterLayout";
import { useState, useEffect } from 'react';
import { Search, X } from "lucide-react";
import { Character } from "@/data/character";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "@/components/auth/firebase-config";

// Adicionar tipo estendido para incluir o ID do Firestore
type CharacterWithId = Character & { id: string };

const SearchBar = ({ onSearch, searchResults, clearSearch, searchQuery, setSearchQuery }) => {
  return (
    <div className="relative mb-8 max-w-2xl mx-auto">
      <div className="flex items-center bg-black/30 backdrop-blur-lg rounded-full px-4 shadow-lg border border-white/10">
        <Search size={20} className="text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Procurar jogadores..."
          className="flex-1 py-3 px-4 bg-transparent outline-none placeholder:text-muted-foreground/50"
        />
        {searchQuery && (
          <button onClick={clearSearch} className="p-2 hover:text-primary">
            <X size={20} />
          </button>
        )}
      </div>

      {searchResults.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-black/50 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden border border-white/10">
          {searchResults.map((result, i) => (
            <button
              key={i}
              onClick={() => {
                onSearch(result);
                clearSearch();
              }}
              className="p-4 w-full text-left hover:bg-white/5 border-b border-white/5 last:border-0"
            >
              <div className="font-medium">{result.nome}</div>
              <div className="text-sm text-muted-foreground mt-1">{result.raca} - {result.plano}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const CharacterSection = ({ character }: { character: CharacterWithId }) => {
  return (
    <div className="mb-4 bg-black/20 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
      <div className="p-4 flex items-center gap-3 bg-gradient-to-r from-primary/30 to-transparent">
        <h3 className="text-lg font-semibold text-primary">{character.nome}</h3>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-muted-foreground">
          <div>
            <label className="text-sm text-primary">Raça</label>
            <p>{character.raca}</p>
          </div>
          <div>
            <label className="text-sm text-primary">Plano</label>
            <p>{character.plano}</p>
          </div>
          <div>
            <label className="text-sm text-primary">PV/PE</label>
            <p>{character.vitalidade?.pv}/{character.vitalidade?.pe}</p>
          </div>
          <div>
            <label className="text-sm text-primary">Nível</label>
            <p>{(character.atributos && Math.floor(Object.values(character.atributos).reduce((a, b) => a + b, 0)/3)) || 1}</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full">
            <thead className="bg-primary/10">
              <tr>
                <th className="p-3 text-left text-sm font-medium text-primary">Atributo</th>
                <th className="p-3 text-left text-sm font-medium text-primary">Valor</th>
              </tr>
            </thead>
            <tbody>
              {character.atributos && Object.entries(character.atributos).map(([key, value], i) => (
                <tr key={i} className="border-t border-white/5 hover:bg-white/5">
                  <td className="p-3 text-sm capitalize">{key}</td>
                  <td className="p-3 text-sm">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MasterPlayers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CharacterWithId[]>([]);
  const [characters, setCharacters] = useState<CharacterWithId[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "characters"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chars: CharacterWithId[] = [];
      querySnapshot.forEach((doc) => {
        chars.push({ 
          id: doc.id, // ID do documento Firestore
          ...doc.data() as Character
        } as CharacterWithId);
      });
      setCharacters(chars);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const results = characters.filter(char =>
      char.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      char.raca.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults(results.slice(0, 5));
  }, [searchQuery, characters]);

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <MasterLayout>
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="text-center mb-12 pt-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Jogadores e Personagens
          </h1>
          <p className="text-muted-foreground text-lg">
            Gerencie todos os personagens dos jogadores
          </p>
        </div>

        <SearchBar
          onSearch={(char: CharacterWithId) => {
            // Implemente navegação se necessário
          }}
          searchResults={searchResults}
          clearSearch={clearSearch}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <div className="space-y-8">
          {loading ? (
            <div className="text-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Carregando personagens...</p>
            </div>
          ) : characters.length === 0 ? (
            <div className="bg-black/20 backdrop-blur-lg rounded-xl border border-white/10 p-6 mt-6 animate-fadeIn">
              <p className="text-center text-muted-foreground/80">Nenhum personagem encontrado.</p>
            </div>
          ) : (
            characters.map((character) => (
              <CharacterSection key={character.id} character={character} />
            ))
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </MasterLayout>
  );
};

export default MasterPlayers;