
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Hourglass } from "lucide-react";

const AwaitingApproval = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/auth');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card className="w-[400px] text-center p-4">
                <CardHeader>
                    <div className="mx-auto bg-yellow-100 rounded-full p-3 w-fit mb-4">
                        <Hourglass className="w-8 h-8 text-yellow-600" />
                    </div>
                    <CardTitle className="mt-4">Aguardando Aprovação</CardTitle>
                    <CardDescription>
                        Sua conta foi criada e está pendente de aprovação por um administrador.
                        Você será notificado por e-mail quando sua conta for aprovada. Se tiver urgência, entre em contato.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleLogout} className="w-full">Voltar para o Login</Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default AwaitingApproval;
