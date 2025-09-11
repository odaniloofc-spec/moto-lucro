import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus, Check } from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validações básicas
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "As senhas digitadas não são iguais.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
      toast({
        title: "Termos não aceitos",
        description: "Você deve aceitar os termos de uso para continuar.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simular delay de cadastro
    setTimeout(() => {
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Sua conta foi criada no MotoLucro. Faça login para continuar.",
        });
      setIsLoading(false);
      navigate("/login");
    }, 2000);
  };

  const benefits = [
    "Controle total de ganhos e despesas",
    "Relatórios detalhados de performance",
    "Metas personalizadas",
    "Interface otimizada para mobile",
    "Backup automático dos dados",
    "Suporte especializado"
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-orbitron font-bold text-foreground mb-2">
            MOTO<span className="text-primary">LUCRO</span>
          </h1>
          <p className="text-muted-foreground font-montserrat">
            Crie sua conta e comece a controlar suas finanças hoje
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Benefits Card */}
          <Card className="bg-finance-card border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="text-2xl font-orbitron font-bold text-foreground">
                Por que se inscrever?
              </CardTitle>
              <CardDescription className="font-montserrat">
                Descubra todos os benefícios que você terá
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground font-montserrat">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <h4 className="text-lg font-orbitron font-bold text-primary mb-2">
                  🎉 Oferta Especial
                </h4>
                <p className="text-sm text-muted-foreground font-montserrat">
                  Todos os planos estão <strong>GRÁTIS</strong> por tempo limitado! 
                  Comece hoje e tenha acesso completo a todas as funcionalidades.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Signup Form */}
          <Card className="bg-finance-card border-border/50 shadow-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-orbitron font-bold text-foreground">
                Criar Conta
              </CardTitle>
              <CardDescription className="font-montserrat">
                Preencha os dados abaixo para começar
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground font-montserrat">
                    Nome Completo
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Digite seu nome completo"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="bg-background/50 border-border/50 focus:border-primary transition-smooth"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-montserrat">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Digite seu email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="bg-background/50 border-border/50 focus:border-primary transition-smooth"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground font-montserrat">
                    Telefone (WhatsApp)
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
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
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground font-montserrat">
                    Confirmar Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirme sua senha"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="bg-background/50 border-border/50 focus:border-primary transition-smooth pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => handleInputChange("acceptTerms", checked as boolean)}
                    className="border-border/50"
                  />
                  <Label htmlFor="terms" className="text-sm text-foreground font-montserrat">
                    Aceito os{" "}
                    <Button
                      type="button"
                      variant="link"
                      className="text-primary hover:text-primary/80 p-0 h-auto text-sm"
                    >
                      termos de uso
                    </Button>{" "}
                    e{" "}
                    <Button
                      type="button"
                      variant="link"
                      className="text-primary hover:text-primary/80 p-0 h-auto text-sm"
                    >
                      política de privacidade
                    </Button>
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-button transition-smooth"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Criando conta...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      Criar Conta Grátis
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground font-montserrat">
                  Já tem uma conta?{" "}
                  <Button
                    variant="link"
                    onClick={() => navigate("/login")}
                    className="text-primary hover:text-primary/80 p-0 h-auto font-montserrat"
                  >
                    Faça login aqui
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

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

export default Signup;
