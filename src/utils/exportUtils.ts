
import { Personagem } from "../components/personagem/types";
import { pericias } from "../data/Pericias";

export const exportToMarkdown = (character: Personagem) => {
    const content = `# ${character.nome}
    ## Raça: ${character.raca}
    ## Plano: ${character.plano}

    ## Atributos
    - Força: ${character.atributos.forca.base + character.atributos.forca.racial}
    - Agilidade: ${character.atributos.agilidade.base + character.atributos.agilidade.racial}
    - Vigor: ${character.atributos.vigor.base + character.atributos.vigor.racial}
    - Presença: ${character.atributos.presenca.base + character.atributos.presenca.racial}
    - Intelecto: ${character.atributos.intelecto.base + character.atributos.intelecto.racial}

    ## Vitalidade
    - PV: ${character.pv}
    - PE: ${character.pe}
    - PP: ${character.pp}
    - DT: ${character.dtTotal}

    ## Habilidades
    - Racial: ${character.habilidadeRacial}

    ## Perícias
    ${character.pericias?.map(categoria => 
        categoria.pericias
            .filter(p => p.pontos > 0)
            .map(p => `- ${p.nome}: ${p.pontos}`)
            .join("\n")
    ).join("\n") || "Nenhuma perícia"}

    ## Inventário

    ### Armas
    ${character.inventario?.armas?.map(arma => `
    - **${arma.nome}** (${arma.tipo || 'N/A'})
    - Dano: ${arma.dano || 'N/A'}
    - Descrição: ${arma.descricao || 'N/A'}
    `).join("\n") || "Nenhuma arma"}

    ### Itens
    ${character.inventario?.geral?.map(item => `
    - **${item.nome}**
    - Descrição: ${item.descricao || 'N/A'}
    `).join("\n") || "Nenhum item"}

    ## Magias
    ${character.magias?.join("\n") || "Nenhuma magia"}

    ## Observações
    ${character.observacoes || "Nenhuma observação"}
    `;

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${character.nome.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
};
