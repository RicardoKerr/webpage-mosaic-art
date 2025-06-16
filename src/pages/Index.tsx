import React from 'react';
import { ArrowRight, Code, Laptop, Users, Zap, Database, Upload, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
const Index = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                Natural Stones
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Catalog</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 max-w-xl">
            </p>
              <div className="mt-10 flex items-center gap-x-6">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105" onClick={() => navigate('/viewer')}>
                  View Catalog
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <img src="/lovable-uploads/14b3e1d0-8f04-4112-a939-ede0d6ad3f58.png" alt="Natural marble texture" className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300" />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {/* REMOVIDO: Seção de funcionalidades administradoras
       <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Main Features
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Everything you need to manage your natural stone catalog
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col items-center text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 p-3 mb-6">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <dt className="text-xl font-semibold leading-7 text-gray-900">
                  Bulk Upload
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Upload hundreds of images at once. System supports multiple formats.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col items-center text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className="rounded-lg bg-gradient-to-r from-green-500 to-teal-500 p-3 mb-6">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <dt className="text-xl font-semibold leading-7 text-gray-900">
                  Database
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Store all technical specifications with complete Supabase integration.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col items-center text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className="rounded-lg bg-gradient-to-r from-orange-500 to-red-500 p-3 mb-6">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <dt className="text-xl font-semibold leading-7 text-gray-900">
                  Professional Visualization
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Elegant interface to present your catalog to clients.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
       </section>
       */}

      {/* Gallery Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Natural Stones Examples</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              See some examples of textures you can catalog
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="aspect-square overflow-hidden">
                <img src="/lovable-uploads/14b3e1d0-8f04-4112-a939-ede0d6ad3f58.png" alt="Marble with golden veins" className="object-cover w-full h-full hover:scale-110 transition-transform duration-300" />
              </div>
              <CardHeader>
                <CardTitle className="text-sm">Classic Stones</CardTitle>
                <CardDescription className="text-xs">
                  Natural veins in golden tones
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="aspect-square overflow-hidden">
                <img src="/lovable-uploads/8c6ffb9e-aae1-4b77-bccf-0d00024f5aff.png" alt="Textured marble" className="object-cover w-full h-full hover:scale-110 transition-transform duration-300" />
              </div>
              <CardHeader>
                <CardTitle className="text-sm">Textured Stones</CardTitle>
                <CardDescription className="text-xs">
                  Natural surface with relief
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="aspect-square overflow-hidden">
                <img src="/lovable-uploads/4b24d0c6-d562-46ec-8bc4-7ebfa01a9a49.png" alt="Multicolored marble" className="object-cover w-full h-full hover:scale-110 transition-transform duration-300" />
              </div>
              <CardHeader>
                <CardTitle className="text-sm">Multicolor Stones</CardTitle>
                <CardDescription className="text-xs">
                  Varied and unique tones
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="aspect-square overflow-hidden">
                <img src="/lovable-uploads/ab956562-5b10-4384-9d89-cf0616450602.png" alt="Green marble" className="object-cover w-full h-full hover:scale-110 transition-transform duration-300" />
              </div>
              <CardHeader>
                <CardTitle className="text-sm">Green Stones</CardTitle>
                <CardDescription className="text-xs">
                  Natural green tones
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
            Ready to view our catalog?
          </h2>
          <p className="mt-6 text-lg leading-8 text-blue-100 max-w-2xl mx-auto">
            Explore our complete collection of natural stones.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 transition-all duration-300 transform hover:scale-105" onClick={() => navigate('/viewer')}>
              <Eye className="mr-2 h-4 w-4" />
              View Catalog
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Rakewells LTDA
              </h3>
              <p className="mt-4 text-gray-400 max-w-md">
                Transforming ideas into innovative digital solutions. 
                Your trusted partner in the technology world.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 Rakewells LTDA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;
