
import { useUserAuth } from '@/hooks/useUserAuth';
import React from 'react';
import { useToast } from '@/hooks/use-toast';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useUserAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><div>Carregando...</div></div>;
    }

    if (!user) {
        return null;
    }

    return <>{children}</>;
}

export default ProtectedRoute;
