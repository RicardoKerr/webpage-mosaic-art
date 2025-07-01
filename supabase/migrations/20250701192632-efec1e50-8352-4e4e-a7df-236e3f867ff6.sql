
-- Criar políticas RLS para a tabela aralogo_auth para permitir autenticação customizada

-- Política para permitir SELECT (necessário para login)
CREATE POLICY "Permitir consulta para autenticação" 
ON public.aralogo_auth 
FOR SELECT 
USING (true);

-- Política para permitir INSERT (necessário para registro)
CREATE POLICY "Permitir inserção para registro" 
ON public.aralogo_auth 
FOR INSERT 
WITH CHECK (true);

-- Política para permitir UPDATE (necessário para admin gerenciar status)
CREATE POLICY "Permitir atualização para gerenciamento" 
ON public.aralogo_auth 
FOR UPDATE 
USING (true);

-- Comentários explicativos
COMMENT ON POLICY "Permitir consulta para autenticação" ON public.aralogo_auth IS 'Permite que usuários façam login verificando credenciais';
COMMENT ON POLICY "Permitir inserção para registro" ON public.aralogo_auth IS 'Permite que novos usuários se registrem no sistema';
COMMENT ON POLICY "Permitir atualização para gerenciamento" ON public.aralogo_auth IS 'Permite atualizações de status e dados de usuários';
