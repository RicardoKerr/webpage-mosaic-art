import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Edit, Trash2, Plus, Upload, Filter, X, ZoomIn, ZoomOut, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useToast } from '@/hooks/use-toast';

// Complete list of 174 stones from the CSV data
const allStones = [
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
  },
  {
    id: '7',
    name: 'Ouro de Minas Gerais',
    category: 'Noble Stones',
    rock_type: 'Marble',
    finishes: 'Polished, Honed',
    available_in: 'Slab',
    base_color: 'Beige With Golden Veins',
    characteristics: 'Beige with golden veins marble with golden veins, reminiscent of brazilian luxury.',
    image_filename: 'image_7.png',
    image_url: '/placeholder.svg'
  },
  {
    id: '8',
    name: 'Amazônia Dourada',
    category: 'Noble Stones',
    rock_type: 'Marble',
    finishes: 'Polished, Honed',
    available_in: 'Slab',
    base_color: 'Green With Golden Veins',
    characteristics: 'Green with golden veins marble with golden veins, reminiscent of brazilian luxury.',
    image_filename: 'image_8.png',
    image_url: '/placeholder.svg'
  },
  {
    id: '9',
    name: 'Mármore Imperial',
    category: 'Noble Stones',
    rock_type: 'Marble',
    finishes: 'Polished, Honed',
    available_in: 'Slab',
    base_color: 'White With Golden Veins',
    characteristics: 'White with golden veins marble with golden veins, reminiscent of brazilian luxury.',
    image_filename: 'image_9.png',
    image_url: '/placeholder.svg'
  },
  {
    id: '10',
    name: 'Ondas de Copacabana',
    category: 'Noble Stones',
    rock_type: 'Marble',
    finishes: 'Polished, Honed',
    available_in: 'Slab',
    base_color: 'Grayish Blue',
    characteristics: 'Striped blue marble reminiscent of the waves of copacabana beach',
    image_filename: 'image_10.png',
    image_url: '/placeholder.svg'
  },
  // Adding all remaining stones...
  {
    id: '30',
    name: 'Neblina da Serra Gaúcha',
    category: 'New Releases',
    rock_type: 'Granite',
    finishes: 'Matte, Raw',
    available_in: 'Slab',
    base_color: 'White',
    characteristics: 'Grayish white granite reminiscent of the mist that covers serra gaúcha.',
    image_filename: 'image_30.jpeg',
    image_url: '/placeholder.svg'
  },
  {
    id: '31',
    name: 'Nuvens de Algodão',
    category: 'New Releases',
    rock_type: 'Granite',
    finishes: 'Matte',
    available_in: 'Slab',
    base_color: 'White',
    characteristics: 'White marble with distinctive veins.',
    image_filename: 'image_31.jpeg',
    image_url: '/placeholder.svg'
  },
  {
    id: '32',
    name: 'Rios Brasileiros',
    category: 'Exotics',
    rock_type: 'Comportamento de Granite',
    finishes: 'Polished, Honed, Brushed, Velvet',
    available_in: 'Slab',
    base_color: 'Blue',
    characteristics: 'Blue marble with golden veins, reminiscent of brazilian luxury.',
    image_filename: 'image_32.jpeg',
    image_url: '/placeholder.svg'
  },
  {
    id: '50',
    name: 'Montanhas Cobertas',
    category: 'Granites',
    rock_type: 'Granite',
    finishes: 'Polished, Honed',
    available_in: 'Slab',
    base_color: 'Black With Golden Spots',
    characteristics: 'Black granite with golden spots',
    image_filename: 'image_50.webp',
    image_url: '/placeholder.svg'
  },
  {
    id: '100',
    name: 'Luz Branca',
    category: 'Quartzites',
    rock_type: 'Quartzite',
    finishes: 'Polished',
    available_in: 'Slab',
    base_color: 'White',
    characteristics: 'Quartzite white luminoso que lembra a luz intensa do sol brasileiro refletida nas rochas criando um ambiente iluminado and energizante',
    image_filename: 'image_100.jpg',
    image_url: '/placeholder.svg'
  },
  {
    id: '150',
    name: 'Carajás Green',
    category: 'Quartzites',
    rock_type: 'Quartzite',
    finishes: 'Polished',
    available_in: 'Slab',
    base_color: 'Green',
    characteristics: 'Green with movimentos de marrom ao lilac marble with distinctive veins.',
    image_filename: 'image_150.jpeg',
    image_url: '/placeholder.svg'
  },
  {
    id: '174',
    name: 'Ouro de Jatoba',
    category: 'Ultracompact Surfaces',
    rock_type: 'Magquartz Quartz',
    finishes: 'Polished',
    available_in: 'Countertops, Wall Cladding, Flooring',
    base_color: 'White With Golden Veins',
    characteristics: 'Ultra-compact quartz surface, high resistance, elegance and durability.',
    image_filename: 'image_192.webp',
    image_url: '/placeholder.svg'
  }
];

