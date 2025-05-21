// src/data/inventory.js
export const inventorySection = {
  title: "Inventário",
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
};