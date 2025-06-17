import { useState, useEffect, useCallback } from 'react';
import { 
  MasterLayout 
} from "@/components/layout/MasterLayout";
import { systemInfo } from "@/data/index";
import { 
  Info, 
  Backpack, 
  Users, 
  Ship, 
  Globe, 
  Map, 
  Search, 
  Star, 
  Briefcase, 
  Calendar, 
  X,
  ChevronDown,
  ChevronRight,
  Menu,
  BookOpen,
  ChevronUp,
  Scroll,
  Wand
} from "lucide-react";

interface Section {
  title: string;
  details?: string[];
  subsections?: any[];
  color?: string;
}

// Content display components
const TableBlock = ({ data }) => (
  <div className="overflow-x-auto rounded-lg border-2 border-amber-600/30 text-sm bg-gradient-to-br from-amber-50/5 to-orange-50/5 backdrop-blur-sm">
    <table className="w-full min-w-[600px]">
      <thead className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-b-2 border-amber-600/40">
        <tr>
          {data[0]?.split('|')
            .filter(c => c.trim())
            .map((header, j) => (
              <th key={j} className="p-3 text-left font-serif font-bold text-amber-200 tracking-wide">
                {header.trim()}
              </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.slice(1).map((row, j) => {
          const cells = row.split('|').filter(c => c.trim());
          return (
            <tr key={j} className="border-t border-amber-600/20 hover:bg-amber-50/10 transition-colors">
              {cells.map((cell, k) => (
                <td key={k} className="p-3 text-amber-100/90 font-serif">
                  {cell.trim()}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

const ListBlock = ({ data }) => (
  <div className="space-y-3 pl-6 border-l-3 border-amber-600/50 text-sm relative">
    <div className="absolute -left-2 top-0 w-4 h-4 bg-amber-600 rounded-full shadow-glow"></div>
    {data.map((item, i) => (
      <div key={i} className="text-amber-100/90 flex items-start gap-3 font-serif">
        <span className="text-amber-400 mt-1 text-lg">◆</span>
        <span className="leading-relaxed">{item.replace(/^[-*]+/, '').trim()}</span>
      </div>
    ))}
  </div>
);

const TextBlock = ({ data }) => (
  <div className="text-amber-100/90 space-y-3 leading-relaxed text-sm font-serif">
    {data.map((line, i) => (
      <p key={i} className="text-justify first-letter:text-2xl first-letter:font-bold first-letter:text-amber-300 first-letter:float-left first-letter:mr-2 first-letter:mt-1">
        {line}
      </p>
    ))}
  </div>
);

const ContentRenderer = ({ content }) => {
  if (!content || content.length === 0) return null;
  
  const processContent = (content) => {
    const blocks = [];
    let currentBlock = null;
    content.forEach((line) => {
      const trimmedLine = line.trim();
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

  const contentBlocks = processContent(content);

  return (
    <div className="space-y-6">
      {contentBlocks.map((block, index) => (
        <div key={index}>
          {block.type === 'table' && <TableBlock data={block.lines} />}
          {block.type === 'list' && <ListBlock data={block.lines} />}
          {block.type === 'text' && <TextBlock data={block.lines} />}
        </div>
      ))}
    </div>
  );
};

const SubsectionRenderer = ({ subsection, sectionColor }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6 mystic-scroll group hover:border-amber-500/60 transition-all duration-300">
      <button 
        className={`w-full p-4 flex items-center justify-between transition-all duration-300 hover:bg-amber-50/10 rounded-t-lg`}
        onClick={() => setIsOpen(!isOpen)}
        style={{ borderLeft: `4px solid ${sectionColor}` }}
      >
        <div className="flex items-center gap-3">
          <Scroll size={18} style={{ color: sectionColor }} className="animate-float" />
          <h3 className="text-base font-serif font-bold" style={{ color: sectionColor }}>
            {subsection.title}
          </h3>
        </div>
        {isOpen ? 
          <ChevronUp size={18} className="text-amber-300 transition-transform duration-300" /> : 
          <ChevronDown size={18} className="text-amber-300 transition-transform duration-300" />
        }
      </button>
      
      {isOpen && (
        <div className="p-6 border-t border-amber-600/20 bg-gradient-to-br from-amber-50/5 to-orange-50/5 rounded-b-lg">
          {subsection.details?.map((detail, i) => (
            <p key={i} className="mb-3 text-amber-100/90 text-sm font-serif leading-relaxed">{detail}</p>
          ))}
          
          {subsection.content && (
            <ContentRenderer content={subsection.content} />
          )}
          
          {subsection.subsections?.map((nestedSubsection, j) => (
            <SubsectionRenderer 
              key={j} 
              subsection={nestedSubsection} 
              sectionColor={sectionColor} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Sidebar Navigation
const SidebarSection = ({ category, section, isActive, onClick, sectionColor }) => {
  const [isOpen, setIsOpen] = useState(isActive);
  
  useEffect(() => {
    if (isActive) setIsOpen(true);
  }, [isActive]);
  
  return (
    <div className="mb-2">
      <button 
        className={`w-full text-left p-3 rounded-lg flex items-center justify-between text-sm font-serif transition-all duration-300 ${
          isActive ? 'bg-gradient-to-r from-amber-600/30 to-orange-600/20 border border-amber-500/50 font-bold shadow-mystical' : 'hover:bg-amber-50/10 hover:border-amber-600/30 border border-transparent'
        }`}
        onClick={() => {
          onClick();
          setIsOpen(!isOpen);
        }}
      >
        <div className="flex items-center gap-3">
          {isOpen ? <ChevronDown size={16} className="text-amber-300" /> : <ChevronRight size={16} className="text-amber-300" />}
          <span style={{ color: sectionColor }} className="tracking-wide">{section.title}</span>
        </div>
      </button>
      
      {isOpen && section.subsections && (
        <div className="pl-6 mt-2 space-y-2 border-l-2 border-amber-600/30">
          {section.subsections.map((subsection, i) => (
            <div key={i} className="mb-2">
              <div 
                className="p-2 rounded-md hover:bg-amber-50/10 cursor-pointer flex items-center gap-3 text-sm font-serif transition-all duration-300 hover:translate-x-1"
                onClick={() => document.getElementById(`subsection-${section.title}-${i}`).scrollIntoView({ behavior: 'smooth' })}
                style={{ color: sectionColor }}
              >
                <span className="text-amber-400 text-xs">◇</span>
                {subsection.title}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SidebarCategory = ({ category, activeCategory, activeSection, onSelectSection }) => {
  const [isOpen, setIsOpen] = useState(category.title === activeCategory);
  
  const getPlanColor = (title) => {
    return "#7c3aed"; // primary color
  };
  
  const categoryIcons = {
    "Barco": <Ship size={18} className="animate-float" />,
    "Personagens": <Users size={18} className="animate-float" />,
    "Inventário": <Backpack size={18} className="animate-float" />,
    "Cidades": <Globe size={18} className="animate-float" />,
    "Planos": <Map size={18} className="animate-float" />,
    "Perícias": <Star size={18} className="animate-float" />,
    "Ocupações": <Briefcase size={18} className="animate-float" />
  };
  
  const sectionColor = getPlanColor(category.title);
  
  useEffect(() => {
    if (category.title === activeCategory) setIsOpen(true);
  }, [activeCategory, category.title]);
  
  return (
    <div className="mb-3">
      <button 
        className={`w-full text-left p-4 rounded-xl flex items-center justify-between text-sm font-serif font-bold transition-all duration-300 border-2 ${
          category.title === activeCategory 
            ? 'bg-gradient-to-r from-primary/30 to-purple-600/20 text-primary border-primary/50 shadow-magical' 
            : 'hover:bg-amber-50/10 border-amber-600/30 hover:border-amber-500/50 text-amber-200'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <span style={{ color: sectionColor }}>{categoryIcons[category.title]}</span>
          <span className="tracking-wide text-base">
            {category.title}
          </span>
        </div>
        {isOpen ? <ChevronDown size={16} className="text-amber-300" /> : <ChevronRight size={16} className="text-amber-300" />}
      </button>
      
      {isOpen && (
        <div className="pl-4 mt-3 space-y-2 border-l-3 border-amber-600/40 ml-2">
          {category.sections.map((section, i) => (
            <SidebarSection 
              key={i}
              category={category.title}
              section={section}
              isActive={category.title === activeCategory && i === activeSection}
              onClick={() => onSelectSection(category.title, i)}
              sectionColor={category.title === "Planos" && section.color ? section.color : sectionColor}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ activeCategory, activeSection, onSelectSection, isSidebarOpen, toggleSidebar }) => {
  return (
    <div className={`h-full overflow-y-auto custom-scrollbar mystic-scroll md:bg-gradient-to-b md:from-amber-900/20 md:to-orange-900/10 backdrop-blur-xl w-[320px] fixed md:relative z-50 md:z-auto transform transition-transform duration-300 ease-in-out border-2 border-amber-600/30 ${
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    }`}>
      <div className="p-4 relative h-full">
        {/* Botão de fechar */}
        <button 
          onClick={toggleSidebar}
          className="md:hidden absolute top-4 right-4 p-2 hover:text-primary rounded-lg hover:bg-amber-50/10 transition-colors"
        >
          <X size={20} />
        </button>
        
        {/* Título do Grimório */}
        <div className="mb-6 text-center border-b-2 border-amber-600/40 pb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BookOpen className="text-amber-400 animate-glow" size={24} />
            <Wand className="text-primary animate-glow" size={20} />
          </div>
          <h2 className="font-medieval text-xl text-amber-200 glowing-text">
            Grimório do Sistema
          </h2>
          <p className="text-amber-300/70 text-xs font-serif mt-1">
            Compêndio de Conhecimento Extraplanar
          </p>
        </div>
      
        <div className="space-y-2">
          {systemInfo.map((category, i) => (
            <SidebarCategory 
              key={i} 
              category={category} 
              activeCategory={activeCategory}
              activeSection={activeSection}
              onSelectSection={onSelectSection}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Main content display
const ContentSection = ({ section, sectionColor, category }) => {
  const displayColor = category === "Planos" && (section as Section).color 
    ? (section as Section).color 
    : sectionColor;
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="mystic-scroll relative overflow-hidden">
        {/* Decorative corners */}
        <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-500/60 rounded-tl-lg"></div>
        <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-500/60 rounded-tr-lg"></div>
        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-500/60 rounded-bl-lg"></div>
        <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-500/60 rounded-br-lg"></div>
        
        <div className="p-8">
          <div className="text-center mb-8 relative">
            <div className="ornamental-divider mb-6"></div>
            <h2 className="text-2xl md:text-3xl font-medieval font-bold tracking-wide" style={{ color: displayColor }}>
              {section.title}
            </h2>
            <div className="mt-2 w-24 h-1 mx-auto rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${displayColor}, transparent)` }}></div>
            <div className="ornamental-divider mt-6"></div>
          </div>
          
          {section.details?.length > 0 && (
            <div className="parchment-section mb-8 relative">
              <div className="absolute top-3 left-3 text-amber-600/40 text-6xl font-medieval">❦</div>
              <h3 className="text-lg font-serif font-bold mb-4 text-center" style={{ color: displayColor }}>
                Sabedoria Ancestral
              </h3>
              <ul className="space-y-3 relative z-10">
                {section.details.map((detail, i) => (
                  <li key={i} className="text-amber-100/90 flex gap-3 text-sm font-serif leading-relaxed">
                    <span style={{ color: displayColor }} className="mt-1 text-lg">⚬</span>
                    <span className="first-letter:text-lg first-letter:font-bold first-letter:text-amber-300">
                      {detail}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="space-y-6">
            {section.subsections?.map((subsection, i) => (
              <div key={i} id={`subsection-${section.title}-${i}`}>
                <SubsectionRenderer subsection={subsection} sectionColor={displayColor} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Search component
const SearchBar = ({ onSearch, searchResults, clearSearch, searchQuery, setSearchQuery }) => {
  const categoryIcons = {
    "Barco": <Ship size={16} />,
    "Personagens": <Users size={16} />,
    "Inventário": <Backpack size={16} />,
    "Cidades": <Globe size={16} />,
    "Planos": <Map size={16} />,   
    "Perícias": <Star size={16} />,
    "Ocupações": <Briefcase size={16} />,
  };

  return (
    <div className="relative mb-6 w-full max-w-2xl mx-auto">
      <div className="flex items-center mystic-scroll px-4 py-3 shadow-mystical">
        <Search size={18} className="text-amber-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar nos grimórios..."
          className="flex-1 py-2 px-4 bg-transparent outline-none placeholder:text-amber-300/50 text-amber-100 font-serif"
        />
        {searchQuery && (
          <button onClick={clearSearch} className="p-2 hover:text-primary transition-colors rounded-lg hover:bg-amber-50/10">
            <X size={16} />
          </button>
        )}
      </div>
      
      {searchResults.length > 0 && (
        <div className="absolute top-full mt-2 w-full mystic-scroll shadow-mystical overflow-hidden z-20">
          {searchResults.map((result, i) => (
            <button
              key={i}
              onClick={() => {
                onSearch(result.category, result.sectionIndex);
                clearSearch();
              }}
              className="p-4 w-full text-left hover:bg-amber-50/10 border-b border-amber-600/20 last:border-0 flex items-start gap-3 text-sm font-serif transition-all duration-300"
            >
              <div className="text-primary shrink-0">
                {categoryIcons[result.category]}
              </div>
              <div className="flex-1">
                <div className="font-bold text-amber-200">{result.title}</div>
                <div className="text-amber-300/80 mt-1 line-clamp-2">{result.preview}</div>
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
  const [activeSection, setActiveSection] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const getCategoryColor = (categoryTitle, sectionIndex = 0) => {
    if (categoryTitle === "Planos") {
      const categoryObj = systemInfo.find(c => c.title === categoryTitle);
      const section = categoryObj?.sections[sectionIndex] as Section;
      return section?.color || "#f97316";
    }
    return "#94a3b8";
  };
  
  const navigateTo = useCallback((category, sectionIndex) => {
    setActiveCategory(category);
    setActiveSection(sectionIndex);
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
        const matchInDetails = section.details?.some(detail => 
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
              : section.details?.[0] || '',
          });
        }
        
        section.subsections?.forEach(subsection => {
          const matchInSubTitle = subsection.title.toLowerCase().includes(normalizedQuery);
          const matchInContent = subsection.content?.some(item => 
            item?.toLowerCase().includes(normalizedQuery)
          );
          
          if (matchInSubTitle || matchInContent) {
            results.push({
              category: category.title,
              section: section.title,
              sectionIndex: sectionIndex,
              title: `${subsection.title} (${section.title})`,
              preview: matchInContent 
                ? subsection.content.find(c => c.toLowerCase().includes(normalizedQuery)) 
                : subsection.content?.[0] || '',
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
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const activeCategoryObject = systemInfo.find(c => c.title === activeCategory);
  const activeColor = getCategoryColor(activeCategory, activeSection);
  
  return (
    <MasterLayout>
      <div className="flex h-full medieval-background">
        {/* Overlay para mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
            onClick={toggleSidebar}
          />
        )}

        <Sidebar 
          activeCategory={activeCategory}
          activeSection={activeSection}
          onSelectSection={navigateTo}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        
        {/* Div principal do conteúdo */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          {/* Cabeçalho medieval */}
          <div className="sticky top-0 z-10 mystic-scroll border-b-2 border-amber-600/40 backdrop-blur-xl">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6">
              <div className="flex items-center gap-4">
                <button 
                  className="p-2 rounded-lg hover:bg-amber-50/10 md:hidden border border-amber-600/30 hover:border-amber-500/50 transition-all"
                  onClick={toggleSidebar}
                >
                  <Menu size={20} className="text-amber-400" />
                </button>
                <div className="text-center md:text-left">
                  <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                    <BookOpen className="text-amber-400 animate-glow" size={32} />
                    <Wand className="text-primary animate-glow" size={28} />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-medieval font-bold glowing-text">
                    Compêndio Extraplanar
                  </h1>
                  <p className="text-amber-300/80 text-base md:text-lg font-serif italic">
                    Grimório Completo de Regras e Conhecimentos Arcanos
                  </p>
                </div>
              </div>
              
              <div className="flex-1 max-w-2xl">
                <SearchBar 
                  onSearch={navigateTo}
                  searchResults={searchResults}
                  clearSearch={clearSearch}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              </div>
            </div>
          </div>

          {/* Container do conteúdo */}
          <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 pb-16">
            {activeCategoryObject?.sections.map((section, i) => (
              activeSection === i && (
                <ContentSection 
                  key={i} 
                  section={section} 
                  sectionColor={activeColor}
                  category={activeCategory} 
                />
              )
            ))}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }

        /* Scrollbar medieval */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(139, 69, 19, 0.2);
          border-radius: 12px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(251, 191, 36, 0.6), rgba(180, 83, 9, 0.8));
          border-radius: 12px;
          border: 1px solid rgba(251, 191, 36, 0.3);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(251, 191, 36, 0.8), rgba(180, 83, 9, 1));
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(251, 191, 36, 0.6) rgba(139, 69, 19, 0.2);
        }

        /* Efeitos especiais medievais */
        .border-l-3 {
          border-left-width: 3px;
        }

        .first-letter:first-letter {
          font-size: 1.25em;
          font-weight: bold;
          color: rgb(252 211 77);
          float: left;
          margin-right: 0.5rem;
          margin-top: 0.25rem;
          line-height: 1;
        }

        /* Responsividade aprimorada */
        @media (max-width: 768px) {
          .custom-scrollbar::-webkit-scrollbar {
            display: none;
          }
          
          .custom-scrollbar {
            scrollbar-width: none;
          }

          .first-letter:first-letter {
            font-size: 1.1em;
            margin-right: 0.25rem;
          }

          .medieval-title {
            font-size: 1.5rem;
          }

          table {
            font-size: 0.75rem;
          }

          th, td {
            padding: 0.5rem;
          }
        }

        @media (max-width: 480px) {
          .medieval-title {
            font-size: 1.25rem;
          }
          
          .ornamental-divider::after {
            font-size: 0.875rem;
            padding: 0 0.5rem;
          }
        }

        /* Animação de flutuação suave */
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-2px) rotate(0.5deg); }
          66% { transform: translateY(-1px) rotate(-0.3deg); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        /* Brilho místico aprimorado */
        .shadow-mystical {
          box-shadow: 
            0 0 20px rgba(251, 191, 36, 0.3),
            0 4px 15px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </MasterLayout>
  );
};

export default MasterSistema;
