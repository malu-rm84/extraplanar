import { useState, useEffect, useCallback } from 'react';
import { MasterLayout } from "@/components/layout/MasterLayout";
import systemInfo from "@/data/systemInfo";
import { ChevronDown, ChevronRight, Info, Anchor, Users, Globe, BookOpen, Ship, Search, X } from "lucide-react";

const SubsectionDropdown = ({ subsection }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Detecta se o conteúdo é uma tabela
  const isTable = subsection.content && subsection.content[0]?.includes('|');
  
  return (
    <div className="mb-3 border rounded-md overflow-hidden bg-white/5 backdrop-blur-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 text-left font-medium hover:bg-primary/10 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Info size={16} className="text-primary/70" />
          {subsection.title}
        </span>
        {isOpen ? 
          <ChevronDown size={18} className="text-primary/70" /> : 
          <ChevronRight size={18} className="text-primary/70" />
        }
      </button>
      
      {isOpen && (
        <div className="p-3 pt-0 border-t">
          {isTable ? (
            <div className="overflow-x-auto mt-2">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-primary/10">
                    {subsection.content[0].split('|').filter(c => c.trim()).map((header, j) => (
                      <th key={j} className="p-2 text-left text-sm font-semibold">{header.trim()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {subsection.content.slice(2).filter(row => row.includes('|')).map((row, j) => (
                    <tr key={j} className={j % 2 === 0 ? "bg-muted/30" : ""}>
                      {row.split('|').filter(c => c.trim()).map((cell, k) => (
                        <td key={k} className="p-2 text-sm">{cell.trim()}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <ul className="list-disc pl-5 pt-2 space-y-1">
              {subsection.content.map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground">{item}</li>
              ))}
            </ul>
          )}
          
          {subsection.content.some(c => c.includes('*')) && (
            <p className="text-xs text-muted-foreground mt-2 italic">
              {subsection.content.find(c => c.includes('*'))}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// Componente para seção com conteúdo expandível
const SystemSection = ({ section }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="bg-card border rounded-lg p-4 my-3 shadow-sm hover:shadow-md transition-shadow">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <h2 className="text-xl font-semibold">{section.title}</h2>
        {isExpanded ? 
          <ChevronDown size={20} className="text-primary" /> : 
          <ChevronRight size={20} className="text-primary" />
        }
      </button>
      
      {isExpanded && (
        <div className="mt-4 space-y-3 animate-fadeIn">
          <div className="bg-muted/30 p-3 rounded-md">
            <h3 className="font-medium mb-2 text-primary">Descrição</h3>
            <ul className="list-disc pl-5">
              {section.details.map((detail, i) => (
                <li key={i} className="text-muted-foreground mb-2">
                  {detail}
                </li>
              ))}
            </ul>
          </div>

          {section.subsections?.map((subsection, i) => (
            <SubsectionDropdown key={i} subsection={subsection} />
          ))}
        </div>
      )}
    </div>
  );
};

// Componente de barra de pesquisa
const SearchBar = ({ onSearch, searchResults, clearSearch, searchQuery, setSearchQuery }) => {
  return (
    <div className="relative mb-6">
      <div className="flex items-center border rounded-lg overflow-hidden bg-background shadow-sm focus-within:ring-2 focus-within:ring-primary/50">
        <div className="pl-3 text-muted-foreground">
          <Search size={18} />
        </div>
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Pesquisar raças, perícias, línguas..."
          className="py-2 px-3 w-full bg-transparent outline-none text-sm"
        />
        {searchQuery && (
          <button 
            onClick={clearSearch}
            className="px-3 py-2 text-muted-foreground hover:text-foreground"
          >
            <X size={18} />
          </button>
        )}
      </div>
      
      {/* Lista de resultados */}
      {searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg max-h-80 overflow-y-auto z-20">
          {searchResults.map((result, i) => (
            <button
              key={i}
              onClick={() => {
                onSearch(result.category, result.sectionIndex);
                clearSearch();
              }}
              className="p-3 w-full text-left border-b last:border-0 hover:bg-muted/50 flex items-start"
            >
              <div className="text-primary mr-2 mt-0.5">
                {categoryIcons[result.category]}
              </div>
              <div>
                <div className="font-medium">{result.title}</div>
                <div className="text-sm text-muted-foreground truncate">{result.preview}</div>
                <div className="text-xs text-primary mt-1">{result.category} → {result.section}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
const categoryIcons = {
  "Barcos": <Ship className="text-blue-500" />,
  "Personagens": <Users className="text-emerald-500" />,
  "Raças": <Users className="text-amber-500" />,
  "Línguas": <Globe className="text-violet-500" />,
  "Perícias": <BookOpen className="text-rose-500" />
};

// Componente principal
const MasterSistema = () => {
  const [activeCategory, setActiveCategory] = useState("Personagens");
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigateTo = useCallback((category, sectionIndex) => {
    setActiveCategory(category);
    setActiveTab(sectionIndex);
  }, []);

  // Função de pesquisa
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const normalizedQuery = searchQuery.toLowerCase().trim();
    const results = [];

    // Pesquisa em todas as categorias e seções
    systemInfo.forEach(category => {
      category.sections.forEach((section, sectionIndex) => {
        // Pesquisa no título e detalhes da seção
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

        // Pesquisa nas subseções
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

  // Limpar pesquisa
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  // Adiciona estilização dinâmica com base na categoria
  const getCategoryColor = (category) => {
    switch(category) {
      case "Barcos": return "from-blue-500/20 to-blue-700/10";
      case "Personagens": return "from-emerald-500/20 to-emerald-700/10";
      case "Raças": return "from-amber-500/20 to-amber-700/10";
      case "Línguas": return "from-violet-500/20 to-violet-700/10";
      case "Perícias": return "from-rose-500/20 to-rose-700/10";
      default: return "from-gray-500/20 to-gray-700/10";
    }
  };

  return (
    <MasterLayout>
      <div className="max-w-5xl mx-auto pb-16">
        {/* Menu de categorias principal */}
        <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-md border-b mb-4 pb-2">
          <h1 className="text-3xl font-serif font-bold my-4">Sistema de RPG</h1>
          
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {systemInfo.map((category, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveCategory(category.title);
                  setActiveTab(0);
                }}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 min-w-max transition-all ${
                  activeCategory === category.title 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'bg-muted hover:bg-accent'
                }`}
              >
                <span>{categoryIcons[category.title]}</span>
                {category.title}
              </button>
            ))}
          </div>
        </div>

        {/* Barra de pesquisa */}
        <SearchBar 
          onSearch={navigateTo}
          searchResults={searchResults}
          clearSearch={clearSearch}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Container principal com o gradiente da categoria ativa */}
        <div className={`rounded-xl p-6 bg-gradient-to-br ${getCategoryColor(activeCategory)}`}>
          {/* Descrição da categoria */}
          <div className="flex items-center gap-3 mb-6 p-4 bg-background/40 backdrop-blur-sm rounded-lg shadow-sm">
            <div className="text-3xl">
              {categoryIcons[activeCategory]}
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">{activeCategory}</h2>
              <p className="text-muted-foreground">
                {systemInfo.find(c => c.title === activeCategory)?.description}
              </p>
            </div>
          </div>
          
          {/* Sub-navegação */}
          <div className="flex gap-2 border-b pb-2 mb-4 overflow-x-auto scrollbar-thin">
            {systemInfo.find(c => c.title === activeCategory)?.sections.map((section, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-2 rounded-lg min-w-max transition-all ${
                  activeTab === i 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'bg-background/50 hover:bg-background/80'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>

          {/* Conteúdo da seção ativa */}
          <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4">
            {systemInfo.find(c => c.title === activeCategory)?.sections.map((section, i) => (
              activeTab === i && (
                <SystemSection 
                  key={i} 
                  section={section}
                />
              )
            ))}
          </div>
        </div>
      </div>
    </MasterLayout>
  );
};

// Adiciona estilos globais para animações
const globalStyles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}
.scrollbar-thin::-webkit-scrollbar {
  height: 6px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(155, 155, 155, 0.5);
  border-radius: 3px;
}
`;

// Insere estilos globais
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = globalStyles;
  document.head.appendChild(style);
}

export default MasterSistema;