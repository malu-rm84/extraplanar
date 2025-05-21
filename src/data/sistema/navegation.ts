// src/data/navigation.js
export const navigationSection = {
  title: "Barco",
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
};