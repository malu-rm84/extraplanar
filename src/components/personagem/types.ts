import { Plano } from "../../data/PlanosRacas";
import { FaixaEtaria, FaixasEtarias } from "../../data/FaixaEtaria";
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

  export const LIMITES_PV_POR_NIVEL: Record<number, number> = {
    0: 15,  // Nível 0
    1: 20,  // Nível 1
    2: 22,  // Nível 2
    3: 24,  // Nível 3
    4: 26,  // Nível 4
    5: 30,  // Nível 5
    6: 32,  // Nível 6
    7: 34,  // Nível 7
    8: 36,  // Nível 8
    9: 38,  // Nível 9
    10: 40, // Nível 10
  };

export interface SessionPD {
  sessionId: string;
  sessionName: string;
  pdAmount: number;
  dateReceived: Date | { toDate: () => Date };
  masterId: string;
}

export interface DistributedPD {
  sessionId: string;
  sessionName: string;
  characterId: string;
  pdAmount: number;
  dateDistributed: Date | { toDate: () => Date };
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
  pdInvestidoPericias?: number; // NOVO CAMPO - PD investido na categoria perícias
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
  pvComprados: number; // Novo campo para PV comprados
  pdDisponivel: number;

  // Atributos Derivados
  pp: number;
  pv: number;
  pe: number;
  dtTotal: number;
}

export const calcularTotalPDRecebidos = (pdData: {
  pdIniciais: number;
  pdSessoes?: SessionPD[];
}): number => {
  const pdSessoes = pdData.pdSessoes?.reduce((acc, session) => 
    acc + (session.pdAmount || 0), 0) || 0;
  
  const pdIniciais = pdData.pdIniciais || 0;
  
  return pdIniciais + pdSessoes;
};

export const calcularNivelPorPD = (totalPD: number): number => {
  if (totalPD < 50) return 0; // Menos de 50 PD = nível 0
  return 1 + Math.floor((totalPD - 50) / 10); // 50 PD = nível 1, a cada 10 PDs ganhos +1 nível
};

export function calcularPP(personagem: Personagem): number {
  const vigorTotal = personagem.atributos.vigor.base + personagem.atributos.vigor.racial;
  const ppBase = 10 + vigorTotal + (personagem.ppComprados || 0);
  const nivel = personagem.nivel || 1;
  const ppMax = 30 + (nivel - 1) * 10;
  return Math.min(ppBase, ppMax);
}

export function calcularPV(personagem: Personagem): number {
  const vigorTotal = personagem.atributos.vigor.base + personagem.atributos.vigor.racial;
  const faixa = FaixasEtarias.find(f => f.nome === personagem.faixaEtaria);
  const bonusFaixa = faixa?.bonusPV || 0;
  
  const pvBaseNivel1 = 10 + vigorTotal + bonusFaixa + (personagem.pvComprados || 0);
  const nivel = personagem.nivel || 1;
  
  const pvTotal = pvBaseNivel1 + (nivel - 1) * (vigorTotal + bonusFaixa);
  
  // Obter o limite máximo para o nível atual
  const pvMax = LIMITES_PV_POR_NIVEL[nivel] || 40;
  
  return Math.min(pvTotal, pvMax);
}

export function calcularPVMaximo(nivel: number): number {
  return LIMITES_PV_POR_NIVEL[nivel] || 40;
}

export function calcularPE(personagem: Personagem): number {
  const vigorTotal = personagem.atributos.vigor.base + personagem.atributos.vigor.racial;
  const faixa = FaixasEtarias.find(f => f.nome === personagem.faixaEtaria);
  const bonusFaixa = faixa?.bonusPE || 0;
  
  // PE inicial (nível 1)
  const peBaseNivel1 = 1 + vigorTotal + bonusFaixa;
  const nivel = personagem.nivel || 1;
  
  // A cada nível, adicionamos vigorTotal + bonusFaixa
  const peTotal = peBaseNivel1 + (nivel - 1) * (vigorTotal + bonusFaixa);
  const peMax = 5 + (nivel - 1) * 5;
  
  return Math.min(peTotal, peMax);
}