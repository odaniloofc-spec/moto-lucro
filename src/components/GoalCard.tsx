import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface GoalCardProps {
  currentAmount: number;
  goalAmount: number;
}

export const GoalCard = ({ currentAmount, goalAmount }: GoalCardProps) => {
  const percentage = Math.min((currentAmount / goalAmount) * 100, 100);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  return (
    <Card className="bg-finance-card border-border shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-foreground font-orbitron text-lg">
          <span className="text-xl">🎯</span>
          Meta de Reserva
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-muted-foreground text-sm font-montserrat">Atual</p>
            <p className="text-xl font-orbitron font-bold text-finance-profit">
              {formatCurrency(currentAmount)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-sm font-montserrat">Meta</p>
            <p className="text-lg font-orbitron text-foreground">
              {formatCurrency(goalAmount)}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Progress value={percentage} className="h-3 bg-background/50" />
          <p className="text-center text-sm font-montserrat">
            <span className="text-finance-profit font-bold">{percentage.toFixed(1)}%</span>
            <span className="text-muted-foreground"> alcançado</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};