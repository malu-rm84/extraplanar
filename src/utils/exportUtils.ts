import { Character } from "../data/character";
import { pericias } from "../data/constants";

export const exportToMarkdown = (character: Character) => {
    const content = `# ${character.nome}
    ## Raça: ${character.raca}
    ## Plano: ${character.plano}

    ## Atributos
    - Força: ${character.atributos.forca}
    - Agilidade: ${character.atributos.agilidade}
    - Vigor: ${character.atributos.vigor}
    - Presença: ${character.atributos.presenca}
    - Intelecto: ${character.atributos.intelecto}

    ## Vitalidade
    - PV: ${character.vitalidade.pv}
    - PE: ${character.vitalidade.pe}
    - PP: ${character.vitalidade.pp}
    - DT: ${character.vitalidade.dt}
    - DP: ${character.vitalidade.dp}

    ## Habilidades
    - Racial: ${character.habilidades.racial}
    - Origem: ${character.habilidades.origem}
    - Extras: ${character.habilidades.extras.join(", ")}

    ## Perícias
    ${Object.entries(character.pericias)
    .map(([pericia, valor]) => `- ${pericias[pericia as keyof typeof pericias]}: ${valor}`)
    .join("\n")}

    ## Inventário

    ### Armas (${character.inventario.armas.length})
    ${character.inventario.armas.map(arma => `
    - **${arma.nome}** (${arma.tipo})
    - Dano: ${arma.dano}
    - Descrição: ${arma.descricao}
    `).join("\n")}

    ### Itens (${character.inventario.itens.length})
    ${character.inventario.itens.map(item => `
    - **${item.nome}** (${item.tipo})
    - Descrição: ${item.descricao}
    `).join("\n")}

    ## Magias
    ${character.magias.join("\n")}

    ## Anotações
    ${character.anotacoes}
    `;

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${character.nome.replace(/\s+/g, '_')}.md`;
    a.click();
};