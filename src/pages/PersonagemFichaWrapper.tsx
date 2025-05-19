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
        <Button 
          onClick={() => window.print()}
          className="no-print mb-4 bg-primary text-white"
        >
          Imprimir Ficha
        </Button>
        <PersonagemFicha personagem={personagem} />
      </div>
    </Layout>
  );
};