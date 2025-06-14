
import React from 'react';
import { ArrowRight, Code, Laptop, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                Transforme suas
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> ideias</span> em realidade
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 max-w-xl">
                Desenvolvemos soluções tecnológicas inovadoras que impulsionam seu negócio para o futuro. 
                Junte-se a centenas de empresas que confiam em nossa expertise.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                  Começar agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="hover:bg-gray-50 transition-all duration-300">
                  Saiba mais
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&h=600"
                alt="Código colorido em monitor"
                className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Por que escolher nossa plataforma?
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Oferecemos as melhores ferramentas e tecnologias para acelerar seu crescimento
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col items-center text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 p-3 mb-6">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <dt className="text-xl font-semibold leading-7 text-gray-900">
                  Desenvolvimento Ágil
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Metodologias modernas para entregas rápidas e eficientes, garantindo qualidade em cada etapa.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col items-center text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className="rounded-lg bg-gradient-to-r from-green-500 to-teal-500 p-3 mb-6">
                  <Laptop className="h-6 w-6 text-white" />
                </div>
                <dt className="text-xl font-semibold leading-7 text-gray-900">
                  Tecnologia Avançada
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Utilizamos as mais recentes tecnologias para criar soluções robustas e escaláveis.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col items-center text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className="rounded-lg bg-gradient-to-r from-orange-500 to-red-500 p-3 mb-6">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <dt className="text-xl font-semibold leading-7 text-gray-900">
                  Suporte Dedicado
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Equipe especializada disponível para ajudar você a alcançar seus objetivos.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Nosso trabalho em ação
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Veja alguns exemplos do que podemos criar juntos
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="aspect-video overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&h=400"
                  alt="Laptop moderno"
                  className="object-cover w-full h-full hover:scale-110 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <CardTitle>Desenvolvimento Web</CardTitle>
                <CardDescription>
                  Criamos websites modernos e responsivos que convertem visitantes em clientes.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="aspect-video overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=600&h=400"
                  alt="Mulher trabalhando com laptop"
                  className="object-cover w-full h-full hover:scale-110 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <CardTitle>Consultoria Digital</CardTitle>
                <CardDescription>
                  Orientamos sua estratégia digital para maximizar resultados e ROI.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="aspect-video overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=600&h=400"
                  alt="Telas digitais interativas"
                  className="object-cover w-full h-full hover:scale-110 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <CardTitle>Soluções Interativas</CardTitle>
                <CardDescription>
                  Experiências digitais imersivas que engajam e impressionam seus usuários.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Pronto para começar seu projeto?
          </h2>
          <p className="mt-6 text-lg leading-8 text-blue-100 max-w-2xl mx-auto">
            Entre em contato conosco hoje e vamos transformar sua visão em uma solução digital de sucesso.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
              <Zap className="mr-2 h-4 w-4" />
              Iniciar projeto
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300">
              Falar com especialista
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                TechSolutions
              </h3>
              <p className="mt-4 text-gray-400 max-w-md">
                Transformando ideias em soluções digitais inovadoras. 
                Sua parceira de confiança no mundo da tecnologia.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Serviços</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">Desenvolvimento Web</li>
                <li className="hover:text-white transition-colors cursor-pointer">Apps Mobile</li>
                <li className="hover:text-white transition-colors cursor-pointer">Consultoria Digital</li>
                <li className="hover:text-white transition-colors cursor-pointer">Design UX/UI</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contato</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">contato@techsolutions.com</li>
                <li className="hover:text-white transition-colors cursor-pointer">+55 11 9999-9999</li>
                <li className="hover:text-white transition-colors cursor-pointer">São Paulo, SP</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 TechSolutions. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
