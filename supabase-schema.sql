-- Schema para o MotoLucro
-- Execute este SQL no Supabase SQL Editor

-- Tabela de usuários (extensão da auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  goal_amount DECIMAL(10,2) DEFAULT 300.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de transações
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  value DECIMAL(10,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('gain', 'expense')),
  category TEXT,
  company TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) - Políticas de segurança
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Política para usuários (cada usuário só vê seus próprios dados)
CREATE POLICY "Users can view own data" ON public.users
    FOR ALL USING (auth.uid() = id);

-- Política para transações (cada usuário só vê suas próprias transações)
CREATE POLICY "Users can view own transactions" ON public.transactions
    FOR ALL USING (auth.uid() = user_id);

-- Função para criar perfil de usuário automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Configurações de autenticação
-- IMPORTANTE: Configure as seguintes opções no dashboard do Supabase:
-- 1. Vá em Authentication > Settings
-- 2. Habilite "Enable email confirmations"
-- 3. Configure "Site URL" para sua aplicação
-- 4. Personalize os templates de email em "Email Templates"
-- 5. Configure SMTP se necessário em "SMTP Settings"

-- Exemplo de configuração via SQL (opcional - use o dashboard):
-- ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can view own profile" ON auth.users FOR SELECT USING (auth.uid() = id);
