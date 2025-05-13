export interface Item {
  nome: string;
  tipo: string;
  descricao: string;
}

export interface Arma extends Item {
  dano: string;
}

export type Character = {
  nome: string;
  raca: string;
  plano: string;
  atributos: {
    forca: number;
    agilidade: number;
    vigor: number;
    presenca: number;
    intelecto: number;
  };
  vitalidade: {
    pv: number;
    pe: number;
    pp: number;
    dt: number;
    dp: number;
  };
  afinidade: {
    natural: number;
  };
  herancas: {
    magia: number;
    influencia: number;
    sorte: number;
    talento: number;
  };
  habilidades: {
    racial: string;
    origem: string;
    extras: string[];
  };
  pericias: Record<string, number>;
  inventario: {
    itens: Item[];
    armas: Arma[];
  };
  magias: string[];
  anotacoes: string;
};