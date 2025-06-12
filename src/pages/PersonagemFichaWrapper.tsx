import { useParams, useNavigate } from "react-router-dom";
import { PlayerLayout } from "@/components/layout/PlayerLayout";
import { MasterLayout } from "@/components/layout/MasterLayout";
import { Button } from "@/components/ui/button";
import { PersonagemFicha } from "./PersonagemFicha";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/components/auth/firebase-config";
import { useEffect, useState } from "react";
import { Personagem } from "@/components/personagem/types";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skull, Trash2 } from "lucide-react";
import html2pdf from 'html2pdf.js';

export const PersonagemFichaWrapper = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser, userRole } = useAuth();
  const [personagem, setPersonagem] = useState<Personagem | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    const carregarPersonagem = async () => {
      if (!id) return;
      
      try {
        const docRef = doc(db, "personagens", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as Personagem;
          setPersonagem({ ...data, id: docSnap.id });
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

  const exportarParaPDF = () => {
    const element = document.getElementById('ficha-personagem');
    
    if (!element) {
      alert('Elemento da ficha não encontrado!');
      return;
    }

    // Clonar o elemento para modificar estilos temporariamente
    const clone = element.cloneNode(true) as HTMLElement;
    document.body.appendChild(clone);
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    
    // Forçar estilos de impressão
    clone.classList.add('printing');
    
    const opt = {
      margin: 5,
      filename: `${personagem?.nome.replace(/\s/g, '_')}_Ficha.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#000000',
        ignoreElements: (element) => {
          // Remover elementos que não devem aparecer
          return element.classList?.contains('no-print');
        }
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      }
    };

    html2pdf()
      .set(opt)
      .from(clone)
      .save()
      .then(() => {
        document.body.removeChild(clone);
      });
  };

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

  const handleDelete = async () => {
    try {
      if (!id || !currentUser) return;
      
      const docRef = doc(db, "personagens", id);
      await deleteDoc(docRef);
      navigate('/personagens');
    } catch (error) {
      console.error("Erro ao excluir personagem:", error);
      alert("Erro ao excluir personagem!");
    } finally {
      setShowDeleteConfirmation(false);
    }
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
  const isDono = personagem.criadoPor === currentUser?.uid;

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="no-print mb-4 flex gap-2">
          <Button 
            onClick={exportarParaPDF}
            className="bg-primary text-white"
          >
            Exportar para PDF
          </Button>
          <Button 
            onClick={exportarParaMD}
            className="bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Exportar para MD
          </Button>
          
          {isDono && (
            <>
              <Link 
                to={`/${userRole}/editar-personagem/${id}`}
                className="inline-flex"
              >
                <Button 
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Editar Personagem
                </Button>
              </Link>

              <Button 
                onClick={() => setShowDeleteConfirmation(true)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Excluir Personagem
              </Button>
            </>
          )}
        </div>
        
        <div id="personagem-ficha">
          <PersonagemFicha personagem={personagem} />
        </div>

        {/* Diálogo de Confirmação de Exclusão */}
        <Dialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
          <DialogContent className="bg-black/90 border-primary/40 backdrop-blur-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-red-500 text-center">
                <Skull className="h-8 w-8 mx-auto mb-2" />
                Excluir Personagem Permanentemente
              </DialogTitle>
              <DialogDescription className="text-center text-gray-300">
                Esta ação não pode ser desfeita! Todos os dados do personagem serão permanentemente removidos.
              </DialogDescription>
            </DialogHeader>

            <div className="text-center text-lg text-primary">
              "{personagem.nome}" será perdido para sempre
            </div>

            <DialogFooter className="flex justify-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteConfirmation(false)}
                className="border-primary/40 text-gray-300 hover:bg-primary/20 hover:text-primary px-8"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-8 gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Confirmar Exclusão
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};