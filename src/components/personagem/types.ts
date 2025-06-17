
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

export interface SessionPD {
  sessionId: string;
  sessionName: string;
  pdAmount: number;
  dateReceived: Date;
  masterId: string;
}

// Nova interface para PDs distribuídos pelo mestre
export interface DistributedPD {
  sessionId: string;
  sessionName: string;
  characterId: string;
  pdAmount: number;
  dateDistributed: Date;
  masterId: string;
  claimed: boolean;
}

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

  // Sistema de PD Renovado
  pdIniciais: number; // Sempre 50
  pdGastos: number; // PDs gastos na criação
  pdSessoes: SessionPD[]; // PDs recebidos das sessões
  nivel: number; // Nível calculado baseado no total de PDs

  // Pontos de Desenvolvimento (legado - manter para compatibilidade)
  ppComprados: number;
  pdDisponivel: number;

  // Atributos Derivados
  pp: number;
  pv: number;
  pe: number;
  dtTotal: number;
}

// Função helper para calcular nível baseado nos PDs
export const calcularNivelPorPD = (totalPD: number): number => {
  if (totalPD < 50) return 0; // Nível 0 se não atingiu 50 PD
  return 1 + Math.floor((totalPD - 50) / 10); // Nível 1 aos 50 PD, +1 a cada 10 PD
};

// Função helper para calcular total de PDs recebidos
export const calcularTotalPDRecebidos = (personagem: Personagem): number => {
  const pdSessoes = personagem.pdSessoes?.reduce((acc, session) => acc + session.pdAmount, 0) || 0;
  return personagem.pdIniciais + pdSessoes;
};
