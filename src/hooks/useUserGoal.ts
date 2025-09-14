import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const useUserGoal = () => {
  const [goalAmount, setGoalAmount] = useState(300);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Carregar meta do usuário
  const loadUserGoal = async () => {
    if (!user) {
      setGoalAmount(300);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('goal_amount')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setGoalAmount(data?.goal_amount || 300);
    } catch (error) {
      console.error('Erro ao carregar meta:', error);
      setGoalAmount(300); // Valor padrão
    } finally {
      setLoading(false);
    }
  };

  // Atualizar meta do usuário
  const updateGoal = async (newGoal: number) => {
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para atualizar a meta.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({ goal_amount: newGoal })
        .eq('id', user.id);

      if (error) throw error;

      setGoalAmount(newGoal);
      toast({
        title: "Meta atualizada!",
        description: `Sua meta foi alterada para ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(newGoal)}`,
      });
    } catch (error) {
      console.error('Erro ao atualizar meta:', error);
      toast({
        title: "Erro ao atualizar meta",
        description: "Não foi possível atualizar sua meta.",
        variant: "destructive",
      });
    }
  };

  // Carregar meta na inicialização e quando o usuário mudar
  useEffect(() => {
    loadUserGoal();
  }, [user]);

  return {
    goalAmount,
    loading,
    updateGoal,
  };
};
