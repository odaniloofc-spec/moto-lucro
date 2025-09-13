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
}

interface ChartData {
  day: string;
  dayOfWeek: string;
  entradas: number;
  saidas: number;
  lucro: number;
}

export const MonthlyChart = ({ transactions }: MonthlyChartProps) => {
  const getChartData = (): ChartData[] => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Filtrar transações do mês atual
    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    // Criar array com todos os dias do mês
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const chartData: ChartData[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dayOfWeek = date.toLocaleDateString('pt-BR', { weekday: 'short' });
      const dayLabel = `${day}/${(currentMonth + 1).toString().padStart(2, '0')}`;

      // Filtrar transações do dia
      const dayTransactions = monthTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getDate() === day;
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
              <span className="text-finance-profit">🚀 Lucro:</span> {formatCurrency(payload[2]?.value || 0)}
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
      <CardHeader>
        <CardTitle className="text-lg font-orbitron font-bold text-foreground flex items-center gap-2">
          <span className="text-xl">📊</span>
          Evolução Mensal - {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="day" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `R$ ${value}`}
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
            <p className="text-sm text-muted-foreground font-montserrat">Lucro do Mês</p>
            <p className="text-xl font-orbitron font-bold text-finance-profit">
              {formatCurrency(chartData.reduce((sum, day) => sum + day.lucro, 0))}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
