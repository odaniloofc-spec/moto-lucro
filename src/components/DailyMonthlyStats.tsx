import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DailyMonthlyStatsProps {
  todayGains: number;
  monthGains: number;
  todayExpenses: number;
  monthExpenses: number;
}

export const DailyMonthlyStats = ({ todayGains, monthGains, todayExpenses, monthExpenses }: DailyMonthlyStatsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const todayProfit = todayGains - todayExpenses;
  const monthProfit = monthGains - monthExpenses;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
      {/* Hoje */}
      <Card className="bg-finance-card border-finance-profit/30 shadow-card">
        <CardContent className="p-3 sm:p-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-base sm:text-lg">📅</span>
              <h3 className="text-xs sm:text-sm font-orbitron font-bold text-muted-foreground uppercase tracking-wide">
                Hoje
              </h3>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground font-montserrat">Ganhos</div>
              <div className="text-sm sm:text-lg font-orbitron font-bold text-finance-gain break-words">
                {formatCurrency(todayGains)}
              </div>
              <div className="text-xs text-muted-foreground font-montserrat">Líquido</div>
              <div className={cn(
                "text-xs sm:text-sm font-orbitron font-bold break-words",
                todayProfit >= 0 ? "text-finance-profit" : "text-finance-expense"
              )}>
                {formatCurrency(todayProfit)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mês */}
      <Card className="bg-finance-card border-finance-profit/30 shadow-card">
        <CardContent className="p-3 sm:p-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-base sm:text-lg">📊</span>
              <h3 className="text-xs sm:text-sm font-orbitron font-bold text-muted-foreground uppercase tracking-wide">
                Este Mês
              </h3>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground font-montserrat">Ganhos</div>
              <div className="text-sm sm:text-lg font-orbitron font-bold text-finance-gain break-words">
                {formatCurrency(monthGains)}
              </div>
              <div className="text-xs text-muted-foreground font-montserrat">Líquido</div>
              <div className={cn(
                "text-xs sm:text-sm font-orbitron font-bold break-words",
                monthProfit >= 0 ? "text-finance-profit" : "text-finance-expense"
              )}>
                {formatCurrency(monthProfit)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};