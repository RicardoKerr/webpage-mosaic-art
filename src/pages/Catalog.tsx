import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Edit, Trash2, Plus, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useToast } from '@/hooks/use-toast';

// Dados de exemplo baseados na tabela completa fornecida
const exampleStones = [
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
  },
  {
    id: '5',
    name: 'Terra do Sertão',
    category: 'Noble Stones',
    rock_type: 'Marble',
    finishes: 'Polished, Honed',
    available_in: 'Slab',
    base_color: 'Orange/Reddish',
    characteristics: 'Orange-reddish marble reminiscent of the arid lands of the brazilian backlands',
    image_filename: 'image_5.jpeg',
    image_url: '/lovable-uploads/429c46cc-a9cd-42a9-b24e-fe26a64b765a.png'
  },
  {
    id: '6',
    name: 'Tempestade Carioca',
    category: 'Noble Stones',
    rock_type: 'Marble',
    finishes: 'Polished, Honed',
    available_in: 'Slab',
    base_color: 'Blue With Veins',
    characteristics: 'Blue with veins marble with distinctive veins.',
    image_filename: 'image_6.png',
    image_url: '/lovable-uploads/8c6ffb9e-aae1-4b77-bccf-0d00024f5aff.png'
  }
];

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
  image_url: string;
}

