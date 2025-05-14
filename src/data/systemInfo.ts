const systemInfo = [
  {
    title: "Barcos",
    description: "Detalhes completos sobre o sistema naval.",
    sections: [
      {
        title: "Tamanhos de Barco",
        details: [
          "Pequeno: 1 deque, 10 km/h, capacidade 20, 3 armas, 5 cômodos.",
          "Médio: 2 deques, 0 km/h, capacidade 50, 5 armas, 10 cômodos.",
          "Grande: 3 deques, -10 km/h, capacidade 150, 7 armas, 20 cômodos.",
          "Enorme: 4 deques, -20 km/h, capacidade 250, 10 armas, 40 cômodos.",
          "Colossal: 5 deques, -30 km/h, capacidade 500, 12 armas, 80 cômodos.",
        ],
        subsections: [
          {
            title: "Estatísticas Detalhadas",
            content: [
              "PV: 150-1000 | Defesa: 18-10 | Resistência: 5-15",
              "Dano de Colisão: 5d10 a 25d10",
              "Construção: 12-40 peças de madeira"
            ]
          }
        ]
      },
      {
        title: "Essenciais",
        details: [
          "Âncora: 3 dias para construir",
          "Mastros: 3 tipos com diferentes bônus",
          "Combinações de Vela/Mastro: +2km/h a +18km/h"
        ],
        subsections: [
          {
            title: "Tabela de Velocidade",
            content: [
              "Bom + Boa = +18km/h",
              "Médio + Média = +10km/h",
              "Ruim + Ruim = +2km/h"
            ]
          }
        ]
      },
      {
        title: "Cômodos",
        details: [
          "23 tipos de cômodos disponíveis",
          "Custos variam de 100 a 600",
          "Efeitos especiais por cômodo"
        ],
        subsections: [
          {
            title: "Exemplos",
            content: [
              "Arsenal: +1 limite de armas",
              "Enfermaria: +3 em Medicina",
              "Sala do Tesouro: +10 inventário"
            ]
          }
        ]
      }
    ]
  },

  {
    title: "Personagens",
    description: "Sistema completo de criação e desenvolvimento de personagens.",
    sections: [
      {
        title: "Fundamentos",
        details: [
          "Criação de personagens em 4 etapas básicas",
          "Sistema de Faixa Etária com impactos mecânicos",
          "Atributos principais e pontos vitais"
        ],
        subsections: [
          {
            title: "Faixa Etária",
            content: [
              "| Criança | -1PV +3PE | Sem ocupação |",
              "| Adolescente | 0PV +2PE | Ocupação até Nv.2 |",
              "| Adulto | +2PV | +1 nível de ocupação |",
              "| Idoso | -1PV -1PE | +2 níveis ocupação |"
            ]
          },
          {
            title: "Atributos Básicos",
            content: [
              "Agilidade: Reflexos e movimentos ágeis",
              "Vigor: Resistência física e saúde",
              "Intelecto: Conhecimento e raciocínio",
              "Força: Capacidade física bruta",
              "Presença: Carisma e influência social"
            ]
          }
        ]
      },
      {
        title: "Atributos & Afinidades",
        details: [
          "Sistema progressivo de compra com PD",
          "5 níveis de proficiência mágica",
          "Customização de poderes sobrenaturais"
        ],
        subsections: [
          {
            title: "Tabela de Atributos",
            content: [
              "| 0 (Abaixo) | 0PD | Franzino/Idoso |",
              "| 3 (Excepcional) | 4PD | Herói local |",
              "| 5 (Ícone) | 11PD | Semideus/Lenda |"
            ]
          },
          {
            title: "Sistema de Afinidades",
            content: [
              "Arcana: Magia arcana e artefatos",
              "Necromante: Manipulação da morte",
              "Nv.5: Domínio sobre a realidade (15PDs)"
            ]
          },
          {
            title: "Vitalidade",
            content: [
              "PV = 10 + Vigor + Bônus Etário",
              "PE = 1 + Vigor + Bônus Etário",
              "PP = 10 + Vigor (+2PD por ponto extra)"
            ]
          }
        ]
      },
      {
        title: "Habilidades por PD",
        details: [
          "150+ habilidades organizadas por PD",
          "Progressão não-linear de habilidades",
          "Combate, magia e habilidades sociais"
        ],
        subsections: [
          {
            title: "PD 1 - Básicas",
            content: [
              "| **Tipo** | **Descrição**                                        |",
              "| -------- | ---------------------------------------------------- |",
              "| **PV**   | Some 1 + Vigor + Bônus de Faixa Etária nos seus PVs. |",
              "| **PE**   | Some 1 + Vigor + Bônus de Faixa Etária nos seus PEs. |"
            ]
          },
          {
            title: "Habilidades Especiais",
            content: [
              "Regeneração Tática (3PD): 1d6+VIG PV/sessão",
              "Mira (4PD): Rolar 2x dano à distância",
              "Ataque Giratório (5PD): Atacar múltiplos alvos"
            ]
          }
        ]
      },
      {
        title: "Antecedentes",
        details: [
          "Sistema de background narrativo-mecânico",
          "Pontos de determinação e sorte",
          "Profissões com impacto no mundo"
        ],
        subsections: [
          {
            title: "Mecânicas Especiais",
            content: [
              "Determinação: +10 em teste crítico (2PD)",
              "Sorte: Converter falha em sucesso (1x/sessão)",
              "Talento: Habilidade única negociável"
            ]
          },
          {
            title: "Profissões",
            content: [
              "Nv.0: Iniciante/Desconhecido",
              "Nv.3: Profissional competente",
              "Nv.5: Referência mundial (exige eventos especiais)"
            ]
          },
          {
            title: "Saberes Extras",
            content: [
              "Línguas: Testes para comunicação complexa",
              "Capacidades: -5 em testes sem proficiência",
              "Perícias: Combinação de atributo + especialização"
            ]
          }
        ]
      }
    ]
  },

  {
    title: "Raças",
    description: "Descrição completa de todas as raças por plano dimensional",
    sections: [
      {
        title: "Plano Material",
        details: [
          "Raças terrenas e suas características básicas",
          "21 raças principais com diversidade de atributos"
        ],
        subsections: [
          {
            title: "Tabela Completa",
            content: [
              "| Raça | Língua Materna | Atributo | Habilidade |",
              "|------|----------------|:--------:|:----------:|",
              "| Aarakocra | Aurano | Agilidade | Voo 9m. |",
              "| Anão | Anão | Vigor | Profissão |",
              "| Bollywug | Esmérion | - | - |",
              "| Bugbear | Gruts'ka | Força | - |",
              "| Draconato | Dracônico | Força | Sopro |",
              "| Elfo | Élfico | Agilidade | Regeneração |",
              "| Gnoll | Esmérion | Agilidade | Frenesi |",
              "| Gnomo | Gnomaraz | Intelecto | - |",
              "| Goblin | Gruts'ka | Agilidade | - |",
              "| Haffling | Pequenino (Anão) | Vigor | - |",
              "| HobGoblin | Gruts'ka | Força | - |",
              "| Humano | Alâmico | Qualquer | - |",
              "| Kenku | - | Agilidade | Mimetismo |",
              "| Kobold | Dracônico | - | Voo (por sessão) |",
              "| Kraken | Náutilo (Alâmico) | Agilidade | Anfíbio |",
              "| Kuo Toa | Abissal | - | - |",
              "| Lagarto | Dracônico | Vigor | - |",
              "| Morto Vivo | o que sabia em vida | - | - |",
              "| Orc | Gulduriano (Anão) | Força | Resistência Orc |",
              "| Tiefling | Infernal | Presença | Resistência (fogo) |",
              "| Tritão | Náutilo (Alâmico) | Agilidade | Anfíbio |",
              "| Yuan-Ti | Rhiz'khazun* | Presença | ? |",
              " ",
              "*Personagens do deserto de Garla têm Rhiz'khazun como língua materna"
            ]
          }
        ]
      },
      {
        title: "Plano Esmeralda",
        details: [
          "Reino das fadas e criaturas místicas",
          "10 raças com conexões naturais"
        ],
        subsections: [
          {
            title: "Tabela Completa",
            content: [
              "| Raça | Língua Materna | Atributo | Habilidade |",
              "|------|----------------|:--------:|:----------:|",
              "| Aarakocra | Aurano | Agilidade | Voo 9m. |",
              "| Bollywug | Esmérion | - | - |",
              "| Fada | Esmérion | Presença | - |",
              "| Elfo | Élfico | Agilidade | Regeneração |",
              "| Kraken | Náutilo (Alâmico) | Agilidade | Anfíbio |",
              "| Tritão | Náutilo (Alâmico) | Agilidade | Anfíbio |",
              "| Anão | Anão | Vigor | Profissão |",
              "| Serelebre | Esmérion | Agilidade | Pulo |",
              "| Elemental | Primoridal (conferir) | conferir | conferir |",
              "| Svartálfar | Myrkrún (Élfico) | Agilidade | Regeneração |"
            ]
          }
        ]
      },
      {
        title: "Plano Chiclete",
        details: [
          "Dimensão surreal e tecnomágica",
          "3 raças exóticas com mecânicas únicas"
        ],
        subsections: [
          {
            title: "Tabela Completa",
            content: [
              "| Raça | Língua Materna | Atributo | Habilidade |",
              "|------|----------------|:--------:|:----------:|",
              "| Chiclete | Mentos | Intelecto | Hiperação |",
              "| Drone | L - 15 | - | Consciência Única |",
              "| Svartálfar | Myrkrún (Élfico) | Agilidade | Regeneração |"
            ]
          }
        ]
      },
      {
        title: "Inferno",
        details: [
          "Reino das entidades infernais",
          "4 raças com resistências específicas"
        ],
        subsections: [
          {
            title: "Tabela Completa",
            content: [
              "| Raça | Língua Materna | Atributo | Habilidade |",
              "|------|----------------|:--------:|:----------:|",
              "| Diabo | Infernal | Presença | - |",
              "| Diabrete | Infernal | - | - |",
              "| Lêmure | Abissal | - | - |",
              "| Tiefling | Infernal | Presença | Resistência (fogo) |"
            ]
          }
        ]
      },
      {
        title: "Plano Étereo",
        details: [
          "Dimensão espiritual e fantasmal",
          "1 raça com mecânicas de incorporeidade"
        ],
        subsections: [
          {
            title: "Tabela Completa",
            content: [
              "| Raça | Língua Materna | Atributo | Habilidade |",
              "|------|----------------|:--------:|:----------:|",
              "| Fantasma | - | - | - |"
            ]
          }
        ]
      },
      {
        title: "Céu",
        details: [
          "Reino celestial e angélico",
          "1 raça com habilidades divinas"
        ],
        subsections: [
          {
            title: "Tabela Completa",
            content: [
              "| Raça | Língua Materna | Atributo | Habilidade |",
              "|------|----------------|:--------:|:----------:|",
              "| Anjo | Celestial | Presença | - |"
            ]
          }
        ]
      }
    ]
  },
  {
    title: "Línguas",
    description: "Sistema completo de idiomas e sua relação com as raças",
    sections: [
      {
        title: "Línguas Maternas",
        details: ["Idiomas básicos associados a origens raciais"],
        subsections: [
          {
            title: "Tabela de Relação Raça-Língua",
            content: [
              "| Língua | Custo PD | Raças Associadas | Referência | Descrição |",
              "|--------|:--------:|------------------|------------|-----------|",
              "| Alâmico | 4 | Humano, Kraken, Tritão | Inglês | Língua comum universal |",
              "| Anão | 4 | Anão, Haffling, Orc | Espanhol | Língua das montanhas e forjas |",
              "| Élfico | 4 | Elfo, Svartálfar | Francês | Língua artística e ancestral |",
              "| Dracônico | 4 | Draconato, Kobold, Lagarto | Alemão | Língua gutural de criaturas escamosas |",
              "| Gruts'ka | 4 | Goblin, HobGoblin, Bugbear | Português BR | Língua rápida e cheia de gírias |",
              "| Infernal | 4 | Tiefling, Diabo | Mandarim | Língua proibida do Inferno |",
              "| Esmerion | 4 | Fada, Bollywug, Serelebre | Russo | Língua da floresta encantada |"
            ]
          }
        ]
      },
      {
        title: "Dialetos Regionais",
        details: ["Variantes linguísticas culturais"],
        subsections: [
          {
            title: "Tabela de Dialetos",
            content: [
              "| Dialeto | Base | Custo PD | Raças Usuárias | Referência | Características |",
              "|---------|------|:--------:|----------------|------------|-----------------|",
              "| Pequenino | Anão | 2 | Anões rurais | Galego | Versão caipira do Anão |",
              "| Gulduriano | Anão | 2 | Orcs | Catalão | Língua marginalizada |",
              "| Náutilo | Alâmico | 2 | Tritões, Krakens | Papiamento | Mistura marítima |",
              "| Myrkrún | Élfico | 2 | Elfos Negros | Holandês | Escrita mágica que queima |",
              "| Código Ladrões | Qualquer | 2 | Ladrões, Nômades | - | Linguagem cifrada |"
            ]
          }
        ]
      },
      {
        title: "Línguas Elementais",
        details: ["Idiomas dos planos primordiais"],
        subsections: [
          {
            title: "Tabela Elemental",
            content: [
              "| Língua | Plano | Custo PD | Raças | Referência |",
              "|--------|-------|:--------:|-------|------------|",
              "| Aurano | Esmeralda | 5 | Aarakocra, Elementais | Português PT | Língua aérea |",
              "| Terrano | Esmeralda | 5 | Elementais da terra | Italiano | Sons profundos |",
              "| Aquano | Esmeralda | 5 | Elementais da água | Finlandês | Melodias líquidas |",
              "| Ignano | Esmeralda | 5 | Elementais do fogo | Híndi | Estalidos vulcânicos |"
            ]
          }
        ]
      },
      {
        title: "Línguas Secretas",
        details: ["Idiomas raros e proibidos"],
        subsections: [
          {
            title: "Tabela de Línguas Ocultas",
            content: [
              "| Língua | Custo PD | Raças | Referência | Perigo |",
              "|--------|:--------:|-------|------------|--------|",
              "| Abissal | 6 | Demônios, Cultistas | Húngaro | Criminalizada |",
              "| Rhiz'khazun | 6 | Yuan-Ti | Árabe | Desertos mortais |",
              "| Mentos | 6 | Chicletes | Japonês | Isolacionista |",
              "| Celestial | 6 | Anjos | Hebraico | Inacessível |",
              "| L-15 | 6 | Drones | Binário | Tecnomágica |"
            ]
          }
        ]
      },
      {
        title: "Línguas Mortas",
        details: ["Idiomas históricos em desuso"],
        subsections: [
          {
            title: "Tabela Arqueológica",
            content: [
              "| Língua | Custo PD | Últimos Falantes | Referência | Contexto |",
              "|--------|:--------:|------------------|------------|----------|",
              "| Kruthak | 6 | Orcs anciãos | Turco | Era pré-dragões |",
              "| Daniel | 6 | Sereias de Umbraterna | Maya | Linguagem gestual |",
              "| Primordial | 6 | Entidades antigas | Latim | Base de dialetos |"
            ]
          }
        ]
      }
    ]
  },
  {
    title: "Perícias",
    description: "Sistema completo de perícias e especializações",
    sections: [
      {
        title: "Físicas & Combate",
        details: ["Habilidades relacionadas a movimento e confronto"],
        subsections: [
          {
            title: "Tabela de Perícias",
            content: [
              "| Perícia | Atributo | Custo PD | Descrição |",
              "|---------|----------|:--------:|-----------|",
              "| Acrobacia | Agilidade | 2 | Movimentos complexos e equilíbrio |",
              "| Atletismo | Força | 2 | Saltos, escaladas e resistência física |",
              "| Furtividade | Agilidade | 3 | Movimento silencioso e camuflagem |",
              "| Luta | Força | 3 | Combate desarmado e técnicas marciais |",
              "| Pontaria | Agilidade | 3 | Precisão com armas à distância |",
              "| Reflexos | Agilidade | 2 | Reações rápidas a estímulos |",
              "| Sobrevivência | Vigor | 2 | Adaptação a ambientes hostis |"
            ]
          }
        ]
      },
      {
        title: "Sociais & Comunicação",
        details: ["Habilidades de interação e influência"],
        subsections: [
          {
            title: "Tabela de Perícias",
            content: [
              "| Perícia | Atributo | Custo PD | Descrição |",
              "|---------|----------|:--------:|-----------|",
              "| Charme | Presença | 2 | Atração e simpatia natural |",
              "| Etiqueta | Presença | 2 | Conhecimento de protocolos sociais |",
              "| Intimidação | Força | 3 | Uso da presença física para coagir |",
              "| Lábia | Intelecto | 3 | Persuasão através de argumentos lógicos |",
              "| Persuasão | Presença | 3 | Capacidade de convencimento |"
            ]
          }
        ]
      },
      {
        title: "Conhecimento & Intelecto",
        details: ["Habilidades acadêmicas e místicas"],
        subsections: [
          {
            title: "Tabela de Perícias",
            content: [
              "| Perícia | Atributo | Custo PD | Descrição |",
              "|---------|----------|:--------:|-----------|",
              "| Alquimia | Intelecto | 4 | Transformação de materiais |",
              "| Arcanismo | Intelecto | 4 | Conhecimento de magias arcanas |",
              "| Ciências | Intelecto | 3 | Conhecimento científico |",
              "| Engenharia | Intelecto | 4 | Construção e mecânica |",
              "| Herbalismo | Intelecto | 3 | Uso de plantas medicinais |",
              "| História | Intelecto | 2 | Conhecimento histórico |",
              "| Medicina | Intelecto | 4 | Tratamento de ferimentos |",
              "| Ocultismo | Intelecto | 4 | Conhecimento do sobrenatural |",
              "| Religião | Intelecto | 2 | Dogmas e práticas religiosas |",
              "| Tática | Intelecto | 3 | Estratégias de combate |"
            ]
          }
        ]
      },
      {
        title: "Ofícios & Artesanato",
        details: ["Habilidades técnicas e artísticas"],
        subsections: [
          {
            title: "Tabela de Perícias",
            content: [
              "| Perícia | Atributo | Custo PD | Descrição |",
              "|---------|----------|:--------:|-----------|",
              "| Caligrafia | Intelecto | 2 | Arte da escrita ornamental |",
              "| Cozinha | Intelecto | 2 | Preparação de alimentos |",
              "| Forja | Força | 3 | Trabalho com metais |",
              "| Mineração | Vigor | 3 | Extração de recursos minerais |",
              "| Música | Presença | 2 | Execução e composição musical |"
            ]
          }
        ]
      },
      {
        title: "Especiais & Únicas",
        details: ["Habilidades com mecânicas exclusivas"],
        subsections: [
          {
            title: "Tabela de Perícias",
            content: [
              "| Perícia | Atributo | Custo PD | Descrição |",
              "|---------|----------|:--------:|-----------|",
              "| Extraplanar | Intelecto | 5 | Conhecimento de outros planos |",
              "| Falsificação | Agilidade | 4 | Criação de itens falsos |",
              "| Intuição | Presença | 3 | Percepção além dos sentidos |",
              "| Investigação | Intelecto | 3 | Análise de evidências |",
              "| Lidar com Animais | Presença | 2 | Comunicação com criaturas |",
              "| Mãos Leves | Agilidade | 3 | Prestidigitação e pequenos furtos |",
              "| Navegação | Intelecto | 3 | Orientação em diferentes ambientes |",
              "| Vontade | Vigor | 4 | Resistência mental |"
            ]
          }
        ]
      }
    ]
  }
];

export default systemInfo;