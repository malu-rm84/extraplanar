import { useAuth } from "@/contexts/AuthContext";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/components/auth/firebase-config";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { parsePD } from "@/utils/pdHelpers";
import BarraProgressoCriacao from "@/components/personagem/BarraProgressoCriacao";
import BotoesNavegacao from "@/components/personagem/BotoesNavegacao";
import EtapaDadosBasicos from "@/components/personagem/EtapaDadosBasicos";
import EtapaPontosFundamentais from "@/components/personagem/EtapaPontosFundamentais";
import EtapaDescricao from "@/components/personagem/EtapaDescrição";
import EtapaAtributos from "@/components/personagem/EtapaAtributos";
import EtapaAfinidades from "@/components/personagem/EtapaAfinidades";
import EtapaPericias from "@/components/personagem/EtapaPericias";
import EtapaOcupacoes from "@/components/personagem/EtapaOcupacoes";
import EtapaCapacidades from "@/components/personagem/EtapaCapacidades";
import EtapaLinguas from "@/components/personagem/EtapaLinguas";
import EtapaHabilidades from "@/components/personagem/EtapaHabilidades";
import EtapaEmDesenvolvimento from "@/components/personagem/EtapaEmDesenvolvimento";
import { 
  calcularNivelPorPD,
  calcularTotalPDRecebidos,
  calcularPP,
  calcularPV,
  calcularPE
} from "@/components/personagem/types";
import { EtapaCriacao, Personagem } from "@/components/personagem/types";
import { pericias } from "@/data/Pericias";
import { ocupacoes } from "@/data/Ocupacoes";
import { Lingua } from "@/data/Linguas";
import { Button } from "@/components/ui/button";
import { FaixasEtarias } from "@/data/FaixaEtaria";

interface CriarPersonagemPageProps {
  personagemExistente?: Personagem;
  onSave?: (personagem: Personagem) => Promise<void>;
}

const calcularTotalPDGastos = (personagem: Personagem) => {
  const custosAtributos = Object.values(personagem.atributos).reduce((acc, atributo) => {
    const custosIncrementais = [0, 1, 2, 4, 7, 11];
    return acc + custosIncrementais.slice(0, (atributo.base || 0) + 1).reduce((a, b) => a + b, 0);
  }, 0);
  
  const custosAfinidades = personagem.afinidades 
    ? Object.values(personagem.afinidades).reduce((acc, nivel) => 
        acc + (nivel * (nivel + 1)) / 2, 0)
    : 0;
    
  // ALTERAÇÃO: Agora usa pdInvestidoPericias em vez de calcular custo individual das perícias
  const custosPericias = personagem.pdInvestidoPericias || 0;
    
  const custosOcupacoes = personagem.ocupacoesSelecionadas?.reduce((acc, ocupacao) => {
    let custo = 0;
    ocupacoes.forEach(categoria => {
      const occ = categoria.ocupacoes.find(o => o.nome === ocupacao.nome);
      if (occ) custo += occ[`nivel${ocupacao.nivel}`];
    });
    return acc + custo;
  }, 0) || 0;
  
  const custosCapacidades = personagem.capacidadesSelecionadas?.reduce(
    (acc, capacidade) => acc + capacidade.custo, 0
  ) || 0;
  
  const custosLinguas = personagem.linguasAdquiridas?.reduce((acc, l) => acc + l.custoPD, 0) || 0;
  const custoshabilidades = personagem.habilidades?.flatMap(c => c.itens)
    .reduce((acc, e) => acc + parsePD(e.custo), 0) || 0;
  
  const custosPPComprados = 2 * (personagem.ppComprados || 0);
  const custosPVComprados = 2 * (personagem.pvComprados || 0);

  return (
    custosAtributos + 
    custosAfinidades + 
    custosPericias + 
    custosOcupacoes + 
    custosCapacidades + 
    custosLinguas + 
    custoshabilidades + 
    custosPPComprados + 
    custosPVComprados
  );
};

const calcularPDDisponiveis = (personagem: Personagem) => {
  const totalRecebidos = calcularTotalPDRecebidos(personagem);
  const totalGastos = personagem.pdGastos || 0;
  const result = Number(totalRecebidos) - Number(totalGastos);
  return isNaN(result) ? 0 : result;
};

// Função para compatibilidade com os componentes existentes
const calcularTotalPD = (personagem: Personagem) => {
  return calcularTotalPDGastos(personagem); // Retorna um número
};

