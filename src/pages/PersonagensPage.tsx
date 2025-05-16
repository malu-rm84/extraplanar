import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Personagem } from "@/components/personagem/types";

export const PersonagensPage = () => {
  const [personagens, setPersonagens] = useState<Personagem[]>([]);

  useEffect(() => {
    const carregarPersonagens = () => {
      const dados = localStorage.getItem('personagens');
      if (dados) setPersonagens(JSON.parse(dados));
    };
    carregarPersonagens();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Meus Personagens</h1>
        <Link to="/criar-personagem" className="btn btn-primary">
          Novo Personagem
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {personagens.map((personagem, index) => (
          <Card key={index} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">{personagem.nome}</h3>
                <p className="text-gray-600">{personagem.raca}</p>
                <p className="text-sm text-gray-500">Plano: {personagem.plano}</p>
              </div>
              <Link
                to={`/personagens/${index}`}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
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