import { supabase } from '@/lib/supabase';

// Função para buscar dados usando RPC (Remote Procedure Call)
// Isso contorna as limitações do RLS
export const fetchUsersWithStats = async () => {
  try {
    console.log('🔍 Buscando dados via RPC...');
    
    // Primeiro, vamos tentar uma abordagem direta
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select(`
        *,
        transactions (
          id,
          value,
          type,
          date,
          category,
          company
        )
      `);

    if (usersError) {
      console.error('❌ Erro na query com join:', usersError);
      throw usersError;
    }

    console.log('✅ Dados carregados:', users?.length || 0);

    // Processar os dados
    const processedUsers = users?.map(user => {
      const transactions = user.transactions || [];
      
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

      return {
        ...user,
        transactions_count: transactions.length,
        total_gains: totalGains,
        total_expenses: totalExpenses,
        net_profit: netProfit,
        days_active: uniqueDays,
        is_suspended: user.is_suspended || false
      };
    }) || [];

    return processedUsers;
  } catch (error) {
    console.error('❌ Erro ao buscar dados:', error);
    throw error;
  }
};

// Função alternativa usando query simples
export const fetchUsersSimple = async () => {
  try {
    console.log('🔍 Buscando usuários (método simples)...');
    
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Erro ao buscar usuários:', error);
      throw error;
    }

    console.log('✅ Usuários encontrados:', users?.length || 0);
    return users || [];
  } catch (error) {
    console.error('❌ Erro na busca simples:', error);
    throw error;
  }
};

// Função para buscar transações de um usuário específico
export const fetchUserTransactions = async (userId: string) => {
  try {
    console.log(`🔍 Buscando transações para usuário: ${userId}`);
    
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error(`❌ Erro ao buscar transações para ${userId}:`, error);
      return [];
    }

    console.log(`✅ Transações encontradas: ${transactions?.length || 0}`);
    return transactions || [];
  } catch (error) {
    console.error(`❌ Erro na busca de transações:`, error);
    return [];
  }
};
