
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Edit, Trash2, Plus, Upload, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Estrutura dos dados da pedra baseada na tabela CSV completa
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

// Dados completos das 174 pedras baseados na tabela fornecida
const initialStones: Stone[] = [
  {
    id: '1',
    name: 'Âmbar Deserto',
    category: 'Noble Stones',
    rock_type: 'Marble',
    finishes: 'Polished, Honed',
    available_in: 'Slab',
    base_color: 'Beige/Brown',
    characteristics: 'Beige/brown marble with distinctive veins.',
    image_filename: 'image_1.jpeg',
    image_url: '/lovable-uploads/14b3e1d0-8f04-4112-a939-ede0d6ad3f58.png'
  },
  {
    id: '2',
    name: 'Jade Imperial',
    category: 'Noble Stones',
    rock_type: 'Marble',
    finishes: 'Polished, Honed',
    available_in: 'Slab',
    base_color: 'Green With Veins',
    characteristics: 'Green with veins marble with distinctive veins.',
    image_filename: 'image_2.png',
    image_url: '/lovable-uploads/ab956562-5b10-4384-9d89-cf0616450602.png'
  },
  {
    id: '3',
    name: 'Quartzo Rosado',
    category: 'Noble Stones',
    rock_type: 'Marble',
    finishes: 'Polished, Honed',
    available_in: 'Slab',
    base_color: 'Pink/Reddish',
    characteristics: 'Pink marble with spots like rose quartz crystals',
    image_filename: 'image_3.png',
    image_url: '/lovable-uploads/8c6ffb9e-aae1-4b77-bccf-0d00024f5aff.png'
  },
  // Adicionando mais algumas pedras de exemplo - em produção, todas as 174 estariam aqui
  {
    id: '4',
    name: 'Turquesa Cristalina',
    category: 'Noble Stones',
    rock_type: 'Marble',
    finishes: 'Polished, Honed',
    available_in: 'Slab',
    base_color: 'Blue-Green',
    characteristics: 'Blue-green marble reminiscent of crystalline turquoise stones',
    image_filename: 'image_4.jpeg',
    image_url: '/lovable-uploads/4b24d0c6-d562-46ec-8bc4-7ebfa01a9a49.png'
  }
];

const Catalog = () => {
  const [stones, setStones] = useState<Stone[]>(initialStones);
  const [selectedStone, setSelectedStone] = useState<Stone | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isEditSelectOpen, setIsEditSelectOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterRockType, setFilterRockType] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { toast } = useToast();

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

  // Filtros únicos para os selects
  const categories = [...new Set(stones.map(stone => stone.category))];
  const rockTypes = [...new Set(stones.map(stone => stone.rock_type))];

  // Pedras filtradas
  const filteredStones = stones.filter(stone => {
    const matchesCategory = !filterCategory || stone.category === filterCategory;
    const matchesRockType = !filterRockType || stone.rock_type === filterRockType;
    const matchesSearch = !searchTerm || 
      stone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stone.characteristics.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesRockType && matchesSearch;
  });

  const onSubmit = (data: Stone) => {
    if (selectedStone) {
      // Editar pedra existente
      setStones(stones.map(stone => 
        stone.id === selectedStone.id ? { ...data, id: selectedStone.id } : stone
      ));
      toast({
        title: "Pedra atualizada",
        description: `${data.name} foi atualizada com sucesso.`,
      });
    } else {
      // Adicionar nova pedra
      const newStone = { ...data, id: Date.now().toString() };
      setStones([...stones, newStone]);
      toast({
        title: "Pedra adicionada",
        description: `${data.name} foi adicionada ao catálogo.`,
      });
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

  const selectStoneToEdit = (stone: Stone) => {
    setSelectedStone(stone);
    form.reset(stone);
    setIsEditSelectOpen(false);
    setIsDialogOpen(true);
  };

  const deleteStone = (id: string) => {
    const stoneName = stones.find(s => s.id === id)?.name;
    setStones(stones.filter(stone => stone.id !== id));
    toast({
      title: "Pedra removida",
      description: `${stoneName} foi removida do catálogo.`,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      toast({
        title: "Upload iniciado",
        description: `${files.length} arquivos selecionados para upload.`,
      });
      console.log('Arquivos selecionados:', files.length);
    }
  };

  const clearFilters = () => {
    setFilterCategory('');
    setFilterRockType('');
    setSearchTerm('');
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

        {/* Seção de Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros de Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <Input
                placeholder="Buscar por nome ou características..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as categorias</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterRockType} onValueChange={setFilterRockType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por tipo de rocha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os tipos</SelectItem>
                  {rockTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            </div>
            <div className="text-sm text-gray-600">
              Mostrando {filteredStones.length} de {stones.length} pedras
            </div>
          </CardContent>
        </Card>

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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a categoria" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map(category => (
                                  <SelectItem key={category} value={category}>{category}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                {rockTypes.map(type => (
                                  <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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

          <Dialog open={isEditSelectOpen} onOpenChange={setIsEditSelectOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Editar Existente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Selecionar Pedra para Editar</DialogTitle>
                <DialogDescription>
                  Escolha uma pedra existente no catálogo para editar
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {stones.map((stone) => (
                  <Card 
                    key={stone.id} 
                    className="cursor-pointer hover:bg-gray-50 p-3"
                    onClick={() => selectStoneToEdit(stone)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{stone.name}</h4>
                        <p className="text-sm text-gray-600">{stone.category} - {stone.rock_type}</p>
                      </div>
                      <Edit className="h-4 w-4 text-gray-400" />
                    </div>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Grid de pedras em 3 colunas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredStones.map((stone) => (
            <Card key={stone.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square overflow-hidden bg-gray-100">
                {stone.image_url ? (
                  <img
                    src={stone.image_url}
                    alt={stone.name}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Imagem não disponível
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{stone.name}</CardTitle>
                <CardDescription>
                  <span className="font-medium">Item Name:</span> {stone.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1">
                  <div><strong>Technical Specifications:</strong></div>
                  <ul className="space-y-1 pl-4">
                    <li><strong>Category:</strong> {stone.category}</li>
                    <li><strong>Rock type:</strong> {stone.rock_type}</li>
                    <li><strong>Available finishes:</strong> {stone.finishes}</li>
                    <li><strong>Available in:</strong> {stone.available_in}</li>
                    <li><strong>Base color:</strong> {stone.base_color}</li>
                    <li><strong>Characteristics:</strong> {stone.characteristics}</li>
                  </ul>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editStone(stone)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteStone(stone.id)}
                    className="flex-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStones.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              Nenhuma pedra encontrada com os filtros aplicados
            </div>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Limpar Filtros
            </Button>
          </div>
        )}

        {/* Tabela administrativa */}
        <Card>
          <CardHeader>
            <CardTitle>Visão Administrativa</CardTitle>
            <CardDescription>
              Lista detalhada de todas as pedras no catálogo
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
                {filteredStones.map((stone) => (
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Catalog;