const Catalog = () => {
  console.log('=== RENDERIZANDO CATALOG ===');
  
  const navigate = useNavigate();
  const { uploadImage } = useImageUpload();
  const { toast } = useToast();
  const [stones, setStones] = useState<Stone[]>(exampleStones);
  const [editingStone, setEditingStone] = useState<Stone | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<{[key: string]: boolean}>({});

  console.log('Estados atuais:', {
    stonesCount: stones.length,
    editingStone: editingStone?.id,
    isAddingNew,
    uploadingImagesKeys: Object.keys(uploadingImages)
  });

  const existingCategories = [...new Set(stones.map(stone => stone.category))];
  const existingRockTypes = [...new Set(stones.map(stone => stone.rock_type))];
  const existingColors = [...new Set(stones.map(stone => stone.base_color))];

  const [formData, setFormData] = useState<Omit<Stone, 'id' | 'image_filename' | 'image_url'>>({
    name: '',
    category: '',
    rock_type: '',
    finishes: '',
    available_in: '',
    base_color: '',
    characteristics: ''
  });

  const handleInputChange = (key: keyof Omit<Stone, 'id' | 'image_filename' | 'image_url'>, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = async (file: File, stoneId: string) => {
    console.log('=== INÍCIO handleImageUpload ===');
    console.log('Stone ID:', stoneId, 'Arquivo:', file.name);
    
    setUploadingImages(prev => {
      console.log('Marcando como uploading:', stoneId);
      return { ...prev, [stoneId]: true };
    });
    
    try {
      const fileName = `image_${stoneId}.${file.name.split('.').pop()}`;
      console.log('Nome do arquivo gerado:', fileName);
      
      const imageUrl = await uploadImage(file, fileName);
      console.log('URL retornada do upload:', imageUrl);
      
      if (imageUrl) {
        console.log('Atualizando estado dos stones...');
        setStones(prevStones => {
          const newStones = prevStones.map(stone => 
            stone.id === stoneId 
              ? { ...stone, image_url: imageUrl, image_filename: fileName }
              : stone
          );
          console.log('Stones atualizados:', newStones.length);
          return newStones;
        });
        
        if (editingStone && editingStone.id === stoneId) {
          console.log('Atualizando editingStone...');
          setEditingStone(prev => prev ? { ...prev, image_url: imageUrl, image_filename: fileName } : null);
        }

        toast({
          title: "Sucesso",
          description: "Imagem enviada com sucesso!",
        });
      } else {
        toast({
          title: "Erro",
          description: "Falha ao enviar imagem. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('ERRO em handleImageUpload:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao enviar imagem.",
        variant: "destructive",
      });
    } finally {
      console.log('Removendo status de uploading para:', stoneId);
      setUploadingImages(prev => {
        const newState = { ...prev };
        delete newState[stoneId];
        return newState;
      });
      console.log('=== FIM handleImageUpload ===');
    }
  };

  const handleEdit = (stone: Stone) => {
    setEditingStone(stone);
    setFormData({
      name: stone.name,
      category: stone.category,
      rock_type: stone.rock_type,
      finishes: stone.finishes,
      available_in: stone.available_in,
      base_color: stone.base_color,
      characteristics: stone.characteristics
    });
  };

  const handleDelete = (id: string) => {
    setStones(stones.filter(stone => stone.id !== id));
  };

  const handleSave = () => {
    if (editingStone) {
      // Update existing stone
      setStones(stones.map(stone =>
        stone.id === editingStone.id ? { ...stone, ...formData } : stone
      ));
      setEditingStone(null);
    } else if (isAddingNew) {
      // Add new stone
      const newStone = {
        id: Date.now().toString(),
        ...formData,
        image_filename: '',
        image_url: ''
      };
      setStones([...stones, newStone]);
      setIsAddingNew(false);
    }
  };

  const handleAdd = () => {
    setIsAddingNew(true);
    setFormData({
      name: '',
      category: '',
      rock_type: '',
      finishes: '',
      available_in: '',
      base_color: '',
      characteristics: ''
    });
  };

  const handleCancel = () => {
    setEditingStone(null);
    setIsAddingNew(false);
  };

  console.log('Renderizando componente. EditingStone:', !!editingStone, 'IsAddingNew:', isAddingNew);

  if (editingStone || isAddingNew) {
    const currentStone = editingStone || {
      id: Date.now().toString(),
      name: '',
      category: '',
      rock_type: '',
      finishes: '',
      available_in: '',
      base_color: '',
      characteristics: '',
      image_filename: '',
      image_url: ''
    };

    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto p-6">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {isAddingNew ? 'Adicionar Nova Pedra' : 'Editar Pedra'}
          </h1>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Nome da pedra"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {existingCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="rock_type">Tipo de Rocha</Label>
                  <Select value={formData.rock_type} onValueChange={(value) => handleInputChange('rock_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de rocha" />
                    </SelectTrigger>
                    <SelectContent>
                      {existingRockTypes.map(rockType => (
                        <SelectItem key={rockType} value={rockType}>{rockType}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="finishes">Acabamentos</Label>
                  <Input
                    id="finishes"
                    type="text"
                    value={formData.finishes}
                    onChange={(e) => handleInputChange('finishes', e.target.value)}
                    placeholder="Acabamentos disponíveis"
                  />
                </div>

                <div>
                  <Label htmlFor="available_in">Disponível em</Label>
                  <Input
                    id="available_in"
                    type="text"
                    value={formData.available_in}
                    onChange={(e) => handleInputChange('available_in', e.target.value)}
                    placeholder="Formatos disponíveis"
                  />
                </div>
                
                <div>
                  <Label htmlFor="base_color">Cor Base</Label>
                  <Select value={formData.base_color} onValueChange={(value) => handleInputChange('base_color', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a cor base" />
                    </SelectTrigger>
                    <SelectContent>
                      {existingColors.map(color => (
                        <SelectItem key={color} value={color}>{color}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="characteristics">Características</Label>
                  <Textarea
                    id="characteristics"
                    value={formData.characteristics}
                    onChange={(e) => handleInputChange('characteristics', e.target.value)}
                    placeholder="Descreva as características da pedra"
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Imagem Atual</Label>
                  {currentStone.image_url && (
                    <img 
                      src={currentStone.image_url} 
                      alt={currentStone.name}
                      className="w-full h-48 object-cover border border-gray-300 rounded-lg"
                    />
                  )}
                </div>

                <div>
                  <Label htmlFor="image_upload">Substituir Imagem</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="image_upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(file, currentStone.id);
                        }
                      }}
                      disabled={uploadingImages[currentStone.id]}
                    />
                    {uploadingImages[currentStone.id] && (
                      <Upload className="h-4 w-4 animate-spin" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    A imagem será salva como: image_{currentStone.id}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button onClick={handleSave}>
                {isAddingNew ? 'Adicionar' : 'Salvar'}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Catálogo de Pedras Naturais
          </h1>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Pedra
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stones.map((stone) => (
            <div key={stone.id} className="produto border border-gray-200 rounded-lg overflow-hidden shadow-lg bg-white">
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-800 pb-3 mb-4">
                  {stone.name}
                </h1>
                
                <div className="font-bold text-lg mb-6">
                  Item Name: {stone.name}
                </div>
                
                <div className="text-center my-8">
                  <img 
                    src={stone.image_url} 
                    alt={stone.name}
                    className="w-full h-64 object-cover mx-auto border border-gray-300 rounded-lg shadow-lg"
                  />
                </div>
                
                <div className="bg-gray-100 p-6 rounded-lg">
                  <strong className="text-lg">Technical Specifications:</strong>
                  <ul className="mt-4 space-y-2 pl-6">
                    <li><strong>Category:</strong> {stone.category}</li>
                    <li><strong>Rock type:</strong> {stone.rock_type}</li>
                    <li><strong>Available finishes:</strong> {stone.finishes}</li>
                    <li><strong>Available in:</strong> {stone.available_in}</li>
                    <li><strong>Base color:</strong> {stone.base_color}</li>
                    <li><strong>Characteristics:</strong> {stone.characteristics}</li>
                  </ul>
                </div>

                <div className="flex justify-between mt-4">
                  <Button 
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(stone)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  <Button 
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(stone.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Deletar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
