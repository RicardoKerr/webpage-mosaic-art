
-- Criar tabela aralogo_auth para controle de acesso customizado
CREATE TABLE public.aralogo_auth (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendente',
    is_admin BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar comentários para documentação
COMMENT ON TABLE public.aralogo_auth IS 'Tabela para controle de autenticação customizado do catálogo';
COMMENT ON COLUMN public.aralogo_auth.status IS 'Status do usuário: pendente, aprovado, rejeitado';
COMMENT ON COLUMN public.aralogo_auth.senha IS 'Senha alfanumérica do usuário';
COMMENT ON COLUMN public.aralogo_auth.is_admin IS 'Define se o usuário tem privilégios de administrador';

-- Adicionar trigger para atualizar updated_at
CREATE TRIGGER update_aralogo_auth_updated_at
    BEFORE UPDATE ON public.aralogo_auth
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
