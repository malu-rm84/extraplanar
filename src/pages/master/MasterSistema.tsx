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
  ChevronUp
} from "lucide-react";

// Content display components
const TableBlock = ({ data }) => (
  <div className="overflow-x-auto rounded-lg border border-white/10 text-sm">
    <table className="w-full min-w-[600px]">
      <thead className="bg-primary/10">
        <tr>
          {data[0]?.split('|')
            .filter(c => c.trim())
            .map((header, j) => (
              <th key={j} className="p-2 text-left font-medium text-primary">
                {header.trim()}
              </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.slice(1).map((row, j) => {
          const cells = row.split('|').filter(c => c.trim());
          return (
            <tr key={j} className="border-t border-white/5 hover:bg-white/5">
              {cells.map((cell, k) => (
                <td key={k} className="p-2 text-muted-foreground">
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
  <ul className="space-y-2 pl-4 border-l-2 border-primary/30 text-sm">
    {data.map((item, i) => (
      <li key={i} className="text-muted-foreground flex items-start gap-2">
        <span className="text-primary mt-1">•</span>
        {item.replace(/^[-*]+/, '').trim()}
      </li>
    ))}
  </ul>
);

const TextBlock = ({ data }) => (
  <div className="text-muted-foreground space-y-2 leading-relaxed text-sm">
    {data.map((line, i) => (
      <p key={i} className="text-justify">{line}</p>
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
    <div className="space-y-4">
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
    <div className="mb-4 bg-black/20 backdrop-blur-lg rounded-lg border border-white/5">
      <button 
        className={`w-full p-2 flex items-center justify-between transition-colors hover:bg-white/5`}
        onClick={() => setIsOpen(!isOpen)}
        style={{ borderLeft: `3px solid ${sectionColor}` }}
      >
        <div className="flex items-center gap-2">
          <Info size={16} style={{ color: sectionColor }} />
          <h3 className="text-sm font-medium" style={{ color: sectionColor }}>
            {subsection.title}
          </h3>
        </div>
        {isOpen ? 
          <ChevronUp size={16} className="text-muted-foreground" /> : 
          <ChevronDown size={16} className="text-muted-foreground" />
        }
      </button>
      
      {isOpen && (
        <div className="p-3 border-t border-white/5">
          {subsection.details?.map((detail, i) => (
            <p key={i} className="mb-2 text-muted-foreground text-sm">{detail}</p>
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
    <div className="mb-1">
      <button 
        className={`w-full text-left p-1.5 rounded-md flex items-center justify-between text-sm ${
          isActive ? 'bg-primary/20 font-medium' : 'hover:bg-white/5'
        }`}
        onClick={() => {
          onClick();
          setIsOpen(!isOpen);
        }}
      >
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <span style={{ color: sectionColor }}>{section.title}</span>
        </div>
      </button>
      
      {isOpen && section.subsections && (
        <div className="pl-4 mt-1 space-y-1 border-l border-white/10">
          {section.subsections.map((subsection, i) => (
            <div key={i} className="mb-1">
              <div 
                className="p-1.5 rounded hover:bg-white/5 cursor-pointer flex items-center gap-2 text-sm"
                onClick={() => document.getElementById(`subsection-${section.title}-${i}`).scrollIntoView({ behavior: 'smooth' })}
                style={{ color: sectionColor }}
              >
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
    if (title === "Planos") {
      return "#f97316";
    }
    
    const defaultColors = {
      "Barco": "#3b82f6",
      "Personagens": "#10b981",
      "Inventário": "#f59e0b",
      "Cidades": "#8b5cf6",
      "Perícias": "#ec4899",
      "Ocupações": "#6366f1"
    };
    
    return defaultColors[title] || "#6366f1";
  };
  
  const categoryIcons = {
    "Barco": <Ship size={16} />,
    "Personagens": <Users size={16} />,
    "Inventário": <Backpack size={16} />,
    "Cidades": <Globe size={16} />,
    "Planos": <Map size={16} />,
    "Perícias": <Star size={16} />,
    "Ocupações": <Briefcase size={16} />
  };
  
  const sectionColor = getPlanColor(category.title);
  
  useEffect(() => {
    if (category.title === activeCategory) setIsOpen(true);
  }, [activeCategory, category.title]);
  
  return (
    <div className="mb-2">
      <button 
        className={`w-full text-left p-2 rounded-md flex items-center justify-between text-sm ${
          category.title === activeCategory ? 'bg-primary/10 font-medium' : 'hover:bg-white/5'
        }`}
        onClick={() => setIsOpen(!isOpen)}
        style={{ color: sectionColor }}
      >
        <div className="flex items-center gap-2">
          {categoryIcons[category.title]}
          <span>{category.title}</span>
        </div>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      
      {isOpen && (
        <div className="pl-4 mt-1 space-y-1 border-l border-white/10">
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

const Sidebar = ({ activeCategory, activeSection, onSelectSection, isSidebarOpen }) => {
  return (
    <div className={`h-full overflow-y-auto custom-scrollbar bg-black/40 backdrop-blur-xl border-r border-white/10 w-64 fixed md:relative ${
      isSidebarOpen ? 'block' : 'hidden md:block'
    }`}>
      <div className="p-3">
        <div className="mb-4">
          <h2 className="text-md font-semibold flex items-center gap-2">
            <BookOpen size={18} className="text-primary" />
            Compêndio Extraplanar
          </h2>
          <p className="text-xs text-muted-foreground">Navegação do Sistema</p>
        </div>
        
        <div className="space-y-1">
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
  const displayColor = category === "Planos" && section.color ? section.color : sectionColor;
  
  return (
    <div className="space-y-4 animate-fadeIn">
      <div 
        className="p-4 md:p-6 bg-black/30 backdrop-blur-lg rounded-xl border border-white/5"
        style={{ borderTop: `2px solid ${displayColor}` }}
      >
        <h2 className="text-lg md:text-xl font-bold mb-3" style={{ color: displayColor }}>{section.title}</h2>
        
        {section.details?.length > 0 && (
          <div className="p-3 bg-black/20 rounded-lg border border-white/10 mb-4">
            <h3 className="text-md font-medium mb-2" style={{ color: displayColor }}>Descrição</h3>
            <ul className="space-y-2">
              {section.details.map((detail, i) => (
                <li key={i} className="text-muted-foreground flex gap-2 text-sm">
                  <span style={{ color: displayColor }} className="mt-1">•</span>
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="space-y-4">
          {section.subsections?.map((subsection, i) => (
            <div key={i} id={`subsection-${section.title}-${i}`}>
              <SubsectionRenderer subsection={subsection} sectionColor={displayColor} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Search component
const SearchBar = ({ onSearch, searchResults, clearSearch, searchQuery, setSearchQuery }) => {
  const categoryIcons = {
    "Barco": <Ship className="text-blue-400" size={16} />,
    "Personagens": <Users className="text-emerald-400" size={16} />,
    "Inventário": <Backpack className="text-amber-400" size={16} />,
    "Cidades": <Globe className="text-purple-400" size={16} />,
    "Planos": <Map className="text-orange-400" size={16} />,   
    "Perícias": <Star className="text-pink-400" size={16} />,
    "Ocupações": <Briefcase className="text-indigo-400" size={16} />,
  };

  return (
    <div className="relative mb-4 w-full max-w-2xl mx-auto">
      <div className="flex items-center bg-black/30 backdrop-blur-lg rounded-lg px-3 shadow border border-white/10">
        <Search size={16} className="text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Procurar no compêndio..."
          className="flex-1 py-2 px-3 bg-transparent outline-none placeholder:text-muted-foreground/50 text-sm"
        />
        {searchQuery && (
          <button onClick={clearSearch} className="p-1 hover:text-primary">
            <X size={16} />
          </button>
        )}
      </div>
      
      {searchResults.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-black/50 backdrop-blur-lg rounded-lg shadow overflow-hidden border border-white/10 z-20">
          {searchResults.map((result, i) => (
            <button
              key={i}
              onClick={() => {
                onSearch(result.category, result.sectionIndex);
                clearSearch();
              }}
              className="p-2 w-full text-left hover:bg-white/5 border-b border-white/5 last:border-0 flex items-start gap-2 text-sm"
            >
              <div className="text-primary shrink-0">
                {categoryIcons[result.category]}
              </div>
              <div className="flex-1">
                <div className="font-medium">{result.title}</div>
                <div className="text-muted-foreground mt-0.5 line-clamp-2">{result.preview}</div>
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
      if (categoryObj?.sections[sectionIndex]?.color) {
        return categoryObj.sections[sectionIndex].color;
      }
    }
    
    const defaultColors = {
      "Barco": "#3b82f6",
      "Personagens": "#10b981",
      "Inventário": "#f59e0b",
      "Cidades": "#8b5cf6",
      "Planos": "#f97316",
      "Perícias": "#ec4899",
      "Ocupações": "#6366f1"
    };
    
    return defaultColors[categoryTitle] || "#6366f1";
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
      <div className="flex h-full">
        <Sidebar 
          activeCategory={activeCategory} 
          activeSection={activeSection}
          onSelectSection={navigateTo}
          isSidebarOpen={isSidebarOpen}
        />
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="sticky top-0 z-10 bg-black/60 backdrop-blur-lg border-b border-white/10 p-3 flex items-center">
            <button 
              className="p-1.5 rounded-md hover:bg-white/10 md:hidden mr-2"
              onClick={toggleSidebar}
            >
              <Menu size={18} />
            </button>
            
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-0.5 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                Sistema Extraplanar
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Compêndio completo de regras e informações
              </p>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto px-3 md:px-4 py-4 pb-12">
            <SearchBar 
              onSearch={navigateTo}
              searchResults={searchResults}
              clearSearch={clearSearch}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            
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
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        
        /* Personalização das barras de rolagem */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(124, 58, 237, 0.5);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(124, 58, 237, 0.7);
        }
        
        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(124, 58, 237, 0.5) rgba(0, 0, 0, 0.2);
        }
        
        @media (max-width: 768px) {
          table {
            font-size: 0.75rem;
          }
          th, td {
            padding: 0.3rem;
          }
        }
      `}</style>
    </MasterLayout>
  );
};

export default MasterSistema;