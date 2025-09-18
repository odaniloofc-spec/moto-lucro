-- Políticas de segurança para o painel administrativo
-- Execute este SQL no Supabase SQL Editor

-- 1. Primeiro, vamos verificar se as políticas existem e removê-las se necessário
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;

-- 2. Criar políticas mais permissivas para o painel admin
-- IMPORTANTE: Estas políticas permitem acesso total - use apenas em desenvolvimento
-- Para produção, implemente uma verificação de role mais segura

-- Política para usuários (permitir acesso total temporariamente)
CREATE POLICY "Allow all access to users" ON public.users
    FOR ALL USING (true);

-- Política para transações (permitir acesso total temporariamente)
CREATE POLICY "Allow all access to transactions" ON public.transactions
    FOR ALL USING (true);

-- 3. Alternativa mais segura (descomente se quiser usar):
-- Substitua 'SEU_USER_ID_ADMIN' pelo ID do usuário admin
-- CREATE POLICY "Admin can manage all users" ON public.users
--     FOR ALL USING (auth.uid() = 'SEU_USER_ID_ADMIN'::uuid);
-- 
-- CREATE POLICY "Admin can manage all transactions" ON public.transactions
--     FOR ALL USING (auth.uid() = 'SEU_USER_ID_ADMIN'::uuid);

-- 4. Verificar se as políticas foram criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'transactions');

-- 5. Teste de acesso (opcional)
-- SELECT COUNT(*) as total_users FROM public.users;
-- SELECT COUNT(*) as total_transactions FROM public.transactions;
