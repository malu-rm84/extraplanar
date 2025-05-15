export interface Ocupacao {
  nome: string;
  nivel1: number;
  nivel2: number;
  nivel3: number;
}

export interface CategoriaOcupacoes {
  categoria: string;
  ocupacoes: Ocupacao[];
}

export const ocupacoes: CategoriaOcupacoes[] = [
  {
    categoria: "Marginalizadas",
    ocupacoes: [
      { nome: "Ladrão", nivel1: 3, nivel2: 4, nivel3: 5 },
      { nome: "Informante", nivel1: 3, nivel2: 4, nivel3: 5 },
      { nome: "Mendigo", nivel1: 3, nivel2: 4, nivel3: 5 },
      { nome: "Prisioneiro", nivel1: 3, nivel2: 4, nivel3: 5 },
      { nome: "Trambiqueiro", nivel1: 3, nivel2: 4, nivel3: 5 },
      { nome: "Nômade", nivel1: 3, nivel2: 4, nivel3: 5 },
    ],
  },
  {
    categoria: "Coleta e Produção Básica",
    ocupacoes: [
      { nome: "Caçador", nivel1: 3, nivel2: 4, nivel3: 5 },
      { nome: "Fazendeiro", nivel1: 3, nivel2: 4, nivel3: 5 },
      { nome: "Pedreiro", nivel1: 3, nivel2: 4, nivel3: 5 },
      { nome: "Minerador", nivel1: 3, nivel2: 4, nivel3: 5 },
      { nome: "Lenhador", nivel1: 3, nivel2: 4, nivel3: 5 },
    ],
  },
  {
    categoria: "Serviços",
    ocupacoes: [
      { nome: "Cozinheiro", nivel1: 4, nivel2: 5, nivel3: 6 },
      { nome: "Taverneiro", nivel1: 4, nivel2: 5, nivel3: 6 },
      { nome: "Mercador", nivel1: 4, nivel2: 5, nivel3: 6 },
      { nome: "Bardo", nivel1: 4, nivel2: 5, nivel3: 6 },
      { nome: "Serviçal", nivel1: 4, nivel2: 5, nivel3: 6 },
      { nome: "Religioso", nivel1: 4, nivel2: 5, nivel3: 6 },
      { nome: "Linguista", nivel1: 4, nivel2: 5, nivel3: 6 },
      { nome: "Guarda", nivel1: 4, nivel2: 5, nivel3: 6 },
      { nome: "Marinheiro", nivel1: 4, nivel2: 5, nivel3: 6 },
    ],
  },
  {
    categoria: "Ofícios Especializados",
    ocupacoes: [
      { nome: "Armoreiro", nivel1: 5, nivel2: 6, nivel3: 7 },
      { nome: "Armeiro", nivel1: 5, nivel2: 6, nivel3: 7 },
      { nome: "Ferreiro", nivel1: 5, nivel2: 6, nivel3: 7 },
      { nome: "Artesão", nivel1: 5, nivel2: 6, nivel3: 7 },
      { nome: "Domador", nivel1: 5, nivel2: 6, nivel3: 7 },
      { nome: "Carpinteiro", nivel1: 5, nivel2: 6, nivel3: 7 },
      { nome: "Engenheiro", nivel1: 5, nivel2: 6, nivel3: 7 },
      { nome: "Estilista", nivel1: 5, nivel2: 6, nivel3: 7 },
      { nome: "Cartógrafo", nivel1: 5, nivel2: 6, nivel3: 7 },
      { nome: "Cientista", nivel1: 5, nivel2: 6, nivel3: 7 },
      { nome: "Estudioso", nivel1: 5, nivel2: 6, nivel3: 7 },
      { nome: "Historiador", nivel1: 5, nivel2: 6, nivel3: 7 },
      { nome: "Joalheiro", nivel1: 5, nivel2: 6, nivel3: 7 },
    ],
  },
  {
    categoria: "Combate & Segurança",
    ocupacoes: [
      { nome: "Soldado", nivel1: 5, nivel2: 6, nivel3: 7 },
      { nome: "Mercenário", nivel1: 5, nivel2: 6, nivel3: 7 },
      { nome: "Assassino", nivel1: 5, nivel2: 6, nivel3: 7 },
    ],
  },
  {
    categoria: "Magia & Ocultismo",
    ocupacoes: [
      { nome: "Alquimista", nivel1: 6, nivel2: 7, nivel3: 8 },
      { nome: "Conjurador", nivel1: 6, nivel2: 7, nivel3: 8 },
      { nome: "Cultista", nivel1: 6, nivel2: 7, nivel3: 8 },
      { nome: "Escriba", nivel1: 6, nivel2: 7, nivel3: 8 },
      { nome: "Tatuador", nivel1: 6, nivel2: 7, nivel3: 8 },
    ],
  },
  {
    categoria: "Alta Sociedade",
    ocupacoes: [
      { nome: "Nobre", nivel1: 7, nivel2: 8, nivel3: 9 },
      { nome: "Embaixador", nivel1: 7, nivel2: 8, nivel3: 9 },
      { nome: "Administrador", nivel1: 7, nivel2: 8, nivel3: 9 },
      { nome: "Burguês", nivel1: 7, nivel2: 8, nivel3: 9 },
      { nome: "Militar", nivel1: 7, nivel2: 8, nivel3: 9 },
    ],
  },
];
