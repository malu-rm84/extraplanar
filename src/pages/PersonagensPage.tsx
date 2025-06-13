// PersonagensPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Personagem } from "@/components/personagem/types";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/components/auth/firebase-config";
import { User, Plus } from "lucide-react";

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
    <div className={`p-6 space-y-8 ${className || ''}`}>
      {!hideHeader && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Meus Personagens
          </h1>
          <Link 
            to={`/${userRole === 'master' ? 'master' : 'player'}/criarpersonagens`}
            className="inline-flex"
          >
            <Button 
              size="lg"
              className="bg-primary/20 hover:bg-primary/30 border border-primary/30 hover:border-primary/50 transition-all shadow-glow hover:shadow-glow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Novo Personagem
            </Button>
          </Link>
        </div>
      )}

      {personagens.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-6">
          <div className="p-8 rounded-full bg-primary/10 border border-primary/20">
            <User className="h-16 w-16 text-primary/60" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-muted-foreground">
              Nenhum personagem criado ainda
            </h3>
            <p className="text-muted-foreground max-w-md">
              Comece sua jornada criando seu primeiro personagem e explore os planos extraplanares.
            </p>
          </div>
          <Link 
            to={`/${userRole === 'master' ? 'master' : 'player'}/criarpersonagens`}
            className="inline-flex"
          >
            <Button 
              size="lg"
              className="bg-primary/20 hover:bg-primary/30 border border-primary/30 hover:border-primary/50 transition-all shadow-glow hover:shadow-glow-lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Criar Primeiro Personagem
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personagens.map((personagem, index) => (
            <Card 
              key={index} 
              className="p-6 bg-black/30 backdrop-blur-lg rounded-xl border border-white/10 hover:border-primary/40 transition-all hover:bg-black/40 group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-white group-hover:text-primary transition-colors">
                      {personagem.nome}
                    </h3>
                    <p className="text-muted-foreground capitalize">
                      {personagem.raca}
                    </p>
                    <p className="text-sm text-muted-foreground/80 capitalize">
                      Plano: {personagem.plano}
                    </p>
                  </div>
                  {/* ÁREA MODIFICADA - Foto do personagem */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-primary/60 overflow-hidden">
                    {personagem.fotoUrl ? (
                      <img 
                        src={personagem.fotoUrl} 
                        alt={personagem.nome} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Caso a imagem não carregue, mostra um placeholder
                          e.currentTarget.src = 'https://via.placeholder.com/150';
                          e.currentTarget.className = "w-full h-full bg-primary/10 flex items-center justify-center";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <Link
                    to={`/${userRole === 'master' ? 'master' : 'player'}/personagens/${personagem.id}`}
                    className="inline-flex w-full"
                  >
                    <Button
                      variant="outline"
                      className="w-full bg-black/30 border-white/20 hover:bg-primary/20 hover:border-primary/40 hover:text-primary transition-all"
                    >
                      Visualizar Personagem
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};