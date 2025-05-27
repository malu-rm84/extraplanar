export interface Habilidades {
  nome: string;
  custo: string;
  descricao: string;
  efeito?: string;
}

export interface CategoriaHabilidades {
  categoria: string;
  itens: Habilidades[];
}

export const habilidades: CategoriaHabilidades[] = [
  {
    categoria: "Habilidades Básicas",
    itens: [
      { nome: "Saque Rápido", custo: "2 + 3PD", descricao: "Desce um passo do saque de arma. Mais 1 passo com 3PD.", efeito: "" },
      { nome: "Atleta", custo: "2PD", descricao: "+3m de deslocamento.", efeito: "" },
      { nome: "Nerdola", custo: "2PD", descricao: "2PE para teste de Atualidades (DT20) e obter info útil.", efeito: "" },
      { nome: "Improvisar Componentes", custo: "2 + 2PD", descricao: "2PE para obter componentes aleatórios (1x ou 2x por sessão).", efeito: "" },
      { nome: "Astuto", custo: "2 + 2PD", descricao: "2PE para trocar atributo base em um teste (1x/sessão ou 1x/cena).", efeito: "" },
      { nome: "Inimigo Favorito", custo: "2 + 2PD", descricao: "+1 dado de dano, rastrear e obter info. 4PE = +2 dados.", efeito: "" },
    ],
  },
  {
    categoria: "Habilidades Sólidas",
    itens: [
      { nome: "Proficiência", custo: "3PD", descricao: "Usa o valor do atributo no ataque com um tipo de arma.", efeito: "" },
      { nome: "Furtividade Suprema", custo: "3PD", descricao: "Move-se totalmente enquanto está furtivo.", efeito: "" },
      { nome: "Pense Bem", custo: "3 + 2PD", descricao: "2PE para +1d6 em perícia com +5. 4PE = +2d6.", efeito: "" },
      { nome: "Ação Ardilosa", custo: "3 + 3PD", descricao: "2PE para usar ação bônus (esconder/disparar/desengajar). 5PE = ação livre.", efeito: "" },
      { nome: "Ataque Especial", custo: "3 + 3PD", descricao: "2PE para +5 no dano. 4PE = +10.", efeito: "" },
      { nome: "Inspirar Confiança", custo: "3PD", descricao: "2PE para um aliado re-rolar um teste falho.", efeito: "" },
      { nome: "Ímpeto", custo: "3PD", descricao: "1-3PE = +2m a +6m de deslocamento.", efeito: "" },
      { nome: "Golpe Pesado", custo: "3PD", descricao: "+1 dado de dano corpo a corpo.", efeito: "" },
      { nome: "Regeneração Tática", custo: "3 + 2 + 3PD", descricao: "Cura: 2PE = 1d6+VIG / 4PE = 2d6+VIG / 8PE = 2d10+VIG.", efeito: "" },
    ],
  },
  {
    categoria: "Habilidades Boas",
    itens: [
      { nome: "Arma Favorita", custo: "4PD", descricao: "+1 na margem de ameaça da arma escolhida.", efeito: "" },
      { nome: "Artista Marcial", custo: "4PD", descricao: "Ataques desarmados com AGI ou FOR à vontade.", efeito: "" },
      { nome: "Investigador", custo: "4 + 2PD", descricao: "2PE para encontrar pistas extras. Funciona sob pressão com mais 2PD.", efeito: "" },
      { nome: "Ataque Furtivo", custo: "4 + 3PD", descricao: "1d6/2PE com vantagem tática. Com 3PD: qualquer vantagem vira furtivo.", efeito: "" },
      { nome: "Mira / Esgrimista", custo: "4 + 3PD", descricao: "Rola 2 danos e escolhe melhor. 3PD = dobra dados e escolhe melhores originais.", efeito: "" },
      { nome: "Magia Acelerada", custo: "4PD", descricao: "Reduz tempo de conjuração em 1 passo.", efeito: "" },
      { nome: "Golpe de Raspão", custo: "4 + 2PD", descricao: "2PE ao errar = 1d8 de dano. 2PE = 1d12.", efeito: "" },
      { nome: "Escapar de Hordas", custo: "4PD", descricao: "Desvantagem em ataques de oportunidade contra você.", efeito: "" },
      { nome: "Consciência Primitiva", custo: "4PD", descricao: "2PE para detectar criaturas/locais.", efeito: "" },
      { nome: "Defesa sem Armadura", custo: "4 + 3PD", descricao: "Soma VIG na defesa (dobrado com 3PD).", efeito: "" },
      { nome: "Ataque Imprudente", custo: "4 + 2 + 2PD", descricao: "-2 DEF, +3 dano (pode ser usado mais vezes com mais PDs).", efeito: "" },
      { nome: "Carga Máxima", custo: "4PD", descricao: "Soma VIG ao espaço de inventário.", efeito: "" },
    ],
  },
  {
    categoria: "Habilidades Fortes",
    itens: [
      { nome: "Evasão", custo: "5PD", descricao: "Evita todo dano em área, não só metade.", efeito: "" },
      { nome: "Expert", custo: "5 + 4PD", descricao: "1-5PE = +1 a +5 bônus em perícias com até +3. 10PE = +10 com 4PD.", efeito: "" },
      { nome: "Teoria Marcial", custo: "5PD", descricao: "1PE + bônus = aumenta passo do crítico (máx. 5).", efeito: "" },
      { nome: "Iniciativa Aprimorada", custo: "5 + 3PD", descricao: "1-5PE = +1 a +5 bônus na iniciativa. Com 3PD: até +10.", efeito: "" },
      { nome: "Evocador", custo: "5PD", descricao: "+1 no multiplicador de crítico de magias.", efeito: "" },
      { nome: "Destruidor de Hordas", custo: "5 + 2PD", descricao: "2PE = ataque extra adjacente. Pode usar 2x com mais 2PD.", efeito: "" },
      { nome: "Ataque Giratório", custo: "5PD", descricao: "1PE por alvo para atacar todos a 1,5m.", efeito: "" },
      { nome: "Duelista de Colossos", custo: "5PD", descricao: "2PE = +1 dado de ataque contra alvos feridos.", efeito: "" },
      { nome: "Fúria", custo: "5PD", descricao: "1PE/turno: vantagem em FOR, +1 crit corpo a corpo, -5 resistências.", efeito: "" },
      { nome: "Maestria", custo: "5PD", descricao: "Reduz a margem de ameaça de uma magia em 1.", efeito: "" },
      { nome: "Mestre de Efeitos", custo: "5 + 4PD", descricao: "1-5PE = +1 a +5 bônus em DT. Com 4PD: até +10.", efeito: "" },
    ],
  },
  {
    categoria: "Habilidades Muito Fortes",
    itens: [
      { nome: "Maestria Mágica", custo: "6PD", descricao: "Reduz 1PE ao conjurar uma magia específica.", efeito: "" },
      { nome: "Primeiras Impressões", custo: "6PD", descricao: "+10 no primeiro teste social com alguém.", efeito: "" },
      { nome: "Aumento de Área de Magia", custo: "6 + 2PD", descricao: "1PE para +3m de área. 2PE = +6m.", efeito: "" },
      { nome: "Invocação", custo: "6PD", descricao: "Gasta 1PE/nível para invocar criatura armazenada como item.", efeito: "" },
      { nome: "Identificar Runa", custo: "6PD", descricao: "1PE por nível para decifrar magias impregnadas.", efeito: "" },
      { nome: "Saraivada", custo: "6PD", descricao: "2PE por alvo para atacar todos no alcance da arma.", efeito: "" },
    ],
  },
  {
    categoria: "Habilidades Excepcionais",
    itens: [
      { nome: "Ambidestro", custo: "7PD", descricao: "1PE para atacar com ação bônus.", efeito: "" },
      { nome: "Concentração", custo: "7PD", descricao: "2PE para manter efeito sem precisar de concentração.", efeito: "" },
      { nome: "Impregnar Magia", custo: "7PD", descricao: "2PE para armazenar magia em item com condição.", efeito: "" },
      { nome: "Precisão de Área", custo: "7PD", descricao: "2PE por alvo para imunizar contra dano em área.", efeito: "" },
      { nome: "Olhos de Mago", custo: "7PD", descricao: "Gasta até 5PE para ver o plano Etéreo até o fim da cena.", efeito: "" },
      { nome: "Lutar Contra a Maré", custo: "7PD", descricao: "2PE (reação) para redirecionar ataque que errou.", efeito: "" },
    ],
  },
  {
    categoria: "Habilidades Quebradas",
    itens: [
      { nome: "Ataque Extra", custo: "8PD", descricao: "2PE para atacar duas vezes na mesma ação.", efeito: "" },
      { nome: "Resistência Natural", custo: "8PD", descricao: "Escolhe 1 tipo de dano (concussão, cortante, perfurante) para ter resistência.", efeito: "" },
      { nome: "Ataque Favorito", custo: "8PD", descricao: "+1 no multiplicador de crítico de uma arma específica.", efeito: "" },
    ],
  },
];
