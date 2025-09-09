import { useState, useEffect } from "react";
import { FinanceCard } from "@/components/FinanceCard";
import { QuickAction } from "@/components/QuickAction";
import { GoalCard } from "@/components/GoalCard";
import { DailyMonthlyStats } from "@/components/DailyMonthlyStats";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  value: number;
  type: "gain" | "expense";
  category?: string;
  date: Date;
}

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goalAmount] = useState(300); // Meta fixa de R$ 300
  const { toast } = useToast();

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const saved = localStorage.getItem("motofinance-transactions");
    if (saved) {
      const parsed = JSON.parse(saved);
      setTransactions(parsed.map((t: any) => ({ ...t, date: new Date(t.date) })));
    }
  }, []);

  // Salvar no localStorage sempre que transactions mudar
  useEffect(() => {
    localStorage.setItem("motofinance-transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (value: number, type: "gain" | "expense", category?: string) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      value,
      type,
      category,
      date: new Date(),
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    
    toast({
      title: type === "gain" ? "Corrida adicionada!" : "Despesa registrada!",
      description: `${type === "gain" ? "Ganho" : "Gasto"} de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)} ${category ? `(${category})` : ""}`,
    });
  };

  const totalGains = transactions
    .filter(t => t.type === "gain")
    .reduce((sum, t) => sum + t.value, 0);

  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.value, 0);

  const netProfit = totalGains - totalExpenses;

  // Cálculos para hoje
  const today = new Date();
  const todayTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.toDateString() === today.toDateString();
  });

  const todayGains = todayTransactions
    .filter(t => t.type === "gain")
    .reduce((sum, t) => sum + t.value, 0);

  const todayExpenses = todayTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.value, 0);

  // Cálculos para este mês
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const monthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
  });

  const monthGains = monthTransactions
    .filter(t => t.type === "gain")
    .reduce((sum, t) => sum + t.value, 0);

  const monthExpenses = monthTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.value, 0);

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="text-center pt-4 pb-2">
        <h1 className="text-4xl font-orbitron font-bold text-foreground mb-2">
          MOTO<span className="text-primary">FINANCE</span>
        </h1>
        <p className="text-muted-foreground font-montserrat">
          Controle financeiro para motoboys
        </p>
      </div>

      {/* Estatísticas Diárias e Mensais */}
      <DailyMonthlyStats
        todayGains={todayGains}
        monthGains={monthGains}
        todayExpenses={todayExpenses}
        monthExpenses={monthExpenses}
      />

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FinanceCard
          title="Ganhos Totais"
          value={totalGains}
          type="gain"
          icon="💰"
        />
        <FinanceCard
          title="Despesas Totais"
          value={totalExpenses}
          type="expense"
          icon="💸"
        />
        <FinanceCard
          title="Lucro Líquido"
          value={netProfit}
          type="profit"
          icon="🚀"
        />
      </div>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QuickAction
          title="Adicionar Corrida"
          type="gain"
          icon="🏍️"
          onAdd={(value) => addTransaction(value, "gain")}
        />
        <QuickAction
          title="Registrar Despesa"
          type="expense"
          icon="🛠️"
          onAdd={(value, category) => addTransaction(value, "expense", category)}
          categories={["Combustível", "Manutenção", "Outros"]}
        />
      </div>

      {/* Meta de Reserva */}
      <GoalCard
        currentAmount={Math.max(0, netProfit)}
        goalAmount={goalAmount}
      />

      {/* Histórico Recente */}
      {transactions.length > 0 && (
        <div className="bg-finance-card rounded-lg border border-border shadow-card p-4">
          <h3 className="text-lg font-orbitron font-bold text-foreground mb-4">
            Últimas Transações
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {transactions.slice(0, 10).map((transaction) => (
              <div
                key={transaction.id}
                className="flex justify-between items-center p-3 bg-background/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {transaction.type === "gain" ? "💰" : "💸"}
                  </span>
                  <div>
                    <p className="font-montserrat text-foreground">
                      {transaction.type === "gain" ? "Corrida" : transaction.category}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.date.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
                <span className={`font-orbitron font-bold ${
                  transaction.type === "gain" ? "text-finance-gain" : "text-finance-expense"
                }`}>
                  {transaction.type === "gain" ? "+" : "-"}
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(transaction.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
