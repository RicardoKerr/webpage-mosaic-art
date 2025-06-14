
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Edit, Trash2, Plus, Upload } from 'lucide-react';

// Estrutura dos dados da pedra baseada no HTML
interface Stone {
  id: string;
  name: string;
  category: string;
  rock_type: string;
  finishes: string;
  available_in: string;
  base_color: string;
  characteristics: string;
  image_filename: string;
  image_url?: string;
}

const Catalog = () => {
  const [stones, setStones] = useState<Stone[]>([]);
  const [selectedStone, setSelectedStone] = useState<Stone | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const form = useForm<Stone>({
    defaultValues: {
      name: '',
      category: 'Noble Stones',
      rock_type: 'Marble',
      finishes: 'Polished, Honed',
      available_in: 'Slab',
      base_color: '',
      characteristics: '',
      image_filename: ''
    }
  });

  const onSubmit = (data: Stone) => {
    if (selectedStone) {
      // Editar pedra existente
      setStones(stones.map(stone => 
        stone.id === selectedStone.id ? { ...data, id: selectedStone.id } : stone
      ));
    } else {
      // Adicionar nova pedra
      const newStone = { ...data, id: Date.now().toString() };
      setStones([...stones, newStone]);
    }
    setIsDialogOpen(false);
    setSelectedStone(null);
    form.reset();
  };

  const editStone = (stone: Stone) => {
    setSelectedStone(stone);
    form.reset(stone);
    setIsDialogOpen(true);
  };

  const deleteStone = (id: string) => {
    setStones(stones.filter(stone => stone.id !== id));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // Aqui implementaremos o upload em lote quando Supabase estiver conectado
      console.log('Arquivos selecionados:', files.length);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Catálogo de Pedras Naturais
          </h1>
          <p className="text-gray-600">
            Gerencie seu catálogo de pedras naturais com upload em lote
          </p>
        </div>

        {/* Botões de ação */}
        <div className="flex gap-4 mb-6">
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Upload className="mr-2 h-4 w-4" />
                Upload em Lote
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload em Lote de Imagens</DialogTitle>
                <DialogDescription>
                  Selecione múltiplas imagens para upload. Os nomes dos arquivos devem seguir o padrão: image_1.jpeg, image_2.png, etc.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
                <p className="text-sm text-gray-500">
                  Formatos aceitos: .jpeg, .jpg, .png, .webp
                </p>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setSelectedStone(null); form.reset(); }}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Pedra
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedStone ? 'Editar Pedra' : 'Nova Pedra'}
                </DialogTitle>
                <DialogDescription>
                  Preencha as informações da pedra natural
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da Pedra</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Âmbar Deserto" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoria</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Noble Stones" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="rock_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Rocha</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Marble" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="finishes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Acabamentos</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Polished, Honed" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="available_in"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Disponível em</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Slab" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="base_color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cor Base</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Beige/Brown" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="characteristics"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Características</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva as características da pedra..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="image_filename"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Arquivo de Imagem</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: image_1.jpeg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {selectedStone ? 'Salvar' : 'Criar'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabela de pedras */}
        <Card>
          <CardHeader>
            <CardTitle>Pedras Cadastradas</CardTitle>
            <CardDescription>
              Lista de todas as pedras no catálogo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cor Base</TableHead>
                  <TableHead>Imagem</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stones.map((stone) => (
                  <TableRow key={stone.id}>
                    <TableCell className="font-medium">{stone.name}</TableCell>
                    <TableCell>{stone.category}</TableCell>
                    <TableCell>{stone.rock_type}</TableCell>
                    <TableCell>{stone.base_color}</TableCell>
                    <TableCell>{stone.image_filename}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editStone(stone)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteStone(stone.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {stones.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhuma pedra cadastrada ainda
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preview das imagens enviadas */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold mb-4">Imagens de Exemplo Enviadas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <img 
              src="/lovable-uploads/14b3e1d0-8f04-4112-a939-ede0d6ad3f58.png" 
              alt="Textura de mármore 1"
              className="w-full h-32 object-cover rounded-lg border"
            />
            <img 
              src="/lovable-uploads/8c6ffb9e-aae1-4b77-bccf-0d00024f5aff.png" 
              alt="Textura de mármore 2"
              className="w-full h-32 object-cover rounded-lg border"
            />
            <img 
              src="/lovable-uploads/4b24d0c6-d562-46ec-8bc4-7ebfa01a9a49.png" 
              alt="Textura de mármore 3"
              className="w-full h-32 object-cover rounded-lg border"
            />
            <img 
              src="/lovable-uploads/429c46cc-a9cd-42a9-b24e-fe26a64b765a.png" 
              alt="Textura de mármore 4"
              className="w-full h-32 object-cover rounded-lg border"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
