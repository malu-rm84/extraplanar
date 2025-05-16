import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { parsePD } from "@/utils/pdHelpers";

import BarraProgressoCriacao from "@/components/personagem/BarraProgressoCriacao";
import BotoesNavegacao from "@/components/personagem/BotoesNavegacao";
import EtapaDadosBasicos from "@/components/personagem/EtapaDadosBasicos";
import EtapaDescricao from "@/components/personagem/EtapaDescrição";
import EtapaAtributos from "@/components/personagem/EtapaAtributos";
import EtapaAfinidades from "@/components/personagem/EtapaAfinidades";
import EtapaPericias from "@/components/personagem/EtapaPericias";
import EtapaOcupacoes from "@/components/personagem/EtapaOcupacoes";
import EtapaCapacidades from "@/components/personagem/EtapaCapacidades";
import EtapaLinguas from "@/components/personagem/EtapaLinguas";
import EtapaExperiencia from "@/components/personagem/EtapaExperiencia";
import EtapaEmDesenvolvimento from "@/components/personagem/EtapaEmDesenvolvimento";

import { EtapaCriacao, Personagem } from "@/components/personagem/types";
import { pericias } from "@/data/Pericias";
import { ocupacoes } from "@/data/Ocupacoes";
import { Lingua } from "@/data/Linguas";
import { Button } from "@/components/ui/button";

const calcularTotalPD = (personagem: Personagem) => {
  // Cálculo dos atributos
  const custosAtributos = Object.values(personagem.atributos).reduce((acc, atributo) => {
    const custosIncrementais = [0, 1, 2, 4, 7, 11];
    return acc + custosIncrementais.slice(0, (atributo.base || 0) + 1).reduce((a, b) => a + b, 0);
  }, 0);

  // Cálculo das afinidades
  const custosAfinidades = Object.values(personagem.afinidades).reduce((acc, nivel) => {
    return acc + (nivel * (nivel + 1)) / 2;
  }, 0);

  // Cálculo das perícias
  const custosPericias = personagem.pericias?.flatMap(c => c.pericias)
    .reduce((acc, p) => acc + (p.custoPD * (p.pontos || 0)), 0) || 0;

  // Cálculo das ocupações
  const custosOcupacoes = personagem.ocupacoesSelecionadas?.reduce((acc, ocupacao) => {
    let custo = 0;
    ocupacoes.forEach(categoria => {
      const occ = categoria.ocupacoes.find(o => o.nome === ocupacao.nome);
      if (occ) custo += occ[`nivel${ocupacao.nivel}`];
    });
    return acc + custo;
  }, 0) || 0;

  // Cálculo das capacidades
  const custosCapacidades = personagem.capacidadesSelecionadas?.reduce(
    (acc, capacidade) => acc + capacidade.custo, 0
  ) || 0;

  const custosLinguas = personagem.linguasAdquiridas?.reduce((acc, l) => acc + l.custoPD, 0) || 0;

  const custosExperiencia = personagem.experiencia?.flatMap(c => c.itens)
    .reduce((acc, e) => acc + parsePD(e.custo), 0) || 0;

  return custosAtributos + custosAfinidades + custosPericias + 
         custosOcupacoes + custosCapacidades + custosLinguas + custosExperiencia;
};

