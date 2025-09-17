import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-4xl font-orbitron font-bold text-foreground mb-2">
            MOTO<span className="text-primary">LUCRO</span>
          </h1>
        </div>

        {/* 404 Content */}
        <div className="mb-8">
          <div className="text-8xl font-orbitron font-bold text-primary mb-4">404</div>
          <h2 className="text-2xl font-orbitron font-bold text-foreground mb-4">
            Página não encontrada
          </h2>
          <p className="text-muted-foreground font-montserrat mb-6">
            A página que você está procurando não existe ou foi movida.
          </p>
          <p className="text-sm text-muted-foreground font-montserrat">
            Rota tentada: <code className="bg-muted px-2 py-1 rounded text-xs">{location.pathname}</code>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate("/")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-button transition-smooth"
          >
            <Home className="w-4 h-4 mr-2" />
            Ir para Início
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="border-primary text-primary hover:bg-primary/10 transition-smooth"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <p className="text-sm text-muted-foreground font-montserrat">
            Se você acredita que isso é um erro, entre em contato conosco.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
