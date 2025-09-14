import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { signIn, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await signIn(email, password);
    
    if (!error) {
      console.log("Login bem-sucedido, redirecionando...");
      // Pequeno delay para garantir que o estado foi atualizado
      setTimeout(() => {
        console.log("Navegando para /dashboard");
        navigate("/dashboard");
      }, 100);
    } else {
      console.log("Erro no login:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-orbitron font-bold text-foreground mb-2">
            MOTO<span className="text-primary">LUCRO</span>
          </h1>
          <p className="text-muted-foreground font-montserrat">
            Faça login para acessar sua conta
          </p>
        </div>

        {/* Login Card */}
        <Card className="bg-finance-card border-border/50 shadow-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-orbitron font-bold text-foreground">
              Entrar
            </CardTitle>
            <CardDescription className="font-montserrat">
              Digite suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-montserrat">
                  Email ou Usuário
                </Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Digite seu email ou usuário"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/50 border-border/50 focus:border-primary transition-smooth"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-montserrat">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background/50 border-border/50 focus:border-primary transition-smooth pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-button transition-smooth"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Entrando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Entrar
                  </div>
                )}
              </Button>
            </form>

            {/* Info */}
            <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <h4 className="text-sm font-orbitron font-bold text-primary mb-2">
                🔐 Autenticação Segura
              </h4>
              <p className="text-xs text-muted-foreground font-montserrat">
                Use suas credenciais reais para acessar o sistema. 
                Se você ainda não tem uma conta, clique em "Inscreva-se aqui" para criar uma.
              </p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground font-montserrat">
                Não tem uma conta?{" "}
                <Button
                  variant="link"
                  onClick={() => navigate("/signup")}
                  className="text-primary hover:text-primary/80 p-0 h-auto font-montserrat"
                >
                  Inscreva-se aqui
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Landing */}
        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/landing")}
            className="text-muted-foreground hover:text-primary transition-smooth"
          >
            ← Voltar para a página inicial
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
