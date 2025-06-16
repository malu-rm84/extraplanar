import { Plano } from "../../data/PlanosRacas";
import { FaixaEtaria } from "../../data/FaixaEtaria";
import { Lingua } from "../../data/Linguas";
import { Habilidades, CategoriaHabilidades } from "../../data/Habilidades";
import { Pericia, CategoriaPericias } from "../../data/Pericias";
import { Ocupacao, CategoriaOcupacoes } from "../../data/Ocupacoes";
import { Capacidade, CategoriaCapacidades } from "../../data/Capacidades";

export interface Campanha {
  id: string;
  name: string;
  description: string;
  status: 'concluída' | 'em andamento' | 'não iniciada';
  participants: Array<{
    id: string;
    name: string;
    type: 'player' | 'character';
    approved: boolean;
    userId?: string;
  }>;
  inviteLink: string;
  sessions: Array<{ id: string; link: string }>;
  mestreId: string;
  mestreNome: string;
  createdAt: Date;
}

export type EtapaCriacao =
  | "dados"
  | "descricao"
  | "atributos"
  | "afinidades"
  | "pericias"
  | "ocupacoes"
  | "capacidades"
  | "linguas" 
  | "inventario"
  | "habilidades"
  | "pontos-fundamentais";

export interface Personagem {
  // Identificação
  id?: string;
  criadoPor: string;
  criadorNome: string;
  dataCriacao: Date;
  dataAtualizacao?: Date;

  // Dados Básicos
  nome: string;
  idade: string;
  plano: string;
  raca: string;
  faixaEtaria?: string;
  habilidadeRacial: string;

  // Descrição
  descricaoFisica?: string;
  personalidade?: string;
  historia?: string;
  observacoes?: string;
  fotoUrl?: string;

  // Sistema Mecânico
  atributos: {
    agilidade: { base: number; racial: number };
    forca: { base: number; racial: number };
    intelecto: { base: number; racial: number };
    presenca: { base: number; racial: number };
    vigor: { base: number; racial: number };
  };
  
  afinidades: {
    arcana: number;
    cosmica: number;
    divina: number;
    natural: number;
    necromante: number;
  };

  // Progressão
  pericias?: CategoriaPericias[];
  ocupacoesSelecionadas?: Array<{
    nome: string;
    nivel: number;
  }>;
  capacidadesSelecionadas?: Array<{
    nome: string;
    custo: number;
  }>;
  habilidades?: CategoriaHabilidades[];

  // Linguagens
  linguaMaterna: Lingua;
  linguasAdquiridas: Lingua[];
  dialectos?: Lingua[];

  // Recursos
  magias: any[];
  inventario?: {
    geral?: Array<{
      nome: string;
      descricao?: string;
      quantidade?: number;
    }>;
    
    armaduras?: Array<{
      nome: string;
      defesa?: number;
      peso?: string;
      descricao?: string;
    }>;
    
    armas?: Array<{
      nome: string;
      dano?: string;
      tipo?: string;
      propriedades?: string[];
      descricao?: string;
    }>;
    
    magicos?: Array<{
      nome: string;
      raridade: string;
      descricao?: string;
      efeito?: string;
      carregamento?: string;
    }>;
  };
  extras?: Record<string, any>;

  // Pontos de Desenvolvimento
  ppComprados: number;
  pdDisponivel: number;

  // Atributos Derivados
  pp: number;
  pv: number;
  pe: number;
  dtTotal: number;
}