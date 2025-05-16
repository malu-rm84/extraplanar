import { Plano } from "../../data/PlanosRacas";
import { FaixaEtaria } from "../../data/FaixaEtaria";
import { Lingua } from "../../data/Linguas";
import { Experiencia, CategoriaExperiencia } from "../../data/Experiencia";
import { Pericia, CategoriaPericias } from "../../data/Pericias";
import { Ocupacao, CategoriaOcupacoes } from "../../data/Ocupacoes";
import { Capacidade, CategoriaCapacidades } from "../../data/Capacidades";

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
  | "experiencia";

export interface Personagem {
  nome: string;
  idade: string;
  plano: string;
  raca: string;
  descricaoFisica?: string;
  personalidade?: string;
  historia?: string;
  observacoes?: string;
  habilidadeRacial: string;
  faixaEtaria?: string;
  linguaMaterna: Lingua;
  linguasAdquiridas: Lingua[];
  dialectos?: Lingua[];
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
  magias: any[];
  experiencia?: CategoriaExperiencia[];
  pericias?: CategoriaPericias[];
  ocupacoesSelecionadas?: Array<{
    nome: string;
    nivel: number;
  }>;
  capacidadesSelecionadas?: Array<{
    nome: string;
    custo: number;
  }>;
  inventario?: any[];
  extras?: Record<string, any>;
}