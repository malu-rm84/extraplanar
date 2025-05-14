import { useState, useEffect, useCallback } from 'react';
import { MasterLayout } from "@/components/layout/MasterLayout";
import systemInfo from "@/data/systemInfo";
import { Info, Backpack, Users, Ship, Globe, Skull, Search, X } from "lucide-react";

const SubsectionDropdown = ({ subsection }) => {
  const processContent = (content) => {
    const blocks = [];
    let currentBlock = null;

    content.forEach((line) => {
      const trimmedLine = line.trim();
      
      // Ignorar linhas de formatação markdown
      if (trimmedLine.match(/^[\s|:-]+$/)) return;

      if (trimmedLine.includes('|')) {
        if (!currentBlock || currentBlock.type !== 'table') {
          currentBlock = { type: 'table', lines: [] };
          blocks.push(currentBlock);
        }
        currentBlock.lines.push(line);
      } else if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
        if (!currentBlock || currentBlock.type !== 'list') {
          currentBlock = { type: 'list', lines: [] };
          blocks.push(currentBlock);
        }
        currentBlock.lines.push(line);
      } else {
        if (!currentBlock || currentBlock.type !== 'text') {
          currentBlock = { type: 'text', lines: [] };
          blocks.push(currentBlock);
        }
        currentBlock.lines.push(line);
      }
    });

    return blocks;
  };

  const contentBlocks = processContent(subsection.content);

  return (
    <div className="mb-4 bg-black/20 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden">
      <div className="p-4 flex items-center gap-3 bg-gradient-to-r from-primary/30 to-transparent">
        <Info size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-primary">{subsection.title}</h3>
      </div>

      <div className="p-4 space-y-4">
        {contentBlocks.map((block, index) => (
          <div key={index} className="space-y-3">
            {block.type === 'table' && (
              <div className="overflow-x-auto rounded-lg border border-white/10">
                <table className="w-full">
                  <thead className="bg-primary/10">
                    <tr>
                      {block.lines[0]?.split('|')
                        .filter(c => c.trim())
                        .map((header, j) => (
                          <th key={j} className="p-3 text-left text-sm font-medium text-primary">
                            {header.trim()}
                          </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.lines.slice(1).map((row, j) => {
                      const cells = row.split('|').filter(c => c.trim());
                      return (
                        <tr key={j} className="border-t border-white/5 hover:bg-white/5">
                          {cells.map((cell, k) => (
                            <td key={k} className="p-3 text-sm text-muted-foreground">
                              {cell.trim()}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {block.type === 'list' && (
              <ul className="space-y-2 pl-4 border-l-2 border-primary/30">
                {block.lines.map((item, i) => (
                  <li key={i} className="text-muted-foreground flex items-start gap-2">
                    <span className="text-primary">▹</span>
                    {item.replace(/^[-*]+/, '').trim()}
                  </li>
                ))}
              </ul>
            )}

            {block.type === 'text' && (
              <div className="text-muted-foreground space-y-2 leading-relaxed">
                {block.lines.map((line, i) => (
                  <p key={i} className="text-justify">{line}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const SystemSection = ({ section }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="p-6 bg-black/30 backdrop-blur-lg rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-primary">{section.title}</h2>
        
        <div className="space-y-4">
          <div className="p-4 bg-black/20 rounded-lg border border-white/10">
            <h3 className="text-lg font-medium mb-3 text-primary">Descrição</h3>
            <ul className="space-y-3">
              {section.details.map((detail, i) => (
                <li key={i} className="text-muted-foreground flex gap-2">
                  <span className="text-primary mt-1">•</span>
                  {detail}
                </li>
              ))}
            </ul>
          </div>

          {section.subsections?.map((subsection, i) => (
            <SubsectionDropdown key={i} subsection={subsection} />
          ))}
        </div>
      </div>
    </div>
  );
};

const SearchBar = ({ onSearch, searchResults, clearSearch, searchQuery, setSearchQuery }) => {
  const categoryIcons = {
    "Navegação": <Ship className="text-blue-400" />,
    "Personagens": <Users className="text-emerald-400" />,
    "Itens": <Backpack className="text-amber-400" />,
    "Cidades": <Globe className="text-purple-400" />,
    "Monstros": <Skull className="text-rose-400" />,
  };

  return (
    <div className="relative mb-8 max-w-2xl mx-auto">
      <div className="flex items-center bg-black/30 backdrop-blur-lg rounded-full px-4 shadow-lg border border-white/10">
        <Search size={20} className="text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Procurar no compêndio..."
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
                onSearch(result.category, result.sectionIndex);
                clearSearch();
              }}
              className="p-4 w-full text-left hover:bg-white/5 border-b border-white/5 last:border-0 flex items-start gap-3"
            >
              <div className="text-primary shrink-0">
                {categoryIcons[result.category]}
              </div>
              <div className="flex-1">
                <div className="font-medium">{result.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{result.preview}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const MasterSistema = () => {
  const [activeCategory, setActiveCategory] = useState("Personagens");
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const navigateTo = useCallback((category, sectionIndex) => {
    setActiveCategory(category);
    setActiveTab(sectionIndex);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const normalizedQuery = searchQuery.toLowerCase().trim();
    const results = [];

    systemInfo.forEach(category => {
      category.sections.forEach((section, sectionIndex) => {
        const matchInTitle = section.title.toLowerCase().includes(normalizedQuery);
        const matchInDetails = section.details.some(detail => 
          detail.toLowerCase().includes(normalizedQuery)
        );

        if (matchInTitle || matchInDetails) {
          results.push({
            category: category.title,
            section: section.title,
            sectionIndex: sectionIndex,
            title: `${section.title} (${category.title})`,
            preview: matchInDetails 
              ? section.details.find(d => d.toLowerCase().includes(normalizedQuery)) 
              : section.details[0] || '',
          });
        }

        section.subsections?.forEach(subsection => {
          const matchInSubTitle = subsection.title.toLowerCase().includes(normalizedQuery);
          const matchInContent = subsection.content.some(item => 
            item.toLowerCase().includes(normalizedQuery)
          );

          if (matchInSubTitle || matchInContent) {
            results.push({
              category: category.title,
              section: section.title,
              sectionIndex: sectionIndex,
              title: `${subsection.title} (${section.title})`,
              preview: matchInContent 
                ? subsection.content.find(c => c.toLowerCase().includes(normalizedQuery)) 
                : subsection.content[0] || '',
            });
          }
        });
      });
    });

    setSearchResults(results.slice(0, 10));
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <MasterLayout>
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="text-center mb-12 pt-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Sistema Extraplanar
          </h1>
          <p className="text-muted-foreground text-lg">
            O arquivo definitivo das realidades além do véu
          </p>
        </div>

        <SearchBar 
          onSearch={navigateTo}
          searchResults={searchResults}
          clearSearch={clearSearch}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Categorias */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {systemInfo.map((category, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveCategory(category.title);
                setActiveTab(0);
              }}
              className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all ${
                activeCategory === category.title
                  ? 'bg-primary/20 border border-primary/30 text-primary shadow-glow'
                  : 'bg-black/30 border border-white/10 hover:border-primary/30 hover:text-primary'
              }`}
            >
              {categoryIcons[category.title]}
              {category.title}
            </button>
          ))}
        </div>

        {/* Conteúdo */}
        <div className="space-y-8">
          {/* Sub-navegação */}
          <div className="flex flex-wrap gap-2 justify-center">
            {systemInfo.find(c => c.title === activeCategory)?.sections.map((section, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  activeTab === i
                    ? 'bg-primary text-primary-foreground shadow-glow'
                    : 'bg-black/30 border border-white/10 hover:bg-primary/20'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>

          {/* Seção Ativa */}
          {systemInfo.find(c => c.title === activeCategory)?.sections.map((section, i) => (
            activeTab === i && <SystemSection key={i} section={section} />
          ))}
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
        .shadow-glow {
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.3);
        }
        body {
          background: #0a0a0a;
        }
      `}</style>
    </MasterLayout>
  );
};

const categoryIcons = {
  "Navegação": <Ship className="text-blue-400" />,
  "Personagens": <Users className="text-emerald-400" />,
  "Itens": <Backpack className="text-amber-400" />,
  "Cidades": <Globe className="text-purple-400" />,
  "Monstros": <Skull className="text-rose-400" />,
};

export default MasterSistema;