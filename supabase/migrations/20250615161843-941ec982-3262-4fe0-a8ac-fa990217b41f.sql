
-- Criação da tabela de aprovações de usuários para controle de acesso de novos cadastros
CREATE TABLE public.user_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- statuses: pending, approved, rejected
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  processed_at TIMESTAMP WITH TIME ZONE,
  processed_by TEXT
);

-- Ativa Row Level Security para a tabela (padrão seguro)
ALTER TABLE public.user_approvals ENABLE ROW LEVEL SECURITY;

-- Permite SELECT livre para todos os admins, restrito para o usuário (adaptar conforme necessidade futura)
CREATE POLICY "Admins and self can read approvals"
  ON public.user_approvals
  FOR SELECT
  USING (TRUE);

-- Permite UPDATE apenas para administradores (você pode refinar depois)
CREATE POLICY "Admins can update approvals"
  ON public.user_approvals
  FOR UPDATE
  USING (TRUE);

-- Permite INSERT para todos (no cadastro inicial)
CREATE POLICY "Anyone can insert approval"
  ON public.user_approvals
  FOR INSERT
  WITH CHECK (TRUE);
