import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Shield, ArrowLeft } from "lucide-react";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!username.trim() || !password.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    // Verificar credenciais do admin
    if (username === "admin" && password === "adminmaster123") {
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao painel administrativo.",
      });
      
      // Salvar sessão do admin no localStorage
      localStorage.setItem("adminSession", "true");
      localStorage.setItem("adminLoginTime", new Date().toISOString());
      
      navigate("/admin-panel");
    } else {
      toast({
        title: "Credenciais inválidas",
        description: "Usuário ou senha incorretos.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl font-orbitron font-bold text-foreground mb-2">
            ADMIN<span className="text-primary">PANEL</span>
          </h1>
          <p className="text-muted-foreground font-montserrat">
            Acesso restrito ao painel administrativo
          </p>
        </div>

        {/* Login Form */}
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="font-orbitron text-foreground">
              Login Administrativo
            </CardTitle>
            <CardDescription className="font-montserrat">
              Digite suas credenciais de administrador
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="font-montserrat text-foreground">
                  Usuário
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Digite seu usuário"
                  className="border-primary/30 focus:border-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-montserrat text-foreground">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    className="border-primary/30 focus:border-primary pr-10"
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
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-button transition-smooth font-montserrat"
              >
                <Shield className="w-4 h-4 mr-2" />
                Entrar no Painel
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-primary transition-smooth font-montserrat"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o site
          </Button>
        </div>

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive font-montserrat text-center">
            ⚠️ Acesso restrito apenas para administradores autorizados
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
