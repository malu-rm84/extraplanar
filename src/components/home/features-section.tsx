
import { 
  Users, 
  FileText, 
  Compass, 
  BookOpen,
  Upload,
  Download,
  Tag,
  Search
} from "lucide-react";
import { PlaneBadge } from "@/components/ui/plane-badge";

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-12">
          <div className="mx-auto w-fit">
            <PlaneBadge plane="emerald">
              <Compass className="h-3.5 w-3.5 mr-1" />
              Funcionalidades
            </PlaneBadge>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
            Ferramentas para Mestres e Jogadores
          </h2>
          <p className="text-muted-foreground">
            Tudo o que você precisa para gerenciar suas aventuras e personagens em um só lugar
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Gerenciamento de Mesas */}
          <div className="mystic-card plane-ethereal">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-medium">Gerenciador de Mesas</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Crie e gerencie suas mesas de jogo, adicione jogadores por e-mail e mantenha suas anotações organizadas.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Convites por e-mail</span>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Anotações compartilhadas</span>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Acesso às fichas dos jogadores</span>
              </li>
            </ul>
          </div>

          {/* Fichas de Personagem */}
          <div className="mystic-card plane-emerald">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-medium">Fichas de Personagem</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Crie e edite fichas detalhadas de personagem com atributos, habilidades, inventário e muito mais.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Preenchimento automático por raça</span>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Sistema de atributos e habilidades</span>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Exportação para Markdown</span>
              </li>
            </ul>
          </div>

          {/* Criador de NPCs */}
          <div className="mystic-card plane-astral">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Compass className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-medium">Criador de NPCs</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Crie NPCs e vilões memoráveis com nosso gerador de nomes e editor de características.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Gerador de nomes por raça</span>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Personalização de atributos</span>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Associação a mesas</span>
              </li>
            </ul>
          </div>

          {/* Sistema de Lore */}
          <div className="mystic-card plane-material">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-medium">Sistema de Lore</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Acesse e organize todo o conteúdo do sistema Extraplanar, incluindo regras e história dos planos.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Organização por planos</span>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Sistema de regras completo</span>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Descrições de raças e habilidades</span>
              </li>
            </ul>
          </div>

          {/* Exportação para Obsidian */}
          <div className="mystic-card plane-ethereal">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-medium">Exportação para Obsidian</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Exporte seus dados no formato Markdown compatível com o Obsidian para organização local.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Fichas em formato Markdown</span>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Anotações exportáveis</span>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Compatível com Obsidian Publish</span>
              </li>
            </ul>
          </div>

          {/* Sistema de Busca */}
          <div className="mystic-card plane-inferno">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-medium">Sistema de Busca</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Encontre rapidamente o que precisa com nossa poderosa ferramenta de busca por tags e termos.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Busca por tags e categorias</span>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Filtros por plano e raça</span>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Resultados instantâneos</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
