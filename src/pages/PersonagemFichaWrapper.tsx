import { useParams } from "react-router-dom";
import { PlayerLayout } from "@/components/layout/PlayerLayout";
import { MasterLayout } from "@/components/layout/MasterLayout";
import { Button } from "@/components/ui/button";
import { PersonagemFicha } from "./PersonagemFicha";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/components/auth/firebase-config";
import { useEffect, useState } from "react";
import { Personagem } from "@/components/personagem/types";

export const PersonagemFichaWrapper = () => {
  const { id } = useParams<{ id: string }>();
  const { userRole } = useAuth();
  const [personagem, setPersonagem] = useState<Personagem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarPersonagem = async () => {
      if (!id) return;
      
      try {
        const docRef = doc(db, "personagens", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setPersonagem(docSnap.data() as Personagem);
        } else {
          console.log("Personagem não encontrado!");
        }
      } catch (error) {
        console.error("Erro ao carregar personagem:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarPersonagem();
  }, [id]);

  const exportarParaMD = () => {
    if (!personagem) return;

    const mdContent = `
<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; color: #333;">

# ${personagem.nome}

**Raça**: ${personagem.raca}  
**Plano**: ${personagem.plano}  
**Idade**: ${personagem.faixaEtaria}  
**Habilidade Racial**: ${personagem.habilidadeRacial}

---

## Atributos
${Object.entries(personagem.atributos)
  .map(([attr, values]) => `
### ${attr.charAt(0).toUpperCase() + attr.slice(1)}
- **Base**: ${values.base}
- **Bônus Racial**: ${values.racial}
- **Total**: ${values.base + values.racial}`)
  .join("\n")}

---

## Afinidades
${Object.entries(personagem.afinidades)
  .map(([afinidade, nivel]) => `- **${afinidade.charAt(0).toUpperCase() + afinidade.slice(1)}**: Nível ${nivel}`)
  .join("\n")}

---

## Perícias
${personagem.pericias
  ?.map((categoria) => `
### ${categoria.categoria}
${categoria.pericias
  .filter(p => p.pontos > 0)
  .map(p => `- ${p.nome} (Nível ${p.pontos} | +${p.pontos * 2})`)
  .join("\n")}`)
  .join("\n") || "Nenhuma perícia adquirida"}

---

## Ocupações
${personagem.ocupacoesSelecionadas
  ?.map(occ => `- ${occ.nome} (Nível ${occ.nivel})`)
  .join("\n") || "Nenhuma ocupação selecionada"}

---

## Capacidades
${personagem.capacidadesSelecionadas
  ?.map(cap => `- ${cap.nome} (Custo: ${cap.custo} PD)`)
  .join("\n") || "Nenhuma capacidade selecionada"}

---

## Línguas
**Materna**: ${personagem.linguaMaterna?.nome || "Não definida"}

**Adquiridas**:
${personagem.linguasAdquiridas
  ?.map(l => `- ${l.nome}`)
  .join("\n") || "Nenhuma língua adquirida"}

---

## Descrição
${personagem.descricaoFisica ? `
### Aparência Física
${personagem.descricaoFisica}` : ""}

${personagem.personalidade ? `
### Personalidade
${personagem.personalidade}` : ""}

${personagem.historia ? `
### História
${personagem.historia}` : ""}

${personagem.observacoes ? `
### Observações
${personagem.observacoes}` : ""}

</div>
    `.trim();

    const blob = new Blob([mdContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${personagem.nome.replace(/\s/g, "_")}_Ficha.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="container mx-auto p-4">Carregando...</div>;
  
  if (!personagem || !personagem.atributos) {
    return (
      <div className="container mx-auto p-4 text-red-500">
        Personagem não encontrado ou dados corrompidos
      </div>
    );
  }

  const Layout = userRole === 'master' ? MasterLayout : PlayerLayout;

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="no-print mb-4 flex gap-2">
          <Button 
            onClick={() => window.print()}
            className="bg-primary text-white"
          >
            Imprimir Ficha
          </Button>
          <Button 
            onClick={exportarParaMD}
            className="bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Exportar para MD
          </Button>
        </div>
        <PersonagemFicha personagem={personagem} />
      </div>
    </Layout>
  );
};