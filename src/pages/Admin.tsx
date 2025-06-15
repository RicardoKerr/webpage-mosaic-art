import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Approval = {
    id: string;
    user_id: string;
    email: string;
    status: 'pending' | 'approved' | 'rejected';
    requested_at: string;
};

const Admin = () => {
    const { user, loading: authLoading } = useAdminAuth();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const { data: approvals, isLoading: approvalsLoading } = useQuery({
        queryKey: ['approvals'],
        queryFn: async () => {
            // @ts-ignore
            const { data, error } = await supabase
                .from('user_approvals')
                .select('*')
                .order('requested_at', { ascending: true });
            if (error) throw new Error(error.message);
            return data as Approval[];
        },
        enabled: !!user,
    });
    
    const mutation = useMutation({
        mutationFn: async ({ id, status }: { id: string, status: 'approved' | 'rejected' }) => {
            // @ts-ignore
            const { error } = await supabase
                .from('user_approvals')
                .update({ status, processed_at: new Date().toISOString(), processed_by: user?.email })
                .eq('id', id);
            if (error) throw new Error(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['approvals'] });
            toast({ title: 'Sucesso', description: 'Status do usuário atualizado.' });
        },
        onError: (error) => {
            toast({ title: 'Erro', description: error.message, variant: 'destructive' });
        }
    });

    if (authLoading || !user) {
        return <div className="flex justify-center items-center h-screen"><div>Carregando...</div></div>;
    }

    const getStatusVariant = (status: Approval['status']) => {
        switch (status) {
            case 'approved': return 'default';
            case 'rejected': return 'destructive';
            case 'pending': return 'secondary';
            default: return 'default';
        }
    }

    return (
        <div className="p-4 md:p-8 min-h-screen bg-gray-50">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-8 h-8 text-blue-600"/>
                    <h1 className="text-3xl font-bold">Painel do Administrador</h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">{user.email}</span>
                    <Button variant="outline" size="sm" onClick={() => supabase.auth.signOut()}>
                        <LogOut className="mr-2" />
                        Sair
                    </Button>
                </div>
            </header>

            <h2 className="text-2xl font-semibold mb-4">Solicitações de Acesso</h2>
            <div className="bg-white rounded-lg shadow">
                {approvalsLoading ? (
                    <p className="p-4">Carregando solicitações...</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Email</TableHead>
                                <TableHead>Data da Solicitação</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {approvals?.map((approval) => (
                                <TableRow key={approval.id}>
                                    <TableCell className="font-medium">{approval.email}</TableCell>
                                    <TableCell>{new Date(approval.requested_at).toLocaleString()}</TableCell>
                                    <TableCell><Badge variant={getStatusVariant(approval.status)}>{approval.status}</Badge></TableCell>
                                    <TableCell className="text-right space-x-2">
                                        {approval.status === 'pending' && (
                                            <>
                                                <Button size="sm" onClick={() => mutation.mutate({ id: approval.id, status: 'approved' })}>Aprovar</Button>
                                                <Button size="sm" variant="destructive" onClick={() => mutation.mutate({ id: approval.id, status: 'rejected' })}>Rejeitar</Button>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
};

export default Admin;
