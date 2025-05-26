// App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { 
  ProtectedRoute, 
  PublicRoute, 
  MasterRoute, 
  PlayerRoute,
  UserTypeRoute 
} from "@/components/auth/ProtectedRoute";

// Página unificada
import HomePage from "./pages/Home";
import UserType from "./pages/UserType";
import NotFound from "./pages/NotFound";
import { PersonagensPage } from './pages/PersonagensPage';
import { PersonagemFichaWrapper } from './pages/PersonagemFichaWrapper';

// Master Pages
import MasterDashboard from "./pages/master/MasterDashboard";
import MasterCampanhas from "./pages/master/MasterCampanhas";
import MasterNotes from "./pages/master/MasterNotes";
import MasterGerador from "./pages/master/MasterGerador";
import { MasterRoll } from "./pages/master/MasterRoll";
import { MasterCriarPersonagens } from "./pages/master/MasterCriarPersonagens";
import { MasterPersonagensPage } from "./pages/master/MasterPersonagensPage";
import MasterSistema from "./pages/master/MasterSistema";
import MasterPlayers from "./pages/master/MasterPlayers";
import MasterConfig from "./pages/master/MasterConfig";

// Player Pages
import PlayerDashboard from "./pages/player/PlayerDashboard";
import { PlayerCriarPersonagens } from "./pages/player/PlayerCriarPersonagens";
import PlayerCampanhas from "./pages/player/PlayerCampanhas";
import PlayerNotes from "./pages/player/PlayerNotes";
import { PlayerRoll } from "./pages/player/PlayerRoll";
import PlayerConfig from "./pages/player/PlayerConfig";
import { PlayerPersonagensPage } from "./pages/player/PlayerPersonagensPage";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Route */}
            <Route element={<PublicRoute />}>
              <Route path="/" element={<HomePage />} />
            </Route>
            
            {/* User Type Selection Route */}
            <Route element={<UserTypeRoute />}>
              <Route path="/choose-role" element={<UserType />} />
            </Route>
            
            {/* Protected Master Routes */}
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
                <Route path="/master/players" element={<MasterPlayers />} />
                <Route path="/master/config" element={<MasterConfig />} />
                <Route path="/personagens" element={<PersonagensPage />} />
                <Route path="/personagens/:id" element={<PersonagemFichaWrapper />} />
              </Route>
            </Route>
            
            {/* Protected Player Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<PlayerRoute />}>
                <Route path="/player/dashboard" element={<PlayerDashboard />} />
                <Route path="/player/criarpersonagens" element={<PlayerCriarPersonagens />} />
                <Route path="/player/personagens" element={<PlayerPersonagensPage />} />
                <Route path="/player/notes" element={<PlayerNotes />} />
                <Route path="/player/rolagem" element={<PlayerRoll />} />
                <Route path="/player/personagens/:id" element={<PersonagemFichaWrapper />} />
                <Route path="/player/campanhas" element={<PlayerCampanhas />} />
                <Route path="/player/config" element={<PlayerConfig />} />
              </Route>
            </Route>
            
            {/* Catch-all Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;