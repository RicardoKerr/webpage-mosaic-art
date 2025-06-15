import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', senha: '' });
  const [signupData, setSignupData] = useState({ email: '', senha: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('aralogo_auth')
        .select('*')
        .eq('email', loginData.email)
        .eq('senha', loginData.senha)
        .single();

      if (error || !data) {
        toast({
          title: "Login error",
          description: "Incorrect email or password.",
          variant: "destructive",
        });
        return;
      }

      if (data.status !== 'aprovado') {
        toast({
          title: "Acesso negado",
          description: data.status === 'pendente' ? 
            "Sua conta está pendente de aprovação." : 
            "Sua conta foi recusada.",
          variant: "destructive",
        });
        return;
      }

      // Save user data to localStorage
      localStorage.setItem('aralogo_user', JSON.stringify({
        id: data.id,
        email: data.email,
        is_admin: data.is_admin,
        status: data.status
      }));

      const userType = data.is_admin ? 'administrador' : 'usuário';
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${userType}! Redirecionando para catálogo.`,
      });

      navigate('/catalog');
    } catch (error) {
      toast({
        title: "Error",
        description: "Unexpected error during login.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('aralogo_auth')
        .insert({
          email: signupData.email,
          senha: signupData.senha,
          status: 'pendente'
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Registration error",
            description: "This email is already registered.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Registration error",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      toast({
        title: "Registration successful!",
        description: "Your account is pending approval. Wait for approval to access the catalog.",
      });

      setSignupData({ email: '', senha: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Unexpected error during registration.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para início
        </Button>

        <div className="flex items-center justify-center">
          <Tabs defaultValue="login" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Registrar-se</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Acesso ao Catálogo</CardTitle>
                  <CardDescription>
                    Entre com suas credenciais para gerenciar o catálogo de pedras.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Input
                        type="email"
                        placeholder="E-mail"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        type="password"
                        placeholder="Senha"
                        value={loginData.senha}
                        onChange={(e) => setLoginData({ ...loginData, senha: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Entrando..." : "Entrar"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Solicitar Acesso</CardTitle>
                  <CardDescription>
                    Cadastre-se para solicitar acesso ao gerenciamento do catálogo.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                      <Input
                        type="email"
                        placeholder="E-mail"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        type="password"
                        placeholder="Senha (apenas letras e números)"
                        value={signupData.senha}
                        onChange={(e) => setSignupData({ ...signupData, senha: e.target.value })}
                        pattern="[A-Za-z0-9]+"
                        title="Use apenas letras e números"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Registrando..." : "Solicitar Acesso"}
                    </Button>
                  </form>
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                      <strong>Atenção:</strong> Após o cadastro, sua conta precisa ser aprovada antes de acessar o catálogo.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
