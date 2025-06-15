
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

const ADMIN_EMAIL = 'admin@techsolutions.com';

export const useUserAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSessionAndApproval = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        setLoading(false);
        return;
      }
      
      if (session.user.email === ADMIN_EMAIL) {
        setUser(session.user);
        setLoading(false);
        return;
      }

      // @ts-ignore - This table is not in the generated types yet because the migration has not been run
      const { data: approvalData, error } = await supabase
        .from('user_approvals')
        .select('status')
        .eq('user_id', session.user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
          // This will catch if the table doesn't exist yet for non-admin users
          console.error("Error checking approval status", error);
          toast({ title: 'Aguardando Aprovação', description: 'Sua conta precisa ser aprovada por um administrador.', variant: 'default' });
          navigate('/awaiting-approval');
      } else if (approvalData?.status === 'approved') {
        setUser(session.user);
      } else {
        navigate('/awaiting-approval');
      }
      setLoading(false);
    };
    
    checkSessionAndApproval();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') {
            navigate('/auth');
        } else if (event === 'SIGNED_IN' && session) {
            checkSessionAndApproval();
        }
    });

    return () => {
        authListener.subscription.unsubscribe();
    };

  }, [navigate, toast]);

  return { user, loading };
};
