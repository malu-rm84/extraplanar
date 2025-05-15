export interface Lingua {
  nome: string;
  custoPD: number;
  base?: string;
  descricao: string;
  referencia: string;
}

export interface CategoriaLinguas {
  categoria: string;
  linguas: Lingua[];
}

export const linguas: CategoriaLinguas[] = [
  {
    categoria: "Dialetos",
    linguas: [
      { nome: "Código dos Ladrões", custoPD: 2, descricao: "Variante para qualquer língua", referencia: "-" },
      { nome: "Alâmico Culto", custoPD: 2, base: "Alâmico", descricao: "Variante refinada do Alâmico", referencia: "Inglês Britânico" },
      { nome: "Gulduriano", custoPD: 2, base: "Anão", descricao: "Língua oficial dos Orcs, marginalizada pelos Anões", referencia: "Catalão" },
      { nome: "Pequenino", custoPD: 2, base: "Anão", descricao: "Variante rural do Anão", referencia: "Galego" },
      { nome: "Gnomaraz", custoPD: 2, base: "Anão", descricao: "-", referencia: "Basco" },
      { nome: "Náutilo", custoPD: 2, base: "Alâmico", descricao: "Mistura marítima de Aquano e Alâmico", referencia: "Papiamento" },
      { nome: "Aurano", custoPD: 2, base: "Primordial", descricao: "Usado nos reinos elementais", referencia: "Português de Portugal" },
      { nome: "Terrano", custoPD: 2, base: "Primordial", descricao: "Usado nos reinos elementais", referencia: "Italiano" },
      { nome: "Aquano", custoPD: 2, base: "Primordial", descricao: "Usado nos reinos elementais", referencia: "Finlandês" },
      { nome: "Ignano", custoPD: 2, base: "Primordial", descricao: "Usado nos reinos elementais", referencia: "Híndi" },
      { nome: "Myrkrún", custoPD: 2, base: "Élfico", descricao: "Élfico adaptado para Elfos Negros", referencia: "Holandês" },
    ],
  },
  {
    categoria: "Línguas Maternas",
    linguas: [
      { nome: "Alâmico", custoPD: 4, descricao: "Língua dos humanos, a mais falada no universo", referencia: "Inglês" },
      { nome: "Élfico", custoPD: 4, descricao: "Língua erudita, pouco modificada", referencia: "Francês" },
      { nome: "Anão", custoPD: 4, descricao: "Língua forte e marcante, influência em outras", referencia: "Espanhol" },
      { nome: "Infernal", custoPD: 4, descricao: "Língua marginalizada do inferno", referencia: "Mandarim" },
      { nome: "Dracônico", custoPD: 4, descricao: "Língua dos dragões, rude e antiga", referencia: "Alemão" },
      { nome: "Gruts'ka", custoPD: 4, descricao: "Língua goblinóide, poética e cheia de gírias", referencia: "Português (Brasil)" },
      { nome: "Esmérion", custoPD: 4, descricao: "Língua da floresta, falada no Plano Esmeralda", referencia: "Russo" },
    ],
  },
  {
    categoria: "Línguas Exotéricas",
    linguas: [
      { nome: "Abissal", custoPD: 5, descricao: "Língua profana, considerada crime em alguns reinos", referencia: "Húngaro" },
      { nome: "Mentos", custoPD: 5, descricao: "Língua isolacionista do Plano Chiclete", referencia: "Japonês" },
      { nome: "Rhiz'khazun", custoPD: 5, descricao: "Língua do deserto de Garla", referencia: "Árabe Beduíno" },
      { nome: "Primordial", custoPD: 5, descricao: "Língua ancestral com vários dialetos", referencia: "Latim" },
    ],
  },
  {
    categoria: "Línguas Mortas/Secretas",
    linguas: [
      { nome: "Daniel", custoPD: 6, descricao: "Língua gestual da sereia barítona de Umbraterna", referencia: "Yucatec Maya Sign Language" },
      { nome: "Kruthak", custoPD: 6, descricao: "Antiga língua Orc antes da guerra dos dragões", referencia: "Turco" },
      { nome: "L-15", custoPD: 6, descricao: "Língua binária do reino de Meccanar", referencia: "Binário" },
      { nome: "Celestial", custoPD: 6, descricao: "Língua dos Anjos, pouco compreendida", referencia: "Hebraico" },
    ],
  },
];
