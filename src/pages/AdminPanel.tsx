import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { 
  Shield, 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Edit,
  Ban,
  CheckCircle,
  LogOut,
  Search,
  Filter,
  RefreshCw
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { fetchUsersWithStats, fetchUsersSimple, fetchUserTransactions } from "@/components/AdminDataFetcher";

interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  goal_amount: number;
  created_at: string;
  updated_at: string;
  is_suspended: boolean;
  transactions_count: number;
  total_gains: number;
  total_expenses: number;
  net_profit: number;
  days_active: number;
}

const AdminPanel = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "suspended">("all");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Verificar se é admin
  useEffect(() => {
    const adminSession = localStorage.getItem("adminSession");
    const adminLoginTime = localStorage.getItem("adminLoginTime");
    
    if (!adminSession || !adminLoginTime) {
      navigate("/admin-admin");
      return;
    }

    // Verificar se a sessão não expirou (24 horas)
    const loginTime = new Date(adminLoginTime);
    const now = new Date();
    const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
      localStorage.removeItem("adminSession");
      localStorage.removeItem("adminLoginTime");
      navigate("/admin-admin");
      return;
    }

    testSupabaseConnection();
  }, [navigate]);

  const testSupabaseConnection = async () => {
    try {
      // Teste básico de conexão
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      if (error) {
        toast({
          title: "Erro de Conexão",
          description: `Não foi possível conectar ao banco de dados: ${error.message}`,
          variant: "destructive",
        });
        return;
      }
      
      fetchUsers();
    } catch (error) {
      toast({
        title: "Erro de Conexão",
        description: "Erro inesperado ao conectar com o banco de dados.",
        variant: "destructive",
      });
    }
  };

  const fetchUsers = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      // Buscar usuários
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) {
        toast({
          title: "Erro ao buscar usuários",
          description: `Erro: ${usersError.message}`,
          variant: "destructive",
        });
        return;
      }

      if (!usersData || usersData.length === 0) {
        setUsers([]);
        return;
      }

      // Processar usuários com dados básicos
      const usersWithBasicStats: User[] = usersData.map(user => ({
        ...user,
        transactions_count: 0,
        total_gains: 0,
        total_expenses: 0,
        net_profit: 0,
        days_active: 0,
        is_suspended: user.is_suspended || false
      }));

      setUsers(usersWithBasicStats);

      // Buscar transações em background para estatísticas
      setTimeout(async () => {
        try {
          const usersWithFullStats: User[] = [];
          
          for (const user of usersData) {
            try {
              const transactions = await fetchUserTransactions(user.id);
              
              // Calcular estatísticas
              const gains = transactions.filter(t => t.type === 'gain');
              const expenses = transactions.filter(t => t.type === 'expense');
              
              const totalGains = gains.reduce((sum, t) => sum + parseFloat(t.value || 0), 0);
              const totalExpenses = expenses.reduce((sum, t) => sum + parseFloat(t.value || 0), 0);
              const netProfit = totalGains - totalExpenses;

              // Calcular dias ativos (últimos 30 dias)
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
              
              const recentTransactions = transactions.filter(t => 
                new Date(t.date) >= thirtyDaysAgo
              );
              
              const uniqueDays = new Set(
                recentTransactions.map(t => 
                  new Date(t.date).toDateString()
                )
              ).size;

              usersWithFullStats.push({
                ...user,
                transactions_count: transactions.length,
                total_gains: totalGains,
                total_expenses: totalExpenses,
                net_profit: netProfit,
                days_active: uniqueDays,
                is_suspended: user.is_suspended || false
              });
            } catch (error) {
              usersWithFullStats.push({
                ...user,
                transactions_count: 0,
                total_gains: 0,
                total_expenses: 0,
                net_profit: 0,
                days_active: 0,
                is_suspended: user.is_suspended || false
              });
            }
          }

          setUsers(usersWithFullStats);
        } catch (error) {
          // Silenciar erro de background
        }
      }, 100);

    } catch (error) {
      toast({
        title: "Erro ao carregar usuários",
        description: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSuspendUser = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_suspended: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: currentStatus ? "Usuário reativado" : "Usuário suspenso",
        description: currentStatus 
          ? "O usuário foi reativado com sucesso." 
          : "O usuário foi suspenso com sucesso.",
      });

      fetchUsers(true); // Recarregar lista (refresh)
    } catch (error) {
      console.error('Erro ao alterar status do usuário:', error);
      toast({
        title: "Erro ao alterar status",
        description: "Não foi possível alterar o status do usuário.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminSession");
    localStorage.removeItem("adminLoginTime");
    navigate("/admin-admin");
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || 
                         (filterStatus === "active" && !user.is_suspended) ||
                         (filterStatus === "suspended" && user.is_suspended);
    
    return matchesSearch && matchesFilter;
  });

  const totalUsers = users.length;
  const activeUsers = users.filter(u => !u.is_suspended).length;
  const suspendedUsers = users.filter(u => u.is_suspended).length;
  const totalRevenue = users.reduce((sum, u) => sum + u.total_gains, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-montserrat">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-primary/20 bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-orbitron font-bold text-foreground">
                  ADMIN<span className="text-primary">PANEL</span>
                </h1>
                <p className="text-muted-foreground font-montserrat">
                  Gerenciamento de usuários
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-primary text-primary hover:bg-primary/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-montserrat text-muted-foreground">
                Total de Usuários
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-orbitron font-bold text-foreground">
                {totalUsers}
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-montserrat text-muted-foreground">
                Usuários Ativos
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-orbitron font-bold text-green-500">
                {activeUsers}
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-montserrat text-muted-foreground">
                Usuários Suspensos
              </CardTitle>
              <Ban className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-orbitron font-bold text-destructive">
                {suspendedUsers}
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-montserrat text-muted-foreground">
                Receita Total
              </CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-orbitron font-bold text-foreground">
                R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-primary/20 mb-6">
          <CardHeader>
            <CardTitle className="font-orbitron text-foreground">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search" className="font-montserrat">Buscar usuário</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-primary/30 focus:border-primary"
                  />
                </div>
              </div>
              <div className="sm:w-56">
                <Label className="font-montserrat">Status</Label>
                <div className="flex gap-1 mt-2 flex-wrap">
                  <Button
                    variant={filterStatus === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("all")}
                    className="text-xs px-2 py-1 h-7"
                  >
                    Todos
                  </Button>
                  <Button
                    variant={filterStatus === "active" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("active")}
                    className="text-xs px-2 py-1 h-7"
                  >
                    Ativos
                  </Button>
                  <Button
                    variant={filterStatus === "suspended" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus("suspended")}
                    className="text-xs px-2 py-1 h-7"
                  >
                    Suspensos
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-orbitron text-foreground">
                Usuários ({filteredUsers.length})
              </CardTitle>
              <div className="flex items-center gap-3">
                {(loading || refreshing) && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-2" />
                    {loading ? 'Carregando...' : 'Atualizando...'}
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchUsers(true)}
                  disabled={loading || refreshing}
                  className="border-primary text-primary hover:bg-primary/10 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Atualizando...' : 'Atualizar'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-primary/20">
                    <th className="text-left py-3 px-4 font-montserrat text-foreground">Usuário</th>
                    <th className="text-left py-3 px-4 font-montserrat text-foreground">Cadastro</th>
                    <th className="text-left py-3 px-4 font-montserrat text-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-montserrat text-foreground">30 Dias</th>
                    <th className="text-left py-3 px-4 font-montserrat text-foreground">Receita</th>
                    <th className="text-left py-3 px-4 font-montserrat text-foreground">Lucro</th>
                    <th className="text-left py-3 px-4 font-montserrat text-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-primary/10 hover:bg-primary/5">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-montserrat font-medium text-foreground">
                            {user.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm font-montserrat text-foreground">
                          {new Date(user.created_at).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(user.created_at).toLocaleTimeString('pt-BR')}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge 
                          variant={user.is_suspended ? "destructive" : "default"}
                          className={user.is_suspended ? "bg-destructive" : "bg-green-500"}
                        >
                          {user.is_suspended ? "Suspenso" : "Ativo"}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm font-montserrat text-foreground">
                          {user.days_active} dias
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {user.transactions_count} transações
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm font-montserrat text-green-500">
                          R$ {user.total_gains.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          R$ {user.total_expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} gastos
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className={`text-sm font-montserrat font-medium ${
                          user.net_profit >= 0 ? 'text-green-500' : 'text-destructive'
                        }`}>
                          R$ {user.net_profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Meta: R$ {user.goal_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuspendUser(user.id, user.is_suspended)}
                            className={user.is_suspended ? "border-green-500 text-green-500 hover:bg-green-500/10" : "border-destructive text-destructive hover:bg-destructive/10"}
                          >
                            {user.is_suspended ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Reativar
                              </>
                            ) : (
                              <>
                                <Ban className="w-3 h-3 mr-1" />
                                Suspender
                              </>
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground font-montserrat">
                    Nenhum usuário encontrado
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
