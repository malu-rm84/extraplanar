const systemInfo = [
  {
    title: "Personagens",
    description: "Informações fundamentais dos personagens, suas origens e capacidades.",
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
              "| Faixa Etária | Bônus de PV | Bônus de PE | Bônus | Idade |",
              "| :--------------: | :---------: | :---------: | :-------------------------------------: | :---: |",
              "| Criança: | -1 | +3 | Não pode ter Ocupação. | 0 |",
              "| Adolescente: | 0 | +2 | Não pode passar do nível 2 de Ocupação. | 0 |",
              "| Jovem: | +1 | +1 | - | 0 |",
              "| Adulto: | +2 | 0 | Aumenta um nível em qualquer Ocupação. | 1 |",
              "| Idoso: | -1 | -1 | Ganha dois níveis em qualquer Ocupação | 2 |",
              "| Caquético: | -2 | -2 | Ganha dois níveis em qualquer Ocupação | 3 |"
            ]
          },
          {
            title: "Atributos Básicos",
            content: [
              "| Valor | Descrição | Custo | Exemplo de Personagem |",
              "| :---: | :-------------: | :----: | :-------------------------: |",
              "| 0 | Abaixo da Média | 0 PD | Idosos, Franzinos |",
              "| 1 | Médio | 1 PD | Fazendeiro, Artesão |",
              "| 2 | Acima da Média | 2 PDs | Soldado básico, Ladino |",
              "| 3 | Excepcional | 4 PDs | Herói local, Mestre artesão |",
              "| 4 | Lendário | 7 PDs | Campeão, Gênio tático |",
              "| 5 | Ícone | 11 PDs | Lenda viva, Semideus |",
              "- Agilidade",
              "- Força",
              "- Intelecto", 
              "- Presença", 
              "- Vigor"
            ]
          },
          {
            title: "Sistema de Afinidades",
            content: [
              "| Nível | Custo Individual | Custo Total Acumulado | Descrição |",
              "| :---: | :--------------: | :-------------------: | :-----------------------: |",
              "| 0 | 0 PD | 0 PD | Sem afinidade |",
              "| 1 | 1 PD | 1 PD | Conexão inicial |",
              "| 2 | 2 PDs | 3 PDs | Controle elementar |",
              "| 3 | 3 PDs | 6 PDs | Mestre na área |",
              "| 4 | 4 PDs | 10 PDs | Poder transcendental |",
              "| 5 | 5 PDs | 15 PDs | Domínio sobre a realidade |",
              "- Arcana", 
              "- Cósmica", 
              "- Divina", 
              "- Natural", 
              "- Necromante"
            ]
          },
          {
            title: "Vitalidade",
            content: [
              "A contagem inicial de PV e PE é:",
              "- PV = 10 + VIGOR + Bônus de Faixa Etária.",
              "- PE = 1 + VIGOR + Bônus de Faixa Etária.",
              "- PP base = 10 + Vigor + 1 (a cada 2PD investido).",
              "A percepção passiva também entra na Vitalidade, sendo definida agora, mas podendo ser aumentada ao longo das sessões. O custo para cada ponto extra na percepção passiva é de 2PD."
            ]
          }
        ]
      },
      {
        title: "Antecedente Mágico",
        details: [
          "Informações complementares ao personagem envolvendo origem mágica, talentos e evolução."
        ],
        subsections: [
          {
            title: "Antecedente Mágico",
            content: [
              "| Elemento | Descrição |",
              "|----------|-----------|",
              "| Melhoria de Magia | Permite aprimorar uma magia específica. |",
              "| Espaço de Magia | Garante um novo espaço para conjuração. |",
              "| Afinidade | Ligação mágica inicial, como Arcana, Divina, etc. |"
            ]
          },
          {
            title: "Determinação",
            content: [
              "| Efeito | Descrição |",
              "|--------|-----------|",
              "| Vida | Recupera PV como ação livre (VIGOR + Nível). |",
              "| PE | Regenera todo o PE como ação livre. |",
              "| Maldade | Recupera 1 ponto de Maldade. |",
              "| Vantagem | +10 em teste, salvaguarda ou ataque. |",
              "| Dano | Erros viram acertos, acertos viram críticos, críticos = dano máximo. |",
              " Esses pontos são coringas para seu personagem. Eles são negociáveis com o mestre e regenerados no fim da campanha (ou quando o mestre decidir). "
            ]
          },
          {
            title: "Sorte",
            content: [
              "| Efeito | Descrição |",
              "|--------|-----------|",
              "| Desastre Calculado | Uma falha se transforma em sucesso. |",
              "| Sugestão do Mestre | O mestre cria um evento positivo por sorte. |",
              " Esses pontos são coringas para seu personagem. Eles são negociáveis com o mestre e regenerados no fim da campanha (ou quando o mestre decidir). "
            ]
          },
          {
            title: "Talento",
            content: [
              "| Exemplo | Descrição |",
              "|---------|-----------|",
              "| 1 | Consegue identificar se um item é falso e dizer como funciona. |",
              "| 2 | Consegue se comunicar com plantas. |",
              " Talentos são habilidades únicas ou inatas do personagem, que podem ser negociadas com o mestre. "
            ]
          },
          {
            title: "Ocupação (Antecedente)",
            content: [
              "Você pode gastar pontos de antecedente para aumentar seu nível de ocupação.",
              "Cada ponto equivale a 1 nível em uma ocupação à sua escolha e representa sua influência, habilidades e histórico."
            ]
          }
        ]
      },
      {
        title: "Raças",
        details: ["Raças disponíveis divididas por plano."],
        subsections: [
          {
            title: "Plano Material",
            content: [
              "| Raça | Língua Materna | Atributo | Habilidade |",
              "|------|----------------|----------|------------|",
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
              "| Yuan-Ti | Rhiz'khazun | Presença | ? |",
              "- Personagens do deserto de Garla têm Rhiz'khazun como língua materna."
            ]
          },
          {
            title: "Plano Esmeralda",
            content: [
              "| Raça | Língua Materna | Atributo | Habilidade |",
              "|------|----------------|----------|------------|",
              "| Aarakocra | Aurano | Agilidade | Voo 9m. |",
              "| Bollywug | Esmérion | - | - |",
              "| Fada | Esmérion | Presença | - |",
              "| Elfo | Élfico | Agilidade | Regeneração |",
              "| Kraken | Náutilo (Alâmico) | Agilidade | Anfíbio |",
              "| Tritão | Náutilo (Alâmico) | Agilidade | Anfíbio |",
              "| Anão | Anão | Vigor | Profissão |",
              "| Serelebre | Esmérion | Agilidade | Pulo |",
              "| Elemental | Primordial (conferir) | conferir | conferir |",
              "| Svartálfar | Myrkrún (Élfico) | Agilidade | Regeneração |"
            ]
          },
          {
            title: "Plano Chiclete",
            content: [
              "| Raça | Língua Materna | Atributo | Habilidade |",
              "|------|----------------|----------|------------|",
              "| Chiclete | Mentos | Intelecto | Hiperação |",
              "| Drone | L - 15 | - | Consciência Única |",
              "| Svartálfar | Myrkrún (Élfico) | Agilidade | Regeneração |"
            ]
          },
          {
            title: "Inferno",
            content: [
              "| Raça | Língua Materna | Atributo | Habilidade |",
              "|------|----------------|----------|------------|",
              "| Diabo | Infernal | Presença | - |",
              "| Diabrete | Infernal | - | - |",
              "| Lêmure | Abissal | - | - |",
              "| Tiefling | Infernal | Presença | Resistência (fogo) |"
            ]
          },
          {
            title: "Plano Etéreo",
            content: [
              "| Raça | Língua Materna | Atributo | Habilidade |",
              "|--------|----------------|----------|------------|",
              "| Fantasma | - | - | - |"
            ]
          },
          {
            title: "Céu",
            content: [
              "| Raça | Língua Materna | Atributo | Habilidade |",
              "|------|----------------|----------|------------|",
              "| Anjo | Celestial | Presença | - |"
            ]
          }
        ]
      },
      {
        title: "Ocupações",
        details: ["Ocupações divididas por categoria com custo base em PDs. Cada profissão pode ser aprimorada até o nível 3, com aumento cumulativo de PDs."],
        subsections: [
          {
            title: "Marginalizadas (3PD)",
            content: [
              "| Profissão | Nv.1 | Nv.2 | Nv.3 |",
              "| ------------- | -------- | -------- | -------- |",
              "| Ladrão        | 3PD      | 4PD      | 5PD      |",
              "| Informante    | 3PD      | 4PD      | 5PD      |",
              "| Mendigo       | 3PD      | 4PD      | 5PD      |",
              "| Prisioneiro   | 3PD      | 4PD      | 5PD      |",
              "| Trambiqueiro  | 3PD      | 4PD      | 5PD      |",
              "| Nômade        | 3PD      | 4PD      | 5PD      |"
            ]
          },
          {
            title: "Coleta e Produção Básica (3PD)",
            content: [
              "| Profissão | Nv.1 | Nv.2 | Nv.3 |",
              "| ------------- | -------- | -------- | -------- |",
              "| Caçador       | 3PD      | 4PD      | 5PD      |",
              "| Fazendeiro    | 3PD      | 4PD      | 5PD      |",
              "| Pedreiro      | 3PD      | 4PD      | 5PD      |",
              "| Minerador     | 3PD      | 4PD      | 5PD      |",
              "| Lenhador      | 3PD      | 4PD      | 5PD      |"
              ]
          },
          {
            title: "Serviços (4PD)",
            content: [
              "| Profissão | Nv.1 | Nv.2 | Nv.3 |",
              "| ------------- | -------- | -------- | -------- |",
              "| Cozinheiro    | 4PD      | 5PD      | 6PD      |",
              "| Taverneiro    | 4PD      | 5PD      | 6PD      |",
              "| Mercador      | 4PD      | 5PD      | 6PD      |",
              "| Bardo         | 4PD      | 5PD      | 6PD      |",
              "| Serviçal      | 4PD      | 5PD      | 6PD      |",
              "| Religioso     | 4PD      | 5PD      | 6PD      |",
              "| Linguista     | 4PD      | 5PD      | 6PD      |",
              "| Guarda        | 4PD      | 5PD      | 6PD      |",
              "| Marinheiro    | 4PD      | 5PD      | 6PD      |"
            ]
          },
          {
            title: "Ofícios Especializados (5PD)",
            content: [
              "| Profissão | Nv.1 | Nv.2 | Nv.3 |",
              "| ------------- | -------- | -------- | -------- |",
              "| Armoreiro     | 5PD      | 6PD      | 7PD      |",
              "| Armeiro       | 5PD      | 6PD      | 7PD      |",
              "| Ferreiro      | 5PD      | 6PD      | 7PD      |",
              "| Artesão       | 5PD      | 6PD      | 7PD      |",
              "| Domador       | 5PD      | 6PD      | 7PD      |",
              "| Carpinteiro   | 5PD      | 6PD      | 7PD      |",
              "| Engenheiro    | 5PD      | 6PD      | 7PD      |",
              "| Estilista     | 5PD      | 6PD      | 7PD      |",
              "| Cartógrafo    | 5PD      | 6PD      | 7PD      |",
              "| Cientista     | 5PD      | 6PD      | 7PD      |",
              "| Estudioso     | 5PD      | 6PD      | 7PD      |",
              "| Historiador   | 5PD      | 6PD      | 7PD      |",
              "| Joalheiro     | 5PD      | 6PD      | 7PD      |"
            ]
          },
          {
            title: "Combate & Segurança (5PD)",
            content: [
              "| Profissão | Nv.1 | Nv.2 | Nv.3 |",
              "| ------------- | -------- | -------- | -------- |",
              "| Soldado       | 5PD      | 6PD      | 7PD      |",
              "| Mercenário    | 5PD      | 6PD      | 7PD      |",
              "| Assassino     | 5PD      | 6PD      | 7PD      |"
            ]
          },
          {
            title: "Magia & Ocultismo (6PD)",
            content: [
              "| Profissão | Nv.1 | Nv.2 | Nv.3 |",
              "| ------------- | -------- | -------- | -------- |",
              "| Alquimista    | 6PD      | 7PD      | 8PD      |",
              "| Conjurador    | 6PD      | 7PD      | 8PD      |",
              "| Cultista      | 6PD      | 7PD      | 8PD      |",
              "| Escriba       | 6PD      | 7PD      | 8PD      |",
              "| Tatuador      | 6PD      | 7PD      | 8PD      |"
            ]
          },
          {
            title: "Alta Sociedade (7PD)",
            content: [
              "| Profissão | Nv.1 | Nv.2 | Nv.3 |",
              "| ------------- | -------- | -------- | -------- |",
              "| Nobre         | 7PD      | 8PD      | 9PD      |",
              "| Embaixador    | 7PD      | 8PD      | 9PD      |",
              "| Administrador | 7PD      | 8PD      | 9PD      |",
              "| Burguês       | 7PD      | 8PD      | 9PD      |",
              "| Militar       | 7PD      | 8PD      | 9PD      |"
            ]
          }
        ]
      },
      {
        title: "Línguas",
        details: [
          "Toda raça tem uma língua materna gratuita, que pode ser vendida pelo valor da sua classificação. Alâmico é a língua comum, mas há diversas outras línguas e dialetos no mundo."
        ],
        subsections: [
          {
            title: "Dialetos (2PD)",
            content: [
              "| Nome | Base | Descrição | Referência |",
              "|------|------|-----------|------------|",
              "| Código dos Ladrões | Qualquer | Variante para qualquer língua | - |",
              "| Alâmico Culto | Alâmico | Variante refinada do Alâmico | Inglês Britânico |",
              "| Gulduriano | Anão | Língua oficial dos Orcs, marginalizada pelos Anões | Catalão |",
              "| Pequenino | Anão | Variante rural do Anão | Galego |",
              "| Gnomaraz | Anão | - | Basco |",
              "| Náutilo | Alâmico | Mistura marítima de Aquano e Alâmico | Papiamento |",
              "| Aurano | Primordial | Usado nos reinos elementais | Português de Portugal |",
              "| Terrano | Primordial | Usado nos reinos elementais | Italiano |",
              "| Aquano | Primordial | Usado nos reinos elementais | Finlandês |",
              "| Ignano | Primordial | Usado nos reinos elementais | Híndi |",
              "| Myrkrún | Élfico | Élfico adaptado para Elfos Negros | Holandês |"
            ]
          },
          {
            title: "Línguas Maternas (4PD)",
            content: [
              "| Nome | Descrição | Referência |",
              "|------|------------|-------------|",
              "| Alâmico | Língua dos humanos, a mais falada no universo | Inglês |",
              "| Élfico | Língua erudita, pouco modificada | Francês |",
              "| Anão | Língua forte e marcante, influência em outras | Espanhol |",
              "| Infernal | Língua marginalizada do inferno | Mandarim |",
              "| Dracônico | Língua dos dragões, rude e antiga | Alemão |",
              "| Gruts'ka | Língua goblinóide, poética e cheia de gírias | Português (Brasil) |",
              "| Esmerion | Língua da floresta, falada no Plano Esmeralda | Russo |"
            ]
          },
          {
            title: "Línguas Exotéricas (5PD)",
            content: [
              "| Nome | Descrição | Referência |",
              "|------|------------|-------------|",
              "| Abissal | Língua profana, considerada crime em alguns reinos | Húngaro |",
              "| Mentos | Língua isolacionista do Plano Chiclete | Japonês |",
              "| Rhiz'khazun | Língua do deserto de Garla | Árabe Beduíno |",
              "| Primordial | Língua ancestral com vários dialetos | Latim |"
            ]
          },
          {
            title: "Línguas Mortas/Secretas (6PD)",
            content: [
              "| Nome | Descrição | Referência |",
              "|------|------------|-------------|",
              "| Daniel | Língua gestual da sereia barítona de Umbraterna | Yucatec Maya Sign Language |",
              "| Kruthak | Antiga língua Orc antes da guerra dos dragões | Turco |",
              "| L-15 | Língua binária do reino de Meccanar | Binário |",
              "| Celestial | Língua dos Anjos, pouco compreendida | Hebraico |"
            ]
          }
        ]
      },
      {
        title: "Perícias",
        details: ["Perícias divididas por categoria, com atributo relacionado, custo em PD e descrição."],
        subsections: [
          {
            title: "Físicas & Combate",
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
          },
          {
            title: "Sociais & Comunicação",
            content: [
              "| Perícia | Atributo | Custo PD | Descrição |",
              "|---------|----------|:--------:|-----------|",
              "| Charme | Presença | 2 | Atração e simpatia natural |",
              "| Etiqueta | Presença | 2 | Conhecimento de protocolos sociais |",
              "| Intimidação | Força | 3 | Uso da presença física para coagir |",
              "| Lábia | Intelecto | 3 | Persuasão através de argumentos lógicos |",
              "| Persuasão | Presença | 3 | Capacidade de convencimento |"
            ]
          },
          {
            title: "Conhecimento & Intelecto",
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
          },
          {
            title: "Ofícios & Artesanato",
            content: [
              "| Perícia | Atributo | Custo PD | Descrição |",
              "|---------|----------|:--------:|-----------|",
              "| Caligrafia | Intelecto | 2 | Arte da escrita ornamental |",
              "| Cozinha | Intelecto | 2 | Preparação de alimentos |",
              "| Forja | Força | 3 | Trabalho com metais |",
              "| Mineração | Vigor | 3 | Extração de recursos minerais |",
              "| Música | Presença | 2 | Execução e composição musical |"
            ]
          },
          {
            title: "Especiais & Únicas",
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
      },

      {
        title: "Capacidades",
        details: ["Capacidades adquiridas por kits, divididas por categoria."],
        subsections: [
          {
            title: "Ofícios Manuais & Artesanato",
            content: [
              "| Capacidade | Custo Padrão | Custo p/Profissionais | Profissões Relacionadas | Preço |",
              "|---------------------|--------------|------------------------|----------------------------------|--------|",
              "| Kit de Ferraria | 3 | 1 | Ferreiro, Armeiro, Armoreiro | |",
              "| Kit de Joalheria | 3 | 1 | Joalheiro, Artesão, Nobre | |",
              "| Kit de Construção | 3 | 1 | Pedreiro, Carpinteiro, Engenheiro | |",
              "| Kit de Tatuagem | 2 | 0 | Tatuador, Alquimista, Cultista | |",
              "| Kit de Cozinha | 2 | 0 | Cozinheiro, Fazendeiro, Taverneiro | |",
              "| Kit de Alquimia | 4 | 2 | Alquimista, Médico, Herbalista | |",
              "| Kit de Herbalismo | 3 | 1 | Herbalista, Médico, Fazendeiro | |",
              "| Kit de Embalsamamento | 3 | 1 | Médico, Cultista, Cientista | |",
              "| Kit de Taverna | 2 | 0 | Taverneiro, Cozinheiro, Alquimista | |",
              "| Kit Médico | 4 | 2 | Médico, Alquimista, Cientista | |",
              "| Kit de Ladrão | 4 | 2 | Ladrão, Assassino, Mercenário | |",
              "| Kit de Domador | 3 | 1 | Caçador, Fazendeiro, Domador | |",
              "| Kit de Tortura | 4 | 2 | Assassino, Militar, Guarda | |"
            ]
          },
          {
            title: "Navegação & Exploração",
            content: [
              "| Capacidade | Custo Padrão | Custo p/Profissionais | Profissões Relacionadas | Preço |",
              "|------------------|--------------|------------------------|-----------------------------|--------|",
              "| Kit de Cartografia | 2 | 0 | Cartógrafo, Navegador, Militar | |",
              "| Kit de Navegação | 3 | 1 | Navegador, Pirata, Caçador | |",
              "| Kit de Arqueologia | 3 | 1 | Historiador, Estudioso, Religioso | |"
            ]
          },
          {
            title: "Artes & Entretenimento",
            content: [
              "| Capacidade | Custo Padrão | Custo p/Profissionais | Profissões Relacionadas | Preço |",
              "|------------------|--------------|------------------------|---------------------------|--------|",
              "| Kit Musical | 2 | 0 | Bardo, Artista, Taverneiro | |",
              "| Kit de Caligrafia | 2 | 0 | Escriba, Nobre, Tatuador | |",
              "| Kit de Jogos | 2 | 0 | Bardo, Mercador, Ladrão | |"
            ]
          },
          {
            title: "Armas Corpo a Corpo",
            content: [
              "| Capacidade | Custo Padrão | Custo p/Profissionais | Profissões Relacionadas |",
              "|----------------|--------------|------------------------|-----------------------------|",
              "| Armas Curtas | 2 | 0 | Assassino, Soldado, Ladrão |",
              "| Armas Leves | 3 | 1 | Soldado, Assassino, Guarda |",
              "| Armas Táticas | 3 | 1 | Militar, Nobre, Mercenário |",
              "| Armas Marciais | 4 | 2 | Militar, Nobre, Assassino |",
              "| Improvisadas | 3 | 1 | Guarda, Ladrão, Trambiqueiro |"
            ]
          },
          {
            title: "Armas à Distância",
            content: [
              "| Capacidade | Custo Padrão | Custo p/Profissionais | Profissões Relacionadas |",
              "|----------------------------|--------------|------------------------|-----------------------------|",
              "| Armas Leves (Dist.) | 2 | 0 | Caçador, Soldado, Guarda |",
              "| Armas Táticas (Dist.) | 3 | 1 | Militar, Mercenário, Soldado |",
              "| Armas Marciais (Dist.) | 4 | 2 | Militar, Soldado, Atirador |",
              "| Improvisadas | 3 | 1 | Guarda, Ladrão, Assassino |"
            ]
          },
          {
            title: "Proteções",
            content: [
              "| Capacidade | Custo Padrão | Custo p/Profissionais | Profissões Relacionadas |",
              "|------------|--------------|------------------------|-----------------------------|",
              "| Armaduras | 3 | 1 | Mercenário, Guarda, Militar |",
              "| Escudos | 3 | 1 | Soldado, Guarda, Militar |"
            ]
          }
        ]
      },
      {
        title: "Habilidades PD",
        details: ["Habilidades organizadas por custo em PD e com descrição dos efeitos."],
        subsections: [
          {
            title: "PD 1 (Fundamentais)",
            content: [
              "| Tipo | Descrição |",
              "|------|------------|",
              "| PV | Some 1 + Vigor + Bônus de Faixa Etária nos seus PVs. |",
              "| PE | Some 1 + Vigor + Bônus de Faixa Etária nos seus PEs. |"
            ]
          },
          {
            title: "PD 2 (Habilidades Básicas)",
            content: [
              "| Habilidade | Custo (PD) | Efeito |",
              "|------------|-------------|--------|",
              "| Saque Rápido | 2 + 3PD | Desce um passo do saque de arma. Mais 1 passo com 3PD. |",
              "| Atleta | 2PD | +3m de deslocamento. |",
              "| Nerdola | 2PD | 2PE para teste de Atualidades (DT20) e obter info útil. |",
              "| Improvisar Componentes | 2 + 2PD | 2PE para obter componentes aleatórios (1x ou 2x por sessão). |",
              "| Astuto | 2 + 2PD | 2PE para trocar atributo base em um teste (1x/sessão ou 1x/cena). |",
              "| Inimigo Favorito | 2 + 2PD | +1 dado de dano, rastrear e obter info. 4PE = +2 dados. |"
            ]
          },
          {
            title: "PD 3 (Habilidades Sólidas)",
            content: [
              "| Habilidade | Custo (PD) | Efeito |",
              "|------------|-------------|--------|",
              "| Proficiência | 3PD | Usa o valor do atributo no ataque com um tipo de arma. |",
              "| Furtividade Suprema | 3PD | Move-se totalmente enquanto está furtivo. |",
              "| Pense Bem | 3 + 2PD | 2PE para +1d6 em perícia com +5. 4PE = +2d6. |",
              "| Ação Ardilosa | 3 + 3PD | 2PE para usar ação bônus (esconder/disparar/desengajar). 5PE = ação livre. |",
              "| Ataque Especial | 3 + 3PD | 2PE para +5 no dano. 4PE = +10. |",
              "| Inspirar Confiança | 3PD | 2PE para um aliado re-rolar um teste falho. |",
              "| Ímpeto | 3PD | 1-3PE = +2m a +6m de deslocamento. |",
              "| Golpe Pesado | 3PD | +1 dado de dano corpo a corpo. |",
              "| Regeneração Tática | 3 + 2 + 3PD | Cura: 2PE = 1d6+VIG / 4PE = 2d6+VIG / 8PE = 2d10+VIG. |"
            ]
          },
          {
            title: "PD 4 (Habilidades Boas)",
            content: [
              "| Habilidade | Custo (PD) | Efeito |",
              "|------------|-------------|--------|",
              "| Arma Favorita | 4PD | +1 na margem de ameaça da arma escolhida. |",
              "| Artista Marcial | 4PD | Ataques desarmados com AGI ou FOR à vontade. |",
              "| Investigador | 4 + 2PD | 2PE para encontrar pistas extras. Funciona sob pressão com mais 2PD. |",
              "| Ataque Furtivo | 4 + 3PD | 1d6/2PE com vantagem tática. Com 3PD: qualquer vantagem vira furtivo. |",
              "| Mira / Esgrimista | 4 + 3PD | Rola 2 danos e escolhe melhor. 3PD = dobra dados e escolhe melhores originais. |",
              "| Magia Acelerada | 4PD | Reduz tempo de conjuração em 1 passo. |",
              "| Golpe de Raspão | 4 + 2PD | 2PE ao errar = 1d8 de dano. 2PE = 1d12. |",
              "| Escapar de Hordas | 4PD | Desvantagem em ataques de oportunidade contra você. |",
              "| Consciência Primitiva | 4PD | 2PE para detectar criaturas/locais. |",
              "| Defesa sem Armadura | 4 + 3PD | Soma VIG na defesa (dobrado com 3PD). |",
              "| Ataque Imprudente | 4 + 2 + 2PD | -2 DEF, +3 dano (pode ser usado mais vezes com mais PDs). |",
              "| Carga Máxima | 4PD | Soma VIG ao espaço de inventário. |"
            ]
          },
          {
            title: "PD 5 (Habilidades Fortes)",
            content: [
              "| Habilidade | Custo (PD) | Efeito |",
              "|------------|-------------|--------|",
              "| Evasão | 5PD | Evita todo dano em área, não só metade. |",
              "| Expert | 5 + 4PD | 1-5PE = +1 a +5 bônus em perícias com até +3. 10PE = +10 com 4PD. |",
              "| Teoria Marcial | 5PD | 1PE + bônus = aumenta passo do crítico (máx. 5). |",
              "| Iniciativa Aprimorada | 5 + 3PD | 1-5PE = +1 a +5 bônus na iniciativa. Com 3PD: até +10. |",
              "| Evocador | 5PD | +1 no multiplicador de crítico de magias. |",
              "| Destruidor de Hordas | 5 + 2PD | 2PE = ataque extra adjacente. Pode usar 2x com mais 2PD. |",
              "| Ataque Giratório | 5PD | 1PE por alvo para atacar todos a 1,5m. |",
              "| Duelista de Colossos | 5PD | 2PE = +1 dado de ataque contra alvos feridos. |",
              "| Fúria | 5PD | 1PE/turno: vantagem em FOR, +1 crit corpo a corpo, -5 resistências. |",
              "| Maestria | 5PD | Reduz a margem de ameaça de uma magia em 1. |",
              "| Mestre de Efeitos | 5 + 4PD | 1-5PE = +1 a +5 bônus em DT. Com 4PD: até +10. |"
            ]
          },
          {
            title: "PD 6 (Habilidades Muito Fortes)",
            content: [
              "| Habilidade | Custo (PD) | Efeito |",
              "|------------------------|--------------|-----------------------------------------------------------|",
              "| Maestria Mágica | 6PD | Reduz 1PE ao conjurar uma magia específica. |",
              "| Primeiras Impressões | 6PD | +10 no primeiro teste social com alguém. |",
              "| Aumento de Área de Magia | 6 + 2PD | 1PE para +3m de área. 2PE = +6m. |",
              "| Invocação | 6PD | Gasta 1PE/nível para invocar criatura armazenada como item. |",
              "| Identificar Runa | 6PD | 1PE por nível para decifrar magias impregnadas. |",
              "| Saraivada | 6PD | 2PE por alvo para atacar todos no alcance da arma. |"
            ]
          },
          {
            title: "PD 7 (Habilidades Excepcionais)",
            content: [
              "| Habilidade | Custo (PD) | Efeito |",
              "|-------------------|--------------|--------------------------------------------------------|",
              "| Ambidestro | 7PD | 1PE para atacar com ação bônus. |",
              "| Concentração | 7PD | 2PE para manter efeito sem precisar de concentração. |",
              "| Impregnar Magia | 7PD | 2PE para armazenar magia em item com condição. |",
              "| Precisão de Área | 7PD | 2PE por alvo para imunizar contra dano em área. |",
              "| Olhos de Mago | 7PD | Gasta até 5PE para ver o plano Etéreo até o fim da cena. |",
              "| Lutar Contra a Maré | 7PD | 2PE (reação) para redirecionar ataque que errou. |"
            ]
          },
          {
            title: "PD 8-10 (Habilidades Quebradas)",
            content: [
              "| Habilidade | Custo (PD) | Efeito |",
              "|-------------------|--------------|----------------------------------------------------------------|",
              "| Ataque Extra | 8PD | 2PE para atacar duas vezes na mesma ação. |",
              "| Resistência Natural | 8PD | Escolhe 1 tipo de dano (concussão, cortante, perfurante) para ter resistência. |",
              "| Ataque Favorito | 8PD | +1 no multiplicador de crítico de uma arma específica. |"
            ]
          }
        ]
      }
    ]
  },
  {
    title: "Navegação",
    description: "Detalhes sobre embarcações, tamanhos, estrutura e tripulação.",
    sections: [
      {
        title: "Tamanhos de Barco",
        details: ["Características de embarcações por classe"],
        subsections: [
          {
            title: "Tabela de Tamanhos",
            content: [
              "| Tamanho | Deques | Velocidade Base | Capacidade | Armas | Cômodos | PV (Defesa/Resistência) | Mastros | Construção Base | Peças de Madeira (Fortificação) | Manutenção Mínima (Navegação/Limpeza/Vigilância) | Dano de Colisão |",
              "| :-----: | :----: | :-------------: | :--------: | :---: | :-----: | :---------------------: | :-----: | :-------------: | :----------------------------: | :---------------------------------------------: | :-------------: |",
              "| Pequeno | 1 | 10km/h | 20 | 3 | 5 | 150 (18/5) | 2 | 12 | 20 (2) | 7 (2/2/3) | 5d10 |",
              "| Médio | 2 | 0km/h | 50 | 5 | 10 | 300 (16/7) | 2 | 18 | 30 (3) | 10 (3/3/4) | 10d10 |",
              "| Grande | 3 | -10km/h | 150 | 7 | 20 | 500 (14/10) | 2 | 25 | 50 (5) | 15 (4/5/6) | 15d10 |",
              "| Enorme | 4 | -20km/h | 250 | 10 | 40 | 750 (12/12) | 3 | 30 | 60 (6) | 25 (7/13/5) | 20d10 |",
              "| Colossal | 5 | -30km/h | 500 | 12 | 80 | 1000 (10/15) | 4 | 40 | 80 (8) | 50 (12/30/8) | 25d10 |"
            ]
          }
        ]
      },
      {
        title: "Essenciais de Barco",
        details: ["Componentes básicos para operação naval"],
        subsections: [
          {
            title: "Âncora",
            content: [
              "| Item | Preço | Custo para Construir | Tempo para Construir |",
              "| :---: | :---: | :-----------------: | :-----------------: |",
              "| Âncora | 800 | 600 | 3 dias |"
            ]
          },
          {
            title: "Mastros",
            content: [
              "| Tipo | Preço | Custo para Construir | Tempo para Construir |",
              "| :------------: | :---: | :-----------------: | :-----------------: |",
              "| Mastro Ruim | 100 | 50 | 1 dia |",
              "| Mastro Médio | 200 | 100 | 2 dias |",
              "| Mastro Bom | 400 | 200 | 4 dias |"
            ]
          },
          {
            title: "Velas",
            content: [
              "| Tipo | Preço |",
              "| :------------: | :---: |",
              "| Vela Ruim | 150 |",
              "| Vela Média | 300 |",
              "| Vela Boa | 450 |",
              "",
              "Tabela de Velocidade Combinada",
              "| Combinação | Bônus de Velocidade |",
              "| :------------------------------: | :-----------------: |",
              "| Mastro Ruim + Vela Ruim | +2 km/h |",
              "| Mastro Ruim + Vela Média | +4 km/h |",
              "| Mastro Ruim + Vela Boa | +6 km/h |",
              "| Mastro Médio + Vela Ruim | +8 km/h |",
              "| Mastro Médio + Vela Média | +10 km/h |",
              "| Mastro Médio + Vela Boa | +12 km/h |",
              "| Mastro Bom + Vela Ruim | +14 km/h |",
              "| Mastro Bom + Vela Média | +16 km/h |",
              "| Mastro Bom + Vela Boa | +18 km/h |"
            ]
          },
          {
            title: "Leme",
            content: [
              "| Tipo | Preço | Custo para Construir | Tempo para Construir | Observação |",
              "| :---: | :---: | :-----------------: | :-----------------: | :------------------------------------- |",
              "| Timão | 200 | 70 | 1 dia | - |",
              "| Tora | 100 | 35 | 1 dia | Se falhar em teste de direção (DT <5), quebra e deixa o barco à deriva. |"
            ]
          },
          {
            title: "Material",
            content: [
              "| Qualidade | Bônus de Resistência |",
              "| :------------: | :-----------------: |",
              "| Material Ruim | +5 |",
              "| Material Médio | +10 |",
              "| Material Bom | +15 |"
            ]
          }
        ]
      },
      {
        title: "Cômodos de Barco",
        details: ["Layout e benefícios de espaços internos"],
        subsections: [
          {
            title: "Tabela de Cômodos",
            content: [
              "| Nome | Descrição | Sistema | Custo | Construção | Despesas | Inventário | Kits Incluídos |",
              "| :---------------- | :----------------------------- | :------------------------------------------------------------- | :----: | :--------: | :------: | :--------: | :-------------: |",
              "| Aposento do Capitão | Cômodo exclusivo para o capitão, usado para descanso e discussões importantes. | Testes de Habilidade e Resistência de Espírito do capitão recebem vantagem aqui. | 150 | 1 dia | 10 | - | - |",
              "| Armazém | Armazena itens e facilita acesso. | Aumenta o inventário do barco em 15. | 150 | 1 dia | 10 | +15 | - |",
              "| Arsenal | Espaço para armas, munição e equipamentos de combate. | Adiciona +1 limite de armas ao barco. Munição não acaba durante uma cena. | 150 | 1 dia | 10 | - | - |",
              "| Biblioteca | Organiza livros, mapas e documentos. | Cartas/mapas são feitos em metade do tempo. +3 em testes de História/Tática (exceto combate). | 200 | 3 dias | 25 | +5 | Kit de Cartografia |",
              "| Câmara dos Oficiais | Exclusivo para oficiais, com planejamento estratégico. | Oferece Condições de Interlúdio perfeitas para 5 criaturas. Resistência lendária aleatória por sessão. | 400 | 6 dias | 40 | - | - |",
              "| Cela | Prisão segura para até 5 criaturas. | Prisioneiros precisam passar em DT30 para escapar. | 220 | 1 dia | 5 | - | - |",
              "| Cozinha | Preparo de alimentos e refeições coletivas. | +3 em testes de Cozinha. Funciona como refeitório para 5 criaturas. | 300 | 3 dias | 25 | +3 | Kit de Cozinha |",
              "| Dispensa | Armazena alimentos com proteção contra umidade. | Alimentos demoram o dobro para estragar. | 150 | 1 dia | 10 | +10 | - |",
              "| Dormitório | Camas básicas para descanso. | Acomoda 10 criaturas. | 100 | 2 dias | 10 | +3 | - |",
              "| Dormitório Comercial | Camas individuais e aquecidas. | Condições de Interlúdio boas para 10 criaturas. | 200 | 4 dias | 20 | +3 | - |",
              "| Dormitório Luxo | Luxo máximo para passageiros. | Condições de Interlúdio perfeitas para 5 criaturas. | 400 | 6 dias | 40 | +5 | - |",
              "| Enfermaria | Ambiente higienizado para tratamentos médicos. | +3 em testes de Medicina. | 350 | 3 dias | 40 | +3 | Kit de Medicina |",
              "| Estábulo | Transporta animais vivos. | Acomoda até 10 animais médios. | 400 | 4 dias | 35 | - | - |",
              "| Laboratório | Espaço para pesquisa científica e alquímica. | +3 em Ciência/Alquimia. Poções/venenos são fabricados em metade do tempo. | 400 | 4 dias | 35 | +3 | Kit de Ciência/Alquimia |",
              "| Oficina | Produção de engenhocas e reparos. | +3 em Engenharia/Forja. | 200 | 2 dias | 15 | +3 | Kit de Engenheiro/Ferreiro |",
              "| Refeitório | Espaço para refeições em grupo. | Acomoda 20 criaturas. Bônus não especificado em lealdade. | 200 | 2 dias | 30 | - | - |",
              "| Sala de Treinamento | Treino físico e habilidades. | Bônus: vantagem +3 em treinos de Agilidade/Força/Vigor ou 3PE temporário. | 450 | 3 dias | 30 | - | - |",
              "| Sala do Tesouro | Armazém ultra-seguro para itens valiosos. | Requer duas chaves (capitão e imediato). | 600 | 4 dias | 10 | +10 | - |"
            ]
          }
        ]
      },
      {
        title: "Personalizáveis de Barco",
        details: ["Melhorias e customizações"],
        subsections: [
          {
            title: "Tabela de Personalizações",
            content: [
              // Fortificação
              "Fortificação",
              "| Tipo | Bônus de Resistência | Custo Relativo (10% da construção) |",
              "| :----: | :------------------: | :-------------------------------: |",
              "| Ruim | +5 | 10% do custo total da construção |",
              "| Médio | +10 | 10% do custo total da construção |",
              "| Bom | +15 | 10% do custo total da construção |",
              "",
              // Armas
              "Armas Navais",
              "| Arma | Dano | Alcance | Preço |",
              "| :------: | :----: | :-----: | :---: |",
              "| Arpão | 6d8 | 120m | 200 |",
              "| Catapulta | 6d12 | 200m | 300 |",
              "",
              // Aríete
              "Aríete de Proa",
              "| Tipo | Redução de Dano de Impacto | Custo |",
              "| :----: | :-----------------------: | :---: |",
              "| Ruim | 1/4 do dano recebido | 750 |",
              "| Médio | 1/3 do dano recebido | 1000 |",
              "| Bom | 1/2 do dano recebido | 1500 |"
            ]
          }
        ]
      },
      {
        title: "Tripulação",
        details: ["Funções e requisitos da equipe"],
        subsections: [
          {
            title: "Tabela de Tripulação",
            content: [
              "| Tamanho do Barco | Tripulação Mínima | Tripulação Máxima Ideal | Efeitos de Não Acomodação |",
              "| :---------------: | :---------------: | :---------------------: | :---------------------------------------------: |",
              "| Pequeno | 10 | 20 | -1 Lealdade/dia, Condições de Interlúdio ruins |",
              "| Médio | 15 | 50 | -1 Lealdade/dia, Condições de Interlúdio ruins |",
              "| Grande | 50 | 150 | -2 Lealdade/dia, Condições de Interlúdio péssimas |",
              "| Enorme | 70 | 250 | -3 Lealdade/dia, Risco de motim (Dado do Mestre) |",
              "| Colossal | 200 | 500 | -5 Lealdade/dia, Alto risco de motim e danos estruturais |",
              "",
              "Nota: Acomodação adequada requer cômodos como Dormitórios, Refeitório e Câmara dos Oficiais. Valores fora da zona ideal reduzem a eficiência da tripulação."
            ]
          }
        ]
      }
    ]
  },

  {
    title: "Itens",
    description: "Regras e detalhes sobre equipamentos, armas, itens mágicos e armaduras.",
    sections: [
      {
        title: "Armaduras",
        details: [
          "Armadura é um item opcional para combates, aumentando segurança do usuário em níveis drásticos. Armadura básica pesa 2 e dá +5 de Defesa Passiva. Pode ser feita de qualquer material, com estilo narrativo. Categoria I, 5 minutos para vestir. Desvantagem em testes de mobilidade (a critério do mestre)."
        ],
        subsections: [
          {
            title: "Melhorias Físicas",
            content: [
              "| Melhoria | Efeito |",
              "|----------|--------|",
              "| Em Área | Evita completamente o dano em área se passar no teste. |",
              "| Leve | Peso reduzido para 1. |",
              "| Camuflada | Vantagem em testes de furtividade e ????. |",
              "| Acrobata | Auxilia em testes de atletismo/acrobacia (????). |",
              "| Natação | Aumenta tempo de respiração em ?? e +1,5m de natação. |",
              "| Escalada | Reduz dano de queda em 20% e +1,5m de escalada. |",
              "| Pesada | Peso +2, Defesa Passiva +5. |",
              "| de Bolso | Reduz tempo de vestir (????). |"
            ]
          },
          {
            title: "Resistência",
            content: [
              "| Melhoria | Efeito |",
              "|----------|--------|",
              "| Especial | Resistência a um tipo de dano especial (escolha). |",
              "| Vulnerabilidade | Fraqueza em um dano especial, resistência em (Cortante/Perfurante/Contusivo). |",
              "| Adamante | Bloqueia completamente um dano crítico por sessão. |"
            ]
          },
          {
            title: "Encantamentos",
            content: [
              "| Encantamento | Efeito |",
              "|--------------|--------|",
              "| Espinho | Reflete parte do dano corpo a corpo no atacante. |",
              "| Respiração | Aumenta tempo de respiração subaquática. |",
              "| Knockback | Arremessa atacantes corpo a corpo 3m para trás. |",
              "| Ricochete | Redireciona projéteis arremessados contra você. |",
              "| Kamikaze | Permite autodestruição (????). |",
              "| Idiomas | Compreende qualquer idioma enquanto vestida. |",
              "| Antigravidade | Inverte gravidade para você (1x/sessão, até 5 turnos). |",
              "| Atração | Força atacantes corpo a corpo a gastar ação completa para desengajar. |"
            ]
          },
          {
            title: "Ajuste",
            content: [
              "| Efeito | Observação |",
              "|--------|------------|",
              "| Reduz tempo de vestir pela metade e remove desvantagens de mobilidade. | Requer ajuste personalizado por usuário. Roubos/transferências exigem reajuste. |"
            ]
          }
        ]
      },
      // Seções vazias para as demais abas (Geral/Armas/Mágicos)
      {
        title: "Geral",
        details: [""],
        subsections: []
      },
      {
        title: "Armas",
        details: [""],
        subsections: []
      },
      {
        title: "Mágicos",
        details: [""],
        subsections: []
      }
    ]
  },

  {
    title: "Cidades",
    description: "Detalhes sobre estruturas urbanas, construções e planejamento municipal.",
    sections: [
      {
        title: "Construções",
        details: ["Tipos de edificações urbanas categorizadas por função e impacto social."],
        subsections: [
          {
            title: "Militar",
            content: [
              "| Construção | Descrição Básica |",
              "|------------|-------------------|",
              "| Quartel | Centro de treinamento e alojamento militar |",
              "| Muralha | Estrutura defensiva perimetral |",
              "| Castelo | Residência fortificada da nobreza |",
              "| Palácio | Centro administrativo e residencial do governante |",
              "| Fortaleza | Posição defensiva estratégica |",
              "| Trincheira | Defesa improvisada em zonas de conflito |",
              "| Posto Avançado | Ponto de observação fronteiriço |"
            ]
          },
          {
            title: "Comércio",
            content: [
              "| Construção | Descrição Básica |",
              "|------------|-------------------|",
              "| Porto | Hub marítimo para transporte e comércio |",
              "| Mercado | Área de troca comercial aberta |",
              "| Casa de Apostas | Centro de jogos e especulação |",
              "| Posto Fiscal | Ponto de controle alfandegário |"
            ]
          },
          {
            title: "Pesquisa",
            content: [
              "| Construção | Descrição Básica |",
              "|------------|-------------------|",
              "| Laboratório | Centro de experimentação científica |",
              "| Liceu | Instituição de ensino avançado |",
              "| Hospital | Complexo médico de grande porte |",
              "| Escolas | Rede de educação básica |",
              "| Academia | Centro de treinamento especializado |"
            ]
          },
          {
            title: "Produção",
            content: [
              "| Construção | Descrição Básica |",
              "|------------|-------------------|",
              "| Artesão | Oficina de manufatura especializada |",
              "| Mina | Complexo de extração mineral |",
              "| Moinho | Estrutura de processamento agrícola |",
              "| Fazenda | Propriedade rural produtiva |",
              "| Ferreiro | Fundição e metalurgia |",
              "| Armazém | Depósito logístico |",
              "| Companhia | Corporação comercial organizada |"
            ]
          },
          {
            title: "Cultural",
            content: [
              "| Construção | Descrição Básica |",
              "|------------|-------------------|",
              "| Taverna | Centro social e hospedagem |",
              "| Templo | Complexo religioso |",
              "| Bordel | Estabelecimento de entretenimento adulto |",
              "| Prisão | Complexo de detenção |",
              "| Tribunal | Corte de justiça |"
            ]
          },
          {
            title: "Especial",
            content: [
              "| Construção | Descrição Básica |",
              "|---------------------------|-------------------|",
              "| Área Urbana Planejada | Bairro com infraestrutura otimizada |",
              "| Embelezamento | Projetos paisagísticos urbanos |",
              "| Aqueduto | Sistema de abastecimento hídrico |",
              "| Alfândega | Controle aduaneiro avançado |"
            ]
          }
        ]
      }
    ]
  },
  {
    title: "Monstros",
    description: "Detalhes sobre criaturas, comportamentos, habilidades e ecologia.",
    sections: [
      {
        title: "Machas",
        details: ["Criaturas minerais alucinógenas territorialistas das montanhas."],
        subsections: [
          {
            title: "Características Básicas",
            content: [
              "| Aspecto | Descrição |",
              "|---------|-----------|",
              "Composição | Pedras Alucinógenas + Rocha |",
              "Habitat | Montanhas e Cavernas de Mineração dos Orclescentes |",
              "Comportamento | Territorialistas, grupos de até 45 indivíduos. Odeiam Orc e barulhos de picareta |"
            ]
          },
          {
            title: "Efeitos das Cores",
            content: [
              "Cores Primárias",
              "| Cor | Efeito |",
              "|-----|--------|",
              "| Amarelo | Larica intensa |",
              "| Azul | Paranóia ou expansão mental |",
              "| Vermelho | Estímulo sexual |",
              "",
              "Cores Secundárias",
              "| Cor | Composição | Efeito |",
              "|------|------------|--------|",
              "| Laranja | Vermelho + Amarelo | Combinação dos efeitos parentais |",
              "| Roxo | Azul + Vermelho | Combinação dos efeitos parentais |",
              "| Verde | Amarelo + Azul | Combinação dos efeitos parentais |",
              "",
              "Cores Neutras",
              "| Cor | Efeito |",
              "|------|--------|",
              "| Branco | Efeito padrão (sem aditivos) |",
              "| Preto | Efeito padrão² (intensificado) |",
              "",
              "Multicolorido: Todos os efeitos simultaneamente ('A Porra Toda') |"
            ]
          },
          {
            title: "Hierarquia",
            content: [
              "Ordem de Dominância (do mais fraco ao mais forte):",
              "1. Brancos",
              "2. Primárias (Amarelo/Azul/Vermelho)",
              "3. Pretos",
              "4. Secundárias (Laranja/Roxo/Verde)",
              "5. Multicolorido"
            ]
          },
          {
            title: "Ciclo de Vida",
            content: [
              "- Alimentação: Rochas o ano todo",
              "- Reprodução: No verão, depositam cristais coloridos. No inverno, consomem esses cristais para se reproduzir"
            ]
          },
          {
            title: "Domesticação & Uso",
            content: [
              "| Aspecto | Detalhes |",
              "|---------|----------|",
              "Dificuldade | Complexa, varia conforme hierarquia (quanto mais alta, mais difícil) |",
              "Método | Oferecer rochas minerais/cristais comestíveis |",
              "Montaria | Apenas Secundárias/Multicoloridos. Requer sela especial e laço de confiança |"
            ]
          },
          {
            title: "Estrutura de Bando",
            content: [
              "Composição Típica:",
              "- 1 Multicolorido (líder)",
              "- 1d4 de cada Cor Secundária",
              "- 1d6 Pretos",
              "- 1d6 de cada Cor Primária",
              "- 1d8 Brancos"
            ]
          }
        ]
      }
    ]
  }
];

export default systemInfo;