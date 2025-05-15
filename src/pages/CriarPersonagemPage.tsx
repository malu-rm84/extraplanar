import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

// Componentes de criação de personagem
import BarraProgressoCriacao from "@/components/personagem/BarraProgressoCriacao";
import BotoesNavegacao from "@/components/personagem/BotoesNavegacao";
import EtapaDadosBasicos from "@/components/personagem/EtapaDadosBasicos";
import EtapaAtributos from "@/components/personagem/EtapaAtributos";
import EtapaEmDesenvolvimento from "@/components/personagem/EtapaEmDesenvolvimento";

// Tipos
import { EtapaCriacao, Personagem } from "@/components/personagem/types";

export const CriarPersonagemPage = () => {
  const navigate = useNavigate();
  const [etapaAtual, setEtapaAtual] = useState<EtapaCriacao>('dados');
  const [personagem, setPersonagem] = useState<Personagem>({
    nome: '',
    idade: '',
    plano: 'material',
    raca: 'humano',
    atributos: {
      forca: 10,
      destreza: 10,
      constituicao: 10,
      inteligencia: 10,
      sabedoria: 10,
      carisma: 10
    },
    afinidades: [],
    magias: []
  });

  // Lista de etapas para navegação
  const etapas = [
    { id: 'dados', nome: 'Dados Básicos' },
    { id: 'atributos', nome: 'Atributos' },
    { id: 'magias', nome: 'Magias' },
    { id: 'pericias', nome: 'Perícias' },
    { id: 'ocupacoes', nome: 'Ocupações' },
    { id: 'capacidades', nome: 'Capacidades' },
    { id: 'inventario', nome: 'Inventário' },
    { id: 'extras', nome: 'Extras' }
  ] as const;

  const irParaProximaEtapa = () => {
    const indiceAtual = etapas.findIndex(etapa => etapa.id === etapaAtual);
    if (indiceAtual < etapas.length - 1) {
      setEtapaAtual(etapas[indiceAtual + 1].id as EtapaCriacao);
      window.scrollTo(0, 0);
    }
  };

  const irParaEtapaAnterior = () => {
    const indiceAtual = etapas.findIndex(etapa => etapa.id === etapaAtual);
    if (indiceAtual > 0) {
      setEtapaAtual(etapas[indiceAtual - 1].id as EtapaCriacao);
      window.scrollTo(0, 0);
    }
  };

  const salvarPersonagem = () => {
    console.log("Personagem salvo:", personagem);
    navigate('/personagens');
  };

  const renderizarEtapaAtual = () => {
    switch (etapaAtual) {
      case 'dados':
        return <EtapaDadosBasicos personagem={personagem} setPersonagem={setPersonagem} />;
      case 'atributos':
        return <EtapaAtributos personagem={personagem} setPersonagem={setPersonagem} />;
      case 'magias':
        return <EtapaEmDesenvolvimento titulo="Magias e Afinidades" />;
      case 'pericias':
        return <EtapaEmDesenvolvimento titulo="Perícias" />;
      case 'ocupacoes':
        return <EtapaEmDesenvolvimento titulo="Ocupações" />;
      case 'capacidades':
        return <EtapaEmDesenvolvimento titulo="Capacidades" />;
      case 'inventario':
        return <EtapaEmDesenvolvimento titulo="Inventário" />;
      case 'extras':
        return <EtapaEmDesenvolvimento titulo="Extras" />;
      default:
        return <EtapaDadosBasicos personagem={personagem} setPersonagem={setPersonagem} />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="text-center mb-12 pt-8">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          Criar Novo Personagem
        </h1>
        <p className="text-muted-foreground text-lg">
          Forje seu destino nas realidades extraplanares
        </p>
      </div>

      {/* Barra de progresso */}
      <div className="mb-8 max-w-4xl mx-auto">
        <BarraProgressoCriacao
          etapas={etapas}
          etapaAtual={etapaAtual}
          setEtapaAtual={(etapa) => setEtapaAtual(etapa as EtapaCriacao)}
        />
      </div>

      <div className="max-w-4xl mx-auto animate-fadeIn">
        <div className="bg-black/30 backdrop-blur-lg rounded-xl shadow-xl border border-white/10">
          <div className="p-6">
            {/* Conteúdo da etapa atual */}
            {renderizarEtapaAtual()}

            {/* Navegação entre etapas */}
            <BotoesNavegacao
              etapaAtual={etapaAtual}
              primeiraEtapa={etapas[0].id}
              ultimaEtapa={etapas[etapas.length - 1].id}
              irParaEtapaAnterior={irParaEtapaAnterior}
              irParaProximaEtapa={irParaProximaEtapa}
              salvarPersonagem={salvarPersonagem}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        body {
          background: #0a0a0a;
        }
      `}</style>
    </div>
  );
};

export default CriarPersonagemPage; 