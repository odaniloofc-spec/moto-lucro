import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FinanceCardProps {
  title: string;
  value: number;
  type: "gain" | "expense" | "profit";
  icon: string;
  className?: string;
  onClick?: () => void;
}

export const FinanceCard = ({ title, value, type, icon, className, onClick }: FinanceCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const getColorClass = () => {
    switch (type) {
      case "gain":
        return "text-finance-gain";
      case "expense":
        return "text-finance-expense";
      case "profit":
        return "text-finance-profit";
      default:
        return "text-foreground";
    }
  };

  const getBackgroundGlow = () => {
    switch (type) {
      case "gain":
        return "bg-finance-gain/10 border-finance-gain/20";
      case "expense":
        return "bg-finance-expense/10 border-finance-expense/20";
      case "profit":
        return "bg-finance-profit/10 border-finance-profit/20 shadow-neon";
      default:
        return "bg-finance-card";
    }
  };

  return (
    <Card 
      className={cn(
        "bg-finance-card border-border transition-smooth hover:scale-105",
        getBackgroundGlow(),
        onClick && "cursor-pointer hover:shadow-lg",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-muted-foreground font-montserrat text-sm uppercase tracking-wide">
            {title}
          </span>
          <span className="text-2xl">{icon}</span>
        </div>
        <div className={cn(
          "text-3xl font-orbitron font-bold tracking-tight",
          getColorClass()
        )}>
          {formatCurrency(value)}
        </div>
      </CardContent>
    </Card>
  );
};