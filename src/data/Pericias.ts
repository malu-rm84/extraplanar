export interface Pericia {
  nome: string;
  atributo: string;
  custoPD: number;
  descricao: string;
  pontos?: number; // Adicione esta linha
}

export interface CategoriaPericias {
  categoria: string;
  pericias: Pericia[];
}

export const pericias: CategoriaPericias[] = [
  {
    categoria: "Físicas & Combate",
    pericias: [
      { nome: "Acrobacia", atributo: "Agilidade", custoPD: 1, descricao: "Movimentos complexos e equilíbrio" },
      { nome: "Atletismo", atributo: "Força", custoPD: 1, descricao: "Saltos, escaladas e resistência física" },
      { nome: "Furtividade", atributo: "Agilidade", custoPD: 1, descricao: "Movimento silencioso e camuflagem" },
      { nome: "Luta", atributo: "Força", custoPD: 1, descricao: "Combate desarmado e técnicas marciais" },
      { nome: "Pontaria", atributo: "Agilidade", custoPD: 1, descricao: "Precisão com armas à distância" },
      { nome: "Reflexos", atributo: "Agilidade", custoPD: 1, descricao: "Reações rápidas a estímulos" },
      { nome: "Sobrevivência", atributo: "Vigor", custoPD: 1, descricao: "Adaptação a ambientes hostis" },
    ],
  },
  {
    categoria: "Sociais & Comunicação",
    pericias: [
      { nome: "Charme", atributo: "Presença", custoPD: 1, descricao: "Atração e simpatia natural" },
      { nome: "Etiqueta", atributo: "Presença", custoPD: 1, descricao: "Conhecimento de protocolos sociais" },
      { nome: "Intimidação", atributo: "Força", custoPD: 1, descricao: "Uso da presença física para coagir" },
      { nome: "Lábia", atributo: "Intelecto", custoPD: 1, descricao: "Persuasão através de argumentos lógicos" },
      { nome: "Persuasão", atributo: "Presença", custoPD: 1, descricao: "Capacidade de convencimento" },
    ],
  },
  {
    categoria: "Conhecimento & Intelecto",
    pericias: [
      { nome: "Alquimia", atributo: "Intelecto", custoPD: 1, descricao: "Transformação de materiais" },
      { nome: "Arcanismo", atributo: "Intelecto", custoPD: 1, descricao: "Conhecimento de magias arcanas" },
      { nome: "Ciências", atributo: "Intelecto", custoPD: 1, descricao: "Conhecimento científico" },
      { nome: "Engenharia", atributo: "Intelecto", custoPD: 1, descricao: "Construção e mecânica" },
      { nome: "Herbalismo", atributo: "Intelecto", custoPD: 1, descricao: "Uso de plantas medicinais" },
      { nome: "História", atributo: "Intelecto", custoPD: 1, descricao: "Conhecimento histórico" },
      { nome: "Medicina", atributo: "Intelecto", custoPD: 1, descricao: "Tratamento de ferimentos" },
      { nome: "Ocultismo", atributo: "Intelecto", custoPD: 1, descricao: "Conhecimento do sobrenatural" },
      { nome: "Religião", atributo: "Intelecto", custoPD: 1, descricao: "Dogmas e práticas religiosas" },
      { nome: "Tática", atributo: "Intelecto", custoPD: 1, descricao: "Estratégias de combate" },
    ],
  },
  {
    categoria: "Ofícios & Artesanato",
    pericias: [
      { nome: "Caligrafia", atributo: "Intelecto", custoPD: 1, descricao: "Arte da escrita ornamental" },
      { nome: "Cozinha", atributo: "Intelecto", custoPD: 1, descricao: "Preparação de alimentos" },
      { nome: "Forja", atributo: "Força", custoPD: 1, descricao: "Trabalho com metais" },
      { nome: "Mineração", atributo: "Vigor", custoPD: 1, descricao: "Extração de recursos minerais" },
      { nome: "Música", atributo: "Presença", custoPD: 1, descricao: "Execução e composição musical" },
    ],
  },
  {
    categoria: "Especiais & Únicas",
    pericias: [
      { nome: "Extraplanar", atributo: "Intelecto", custoPD: 1, descricao: "Conhecimento de outros planos" },
      { nome: "Falsificação", atributo: "Agilidade", custoPD: 1, descricao: "Criação de itens falsos" },
      { nome: "Intuição", atributo: "Presença", custoPD: 1, descricao: "Percepção além dos sentidos" },
      { nome: "Investigação", atributo: "Intelecto", custoPD: 1, descricao: "Análise de evidências" },
      { nome: "Lidar com Animais", atributo: "Presença", custoPD: 1, descricao: "Comunicação com criaturas" },
      { nome: "Mãos Leves", atributo: "Agilidade", custoPD: 1, descricao: "Prestidigitação e pequenos furtos" },
      { nome: "Navegação", atributo: "Intelecto", custoPD: 1, descricao: "Orientação em diferentes ambientes" },
      { nome: "Vontade", atributo: "Vigor", custoPD: 1, descricao: "Resistência mental" },
    ],
  },
];
