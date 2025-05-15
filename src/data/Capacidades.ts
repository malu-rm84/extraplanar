export interface Capacidade {
  nome: string;
  custoPadrao: number;
  custoProfissional: number;
  profissoesRelacionadas: string[];
  preco?: string;
}

export interface CategoriaCapacidades {
  categoria: string;
  capacidades: Capacidade[];
}

export const capacidades: CategoriaCapacidades[] = [
  {
    categoria: "Ofícios Manuais & Artesanato",
    capacidades: [
      { nome: "Kit de Ferraria", custoPadrao: 3, custoProfissional: 1, profissoesRelacionadas: ["Ferreiro", "Armeiro", "Armoreiro"], preco: "" },
      { nome: "Kit de Joalheria", custoPadrao: 3, custoProfissional: 1, profissoesRelacionadas: ["Joalheiro", "Artesão", "Nobre"], preco: "" },
      { nome: "Kit de Construção", custoPadrao: 3, custoProfissional: 1, profissoesRelacionadas: ["Pedreiro", "Carpinteiro", "Engenheiro"], preco: "" },
      { nome: "Kit de Tatuagem", custoPadrao: 2, custoProfissional: 0, profissoesRelacionadas: ["Tatuador", "Alquimista", "Cultista"], preco: "" },
      { nome: "Kit de Cozinha", custoPadrao: 2, custoProfissional: 0, profissoesRelacionadas: ["Cozinheiro", "Fazendeiro", "Taverneiro"], preco: "" },
      { nome: "Kit de Alquimia", custoPadrao: 4, custoProfissional: 2, profissoesRelacionadas: ["Alquimista", "Medicina", "Herbalismo"], preco: "" },
      { nome: "Kit de Herbalismo", custoPadrao: 3, custoProfissional: 1, profissoesRelacionadas: ["Herbalista", "Medicina", "Fazendeiro"], preco: "" },
      { nome: "Kit de Embalsamamento", custoPadrao: 3, custoProfissional: 1, profissoesRelacionadas: ["Medicina", "Cultista", "Cientista"], preco: "" },
      { nome: "Kit de Taverna", custoPadrao: 2, custoProfissional: 0, profissoesRelacionadas: ["Taverneiro", "Cozinheiro", "Alquimista"], preco: "" },
      { nome: "Kit Médico", custoPadrao: 4, custoProfissional: 2, profissoesRelacionadas: ["Medicina", "Alquimista", "Cientista"], preco: "" },
      { nome: "Kit de Ladrão", custoPadrao: 4, custoProfissional: 2, profissoesRelacionadas: ["Ladrão", "Assassino", "Mercenário"], preco: "" },
      { nome: "Kit de Domador", custoPadrao: 3, custoProfissional: 1, profissoesRelacionadas: ["Caçador", "Fazendeiro", "Domador"], preco: "" },
      { nome: "Kit de Tortura", custoPadrao: 4, custoProfissional: 2, profissoesRelacionadas: ["Assassino", "Militar", "Guarda"], preco: "" },
    ],
  },
  {
    categoria: "Navegação & Exploração",
    capacidades: [
      { nome: "Kit de Cartografia", custoPadrao: 2, custoProfissional: 0, profissoesRelacionadas: ["Cartógrafo", "Navegação", "Militar"], preco: "" },
      { nome: "Kit de Navegação", custoPadrao: 3, custoProfissional: 1, profissoesRelacionadas: ["Navegador", "Pirata", "Caçador"], preco: "" },
      { nome: "Kit de Arqueologia", custoPadrao: 3, custoProfissional: 1, profissoesRelacionadas: ["Historiador", "Estudioso", "Religioso"], preco: "" },
    ],
  },
  {
    categoria: "Artes & Entretenimento",
    capacidades: [
      { nome: "Kit Musical", custoPadrao: 2, custoProfissional: 0, profissoesRelacionadas: ["Bardo", "Música", "Taverneiro"], preco: "" },
      { nome: "Kit de Caligrafia", custoPadrao: 2, custoProfissional: 0, profissoesRelacionadas: ["Caligrafia", "Nobre", "Tatuador"], preco: "" },
      { nome: "Kit de Jogos", custoPadrao: 2, custoProfissional: 0, profissoesRelacionadas: ["Bardo", "Mercador", "Ladrão"], preco: "" },
    ],
  },
  {
    categoria: "Armas Corpo a Corpo",
    capacidades: [
      { nome: "Armas Curtas", custoPadrao: 2, custoProfissional: 0, profissoesRelacionadas: ["Assassino", "Soldado", "Ladrão"], preco: "" },
      { nome: "Armas Leves", custoPadrao: 3, custoProfissional: 1, profissoesRelacionadas: ["Soldado", "Assassino", "Guarda"], preco: "" },
      { nome: "Armas Táticas", custoPadrao: 3, custoProfissional: 1, profissoesRelacionadas: ["Militar", "Nobre", "Mercenário"], preco: "" },
      { nome: "Armas Marciais", custoPadrao: 4, custoProfissional: 2, profissoesRelacionadas: ["Militar", "Nobre", "Assassino"], preco: "" },
      { nome: "Improvisadas", custoPadrao: 3, custoProfissional: 1, profissoesRelacionadas: ["Guarda", "Ladrão", "Trambiqueiro"], preco: "" },
    ],
  },
  {
    categoria: "Armas à Distância",
    capacidades: [
      { nome: "Armas Leves (Dist.)", custoPadrao: 2, custoProfissional: 0, profissoesRelacionadas: ["Caçador", "Soldado", "Guarda"], preco: "" },
      { nome: "Armas Táticas (Dist.)", custoPadrao: 3, custoProfissional: 1, profissoesRelacionadas: ["Militar", "Mercenário", "Soldado"], preco: "" },
      { nome: "Armas Marciais (Dist.)", custoPadrao: 4, custoProfissional: 2, profissoesRelacionadas: ["Militar", "Soldado", "Pontaria"], preco: "" },
      { nome: "Improvisadas", custoPadrao: 3, custoProfissional: 1, profissoesRelacionadas: ["Guarda", "Ladrão", "Assassino"], preco: "" },
    ],
  },
  {
    categoria: "Proteções",
    capacidades: [
      { nome: "Armaduras", custoPadrao: 3, custoProfissional: 1, profissoesRelacionadas: ["Mercenário", "Guarda", "Militar"], preco: "" },
      { nome: "Escudos", custoPadrao: 3, custoProfissional: 1, profissoesRelacionadas: ["Soldado", "Guarda", "Militar"], preco: "" },
    ],
  },
];
