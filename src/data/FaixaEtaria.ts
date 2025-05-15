export interface FaixaEtaria {
  nome: string;
  bonusPV: number;
  bonusPE: number;
  bonus: string;
  idade: number;
}

export const FaixasEtarias: FaixaEtaria[] = [
  {
    nome: "Criança",
    bonusPV: -1,
    bonusPE: 3,
    bonus: "Não pode ter Ocupação.",
    idade: 0,
  },
  {
    nome: "Adolescente",
    bonusPV: 0,
    bonusPE: 2,
    bonus: "Não pode passar do nível 2 de Ocupação.",
    idade: 0,
  },
  {
    nome: "Jovem",
    bonusPV: 1,
    bonusPE: 1,
    bonus: "-",
    idade: 0,
  },
  {
    nome: "Adulto",
    bonusPV: 2,
    bonusPE: 0,
    bonus: "Aumenta um nível em qualquer Ocupação.",
    idade: 1,
  },
  {
    nome: "Idoso",
    bonusPV: -1,
    bonusPE: -1,
    bonus: "Ganha dois níveis em qualquer Ocupação.",
    idade: 2,
  },
  {
    nome: "Caquético",
    bonusPV: -2,
    bonusPE: -2,
    bonus: "Ganha dois níveis em qualquer Ocupação.",
    idade: 3,
  },
];
