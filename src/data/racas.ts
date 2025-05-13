export type RaceData = {
  plano: string;
  idioma: string;
  atributoPrincipal: string;
  habilidadeRacial: string;
};

export const races: Record<string, RaceData> = {
  // Plano Material
  "Aarakoora": { 
    plano: "Material",
    idioma: "Aurano",
    atributoPrincipal: "Agilidade",
    habilidadeRacial: "Voo 9m" 
  },
  "Anão": {
    plano: "Material",
    idioma: "Anão",
    atributoPrincipal: "Vigor",
    habilidadeRacial: "Profissão"
  },
  "Bollywug": {
    plano: "Material",
    idioma: "Esmérion",
    atributoPrincipal: "-",
    habilidadeRacial: ""
  },
  "Bugbear": {
    plano: "Material",
    idioma: "Gruts'ka",
    atributoPrincipal: "Força",
    habilidadeRacial: ""
  },
  "Draconato": {
    plano: "Material",
    idioma: "Dracônico",
    atributoPrincipal: "Força",
    habilidadeRacial: "Sopro"
  },
  "Elfo": {
    plano: "Material",
    idioma: "Élfico",
    atributoPrincipal: "Agilidade",
    habilidadeRacial: "Regeneração"
  },
  "Gnoll": {
    plano: "Material",
    idioma: "Esmérion",
    atributoPrincipal: "Agilidade",
    habilidadeRacial: "Frenesi"
  },
  "Gnomo": {
    plano: "Material",
    idioma: "Gnomaraz",
    atributoPrincipal: "Intelecto",
    habilidadeRacial: ""
  },
  "Goblin": {
    plano: "Material",
    idioma: "Gruts'ka",
    atributoPrincipal: "Agilidade",
    habilidadeRacial: ""
  },
  "Haffling": {
    plano: "Material",
    idioma: "Pequenino (Anão)",
    atributoPrincipal: "Vigor",
    habilidadeRacial: ""
  },
  "HobGoblin": {
    plano: "Material",
    idioma: "Gruts'ka",
    atributoPrincipal: "Força",
    habilidadeRacial: ""
  },
  "Humano": {
    plano: "Material",
    idioma: "Alâmico",
    atributoPrincipal: "Qualquer",
    habilidadeRacial: "Adaptabilidade"
  },
  "Kobold": {
    plano: "Material",
    idioma: "Dracônico",
    atributoPrincipal: "-",
    habilidadeRacial: "Voo (por sessão)"
  },
  "Kraken": {
    plano: "Material",
    idioma: "Náutilo (Alâmico)",
    atributoPrincipal: "Agilidade",
    habilidadeRacial: "Anfíbio"
  },
  "Kuo Toa": {
    plano: "Material",
    idioma: "Abissal",
    atributoPrincipal: "-",
    habilidadeRacial: ""
  },
  "Lagarto": {
    plano: "Material",
    idioma: "Dracônico",
    atributoPrincipal: "Vigor",
    habilidadeRacial: ""
  },
  "Morto Vivo": {
    plano: "Material",
    idioma: "O que sabia em vida",
    atributoPrincipal: "-",
    habilidadeRacial: ""
  },
  "Orc": {
    plano: "Material",
    idioma: "Gulduriano (Anão)",
    atributoPrincipal: "Força",
    habilidadeRacial: "Resistência Orc"
  },
  "Tiefling": {
    plano: "Material",
    idioma: "Infernal",
    atributoPrincipal: "Presença",
    habilidadeRacial: "Resistência (fogo)"
  },
  "Tritão": {
    plano: "Material",
    idioma: "Náutilo (Alâmico)",
    atributoPrincipal: "Agilidade",
    habilidadeRacial: "Anfíbio"
  },
  "Yuan-Ti": {
    plano: "Material",
    idioma: "Rhiz'khazun",
    atributoPrincipal: "Presença",
    habilidadeRacial: "Hibridismo"
  },

  // Plano Esmeralda
  "Fada": {
    plano: "Esmeralda",
    idioma: "Esmérion",
    atributoPrincipal: "Presença",
    habilidadeRacial: ""
  },
  "Serelebre": {
    plano: "Esmeralda",
    idioma: "Esmérion",
    atributoPrincipal: "Agilidade",
    habilidadeRacial: "Pulo"
  },
  "Elemental": {
    plano: "Esmeralda",
    idioma: "Primoridal",
    atributoPrincipal: "Conferir",
    habilidadeRacial: "Conferir"
  },
  "Svartálfar": {
    plano: "Esmeralda",
    idioma: "Myrkrún (Élfico)",
    atributoPrincipal: "Agilidade",
    habilidadeRacial: "Regeneração"
  },

  // Plano Chiclete
  "Chiclete": {
    plano: "Chiclete",
    idioma: "Mentos",
    atributoPrincipal: "Intelecto",
    habilidadeRacial: "Hiperação"
  },
  "Drone": {
    plano: "Chiclete",
    idioma: "L-15",
    atributoPrincipal: "-",
    habilidadeRacial: "Consciência Única"
  },


  // Inferno
  "Diabo": {
    plano: "Inferno",
    idioma: "Infernal",
    atributoPrincipal: "Presença",
    habilidadeRacial: ""
  },
  "Diabrete": {
    plano: "Inferno",
    idioma: "Infernal",
    atributoPrincipal: "-",
    habilidadeRacial: ""
  },
  "Lêmure": {
    plano: "Inferno",
    idioma: "Abissal",
    atributoPrincipal: "-",
    habilidadeRacial: ""
  },

  // Plano Étereo
  "Fantasma": {
    plano: "Étereo",
    idioma: "-",
    atributoPrincipal: "-",
    habilidadeRacial: ""
  },

  // Céu
  "Anjo": {
    plano: "Céu",
    idioma: "Celestial",
    atributoPrincipal: "Presença",
    habilidadeRacial: ""
  }
};