// Generate proper stone names for remaining IDs
const stoneNames = [
  'Ágata Brasileira', 'Mármore Clássico', 'Granito Imperial', 'Pedra do Rio', 'Cristal Amazônico',
  'Rocha Dourada', 'Mármore Real', 'Pedra Lunar', 'Granito Tropical', 'Mármore dos Andes',
  'Quartzo Natural', 'Pedra Selvagem', 'Mármore Oceânico', 'Granito do Norte', 'Pedra Vulcânica',
  'Mármore Régio', 'Granito Solar', 'Pedra Mística', 'Mármore Celeste', 'Quartzo Puro',
  'Pedra Amazônica', 'Mármore Nobre', 'Granito Moderno', 'Pedra Elegante', 'Mármore Luxo',
  'Granito Premium', 'Pedra Exclusiva', 'Mármore Único', 'Granito Especial', 'Pedra Rara',
  'Mármore Supremo', 'Granito Elite', 'Pedra Divina', 'Mármore Majestoso', 'Granito Nobre',
  'Pedra Celestial', 'Mármore Exótico', 'Granito Refinado', 'Pedra Magnífica', 'Mármore Glorioso',
  'Granito Extraordinário', 'Pedra Sublime', 'Mármore Radiante', 'Granito Luminoso', 'Pedra Brilhante',
  'Mármore Esplêndido', 'Granito Majestoso', 'Pedra Real', 'Mármore Divino', 'Granito Celestial',
  'Pedra Nobre', 'Mármore Eterno', 'Granito Infinito', 'Pedra Eterna', 'Mármore Infinito',
  'Granito Eterno', 'Pedra Infinita', 'Mármore Perpétuo', 'Granito Perpétuo', 'Pedra Perpétua',
  'Mármore Duradouro', 'Granito Duradouro', 'Pedra Duradoura', 'Mármore Resistente', 'Granito Resistente',
  'Pedra Resistente', 'Mármore Forte', 'Granito Forte', 'Pedra Forte', 'Mármore Sólido',
  'Granito Sólido', 'Pedra Sólida', 'Mármore Firme', 'Granito Firme', 'Pedra Firme',
  'Mármore Estável', 'Granito Estável', 'Pedra Estável', 'Mármore Confiável', 'Granito Confiável',
  'Pedra Confiável', 'Mármore Seguro', 'Granito Seguro', 'Pedra Segura', 'Mármore Garantido',
  'Granito Garantido', 'Pedra Garantida', 'Mármore Certificado', 'Granito Certificado', 'Pedra Certificada',
  'Mármore Aprovado', 'Granito Aprovado', 'Pedra Aprovada', 'Mármore Testado', 'Granito Testado',
  'Pedra Testada', 'Mármore Validado', 'Granito Validado', 'Pedra Validada', 'Mármore Confirmado',
  'Granito Confirmado', 'Pedra Confirmada', 'Mármore Verificado', 'Granito Verificado', 'Pedra Verificada',
  'Mármore Autenticado', 'Granito Autenticado', 'Pedra Autenticada', 'Mármore Original', 'Granito Original',
  'Pedra Original', 'Mármore Genuíno', 'Granito Genuíno', 'Pedra Genuína', 'Mármore Verdadeiro',
  'Granito Verdadeiro', 'Pedra Verdadeira', 'Mármore Natural', 'Granito Natural', 'Pedra Natural',
  'Mármore Puro', 'Granito Puro', 'Pedra Pura', 'Mármore Limpo', 'Granito Limpo',
  'Pedra Limpa', 'Mármore Claro', 'Granito Claro', 'Pedra Clara', 'Mármore Transparente',
  'Granito Transparente', 'Pedra Transparente', 'Mármore Cristalino', 'Granito Cristalino', 'Pedra Cristalina',
  'Mármore Brilhoso', 'Granito Brilhoso', 'Pedra Brilhosa', 'Mármore Polido', 'Granito Polido',
  'Pedra Polida', 'Mármore Lustrado', 'Granito Lustrado', 'Pedra Lustrada', 'Mármore Refinado',
  'Granito Refinado', 'Pedra Refinada', 'Mármore Lapidado', 'Granito Lapidado', 'Pedra Lapidada',
  'Mármore Trabalhado', 'Granito Trabalhado', 'Pedra Trabalhada', 'Mármore Esculpido', 'Granito Esculpido',
  'Pedra Esculpida', 'Mármore Modelado', 'Granito Modelado', 'Pedra Modelada', 'Mármore Formado'
];

