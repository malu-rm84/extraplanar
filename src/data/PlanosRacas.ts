export type AtributoChave = 'agilidade' | 'força' | 'intelecto' | 'presença' | 'vigor' | 'nenhum';

export const MAPEAMENTO_ATRIBUTOS: Record<string, { chave: AtributoChave; nome: string }> = {
  'agilidade': { chave: 'agilidade', nome: 'Agilidade' },
  'força': { chave: 'força', nome: 'Força' },
  'intelecto': { chave: 'intelecto', nome: 'Intelecto' },
  'presença': { chave: 'presença', nome: 'Presença' },
  'vigor': { chave: 'vigor', nome: 'Vigor' },
  '': { chave: 'nenhum', nome: '' },
  'qualquer': { chave: 'nenhum', nome: 'Escolha um atributo' },
  'conferir': { chave: 'nenhum', nome: 'A definir' }
} as const;

export interface Race {
  nome: string;
  linguaMaterna: string;
  atributo: AtributoChave; // Alterado para usar o tipo de chave
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
      { nome: "Aarakocra", linguaMaterna: "Aurano", atributo: 'agilidade', habilidade: "Voo 9m." },
      { nome: "Anão", linguaMaterna: "Anão", atributo: 'vigor', habilidade: "Profissão" },
      { nome: "Bollywug", linguaMaterna: "Esmérion", atributo: 'nenhum', habilidade: 'nenhum' },
      { nome: "Bugbear", linguaMaterna: "Gruts'ka", atributo: 'força', habilidade: 'nenhum' },
      { nome: "Draconato", linguaMaterna: "Dracônico", atributo: 'força', habilidade: "Sopro" },
      { nome: "Elfo", linguaMaterna: "Élfico", atributo: 'agilidade', habilidade: "Regeneração" },
      { nome: "Gnoll", linguaMaterna: "Esmérion", atributo: 'agilidade', habilidade: "Frenesi" },
      { nome: "Gnomo", linguaMaterna: "Gnomaraz", atributo: 'intelecto', habilidade: 'nenhum' },
      { nome: "Goblin", linguaMaterna: "Gruts'ka", atributo: 'agilidade', habilidade: 'de baixo' },
      { nome: "Haffling", linguaMaterna: "Pequenino (Anão)", atributo: 'vigor', habilidade: 'nenhum' },
      { nome: "HobGoblin", linguaMaterna: "Gruts'ka", atributo: 'força', habilidade: 'nenhum' },
      { nome: "Humano", linguaMaterna: "Alâmico", atributo: 'nenhum', habilidade: 'nenhum' },
      { nome: "Kenku", linguaMaterna: 'nenhum', atributo: 'agilidade', habilidade: "Mimetismo" },
      { nome: "Kobold", linguaMaterna: "Dracônico", atributo: 'nenhum', habilidade: "Voo (por sessão)" },
      { nome: "Kraken", linguaMaterna: "Náutilo (Alâmico)", atributo: 'agilidade', habilidade: "Anfíbio" },
      { nome: "Kuo Toa", linguaMaterna: "Abissal", atributo: 'nenhum', habilidade: 'nenhum' },
      { nome: "Lagarto", linguaMaterna: "Dracônico", atributo: 'vigor', habilidade: 'nenhum' },
      { nome: "Morto Vivo", linguaMaterna: "o que sabia em vida", atributo: 'nenhum', habilidade: 'nenhum' },
      { nome: "Orc", linguaMaterna: "Gulduriano (Anão)", atributo: 'força', habilidade: "Resistência Orc" },
      { nome: "Tiefling", linguaMaterna: "Infernal", atributo: 'presença', habilidade: "Resistência (fogo)" },
      { nome: "Tritão", linguaMaterna: "Náutilo (Alâmico)", atributo: 'agilidade', habilidade: "Anfíbio" },
      { nome: "Yuan-Ti", linguaMaterna: "Rhiz'khazun", atributo: 'presença', habilidade: "?" },
    ],
  },
  {
    nome: "Plano Esmeralda",
    racas: [
      { nome: "Aarakocra", linguaMaterna: "Aurano", atributo: 'agilidade', habilidade: "Voo 9m." },
      { nome: "Bollywug", linguaMaterna: "Esmérion", atributo: 'nenhum', habilidade: 'nenhum' },
      { nome: "Fada", linguaMaterna: "Esmérion", atributo: 'presença', habilidade: 'nenhum' },
      { nome: "Elfo", linguaMaterna: "Élfico", atributo: 'agilidade', habilidade: "Regeneração" },
      { nome: "Kraken", linguaMaterna: "Náutilo (Alâmico)", atributo: 'agilidade', habilidade: "Anfíbio" },
      { nome: "Tritão", linguaMaterna: "Náutilo (Alâmico)", atributo: 'agilidade', habilidade: "Anfíbio" },
      { nome: "Anão", linguaMaterna: "Anão", atributo: 'vigor', habilidade: "Profissão" },
      { nome: "Serelebre", linguaMaterna: "Esmérion", atributo: 'agilidade', habilidade: "Pulo" },
      { nome: "Elemental", linguaMaterna: "Primoridal (conferir)", atributo: 'nenhum', habilidade: "conferir" },
      { nome: "Svartálfar", linguaMaterna: "Myrkrún (Élfico)", atributo: 'agilidade', habilidade: "Regeneração" },
    ],
  },
  {
    nome: "Plano Chiclete",
    racas: [
      { nome: "Chiclete", linguaMaterna: "Mentos", atributo: 'intelecto', habilidade: "Hiperação" },
      { nome: "Drone", linguaMaterna: "L - 15", atributo: 'nenhum', habilidade: "Consciência Única" },
      { nome: "Svartálfar", linguaMaterna: "Myrkrún (Élfico)", atributo: 'agilidade', habilidade: "Regeneração" },
    ],
  },
  {
    nome: "Inferno",
    racas: [
      { nome: "Diabo", linguaMaterna: "Infernal", atributo: 'presença', habilidade: 'nenhum' },
      { nome: "Diabrete", linguaMaterna: "Infernal", atributo: 'nenhum', habilidade: "-" },
      { nome: "Lêmure", linguaMaterna: "Abissal", atributo: 'nenhum', habilidade: "-" },
      { nome: "Tiefling", linguaMaterna: "Infernal", atributo: 'presença', habilidade: "Resistência (fogo)" },
    ],
  },
  {
    nome: "Plano Étereo",
    racas: [
      { nome: "Fantasma", linguaMaterna: 'nenhum', atributo: 'nenhum', habilidade: 'nenhum' },
    ],
  },
  {
    nome: "Céu",
    racas: [
      { nome: "Anjo", linguaMaterna: "Celestial", atributo: 'presença', habilidade: 'nenhum' },
    ],
  },
];
