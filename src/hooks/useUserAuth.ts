
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

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

      const { data: approvalData, error } = await supabase
        .from('user_approvals')
        .select('status')
        .eq('user_id', session.user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
          console.error("Error checking approval status", error);
          toast({ title: 'Erro', description: 'Não foi possível verificar seu status de aprovação.', variant: 'destructive' });
          navigate('/auth');
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
            // Re-check on sign-in event to handle token refresh after email confirmation
            checkSessionAndApproval();
        }
    });

    return () => {
        authListener.subscription.unsubscribe();
    };

  }, [navigate]);

  return { user, loading };
};
