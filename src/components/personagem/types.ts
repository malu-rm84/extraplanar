
export type EtapaCriacao = 'dados' | 'atributos' | 'magias' | 'pericias' | 'ocupacoes' | 'capacidades' | 'inventario' | 'extras';

export interface Personagem {
  nome: string;
  idade: string;
  plano: string;
  raca: string;
  atributos: {
    forca: number;
    destreza: number;
    constituicao: number;
    inteligencia: number;
    sabedoria: number;
    carisma: number;
  };
  afinidades: any[];
  magias: any[];
}
