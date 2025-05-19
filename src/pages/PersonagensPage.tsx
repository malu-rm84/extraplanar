import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Personagem } from "@/components/personagem/types";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/components/auth/firebase-config";

interface PersonagensPageProps {
  className?: string;
  hideHeader?: boolean;
}

export const PersonagensPage = ({ className, hideHeader }: PersonagensPageProps) => {
  const [personagens, setPersonagens] = useState<Personagem[]>([]);
  const { currentUser, userRole } = useAuth();

  useEffect(() => {
    const carregarPersonagens = async () => {
      if (!currentUser) return;
      
      const q = query(
        collection(db, "personagens"),
        where("criadoPor", "==", currentUser.uid)
      );
      
      const querySnapshot = await getDocs(q);
      const dados = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setPersonagens(dados as Personagem[]);
    };

    carregarPersonagens();
  }, [currentUser]);

  return (
    <div className={`container mx-auto p-4 bg-gray-900 min-h-screen ${className || ''}`}>
      {!hideHeader && (
        <div className="flex justify-between items-center mb-8 pt-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Meus Personagens
          </h1>
          <Link 
            to={`/${userRole === 'master' ? 'master' : 'player'}/criarpersonagens`}
            className="px-6 py-3 bg-primary/80 hover:bg-primary text-white rounded-lg transition-colors backdrop-blur-sm border border-primary/40"
          >
            Novo Personagem
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {personagens.map((personagem, index) => (
          <Card 
            key={index} 
            className="p-6 bg-black/30 backdrop-blur-sm border border-white/10 hover:border-primary/40 transition-all"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-gray-300">{personagem.nome}</h3>
                <p className="text-gray-400">{personagem.raca}</p>
                <p className="text-sm text-gray-500">Plano: {personagem.plano}</p>
              </div>
              <Link
                to={`/${userRole === 'master' ? 'master' : 'player'}/personagens/${personagem.id}`} // Usar ID do documento
                className="px-4 py-2 bg-primary/80 hover:bg-primary text-white rounded-lg transition-colors backdrop-blur-sm border border-primary/40"
              >
                Visualizar
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};