export const CriarPersonagemPage = ({ 
  personagemExistente, 
  onSave 
}: CriarPersonagemPageProps) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [etapaAtual, setEtapaAtual] = useState<EtapaCriacao>('dados');
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const estadoInicial: Personagem = {
    nome: '',
    idade: '',
    plano: 'material',
    raca: 'humano',
    criadoPor: '',
    criadorNome: '',
    dataCriacao: new Date(),
    ppComprados: 0,
    pvComprados: 0,
    // Novo sistema de PD
    pdIniciais: 50,
    pdGastos: 0,
    pdSessoes: [],
    nivel: 1,
    // Legacy (manter para compatibilidade)
    pdDisponivel: 50,
    pp: 0,
    pv: 0,
    pe: 0,
    dtTotal: 10,
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
    pdInvestidoPericias: 0, // NOVO CAMPO
    linguaMaterna: {} as Lingua,
    linguasAdquiridas: [],
  };
  
  const [personagem, setPersonagem] = useState<Personagem>(personagemExistente || estadoInicial);

  useEffect(() => {
    const carregarParaEdicao = async () => {
      if (id && !personagemExistente) {
        const docRef = doc(db, "personagens", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Personagem;
          // Migrar dados antigos se necessário
          if (!data.pdIniciais) {
            data.pdIniciais = 50;
            data.pdGastos = calcularTotalPDGastos(data);
            data.pdSessoes = [];
            data.nivel = calcularNivelPorPD(data.pdIniciais);
          }
          setPersonagem(data);
        }
      }
    };
    carregarParaEdicao();
  }, [id, personagemExistente]);

  // Atualizar PD gastos sempre que algo mudar
  useEffect(() => {
    const pdGastos = calcularTotalPDGastos(personagem);
    const totalPD = calcularTotalPDRecebidos(personagem);
    const nivel = calcularNivelPorPD(totalPD);
    
    setPersonagem(prev => ({
      ...prev,
      pdGastos,
      nivel,
      pdDisponivel: totalPD - pdGastos
    }));
  }, [
    personagem.atributos,
    personagem.afinidades,
    personagem.pericias,
    personagem.ocupacoesSelecionadas,
    personagem.capacidadesSelecionadas,
    personagem.linguasAdquiridas,
    personagem.habilidades,
    personagem.ppComprados,
    personagem.pvComprados,
    personagem.pdSessoes
  ]);

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
    { id: 'habilidades', nome: 'Habilidades' },
    { id: 'pontos-fundamentais', nome: 'Pontos Fundamentais' },
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

  const salvarPersonagem = async () => {
    try {
      if (!currentUser) throw new Error("Usuário não autenticado");
      
      const personagemCompleto = {
        ...personagem,
        criadoPor: currentUser.uid,
        criadorNome: currentUser.displayName || "Anônimo",
        dataCriacao: personagemExistente?.dataCriacao || new Date(),
        dataAtualizacao: new Date(),
        pp: calcularPP(personagem),
        pv: calcularPV(personagem),
        pe: calcularPE(personagem),
        dtTotal: 10
      };
      
      if (onSave) {
        await onSave(personagemCompleto);
      } else {
        if (id) {
          await updateDoc(doc(db, "personagens", id), personagemCompleto);
          navigate(`/personagens/${id}`);
        } else {
          await addDoc(collection(db, "personagens"), personagemCompleto);
          navigate('/personagens');
        }
      }
    } catch (error) {
      console.error("Erro ao salvar personagem:", error);
      alert("Erro ao salvar personagem!");
    }
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
      case 'habilidades':
        return <EtapaHabilidades 
          personagem={personagem}
          setPersonagem={setPersonagem}
          calcularTotalPD={calcularTotalPD}
        />;
      case 'pontos-fundamentais':
        return <EtapaPontosFundamentais 
          personagem={personagem} 
          setPersonagem={setPersonagem} 
          calcularTotalPD={calcularTotalPD} 
          pdDisponivel={pdDisponiveis}
        />;
      default:
        return <EtapaDadosBasicos personagem={personagem} setPersonagem={setPersonagem} />;
    }
  };

  const pdDisponiveis = calcularPDDisponiveis(personagem);
  const totalPDRecebidos = calcularTotalPDRecebidos(personagem);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Novo cabeçalho com estilo unificado */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pt-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            {id ? 'Editar Personagem' : 'Criar Novo Personagem'}
          </h1>
          <p className="text-muted-foreground text-lg">
            Forje seu destino nas realidades extraplanares
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xl font-bold text-primary bg-black/20 p-3 rounded-lg border border-primary/20">
            <div className="flex flex-col gap-1 text-center">
              <div className="text-sm text-gray-400">Nível {calcularNivelPorPD(totalPDRecebidos)}</div>
              <div>
                PD Disponíveis: <span className={`${pdDisponiveis >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {pdDisponiveis}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Total: {totalPDRecebidos} PD
              </div>
            </div>
          </div>
          <Button 
            onClick={() => setShowConfirmation(true)}
            size="lg"
            className="bg-primary/20 hover:bg-primary/30 border border-primary/30 hover:border-primary/50 transition-all shadow-glow hover:shadow-glow-lg"
          >
            Salvar Personagem
          </Button>
        </div>
      </div>
      <div className="flex gap-6 mx-auto animate-fadeIn">
        <div className="w-72 h-auto sticky top-24 self-start">
          <div className="flex flex-col gap-4">
            <BarraProgressoCriacao
              etapas={etapas}
              etapaAtual={etapaAtual}
              setEtapaAtual={(etapa) => setEtapaAtual(etapa as EtapaCriacao)}
            />
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
        <div className="flex-1 bg-black/30 backdrop-blur-lg rounded-xl shadow-xl border border-white/10">
          <div className="p-6">
            {renderizarEtapaAtual()}
          </div>
        </div>
      </div>
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="bg-black/90 border-gray-700 backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">
              {id ? 'Confirmar Edição' : 'Confirmar Criação'}
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              {id ? 'Tem certeza que deseja salvar as alterações?' : 'Tem certeza que deseja finalizar e salvar este personagem?'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmation(false)}
              className="border-primary/30 text-gray-300 hover:bg-primary/20 hover:text-primary"
            >
              Cancelar
            </Button>
            <Button 
              onClick={salvarPersonagem}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              {id ? 'Salvar Alterações' : 'Confirmar'}
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
        select option {
          background-color: #0f0f1f;
          color: #e2e2e2;
        }
      `}</style>
    </div>
  );
};

export default CriarPersonagemPage;