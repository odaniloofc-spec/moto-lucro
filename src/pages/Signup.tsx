import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus, Check, CheckCircle, Mail } from "lucide-react";

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();
  const { signUp, loading } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validar nome
    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Nome deve ter pelo menos 2 caracteres";
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    // Validar telefone
    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório";
    }

    // Validar senha
    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    // Validar confirmação de senha
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirmação de senha é obrigatória";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Senhas não coincidem";
    }

    // Validar termos
    if (!formData.acceptTerms) {
      newErrors.terms = "Você deve aceitar os termos de uso";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const { error } = await signUp(formData.email, formData.password, formData.name);
    
    if (!error) {
      setEmailSent(true);
    }
  };

  const benefits = [
    "Controle total de ganhos e despesas",
    "Relatórios detalhados de performance",
    "Metas personalizadas",
    "Interface otimizada para mobile",
    "Backup automático dos dados",
    "Suporte especializado"
  ];

  // Tela de confirmação de email
  if (emailSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="bg-finance-card border-border/50 shadow-card">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-orbitron font-bold text-foreground">
                Verifique seu Email
              </CardTitle>
              <CardDescription className="font-montserrat">
                Enviamos um link de confirmação para <strong>{formData.email}</strong>
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground font-montserrat">
                  Clique no link que enviamos para ativar sua conta e começar a usar o MotoLucro.
                </p>
                <p className="text-xs text-muted-foreground font-montserrat">
                  Não recebeu o email? Verifique sua pasta de spam ou clique em "Reenviar".
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={() => navigate("/login")}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Ir para Login
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setEmailSent(false)}
                  className="w-full"
                >
                  Voltar ao Cadastro
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
                    className={`bg-background/50 border-border/50 focus:border-primary transition-smooth ${
                      errors.name ? "border-red-500 focus:border-red-500" : ""
                    }`}
                    required
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 font-montserrat">{errors.name}</p>
                  )}
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
                    className={`bg-background/50 border-border/50 focus:border-primary transition-smooth ${
                      errors.email ? "border-red-500 focus:border-red-500" : ""
                    }`}
                    required
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 font-montserrat">{errors.email}</p>
                  )}
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
                    className={`bg-background/50 border-border/50 focus:border-primary transition-smooth ${
                      errors.phone ? "border-red-500 focus:border-red-500" : ""
                    }`}
                    required
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500 font-montserrat">{errors.phone}</p>
                  )}
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
                      className={`bg-background/50 border-border/50 focus:border-primary transition-smooth pr-10 ${
                        errors.password ? "border-red-500 focus:border-red-500" : ""
                      }`}
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
                  {errors.password && (
                    <p className="text-sm text-red-500 font-montserrat">{errors.password}</p>
                  )}
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
                      className={`bg-background/50 border-border/50 focus:border-primary transition-smooth pr-10 ${
                        errors.confirmPassword ? "border-red-500 focus:border-red-500" : ""
                      }`}
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
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500 font-montserrat">{errors.confirmPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) => handleInputChange("acceptTerms", checked as boolean)}
                      className={`border-border/50 ${errors.terms ? "border-red-500" : ""}`}
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
                  {errors.terms && (
                    <p className="text-sm text-red-500 font-montserrat">{errors.terms}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-button transition-smooth"
                  disabled={loading}
                >
                  {loading ? (
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
