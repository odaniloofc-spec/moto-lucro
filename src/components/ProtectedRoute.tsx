import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("ProtectedRoute - user:", user, "loading:", loading, "pathname:", location.pathname);
    
    if (!loading && !user) {
      console.log("Usuário não autenticado, redirecionando para login");
      // Salvar a rota atual para redirecionar após login
      const returnTo = location.pathname !== '/dashboard' ? location.pathname : '/dashboard';
      navigate(`/login?returnTo=${encodeURIComponent(returnTo)}`);
    }
  }, [user, loading, navigate, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-montserrat">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Será redirecionado pelo useEffect
  }

  return <>{children}</>;
};
