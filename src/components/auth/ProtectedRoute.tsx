
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const ProtectedRoute = () => {
  const { currentUser, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const MasterRoute = () => {
  const { userRole, loading } = useAuth();
  
  if (loading) return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  
  if (userRole !== "master") {
    return <Navigate to="/player/dashboard" replace />;
  }

  return <Outlet />;
};

export const PlayerRoute = () => {
  const { userRole, loading } = useAuth();
  
  if (loading) return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  
  if (userRole !== "player") {
    return <Navigate to="/master/dashboard" replace />;
  }

  return <Outlet />;
};

export const PublicRoute = () => {
  const { currentUser, userRole } = useAuth();
  
  if (currentUser && userRole === "master") {
    return <Navigate to="/master/dashboard" replace />;
  }

  if (currentUser && userRole === "player") {
    return <Navigate to="/player/dashboard" replace />;
  }

  return <Outlet />;
};

export const UserTypeRoute = () => {
  const { currentUser, userRole, loading } = useAuth();
  
  if (loading) return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (userRole === "master") {
    return <Navigate to="/master/dashboard" replace />;
  }
  
  if (userRole === "player") {
    return <Navigate to="/player/dashboard" replace />;
  }
  
  return <Outlet />;
};
