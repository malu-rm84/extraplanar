// constants.ts
export const planos = ["Material", "Esmeralda", "Chiclete", "Inferno", "Étereo", "Céu"];

export const pericias = {
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

export const attributeIcons = {
  forca: "💪",
  agilidade: "🏃",
  vigor: "❤️",
  presenca: "✨",
  intelecto: "🧠",
};

export const planoColors = {
  "Material": { bg: "bg-amber-100", border: "border-amber-500", text: "text-amber-800" },
  "Esmeralda": { bg: "bg-emerald-100", border: "border-emerald-500", text: "text-emerald-800" },
  "Chiclete": { bg: "bg-pink-100", border: "border-pink-500", text: "text-pink-800" },
  "Inferno": { bg: "bg-red-100", border: "border-red-500", text: "text-red-800" },
  "Étereo": { bg: "bg-purple-100", border: "border-purple-500", text: "text-purple-800" },
  "Céu": { bg: "bg-blue-100", border: "border-blue-500", text: "text-blue-800" },
};

export const periciaCategories = {
    "Combate": ["luta", "pontaria", "reflexos", "iniciativa", "tatica", "intimidacao"],
    "Conhecimento": ["historia", "arcanismo", "ciencias", "religiao", "extraplanar", "ocultismo", "atualidades", "natureza"],
    "Social": ["labia", "persuasao", "charme", "intuicao", "lidarAnimais"],
    "Técnicas": ["alquimia", "engenharia", "forja", "medicina", "navegacao", "oficio"],
    "Aventura": ["acrobacia", "atletismo", "fortitude", "furtividade", "investigacao", "maosLeves", "percepcao", "sobrevivencia", "vontade"],
    "Arte": ["artes"]
  };

export const occupationCategories = {
  "Marginalizadas (Base: 3PD)": [
    "Ladrão",
    "Informante",
    "Mendigo",
    "Prisioneiro",
    "Trambiqueiro",
    "Nômade",
  ],
  "Coleta e Produção Básica (Base: 3PD)": [
    "Caçador",
    "Fazendeiro",
    "Pedreiro",
    "Minerador",
    "Lenhador",
  ],
  "Serviços (Base: 4PD)": [
    "Cozinheiro",
    "Taverneiro",
    "Mercador",
    "Bardo",
    "Serviçal",
    "Religioso",
    "Linguista",
    "Guarda",
    "Marinheiro",
  ],
  "Ofícios Especializados (Base: 5PD)": [
    "Armoreiro",
    "Armeiro",
    "Ferreiro",
    "Artesão",
    "Domador",
    "Carpinteiro",
    "Engenheiro",
    "Estilista",
    "Cartógrafo",
    "Cientista",
    "Estudioso",
    "Historiador",
    "Joalheiro",
  ],
  "Combate & Segurança (Base: 5PD)": [
    "Soldado",
    "Mercenário",
    "Assassino",
  ],
  "Magia & Ocultismo (Base: 6PD)": [
    "Alquimista",
    "Conjurador",
    "Cultista",
    "Escriba",
    "Tatuador",
  ],
  "Alta Sociedade (Base: 7PD)": [
    "Nobre",
    "Embaixador",
    "Administrador",
    "Burguês",
    "Militar",
  ],
} as const;

export type Ocupacao =
  (typeof occupationCategories)[keyof typeof occupationCategories][number];

  export interface Lingua {
  nome: string;
  descricao?: string;
  referencia: string;
}

export interface LinguasPorCategoria {
  "Dialetos (2PD)": Lingua[];
  "Línguas Maternas (4PD)": Lingua[];
  "Línguas Exotéricas (5PD)": Lingua[];
  "Línguas Mortas/Secretas (6PD)": Lingua[];
}

export const linguas: LinguasPorCategoria = {
  "Dialetos (2PD)": [
    { nome: "Código dos Ladrões", descricao: "Variante para qualquer língua", referencia: "Variante para qualquer língua" },
    { nome: "Alâmico Culto", referencia: "Inglês Britânico" },
    { nome: "Gulduriano", descricao: "Língua oficial dos Orcs de hoje em dia, rivalizada e muito marginalizada pelos anões", referencia: "Catalão" },
    { nome: "Pequenino", descricao: "Variante do Anão rural, considerada só uma versão caipira da original.", referencia: "Galego" },
    { nome: "Gnomaraz", referencia: "Basco" },
    { nome: "Náutilo", descricao: "Língua marítima originária do Aquano, mas misturada com o Alâmico humano, muito utilizado por tritões e krakens", referencia: "Papiamento" },
    { nome: "Aurano", referencia: "Português de Portugal" },
    { nome: "Terrano", referencia: "Italiano" },
    { nome: "Aquano", referencia: "Finlandês" },
    { nome: "Ignano", referencia: "Híndi" },
    { nome: "Myrkrún", descricao: "Élfico modificado para Elfos Negros com escrita mágica", referencia: "Holandês" },
  ],
  "Línguas Maternas (4PD)": [
    { nome: "Alâmico", descricao: "Língua comum dos humanos, originária do Celestial", referencia: "Inglês" },
    { nome: "Élfico", descricao: "Língua artística moldada pelos eruditos elfos", referencia: "Francês" },
    { nome: "Anão", descricao: "Linguagem forte desenvolvida pelos anões", referencia: "Espanhol" },
    { nome: "Infernal", descricao: "Língua do inferno, distinta do Abissal", referencia: "Mandarim" },
    { nome: "Dracônico", descricao: "Língua rudimentar dos dragões", referencia: "Alemão" },
    { nome: "Gruts'ka", descricao: "Língua poética dos Goblinóides", referencia: "Português (Brasil)" },
    { nome: "Esmerion", descricao: "Fala da floresta usada no Plano Esmeralda", referencia: "Russo" },
  ],
  "Línguas Exotéricas (5PD)": [
    { nome: "Abissal", descricao: "Língua suja originária do poço abissal de Demogórgon", referencia: "Húngaro" },
    { nome: "Mentos", descricao: "Língua do Plano Chiclete", referencia: "Japonês" },
    { nome: "Rhiz'khazun", descricao: "Língua do deserto de Garla", referencia: "Árabe Beduíno" },
    { nome: "Primordial", descricao: "Língua de seres muito antigos", referencia: "Latim" },
  ],
  "Línguas Mortas/Secretas (6PD)": [
    { nome: "Daniel", descricao: "Combina sinais, gestos e voz para comunic ação", referencia: "Yucatec Maya Sign Language" },
    { nome: "Kruthak", descricao: "Língua do reinado Orc antigo", referencia: "Turco" },
    { nome: "L-15", descricao: "Língua do reino de Meccanar", referencia: "Binário" },
    { nome: "Celestial", descricao: "Língua dos Anjos", referencia: "Hebraico" },
  ],
} as const;

export type LinguaItem = (typeof linguas)[keyof typeof linguas][number];