export const CriarPersonagemPage = () => {
  const navigate = useNavigate();
  const [etapaAtual, setEtapaAtual] = useState<EtapaCriacao>('dados');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [personagem, setPersonagem] = useState<Personagem>({
    nome: '',
    idade: '',
    plano: 'material',
    raca: 'humano',
    atributos: {
      agilidade: { base: 0, racial: 0 },
      forca: { base: 0, racial: 0 },
      intelecto: { base: 0, racial: 0 },
      presenca: { base: 0, racial: 0 },
      vigor: { base: 0, racial: 0 }
    },
    afinidades: {
      arcana: 0,
      cosmica: 0,
      divina: 0,
      natural: 0,
      necromante: 0
    },
    magias: [],
    habilidadeRacial: '',
    pericias: pericias.map(categoria => ({
      categoria: categoria.categoria,
      pericias: categoria.pericias.map(pericia => ({
        ...pericia,
        pontos: 0
      }))
    })),
    linguaMaterna: {} as Lingua,
    linguasAdquiridas: [],
  });

  const etapas = [
    { id: 'dados', nome: 'Dados Básicos' },
    { id: 'descricao', nome: 'Descrição' },
    { id: 'atributos', nome: 'Atributos' },
    { id: 'afinidades', nome: 'Afinidades' },
    { id: 'pericias', nome: 'Perícias' },
    { id: 'ocupacoes', nome: 'Ocupações' },
    { id: 'capacidades', nome: 'Capacidades' },
    { id: 'linguas', nome: 'Línguas' },
    { id: 'inventario', nome: 'Inventário' },
    { id: 'experiencia', nome: 'Experiência' }
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
    const personagensSalvos = JSON.parse(localStorage.getItem('personagens') || '[]');
    localStorage.setItem('personagens', JSON.stringify([...personagensSalvos, personagem]));
    navigate('/personagens');
  };

  const renderizarEtapaAtual = () => {
    switch (etapaAtual) {
      case 'dados':
        return <EtapaDadosBasicos personagem={personagem} setPersonagem={setPersonagem} />;
      case 'descricao':
        return <EtapaDescricao personagem={personagem} setPersonagem={setPersonagem} />;
      case 'atributos':
        return <EtapaAtributos personagem={personagem} setPersonagem={setPersonagem} />;
      case 'afinidades':
        return <EtapaAfinidades 
            personagem={personagem} 
            setPersonagem={setPersonagem} 
            calcularTotalPD={calcularTotalPD}
          />;
      case 'pericias':
        return <EtapaPericias 
            personagem={personagem} 
            setPersonagem={setPersonagem}
            calcularTotalPD={calcularTotalPD}
          />;
      case 'ocupacoes':
        return <EtapaOcupacoes personagem={personagem} setPersonagem={setPersonagem} />;
      case 'capacidades':
        return <EtapaCapacidades 
            personagem={personagem} 
            setPersonagem={setPersonagem}
            calcularTotalPD={calcularTotalPD}
          />;
      case 'linguas':
        return <EtapaLinguas 
          personagem={personagem} 
          setPersonagem={setPersonagem}
          calcularTotalPD={calcularTotalPD}
        />;
      case 'inventario':
        return <EtapaEmDesenvolvimento titulo="Inventário" />;
      case 'experiencia':
        return <EtapaExperiencia 
          personagem={personagem}
          setPersonagem={setPersonagem}
          calcularTotalPD={calcularTotalPD}
        />;
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

      <div className="mb-8 max-w-4xl mx-auto">
        <BarraProgressoCriacao
          etapas={etapas}
          etapaAtual={etapaAtual}
          setEtapaAtual={(etapa) => setEtapaAtual(etapa as EtapaCriacao)}
        />
      </div>

      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md py-4 mb-8 border-b border-white/10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="text-xl font-bold text-primary">
            PD Disponíveis: <span className="text-emerald-400">{50 - calcularTotalPD(personagem)}</span>/50
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto animate-fadeIn">
        <div className="bg-black/30 backdrop-blur-lg rounded-xl shadow-xl border border-white/10">
          <div className="p-6">
            {renderizarEtapaAtual()}

            <BotoesNavegacao
              etapaAtual={etapaAtual}
              primeiraEtapa={etapas[0].id}
              ultimaEtapa={etapas[etapas.length - 1].id}
              irParaEtapaAnterior={irParaEtapaAnterior}
              irParaProximaEtapa={irParaProximaEtapa}
              salvarPersonagem={() => setShowConfirmation(true)}
              pdExcedido={calcularTotalPD(personagem) > 50}
            />
          </div>
        </div>
      </div>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Confirmar Criação</DialogTitle>
            <DialogDescription className="text-gray-300">
              Tem certeza que deseja finalizar e salvar este personagem?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmation(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancelar
            </Button>
            <Button 
              onClick={salvarPersonagem}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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