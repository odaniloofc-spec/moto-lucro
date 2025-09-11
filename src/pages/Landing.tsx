import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Users, TrendingUp, Shield, Smartphone, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState<string | null>(null);

  const features = [
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      title: "Controle Total",
      description: "Acompanhe ganhos, despesas e lucro líquido em tempo real"
    },
    {
      icon: <Smartphone className="w-8 h-8 text-primary" />,
      title: "Interface Mobile",
      description: "Otimizado para uso no celular durante as corridas"
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Dados Seguros",
      description: "Seus dados financeiros protegidos e sincronizados"
    },
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "Ações Rápidas",
      description: "Registre corridas e despesas em segundos"
    }
  ];

  const pricingPlans = [
    {
      name: "MVP Gratuito",
      price: "R$ 0",
      originalPrice: "R$ 49,90",
      period: "para sempre",
      description: "Teste todas as funcionalidades",
      features: [
        "Transações ilimitadas",
        "Controle de ganhos e despesas",
        "Relatórios detalhados",
        "Metas personalizadas",
        "Filtros por data",
        "Integração com apps (Uber, 99Pop, iFood)"
      ],
      cta: "Começar Grátis",
      popular: true,
      color: "border-primary/50 shadow-neon"
    },
    {
      name: "Futuro Pro",
      price: "R$ 0",
      originalPrice: "R$ 99,90",
      period: "em breve",
      description: "Funcionalidades avançadas",
      features: [
        "Tudo do MVP",
        "Dashboard personalizado",
        "Backup automático",
        "Suporte prioritário",
        "Análise de performance",
        "API para desenvolvedores"
      ],
      cta: "Em Breve",
      popular: false,
      color: "border-muted-foreground/20"
    },
    {
      name: "Futuro Premium",
      price: "R$ 0",
      originalPrice: "R$ 199,90",
      period: "em breve",
      description: "Solução completa",
      features: [
        "Tudo do Pro",
        "Integração completa",
        "Relatórios avançados",
        "Suporte 24/7",
        "Multi-usuário",
        "White-label"
      ],
      cta: "Em Breve",
      popular: false,
      color: "border-muted-foreground/20"
    }
  ];

  const testimonials = [
    {
      name: "João Silva",
      role: "Motoboy - São Paulo",
      content: "O MotoFinance revolucionou meu controle financeiro. Agora sei exatamente quanto ganho por dia!",
      rating: 5
    },
    {
      name: "Maria Santos",
      role: "Entregadora - Rio de Janeiro",
      content: "Interface super fácil de usar. Consigo registrar tudo rapidinho entre as entregas.",
      rating: 5
    },
    {
      name: "Carlos Oliveira",
      role: "Motoboy - Belo Horizonte",
      content: "Os relatórios me ajudaram a otimizar minhas rotas e aumentar meus ganhos em 30%.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-orbitron font-bold text-foreground">
              MOTO<span className="text-primary">LUCRO</span>
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/login')}
              className="text-foreground hover:text-primary transition-smooth"
            >
              Entrar
            </Button>
            <Button 
              onClick={() => navigate('/signup')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-button transition-smooth"
            >
              Inscrever-se
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            🚀 MVP GRATUITO - Teste todas as funcionalidades sem pagar nada!
          </Badge>
          
            <h1 className="text-5xl md:text-7xl font-orbitron font-bold text-foreground mb-6">
            MOTO<span className="text-primary">LUCRO</span>
            <br />
            <span className="text-primary">MVP</span>
            <br />
            para Motoboys
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto font-montserrat">
            MVP gratuito para testar todas as funcionalidades! Gerencie seus ganhos, despesas e metas 
            financeiras. Feita especialmente para profissionais da entrega.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              onClick={() => navigate('/signup')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-button transition-smooth text-lg px-8 py-6"
            >
              Começar Grátis Agora
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/login')}
              className="border-primary text-primary hover:bg-primary/10 transition-smooth text-lg px-8 py-6"
            >
              Fazer Login
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-orbitron font-bold text-primary mb-2">1000+</div>
              <div className="text-muted-foreground font-montserrat">Motoboys Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-orbitron font-bold text-primary mb-2">R$ 2.5M+</div>
              <div className="text-muted-foreground font-montserrat">Ganhos Controlados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-orbitron font-bold text-primary mb-2">4.9★</div>
              <div className="text-muted-foreground font-montserrat">Avaliação dos Usuários</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-finance-secondary">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-orbitron font-bold text-foreground mb-4">
              Por que escolher o MotoFinance?
            </h2>
            <p className="text-xl text-muted-foreground font-montserrat">
              Ferramentas poderosas desenvolvidas especificamente para motoboys
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="bg-finance-card border-border/50 hover:border-primary/50 transition-smooth text-center"
              >
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-orbitron font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground font-montserrat">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-orbitron font-bold text-foreground mb-4">
              Escolha seu Plano
            </h2>
            <p className="text-xl text-muted-foreground font-montserrat">
              MVP 100% GRATUITO - Teste todas as funcionalidades!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index}
                className={`bg-finance-card border-2 ${plan.color} hover:border-primary/70 transition-smooth relative ${
                  plan.popular ? 'scale-105 shadow-neon' : ''
                }`}
                onMouseEnter={() => setIsHovered(plan.name)}
                onMouseLeave={() => setIsHovered(null)}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      MVP Ativo
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-orbitron font-bold text-foreground">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-4">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-4xl font-orbitron font-bold text-primary">
                        {plan.price}
                      </span>
                      {plan.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">
                          {plan.originalPrice}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground font-montserrat mt-1">
                      {plan.period}
                    </p>
                  </div>
                  <CardDescription className="text-foreground font-montserrat">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-foreground font-montserrat">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full mt-6 ${
                      plan.popular 
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-button' 
                        : 'bg-secondary hover:bg-secondary/90 text-secondary-foreground'
                    } transition-smooth`}
                    onClick={() => plan.popular ? navigate('/signup') : null}
                    disabled={!plan.popular}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-muted-foreground font-montserrat">
              💡 MVP 100% gratuito - Sem taxas, sem compromisso!
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-finance-secondary">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-orbitron font-bold text-foreground mb-4">
              O que nossos usuários dizem
            </h2>
            <p className="text-xl text-muted-foreground font-montserrat">
              Histórias reais de motoboys que transformaram suas finanças
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-finance-card border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-foreground font-montserrat mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-orbitron font-bold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground font-montserrat">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-orbitron font-bold text-foreground mb-4">
            Pronto para transformar suas finanças?
          </h2>
          <p className="text-xl text-muted-foreground font-montserrat mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de motoboys que já estão no controle total de suas finanças
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/signup')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-button transition-smooth text-lg px-12 py-6"
          >
            Começar Agora - É Grátis!
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-orbitron font-bold text-foreground mb-2">
              MOTO<span className="text-primary">LUCRO</span>
            </h3>
            <p className="text-muted-foreground font-montserrat">
              Controle financeiro inteligente para motoboys
            </p>
          </div>
          <div className="flex justify-center space-x-6 mb-6">
            <Button variant="ghost" onClick={() => navigate('/login')} className="text-muted-foreground hover:text-primary">
              Entrar
            </Button>
            <Button variant="ghost" onClick={() => navigate('/signup')} className="text-muted-foreground hover:text-primary">
              Inscrever-se
            </Button>
          </div>
          <p className="text-sm text-muted-foreground font-montserrat">
            © 2024 MotoLucro. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
