import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FinanceCard } from "@/components/FinanceCard";
import { QuickAction } from "@/components/QuickAction";
import { GoalCard } from "@/components/GoalCard";
import { DailyMonthlyStats } from "@/components/DailyMonthlyStats";
import { TransactionList } from "@/components/TransactionList";
import { TransactionModal } from "@/components/TransactionModal";
import { MonthlyChart } from "@/components/MonthlyChart";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useTransactions } from "@/hooks/useTransactions";
import { useUserGoal } from "@/hooks/useUserGoal";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [isGainsModalOpen, setIsGainsModalOpen] = useState(false);
  const [isExpensesModalOpen, setIsExpensesModalOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<"all" | "week" | "month" | "custom">("month");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  
  const { user, signOut } = useAuth();
  const { transactions, loading: transactionsLoading, addTransaction, editTransaction, deleteTransaction } = useTransactions();
  const { goalAmount, loading: goalLoading, updateGoal } = useUserGoal();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Removido: proteção de rota agora é feita pelo ProtectedRoute

  const handleAddTransaction = async (value: number, type: "gain" | "expense", category?: string, company?: string) => {
    await addTransaction({
      value,
      type,
      category,
      company,
      date: new Date(),
    });
  };

  const handleEditTransaction = async (id: string, value: number, category?: string, company?: string) => {
    await editTransaction(id, { value, category, company });
  };

  const handleDeleteTransaction = async (id: string) => {
    await deleteTransaction(id);
  };

  const handleGoalChange = async (newGoal: number) => {
    await updateGoal(newGoal);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
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

  // Mostrar loading se ainda estiver carregando
  if (transactionsLoading || goalLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-montserrat">Carregando seus dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center pt-2 sm:pt-4 pb-2 gap-4">
        <div className="text-center sm:text-left flex-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-orbitron font-bold text-foreground mb-1 sm:mb-2">
            MOTO<span className="text-primary">LUCRO</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-montserrat">
            Controle financeiro para motoboys
          </p>
        </div>
        
        {/* User Info & Logout */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <div className="text-center sm:text-right">
            <p className="text-xs sm:text-sm font-montserrat text-foreground">
              Olá, <span className="font-semibold">{user?.user_metadata?.name || user?.email}</span>
            </p>
            <p className="text-xs text-muted-foreground font-montserrat hidden sm:block">
              {user?.email}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </div>

      {/* Estatísticas Diárias e Mensais */}
      <DailyMonthlyStats
        todayGains={todayGains}
        monthGains={monthGains}
        todayExpenses={todayExpenses}
        monthExpenses={monthExpenses}
      />

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <FinanceCard
          title="Ganhos Totais"
          value={totalGains}
          type="gain"
          icon="💰"
          onClick={() => setIsGainsModalOpen(true)}
        />
        <FinanceCard
          title="Despesas Totais"
          value={totalExpenses}
          type="expense"
          icon="💸"
          onClick={() => setIsExpensesModalOpen(true)}
        />
        <FinanceCard
          title="Lucro Líquido"
          value={netProfit}
          type="profit"
          icon="🚀"
        />
      </div>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <QuickAction
          title="Adicionar Valor"
          type="gain"
          icon="🏍️"
          onAdd={(value, category, company) => handleAddTransaction(value, "gain", category, company)}
          companies={["Uber Moto", "99 Moto", "iFood", "Rappi", "Outros"]}
        />
        <QuickAction
          title="Registrar Despesa"
          type="expense"
          icon="🛠️"
          onAdd={(value, category) => handleAddTransaction(value, "expense", category)}
          categories={["Combustível", "Manutenção", "Outros"]}
        />
      </div>

      {/* Meta de Reserva */}
      <GoalCard
        currentAmount={Math.max(0, netProfit)}
        goalAmount={goalAmount}
        onGoalChange={handleGoalChange}
      />

      {/* Histórico de Transações */}
      {transactions.length > 0 && (
        <TransactionList
          transactions={transactions}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
        />
      )}

      {/* Gráfico de Evolução Mensal */}
      {transactions.length > 0 && (
        <MonthlyChart 
          transactions={transactions} 
          dateFilter={dateFilter}
          startDate={startDate}
          endDate={endDate}
        />
      )}

      {/* Modais */}
      <TransactionModal
        isOpen={isGainsModalOpen}
        onClose={() => setIsGainsModalOpen(false)}
        transactions={transactions}
        type="gain"
        title="Histórico de Ganhos"
      />
      
      <TransactionModal
        isOpen={isExpensesModalOpen}
        onClose={() => setIsExpensesModalOpen(false)}
        transactions={transactions}
        type="expense"
        title="Histórico de Despesas"
      />
    </div>
  );
};

export default Index;
