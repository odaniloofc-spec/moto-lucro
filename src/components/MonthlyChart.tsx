import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Transaction {
  id: string;
  value: number;
  type: "gain" | "expense";
  category?: string;
  company?: string;
  date: Date;
}

interface MonthlyChartProps {
  transactions: Transaction[];
  dateFilter?: "all" | "week" | "month" | "custom";
  startDate?: Date | null;
  endDate?: Date | null;
}

interface ChartData {
  day: string;
  dayOfWeek: string;
  entradas: number;
  saidas: number;
  lucro: number;
}

export const MonthlyChart = ({ transactions, dateFilter = "month", startDate, endDate }: MonthlyChartProps) => {
  const getChartData = (): ChartData[] => {
    const now = new Date();
    let filteredTransactions = [...transactions];
    
    // Aplicar filtro de data
    switch (dateFilter) {
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredTransactions = filteredTransactions.filter(t => new Date(t.date) >= weekAgo);
        break;
      case "month":
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        filteredTransactions = filteredTransactions.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate.getMonth() === currentMonth && 
                 transactionDate.getFullYear() === currentYear;
        });
        break;
      case "custom":
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          filteredTransactions = filteredTransactions.filter(t => {
            const transactionDate = new Date(t.date);
            return transactionDate >= start && transactionDate <= end;
          });
        }
        break;
    }

    // Determinar o período para o gráfico
    let startPeriod: Date, endPeriod: Date;
    
    if (dateFilter === "custom" && startDate && endDate) {
      startPeriod = new Date(startDate);
      endPeriod = new Date(endDate);
    } else if (dateFilter === "week") {
      endPeriod = new Date(now);
      startPeriod = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else {
      // Mês atual
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      startPeriod = new Date(currentYear, currentMonth, 1);
      endPeriod = new Date(currentYear, currentMonth + 1, 0);
    }

    const chartData: ChartData[] = [];
    const currentDate = new Date(startPeriod);

    while (currentDate <= endPeriod) {
      const dayOfWeek = currentDate.toLocaleDateString('pt-BR', { weekday: 'short' });
      const dayLabel = `${currentDate.getDate()}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;

      // Filtrar transações do dia
      const dayTransactions = filteredTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.toDateString() === currentDate.toDateString();
      });

      // Calcular totais do dia
      const entradas = dayTransactions
        .filter(t => t.type === "gain")
        .reduce((sum, t) => sum + t.value, 0);

      const saidas = dayTransactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.value, 0);

      const lucro = entradas - saidas;

      chartData.push({
        day: dayLabel,
        dayOfWeek,
        entradas,
        saidas,
        lucro
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return chartData;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-montserrat font-bold text-foreground mb-2">
            {label} - {payload[0]?.payload?.dayOfWeek}
          </p>
          <div className="space-y-1">
            <p className="text-sm font-montserrat">
              <span className="text-finance-gain">💰 Entradas:</span> {formatCurrency(payload[0]?.value || 0)}
            </p>
            <p className="text-sm font-montserrat">
              <span className="text-finance-expense">💸 Saídas:</span> {formatCurrency(payload[1]?.value || 0)}
            </p>
            <p className="text-sm font-montserrat font-bold">
              <span className="text-finance-profit">🚀 Valor:</span> {formatCurrency(payload[2]?.value || 0)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const chartData = getChartData();
  const hasData = chartData.some(day => day.entradas > 0 || day.saidas > 0);

  if (!hasData) {
    return (
      <Card className="bg-finance-card rounded-lg border border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-orbitron font-bold text-foreground flex items-center gap-2">
            <span className="text-xl">📊</span>
            Evolução Mensal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground font-montserrat">
              Nenhuma transação encontrada para este mês.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-finance-card rounded-lg border border-border shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg font-orbitron font-bold text-foreground flex items-center gap-2">
          <span className="text-lg sm:text-xl">📊</span>
          <span className="hidden sm:inline">Evolução Mensal - {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
          <span className="sm:hidden">Evolução Mensal</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="h-64 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 10,
                left: 10,
                bottom: 40,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="day" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                angle={-45}
                textAnchor="end"
                height={40}
                interval="preserveStartEnd"
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickFormatter={(value) => `R$${value}`}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="entradas" 
                name="Entradas" 
                fill="hsl(var(--finance-gain))"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="saidas" 
                name="Saídas" 
                fill="hsl(var(--finance-expense))"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Resumo do mês */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-finance-gain/10 border border-finance-gain/20 rounded-lg">
            <p className="text-sm text-muted-foreground font-montserrat">Total de Entradas</p>
            <p className="text-xl font-orbitron font-bold text-finance-gain">
              {formatCurrency(chartData.reduce((sum, day) => sum + day.entradas, 0))}
            </p>
          </div>
          <div className="text-center p-4 bg-finance-expense/10 border border-finance-expense/20 rounded-lg">
            <p className="text-sm text-muted-foreground font-montserrat">Total de Saídas</p>
            <p className="text-xl font-orbitron font-bold text-finance-expense">
              {formatCurrency(chartData.reduce((sum, day) => sum + day.saidas, 0))}
            </p>
          </div>
          <div className="text-center p-4 bg-finance-profit/10 border border-finance-profit/20 rounded-lg shadow-neon">
            <p className="text-sm text-muted-foreground font-montserrat">Valor do Mês</p>
            <p className="text-xl font-orbitron font-bold text-finance-profit">
              {formatCurrency(chartData.reduce((sum, day) => sum + day.lucro, 0))}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
