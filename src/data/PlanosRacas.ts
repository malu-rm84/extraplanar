export interface Race {
  nome: string;
  linguaMaterna: string;
  atributo: string;
  habilidade: string;
}

export interface Plano {
  nome: string;
  racas: Race[];
}

export const Planos: Plano[] = [
  {
    nome: "Plano Material",
    racas: [
      { nome: "Aarakocra", linguaMaterna: "Aurano", atributo: "Agilidade", habilidade: "Voo 9m." },
      { nome: "Anão", linguaMaterna: "Anão", atributo: "Vigor", habilidade: "Profissão" },
      { nome: "Bollywug", linguaMaterna: "Esmérion", atributo: "", habilidade: "" },
      { nome: "Bugbear", linguaMaterna: "Gruts'ka", atributo: "Força", habilidade: "" },
      { nome: "Draconato", linguaMaterna: "Dracônico", atributo: "Força", habilidade: "Sopro" },
      { nome: "Elfo", linguaMaterna: "Élfico", atributo: "Agilidade", habilidade: "Regeneração" },
      { nome: "Gnoll", linguaMaterna: "Esmérion", atributo: "Agilidade", habilidade: "Frenesi" },
      { nome: "Gnomo", linguaMaterna: "Gnomaraz", atributo: "Intelecto", habilidade: "" },
      { nome: "Goblin", linguaMaterna: "Gruts'ka", atributo: "Agilidade", habilidade: "" },
      { nome: "Haffling", linguaMaterna: "Pequenino (Anão)", atributo: "Vigor", habilidade: "" },
      { nome: "HobGoblin", linguaMaterna: "Gruts'ka", atributo: "Força", habilidade: "" },
      { nome: "Humano", linguaMaterna: "Alâmico", atributo: "Qualquer", habilidade: "" },
      { nome: "Kenku", linguaMaterna: "", atributo: "Agilidade", habilidade: "Mimetismo" },
      { nome: "Kobold", linguaMaterna: "Dracônico", atributo: "", habilidade: "Voo (por sessão)" },
      { nome: "Kraken", linguaMaterna: "Náutilo (Alâmico)", atributo: "Agilidade", habilidade: "Anfíbio" },
      { nome: "Kuo Toa", linguaMaterna: "Abissal", atributo: "", habilidade: "" },
      { nome: "Lagarto", linguaMaterna: "Dracônico", atributo: "Vigor", habilidade: "" },
      { nome: "Morto Vivo", linguaMaterna: "o que sabia em vida", atributo: "", habilidade: "" },
      { nome: "Orc", linguaMaterna: "Gulduriano (Anão)", atributo: "Força", habilidade: "Resistência Orc" },
      { nome: "Tiefling", linguaMaterna: "Infernal", atributo: "Presença", habilidade: "Resistência (fogo)" },
      { nome: "Tritão", linguaMaterna: "Náutilo (Alâmico)", atributo: "Agilidade", habilidade: "Anfíbio" },
      { nome: "Yuan-Ti", linguaMaterna: "Rhiz'khazun", atributo: "Presença", habilidade: "?" },
    ],
  },
  {
    nome: "Plano Esmeralda",
    racas: [
      { nome: "Aarakocra", linguaMaterna: "Aurano", atributo: "Agilidade", habilidade: "Voo 9m." },
      { nome: "Bollywug", linguaMaterna: "Esmérion", atributo: "", habilidade: "" },
      { nome: "Fada", linguaMaterna: "Esmérion", atributo: "Presença", habilidade: "" },
      { nome: "Elfo", linguaMaterna: "Élfico", atributo: "Agilidade", habilidade: "Regeneração" },
      { nome: "Kraken", linguaMaterna: "Náutilo (Alâmico)", atributo: "Agilidade", habilidade: "Anfíbio" },
      { nome: "Tritão", linguaMaterna: "Náutilo (Alâmico)", atributo: "Agilidade", habilidade: "Anfíbio" },
      { nome: "Anão", linguaMaterna: "Anão", atributo: "Vigor", habilidade: "Profissão" },
      { nome: "Serelebre", linguaMaterna: "Esmérion", atributo: "Agilidade", habilidade: "Pulo" },
      { nome: "Elemental", linguaMaterna: "Primoridal (conferir)", atributo: "conferir", habilidade: "conferir" },
      { nome: "Svartálfar", linguaMaterna: "Myrkrún (Élfico)", atributo: "Agilidade", habilidade: "Regeneração" },
    ],
  },
  {
    nome: "Plano Chiclete",
    racas: [
      { nome: "Chiclete", linguaMaterna: "Mentos", atributo: "Intelecto", habilidade: "Hiperação" },
      { nome: "Drone", linguaMaterna: "L - 15", atributo: "", habilidade: "Consciência Única" },
      { nome: "Svartálfar", linguaMaterna: "Myrkrún (Élfico)", atributo: "Agilidade", habilidade: "Regeneração" },
    ],
  },
  {
    nome: "Inferno",
    racas: [
      { nome: "Diabo", linguaMaterna: "Infernal", atributo: "Presença", habilidade: "" },
      { nome: "Diabrete", linguaMaterna: "Infernal", atributo: "", habilidade: "-" },
      { nome: "Lêmure", linguaMaterna: "Abissal", atributo: "", habilidade: "-" },
      { nome: "Tiefling", linguaMaterna: "Infernal", atributo: "Presença", habilidade: "Resistência (fogo)" },
    ],
  },
  {
    nome: "Plano Étereo",
    racas: [
      { nome: "Fantasma", linguaMaterna: "", atributo: "", habilidade: "" },
    ],
  },
  {
    nome: "Céu",
    racas: [
      { nome: "Anjo", linguaMaterna: "Celestial", atributo: "Presença", habilidade: "" },
    ],
  },
];
