
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';

const ADMIN_EMAIL = 'admin@techsolutions.com';

export const useAdminAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session || session.user.email !== ADMIN_EMAIL) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
      setLoading(false);
    };

    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT' || (event === 'SIGNED_IN' && session?.user.email !== ADMIN_EMAIL)) {
            navigate('/auth');
        } else if (session) {
            setUser(session.user);
        }
    });

    return () => {
        authListener.subscription.unsubscribe();
    };

  }, [navigate]);

  return { user, loading };
};
