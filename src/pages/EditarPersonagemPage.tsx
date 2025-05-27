import { useParams, useNavigate } from "react-router-dom";
import { CriarPersonagemPage } from "./CriarPersonagemPage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/components/auth/firebase-config";
import { useEffect, useState } from "react";
import { Personagem } from "@/components/personagem/types";
import { useAuth } from "@/contexts/AuthContext";

export const EditarPersonagemPage = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [personagem, setPersonagem] = useState<Personagem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarPersonagem = async () => {
      if (!id || !currentUser) return;
      
      try {
        const docRef = doc(db, "personagens", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as Personagem;
          if (data.criadoPor !== currentUser.uid) {
            navigate('/personagens');
            return;
          }
          setPersonagem(data);
        }
      } catch (error) {
        console.error("Erro ao carregar personagem:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarPersonagem();
  }, [id, currentUser, navigate]);

  const salvarEdicao = async (personagemAtualizado: Personagem) => {
    try {
      if (!id || !currentUser) throw new Error("Não autorizado");
      
      const docRef = doc(db, "personagens", id);
      await updateDoc(docRef, {
        ...personagemAtualizado,
        dataAtualizacao: new Date()
      });
      navigate(`/personagens/${id}`);
    } catch (error) {
      console.error("Erro ao salvar edições:", error);
      alert("Erro ao salvar alterações!");
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (!personagem) return <div>Personagem não encontrado</div>;

  return (
    <CriarPersonagemPage 
      personagemExistente={personagem}
      onSave={salvarEdicao}
    />
  );
};