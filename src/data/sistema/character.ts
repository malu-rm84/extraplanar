// src/data/character.js
export const characterSections = [
  {
    title: "Fundamentos",
    details: [
      "O foco do seu personagem é o entorno de como ele se desenvolverá ao longo da sua história em Extraplanar!",
      "A criação do personagem é a parte mais legal de todo RPG, e mais trabalhosa também. A primeira coisa interessante a se fazer é ter uma mínima noção da história e personalidade do seu personagem:",
      "1) O que ele fazia da vida?",
      "2) O que trouxe ele as aventuras?",
      "3) Qual os traços marcantes físicos e psicológicos dele?"
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
              "- Agilidade: Reflexos e movimentos ágeis",
              "- Força: Capacidade física bruta",
              "- Intelecto: Conhecimento e raciocínio", 
              "- Presença: Carisma e influência social", 
              "- Vigor: Resistência física e saúde"
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
              "- Arcana: Magia arcana e artefatos", 
              "- Cósmica: Energias cósmicas e dimensões", 
              "- Divina: Poder sagrado e milagres", 
              "- Natural: Elementos naturais", 
              "- Necromante: Manipulação da morte"
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
];