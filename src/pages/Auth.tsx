
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

type FormValues = z.infer<typeof formSchema>;

const ADMIN_EMAIL = 'admin@techsolutions.com';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const checkApprovalAndRedirect = async (userId: string, isLoginAttempt: boolean) => {
    const { data: approvalData, error: approvalError } = await supabase
      .from<any>('user_approvals')
      .select('status')
      .eq('user_id', userId)
      .maybeSingle();

    if (approvalError) {
      toast({
        title: "Aguardando Aprovação",
        description: "Sua conta precisa ser aprovada por um administrador.",
        variant: "default",
      });
      if (isLoginAttempt) await supabase.auth.signOut();
      navigate('/awaiting-approval');
      return;
    }

    if (approvalData && approvalData.status === 'approved') {
        if (isLoginAttempt) {
             toast({ title: "Login bem-sucedido!", description: "Redirecionando para o catálogo." });
        }
        navigate('/catalog');
    } else {
        if (isLoginAttempt) {
            toast({ title: 'Aguardando Aprovação', description: 'Sua conta precisa ser aprovada por um administrador.' });
            await supabase.auth.signOut();
        }
        navigate('/awaiting-approval');
    }
  }

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          if (session.user.email === ADMIN_EMAIL) {
            navigate('/admin');
          } else {
            checkApprovalAndRedirect(session.user.id, false);
          }
        }
      }
    );
    return () => authListener.subscription.unsubscribe();
  }, [navigate]);

  const handleLogin: SubmitHandler<FormValues> = async ({ email, password }) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({
        title: "Erro no login",
        description: "Verifique seu e-mail e senha.",
        variant: "destructive",
      });
    } else if (data.user) {
      if (data.user.email === ADMIN_EMAIL) {
        navigate('/admin');
      } else {
        await checkApprovalAndRedirect(data.user.id, true);
      }
    }
    setLoading(false);
  };

  const handleSignUp: SubmitHandler<FormValues> = async ({ email, password }) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth`,
      },
    });
    if (error) {
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Verifique seu email para confirmar a conta. Sua conta aguarda aprovação do administrador.",
      });
      form.reset();
    }
    setLoading(false);
  };
  
  const renderForm = (isLogin: boolean) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(isLogin ? handleLogin : handleSignUp)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="seu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Carregando..." : (isLogin ? "Entrar" : "Cadastrar")}
        </Button>
      </form>
    </Form>
  )

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Entrar</TabsTrigger>
          <TabsTrigger value="signup">Cadastrar</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Acesse sua conta para gerenciar o catálogo.</CardDescription>
            </CardHeader>
            <CardContent>
              {renderForm(true)}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Cadastro</CardTitle>
              <CardDescription>Crie uma conta para começar a gerenciar.</CardDescription>
            </CardHeader>
            <CardContent>
              {renderForm(false)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Auth;
