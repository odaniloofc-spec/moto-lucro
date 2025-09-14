import { useState, useEffect } from 'react';
import { supabase, Transaction } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Carregar transações do Supabase
  const loadTransactions = async () => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      // Converter strings de data para objetos Date
      const formattedData = data?.map(transaction => ({
        ...transaction,
        date: new Date(transaction.date)
      })) || [];

      setTransactions(formattedData);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as transações do servidor.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Adicionar nova transação
  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para adicionar transações.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          ...transaction,
          user_id: user.id,
          date: transaction.date.toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      // Adicionar à lista local
      const newTransaction = {
        ...data,
        date: new Date(data.date)
      };
      setTransactions(prev => [newTransaction, ...prev]);

      toast({
        title: transaction.type === "gain" ? "Lucro adicionado!" : "Despesa registrada!",
        description: `${transaction.type === "gain" ? "Ganho" : "Gasto"} de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transaction.value)} ${transaction.company ? `(${transaction.company})` : ""} ${transaction.category ? `- ${transaction.category}` : ""}`,
      });

      return newTransaction;
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a transação.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Editar transação
  const editTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update({
          ...updates,
          date: updates.date ? updates.date.toISOString() : undefined,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Atualizar na lista local
      const updatedTransaction = {
        ...data,
        date: new Date(data.date)
      };
      setTransactions(prev => prev.map(t => t.id === id ? updatedTransaction : t));

      toast({
        title: "Transação editada!",
        description: "A transação foi atualizada com sucesso.",
      });

      return updatedTransaction;
    } catch (error) {
      console.error('Erro ao editar transação:', error);
      toast({
        title: "Erro ao editar",
        description: "Não foi possível editar a transação.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Excluir transação
  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Remover da lista local
      setTransactions(prev => prev.filter(t => t.id !== id));

      toast({
        title: "Transação excluída!",
        description: "A transação foi removida com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a transação.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Carregar transações na inicialização e quando o usuário mudar
  useEffect(() => {
    loadTransactions();
  }, [user]);

  return {
    transactions,
    loading,
    addTransaction,
    editTransaction,
    deleteTransaction,
    refreshTransactions: loadTransactions
  };
};
