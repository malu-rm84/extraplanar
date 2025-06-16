// App.tsx
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { 
  ProtectedRoute, 
  PublicRoute, 
  MasterRoute, 
  PlayerRoute,
  UserTypeRoute 
} from "@/components/auth/ProtectedRoute";

// Páginas
import HomePage from "./pages/Home";
import UserType from "./pages/UserType";
import NotFound from "./pages/NotFound";
import { PersonagensPage } from './pages/PersonagensPage';
import { PersonagemFichaWrapper } from './pages/PersonagemFichaWrapper';
import { EditarPersonagemPage } from "./pages/EditarPersonagemPage";

// Master Pages
import MasterDashboard from "./pages/master/MasterDashboard";
import MasterCampanhas from "./pages/master/MasterCampanhas";
import MasterNotes from "./pages/master/MasterNotes";
import MasterGerador from "./pages/master/MasterGerador";
import { MasterRoll } from "./pages/master/MasterRoll";
import { MasterCriarPersonagens } from "./pages/master/MasterCriarPersonagens";
import { MasterPersonagensPage } from "./pages/master/MasterPersonagensPage";
import MasterSistema from "./pages/master/MasterSistema";
import MasterConfig from "./pages/master/MasterConfig";

// Player Pages
import PlayerDashboard from "./pages/player/PlayerDashboard";
import { PlayerCriarPersonagens } from "./pages/player/PlayerCriarPersonagens";
import PlayerCampanhas from "./pages/player/PlayerCampanhas";
import { PlayerCampaignDetailPage } from "./pages/player/PlayerCampaignDetailPage";
import PlayerNotes from "./pages/player/PlayerNotes";
import { PlayerRoll } from "./pages/player/PlayerRoll";
import PlayerConfig from "./pages/player/PlayerConfig";
import { PlayerPersonagensPage } from "./pages/player/PlayerPersonagensPage";
import PlayerSessionPage from "./pages/player/PlayerSessionPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <Router basename={import.meta.env.BASE_URL}>
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Carregando...</div>}>
            <Routes>
              {/* Rotas Públicas */}
              <Route element={<PublicRoute />}>
                <Route index element={<HomePage />} />
                <Route path="/login" element={<HomePage />} />
              </Route>

              {/* Escolha de Tipo de Usuário */}
              <Route element={<UserTypeRoute />}>
                <Route path="/choose-role" element={<UserType />} />
              </Route>

              {/* Rotas Protegidas - Mestre */}
              <Route element={<ProtectedRoute />}>
                <Route element={<MasterRoute />}>
                  <Route path="/master/dashboard" element={<MasterDashboard />} />
                  <Route path="/master/campanhas" element={<MasterCampanhas />} />
                  <Route path="/master/notes" element={<MasterNotes />} />
                  <Route path="/master/gerador" element={<MasterGerador />} />
                  <Route path="/master/rolagem" element={<MasterRoll />} />
                  <Route path="/master/criarpersonagens" element={<MasterCriarPersonagens />} />
                  <Route path="/master/personagens" element={<MasterPersonagensPage />} />
                  <Route path="/master/personagens/:id" element={<PersonagemFichaWrapper />} />
                  <Route path="/master/sistema" element={<MasterSistema />} />
                  <Route path="/master/config" element={<MasterConfig />} />
                  <Route path="/personagens" element={<PersonagensPage />} />
                  <Route path="/editar-personagem/:id" element={<EditarPersonagemPage />} />
                  <Route path="/personagens/:id" element={<PersonagemFichaWrapper />} />
                </Route>
              </Route>

              {/* Rotas Protegidas - Jogador */}
              <Route element={<ProtectedRoute />}>
                <Route element={<PlayerRoute />}>
                  <Route path="/player/dashboard" element={<PlayerDashboard />} />
                  <Route path="/player/criarpersonagens" element={<PlayerCriarPersonagens />} />
                  <Route path="/player/personagens" element={<PlayerPersonagensPage />} />
                  <Route path="/player/notes" element={<PlayerNotes />} />
                  <Route path="/player/rolagem" element={<PlayerRoll />} />
                  <Route path="/player/personagens/:id" element={<PersonagemFichaWrapper />} />
                  <Route path="/player/editar-personagem/:id" element={<EditarPersonagemPage />} />
                  <Route path="/player/campanhas" element={<PlayerCampanhas />} />
                  <Route path="/campanha/:campaignId" element={<PlayerCampaignDetailPage />} />
                  <Route path="/sessao/:sessionId" element={<PlayerSessionPage />} />
                  <Route path="/player/config" element={<PlayerConfig />} />
                </Route>
              </Route>

              {/* Redirecionamentos e Fallback */}
              <Route path="/index.html" element={<Navigate to="/" replace />} />
              <Route path="/extraplanar" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;