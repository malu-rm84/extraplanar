export interface Ocupacao {
  nome: string;
  nivel1: number;
  nivel2: number;
  nivel3: number;
  nivel4: number;
  nivel5: number;
  descricao: string; // Nova propriedade adicionada
}

export interface CategoriaOcupacoes {
  categoria: string;
  ocupacoes: Ocupacao[];
}

export const ocupacoes: CategoriaOcupacoes[] = [
  {
    categoria: "Marginalizadas",
    ocupacoes: [
      { 
        nome: "Ladrão", 
        nivel1: 3, 
        nivel2: 4, 
        nivel3: 5,
        nivel4: 6,
        nivel5: 7,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Informante", 
        nivel1: 3, 
        nivel2: 4, 
        nivel3: 5,
        nivel4: 6,
        nivel5: 7,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Mendigo", 
        nivel1: 3, 
        nivel2: 4, 
        nivel3: 5,
        nivel4: 6,
        nivel5: 7,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Prisioneiro", 
        nivel1: 3, 
        nivel2: 4, 
        nivel3: 5,
        nivel4: 6,
        nivel5: 7,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Trambiqueiro", 
        nivel1: 3, 
        nivel2: 4, 
        nivel3: 5,
        nivel4: 6,
        nivel5: 7,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Nômade", 
        nivel1: 3, 
        nivel2: 4, 
        nivel3: 5,
        nivel4: 6,
        nivel5: 7,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
    ],
  },
  {
    categoria: "Coleta e Produção Básica",
    ocupacoes: [
      { 
        nome: "Caçador", 
        nivel1: 3, 
        nivel2: 4, 
        nivel3: 5,
        nivel4: 6,
        nivel5: 7,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Fazendeiro", 
        nivel1: 3, 
        nivel2: 4, 
        nivel3: 5,
        nivel4: 6,
        nivel5: 7,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Pedreiro", 
        nivel1: 3, 
        nivel2: 4, 
        nivel3: 5,
        nivel4: 6,
        nivel5: 7,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Minerador", 
        nivel1: 3, 
        nivel2: 4, 
        nivel3: 5,
        nivel4: 6,
        nivel5: 7,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Lenhador", 
        nivel1: 3, 
        nivel2: 4, 
        nivel3: 5,
        nivel4: 6,
        nivel5: 7,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
    ],
  },
  {
    categoria: "Serviços",
    ocupacoes: [
      { 
        nome: "Cozinheiro", 
        nivel1: 4, 
        nivel2: 5, 
        nivel3: 6,
        nivel4: 7,
        nivel5: 8,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Taverneiro", 
        nivel1: 4, 
        nivel2: 5, 
        nivel3: 6,
        nivel4: 7,
        nivel5: 8,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Mercador", 
        nivel1: 4, 
        nivel2: 5, 
        nivel3: 6,
        nivel4: 7,
        nivel5: 8,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Bardo", 
        nivel1: 4, 
        nivel2: 5, 
        nivel3: 6,
        nivel4: 7,
        nivel5: 8,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Serviçal", 
        nivel1: 4, 
        nivel2: 5, 
        nivel3: 6,
        nivel4: 7,
        nivel5: 8,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Religioso", 
        nivel1: 4, 
        nivel2: 5, 
        nivel3: 6,
        nivel4: 7,
        nivel5: 8,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Linguista", 
        nivel1: 4, 
        nivel2: 5, 
        nivel3: 6,
        nivel4: 7,
        nivel5: 8,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Guarda", 
        nivel1: 4, 
        nivel2: 5, 
        nivel3: 6,
        nivel4: 7,
        nivel5: 8,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Marinheiro", 
        nivel1: 4, 
        nivel2: 5, 
        nivel3: 6,
        nivel4: 7,
        nivel5: 8,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
    ],
  },
  {
    categoria: "Ofícios Especializados",
    ocupacoes: [
      { 
        nome: "Armoreiro", 
        nivel1: 5, 
        nivel2: 6, 
        nivel3: 7,
        nivel4: 8,
        nivel5: 9,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Armeiro", 
        nivel1: 5, 
        nivel2: 6, 
        nivel3: 7,
        nivel4: 8,
        nivel5: 9,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Ferreiro", 
        nivel1: 5, 
        nivel2: 6, 
        nivel3: 7,
        nivel4: 8,
        nivel5: 9,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Artesão", 
        nivel1: 5, 
        nivel2: 6, 
        nivel3: 7,
        nivel4: 8,
        nivel5: 9,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Domador", 
        nivel1: 5, 
        nivel2: 6, 
        nivel3: 7,
        nivel4: 8,
        nivel5: 9,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Carpinteiro", 
        nivel1: 5, 
        nivel2: 6, 
        nivel3: 7,
        nivel4: 8,
        nivel5: 9,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Engenheiro", 
        nivel1: 5, 
        nivel2: 6, 
        nivel3: 7,
        nivel4: 8,
        nivel5: 9,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Estilista", 
        nivel1: 5, 
        nivel2: 6, 
        nivel3: 7,
        nivel4: 8,
        nivel5: 9,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Cartógrafo", 
        nivel1: 5, 
        nivel2: 6, 
        nivel3: 7,
        nivel4: 8,
        nivel5: 9,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Cientista", 
        nivel1: 5, 
        nivel2: 6, 
        nivel3: 7,
        nivel4: 8,
        nivel5: 9,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Estudioso", 
        nivel1: 5, 
        nivel2: 6, 
        nivel3: 7,
        nivel4: 8,
        nivel5: 9,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Historiador", 
        nivel1: 5, 
        nivel2: 6, 
        nivel3: 7,
        nivel4: 8,
        nivel5: 9,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Joalheiro", 
        nivel1: 5, 
        nivel2: 6, 
        nivel3: 7,
        nivel4: 8,
        nivel5: 9,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
    ],
  },
  {
    categoria: "Combate & Segurança",
    ocupacoes: [
      { 
        nome: "Soldado", 
        nivel1: 5, 
        nivel2: 6, 
        nivel3: 7,
        nivel4: 8,
        nivel5: 9,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Mercenário", 
        nivel1: 5, 
        nivel2: 6, 
        nivel3: 7,
        nivel4: 8,
        nivel5: 9,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Assassino", 
        nivel1: 5, 
        nivel2: 6, 
        nivel3: 7,
        nivel4: 8,
        nivel5: 9,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
    ],
  },
  {
    categoria: "Magia & Ocultismo",
    ocupacoes: [
      { 
        nome: "Alquimista", 
        nivel1: 6, 
        nivel2: 7, 
        nivel3: 8,
        nivel4: 9,
        nivel5: 10,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Conjurador", 
        nivel1: 6, 
        nivel2: 7, 
        nivel3: 8,
        nivel4: 9,
        nivel5: 10,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Cultista", 
        nivel1: 6, 
        nivel2: 7, 
        nivel3: 8,
        nivel4: 9,
        nivel5: 10,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Escriba", 
        nivel1: 6, 
        nivel2: 7, 
        nivel3: 8,
        nivel4: 9,
        nivel5: 10,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Tatuador", 
        nivel1: 6, 
        nivel2: 7, 
        nivel3: 8,
        nivel4: 9,
        nivel5: 10,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
    ],
  },
  {
    categoria: "Alta Sociedade",
    ocupacoes: [
      { 
        nome: "Nobre", 
        nivel1: 7, 
        nivel2: 8, 
        nivel3: 9,
        nivel4: 10,
        nivel5: 11,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Embaixador", 
        nivel1: 7, 
        nivel2: 8, 
        nivel3: 9,
        nivel4: 10,
        nivel5: 11,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Administrador", 
        nivel1: 7, 
        nivel2: 8, 
        nivel3: 9,
        nivel4: 10,
        nivel5: 11,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Burguês", 
        nivel1: 7, 
        nivel2: 8, 
        nivel3: 9,
        nivel4: 10,
        nivel5: 11,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
      { 
        nome: "Militar", 
        nivel1: 7, 
        nivel2: 8, 
        nivel3: 9,
        nivel4: 10,
        nivel5: 11,
        descricao: "Descrição do efeito desta ocupação será adicionada aqui..." 
      },
    ],
  },
];