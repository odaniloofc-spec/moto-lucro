import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro na autenticação:', error);
          toast({
            title: "Erro na autenticação",
            description: "Não foi possível confirmar sua conta. Tente fazer login novamente.",
            variant: "destructive",
          });
          navigate('/login');
          return;
        }

        if (data.session) {
          toast({
            title: "Conta confirmada com sucesso!",
            description: "Bem-vindo ao MotoLucro!",
          });
          navigate('/dashboard');
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Erro inesperado:', error);
        toast({
          title: "Erro inesperado",
          description: "Ocorreu um erro inesperado. Tente novamente.",
          variant: "destructive",
        });
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground font-montserrat">
          Confirmando sua conta...
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