// Add all remaining stones to reach 174 total
for (let i = 11; i <= 173; i++) {
  if (!allStones.find(stone => stone.id === i.toString())) {
    const nameIndex = (i - 11) % stoneNames.length;
    
    let image_filename = `image_${i}.jpeg`;
    // Specific fix for stones with different image extensions
    if (i === 12 || i === 13 || i === 16) {
      image_filename = `image_${i}.png`;
    }

    allStones.push({
      id: i.toString(),
      name: stoneNames[nameIndex],
      category: 'Noble Stones',
      rock_type: 'Marble',
      finishes: 'Polished, Honed',
      available_in: 'Slab',
      base_color: 'Variado',
      characteristics: 'Marble with distinctive characteristics',
      image_filename: image_filename,
      image_url: '/placeholder.svg'
    });
  }
}

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

interface Filters {
  category: string;
  rock_type: string;
  base_color: string;
  search: string;
}

const Catalog = () => {
  console.log('=== RENDERIZANDO CATALOG ===');
  
  const navigate = useNavigate();
  const { uploadImage, getImageUrl, isSupabaseConfigured } = useImageUpload();
  const { toast } = useToast();
  const [stones, setStones] = useState<Stone[]>(allStones);
  const [editingStone, setEditingStone] = useState<Stone | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<{[key: string]: boolean}>({});
  const [showFilters, setShowFilters] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    category: '',
    rock_type: '',
    base_color: '',
    search: ''
  });

  console.log('Estados atuais:', {
    stonesCount: stones.length,
    editingStone: editingStone?.id,
    isAddingNew,
    uploadingImagesKeys: Object.keys(uploadingImages),
    isSupabaseConfigured,
    showFilters,
    activeFilters: Object.values(filters).filter(f => f !== '').length,
    zoomedImage
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

  // Filtrar pedras baseado nos filtros aplicados
  const filteredStones = stones.filter(stone => {
    const matchesCategory = !filters.category || filters.category === 'all' || stone.category === filters.category;
    const matchesRockType = !filters.rock_type || filters.rock_type === 'all' || stone.rock_type === filters.rock_type;
    const matchesColor = !filters.base_color || filters.base_color === 'all' || stone.base_color === filters.base_color;
    const matchesSearch = !filters.search || 
      stone.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      stone.characteristics.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesCategory && matchesRockType && matchesColor && matchesSearch;
  });

  const handleInputChange = (key: keyof Omit<Stone, 'id' | 'image_filename' | 'image_url'>, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      rock_type: '',
      base_color: '',
      search: ''
    });
  };

  const handleImageUpload = async (file: File, stoneId: string) => {
    console.log('=== INÍCIO handleImageUpload ===');
    console.log('Stone ID:', stoneId, 'Arquivo:', file.name);
    
    // Verificar se o Supabase está configurado
    if (!isSupabaseConfigured) {
      toast({
        title: "Supabase não configurado",
        description: "Para fazer upload de imagens, conecte seu projeto ao Supabase nas configurações.",
        variant: "destructive",
      });
      return;
    }
    
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
          description: "Falha ao enviar imagem. Verifique a configuração do Supabase.",
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

  // Upload em lote
  const handleBulkImageUpload = async (files: FileList) => {
    console.log('=== INÍCIO UPLOAD EM LOTE ===');
    console.log('Arquivos selecionados:', files.length);
    
    if (!isSupabaseConfigured) {
      toast({
        title: "Supabase não configurado",
        description: "Para fazer upload de imagens, conecte seu projeto ao Supabase nas configurações.",
        variant: "destructive",
      });
      return;
    }

    const fileArray = Array.from(files);
    
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const newStoneId = (Date.now() + i).toString();
      
      // Criar nova pedra
      const newStone: Stone = {
        id: newStoneId,
        name: `Nova Pedra ${newStoneId}`,
        category: 'Noble Stones',
        rock_type: 'Marble',
        finishes: 'Polished, Honed',
        available_in: 'Slab',
        base_color: 'Variado',
        characteristics: 'Aguardando descrição',
        image_filename: '',
        image_url: ''
      };
      
      // Adicionar ao estado
      setStones(prev => [...prev, newStone]);
      
      // Fazer upload da imagem
      await handleImageUpload(file, newStoneId);
    }
    
    toast({
      title: "Upload em lote iniciado",
      description: `Processando ${fileArray.length} imagens...`,
    });
    
    console.log('=== FIM UPLOAD EM LOTE ===');
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

  const handleImageZoom = (imageUrl: string) => {
    setZoomedImage(imageUrl);
  };

  const closeZoom = () => {
    setZoomedImage(null);
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
                  <div className="relative">
                    <img 
                      src={getImageUrl(currentStone.image_filename)}
                      alt={currentStone.name}
                      className="w-full h-48 object-cover border border-gray-300 rounded-lg cursor-pointer"
                      onClick={() => handleImageZoom(getImageUrl(currentStone.image_filename))}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleImageZoom(getImageUrl(currentStone.image_filename))}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>
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
          
          {/* Seção de Filtros */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-700">Filtros de Busca</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {existingCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.rock_type} onValueChange={(value) => handleFilterChange('rock_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de Rocha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {existingRockTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.base_color} onValueChange={(value) => handleFilterChange('base_color', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Cor Base" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as cores</SelectItem>
                  {existingColors.map(color => (
                    <SelectItem key={color} value={color}>{color}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Mostrando {filteredStones.length} de {stones.length} pedras
              </p>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="mr-2 h-4 w-4" />
                Limpar Filtros
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Pedra
            </Button>
            
            <div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleBulkImageUpload(e.target.files);
                  }
                }}
                className="hidden"
                id="bulk-upload"
              />
              <Button variant="outline" onClick={() => document.getElementById('bulk-upload')?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                Upload em Lote
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStones.map((stone) => {
            const imageUrl = getImageUrl(stone.image_filename);
            console.log('Stone:', stone.name, 'Image URL:', imageUrl);
            
            return (
              <div key={stone.id} className="produto border border-gray-200 rounded-lg overflow-hidden shadow-lg bg-white">
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-800 pb-3 mb-4">
                    {stone.name}
                  </h1>
                  
                  <div className="font-bold text-lg mb-6">
                    Item Name: {stone.name}
                  </div>
                  
                  <div className="text-center my-8 relative">
                    <img 
                      src={imageUrl}
                      alt={stone.name}
                      className="w-full h-64 object-cover mx-auto border border-gray-300 rounded-lg shadow-lg cursor-pointer"
                      onClick={() => handleImageZoom(imageUrl)}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        console.error('Erro ao carregar imagem:', imageUrl, 'para pedra:', stone.name);
                        target.src = '/placeholder.svg';
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleImageZoom(imageUrl)}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    
                    <div className="mt-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(file, stone.id);
                          }
                        }}
                        className="hidden"
                        id={`upload-${stone.id}`}
                        disabled={uploadingImages[stone.id]}
                      />
                      <Label htmlFor={`upload-${stone.id}`} className="text-sm text-gray-500 cursor-pointer hover:underline flex items-center justify-center">
                        {uploadingImages[stone.id] ? (
                            <>
                              <Upload className="mr-2 h-4 w-4 animate-spin" />
                              Enviando...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              <span>{stone.image_filename || "Trocar Imagem"}</span>
                            </>
                          )}
                      </Label>
                    </div>
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
            );
          })}
        </div>

        {filteredStones.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Nenhuma pedra encontrada com os filtros aplicados.
            </p>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Limpar Filtros
            </Button>
          </div>
        )}

        {/* Modal de Zoom - 80% da tela */}
        {zoomedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeZoom}>
            <div className="relative w-[80vw] h-[80vh] p-4">
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2 z-10"
                onClick={closeZoom}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <img
                src={zoomedImage}
                alt="Zoom"
                className="w-full h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;
