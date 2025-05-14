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
