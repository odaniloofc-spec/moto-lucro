-- Atualização do schema para adicionar funcionalidades de admin
-- Execute este SQL no Supabase SQL Editor se a tabela users já existir

-- Adicionar coluna is_suspended se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'is_suspended'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.users ADD COLUMN is_suspended BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Criar política para admin acessar todos os usuários
-- IMPORTANTE: Substitua 'SEU_USER_ID_ADMIN' pelo ID do usuário admin no Supabase
-- Você pode encontrar o ID do usuário admin em Authentication > Users no dashboard

-- Exemplo de política (descomente e ajuste o ID):
-- CREATE POLICY "Admin can manage all users" ON public.users
--     FOR ALL USING (auth.uid() = 'SEU_USER_ID_ADMIN'::uuid);

-- Alternativa: Política mais flexível para desenvolvimento
-- (CUIDADO: Use apenas em desenvolvimento, não em produção)
-- CREATE POLICY "Allow all for admin panel" ON public.users
--     FOR ALL USING (true);

-- Para produção, use uma abordagem mais segura:
-- 1. Crie um usuário admin específico
-- 2. Use o ID desse usuário na política
-- 3. Ou implemente verificação de role no código da aplicação
