
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

// Public Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserType from "./pages/UserType";
import NotFound from "./pages/NotFound";

// Master Pages
import MasterDashboard from "./pages/master/MasterDashboard";
import MasterMesas from "./pages/master/MasterMesas";
import MasterLore from "./pages/master/MasterLore";
import MasterSessao from "./pages/master/MasterSessao";
import MasterSistema from "./pages/master/MasterSistema";
import MasterPlayers from "./pages/master/MasterPlayers";
import MasterConfig from "./pages/master/MasterConfig";

// Player Pages
import PlayerDashboard from "./pages/player/PlayerDashboard";
import PlayerPersonagens from "./pages/player/PlayerPersonagens";
import PlayerSessao from "./pages/player/PlayerSessao";
import PlayerConfig from "./pages/player/PlayerConfig";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicRoute />}>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            
            {/* User Type Selection Route */}
            <Route element={<UserTypeRoute />}>
              <Route path="/user-type" element={<UserType />} />
            </Route>
            
            {/* Protected Master Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MasterRoute />}>
                <Route path="/master/dashboard" element={<MasterDashboard />} />
                <Route path="/master/mesas" element={<MasterMesas />} />
                <Route path="/master/lore" element={<MasterLore />} />
                <Route path="/master/sessao" element={<MasterSessao />} />
                <Route path="/master/sistema" element={<MasterSistema />} />
                <Route path="/master/players" element={<MasterPlayers />} />
                <Route path="/master/config" element={<MasterConfig />} />
              </Route>
            </Route>
            
            {/* Protected Player Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<PlayerRoute />}>
                <Route path="/player/dashboard" element={<PlayerDashboard />} />
                <Route path="/player/personagens" element={<PlayerPersonagens />} />
                <Route path="/player/sessao" element={<PlayerSessao />} />
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
