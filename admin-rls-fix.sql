-- Script para corrigir políticas RLS do painel admin
-- Execute este script no SQL Editor do Supabase

-- 1. Primeiro, vamos verificar as políticas atuais
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'transactions');

-- 2. Remover políticas existentes que podem estar bloqueando
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Allow all access to users" ON public.users;
DROP POLICY IF EXISTS "Allow all access to transactions" ON public.transactions;

-- 3. Criar políticas temporárias para o painel admin (ATENÇÃO: APENAS PARA DESENVOLVIMENTO)
-- Em produção, você deve usar políticas mais restritivas baseadas em roles

-- Política para usuários - permitir todas as operações
CREATE POLICY "Admin access to users" ON public.users
    FOR ALL USING (true) WITH CHECK (true);

-- Política para transações - permitir todas as operações  
CREATE POLICY "Admin access to transactions" ON public.transactions
    FOR ALL USING (true) WITH CHECK (true);

-- 4. Verificar se as tabelas existem e têm as colunas necessárias
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;

SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'transactions'
ORDER BY ordinal_position;

-- 5. Adicionar coluna is_suspended se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' 
                   AND table_name='users' 
                   AND column_name='is_suspended') THEN
        ALTER TABLE public.users ADD COLUMN is_suspended BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- 6. Verificar se há dados nas tabelas
SELECT COUNT(*) as total_users FROM public.users;
SELECT COUNT(*) as total_transactions FROM public.transactions;

-- 7. Teste de query simples
SELECT id, email, name, created_at, is_suspended 
FROM public.users 
LIMIT 5;

SELECT id, user_id, value, type, date, category, company 
FROM public.transactions 
LIMIT 5;
