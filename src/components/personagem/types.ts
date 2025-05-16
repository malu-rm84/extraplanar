import { Plano } from "../../data/PlanosRacas";
import { FaixaEtaria } from "../../data/FaixaEtaria";
import { Lingua } from "../../data/Linguas";
import { Experiencia, CategoriaExperiencia } from "../../data/Experiencia";
import { Pericia, CategoriaPericias } from "../../data/Pericias";
import { Ocupacao, CategoriaOcupacoes } from "../../data/Ocupacoes";
import { Capacidade, CategoriaCapacidades } from "../../data/Capacidades";

export type EtapaCriacao =
  | "dados"
  | "atributos"
  | "magias"
  | "pericias"
  | "ocupacoes"
  | "capacidades"
  | "inventario"
  | "extras";

export interface Personagem {
  nome: string;
  idade: string;
  plano: string;
  raca: string;
  faixaEtaria?: FaixaEtaria;
  linguaMaterna?: Lingua;
  dialectos?: Lingua[];
  atributos: {
    forca: number;
    destreza: number;
    constituicao: number;
    inteligencia: number;
    sabedoria: number;
    carisma: number;
  };
  afinidades: string[];
  magias: any[];
  experiencia?: CategoriaExperiencia[];
  pericias?: CategoriaPericias[];
  ocupacoes?: CategoriaOcupacoes[];
  capacidades?: CategoriaCapacidades[];
  inventario?: any[];
  extras?: Record<string, any>;
}

