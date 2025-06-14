import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Edit, Trash2, Plus, Upload, Filter, X, ZoomIn, ZoomOut, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
  origin: string;
}

type StoneFormData = Omit<Stone, 'id' | 'image_filename' | 'image_url'>;

interface Filters {
  category: string;
  rock_type: string;
  base_color: string;
  search: string;
}

const Catalog = () => {
  console.log('=== RENDERIZANDO CATALOG ===');
  
  const navigate = useNavigate();
  const { uploadImage, isSupabaseConfigured } = useImageUpload();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const fetchMaterials = async (): Promise<Stone[]> => {
    const { data, error } = await supabase
      .from('materials')
      .select(`
        id,
        commercial_name,
        category,
        rock_type,
        base_color,
        description,
        main_image_url,
        origin,
        material_finishes(finish_name),
        material_applications(application_name)
      `)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching materials:', error);
      throw new Error('Could not fetch materials');
    }

    return data.map((material: any) => ({
      id: material.id,
      name: material.commercial_name,
      category: material.category,
      rock_type: material.rock_type,
      finishes: material.material_finishes.map((f: any) => f.finish_name).join(', '),
      available_in: material.material_applications.map((a: any) => a.application_name).join(', '),
      base_color: material.base_color,
      characteristics: material.description,
      image_url: material.main_image_url || '/placeholder.svg',
      image_filename: material.main_image_url ? material.main_image_url.split('/').pop() : '',
      origin: material.origin,
    }));
  };

  const { data: stones = [], isLoading, isError } = useQuery<Stone[], Error>({
    queryKey: ['materials'],
    queryFn: fetchMaterials,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, stoneData }: { id: string, stoneData: StoneFormData }) => {
      const { error: materialError } = await supabase
        .from('materials')
        .update({
          commercial_name: stoneData.name,
          category: stoneData.category,
          rock_type: stoneData.rock_type,
          base_color: stoneData.base_color,
          description: stoneData.characteristics,
          origin: stoneData.origin,
        })
        .eq('id', id);

      if (materialError) throw materialError;
      
      await supabase.from('material_finishes').delete().eq('material_id', id);
      const finishes = stoneData.finishes.split(',').map(f => f.trim()).filter(Boolean);
      if (finishes.length > 0) {
        const { error: finishesError } = await supabase.from('material_finishes').insert(
          finishes.map(f => ({ material_id: id, finish_name: f }))
        );
        if (finishesError) throw finishesError;
      }

      await supabase.from('material_applications').delete().eq('material_id', id);
      const applications = stoneData.available_in.split(',').map(a => a.trim()).filter(Boolean);
      if (applications.length > 0) {
        const { error: applicationsError } = await supabase.from('material_applications').insert(
          applications.map(a => ({ material_id: id, application_name: a }))
        );
        if (applicationsError) throw applicationsError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      toast({ title: "Success", description: "Material updated successfully." });
      handleCancel();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: `Failed to update material: ${error.message}`, variant: "destructive" });
    }
  });

  const createMutation = useMutation({
    mutationFn: async (stoneData: StoneFormData) => {
      const { data, error: materialError } = await supabase
        .from('materials')
        .insert({
          commercial_name: stoneData.name,
          category: stoneData.category,
          rock_type: stoneData.rock_type,
          base_color: stoneData.base_color,
          description: stoneData.characteristics,
          origin: stoneData.origin,
          main_image_url: '/placeholder.svg',
        })
        .select('id')
        .single();
      
      if (materialError) throw materialError;
      const newMaterialId = data.id;
      
      const finishes = stoneData.finishes.split(',').map(f => f.trim()).filter(Boolean);
      if (finishes.length > 0) {
        await supabase.from('material_finishes').insert(finishes.map(f => ({ material_id: newMaterialId, finish_name: f })));
      }

      const applications = stoneData.available_in.split(',').map(a => a.trim()).filter(Boolean);
      if (applications.length > 0) {
        await supabase.from('material_applications').insert(applications.map(a => ({ material_id: newMaterialId, application_name: a })));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      toast({ title: "Success", description: "Material created successfully." });
      handleCancel();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: `Failed to create material: ${error.message}`, variant: "destructive" });
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('materials').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      toast({ title: 'Success', description: 'Material deleted successfully.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: `Failed to delete material: ${error.message}`, variant: 'destructive' });
    }
  });

  const imageUploadMutation = useMutation({
    mutationFn: async ({ file, stoneId }: { file: File, stoneId: string }) => {
      if (!isSupabaseConfigured) throw new Error("Supabase not configured");
      
      const fileName = `public/materials/${stoneId}/${Date.now()}_${file.name}`;
      const imageUrl = await uploadImage(file, fileName);

      if (!imageUrl) throw new Error("Image upload failed");

      const { error } = await supabase.from('materials').update({ main_image_url: imageUrl }).eq('id', stoneId);
      if (error) throw error;
      
      return imageUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      toast({ title: "Success", description: "Image uploaded successfully!" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
    onMutate: ({ stoneId }) => {
       setUploadingImages(prev => ({ ...prev, [stoneId]: true }));
    },
    onSettled: (_data, _error, { stoneId }) => {
      setUploadingImages(prev => {
        const newState = { ...prev };
        delete newState[stoneId];
        return newState;
      });
    }
  });
  
  const bulkCreateMutation = useMutation({
    mutationFn: async (file: File) => {
      const { data: newMaterial, error: createError } = await supabase
        .from('materials')
        .insert({
          commercial_name: `New Stone - ${file.name.split('.')[0]}`,
          category: 'New Releases',
          rock_type: 'Unknown',
          base_color: 'Varied',
          description: 'Awaiting description',
          origin: 'Unknown',
          main_image_url: '/placeholder.svg',
        })
        .select('id').single();
      
      if (createError) throw createError;
      const newStoneId = newMaterial.id;

      await imageUploadMutation.mutateAsync({ file, stoneId: newStoneId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
    onError: (error: Error) => {
      toast({ title: 'Error during bulk upload', description: error.message, variant: 'destructive' });
    }
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

  const existingCategories = [...new Set((stones || []).map(stone => stone.category))];
  const existingRockTypes = [...new Set((stones || []).map(stone => stone.rock_type))];
  const existingColors = [...new Set((stones || []).map(stone => stone.base_color))];

  const [formData, setFormData] = useState<StoneFormData>({
    name: '',
    category: '',
    rock_type: '',
    finishes: '',
    available_in: '',
    base_color: '',
    characteristics: '',
    origin: ''
  });

  const filteredStones = (stones || []).filter(stone => {
    const matchesCategory = !filters.category || stone.category === filters.category;
    const matchesRockType = !filters.rock_type || stone.rock_type === filters.rock_type;
    const matchesColor = !filters.base_color || stone.base_color === filters.base_color;
    const matchesSearch = !filters.search || 
      stone.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      stone.characteristics.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesCategory && matchesRockType && matchesColor && matchesSearch;
  });

  const handleInputChange = (key: keyof StoneFormData, value: string) => {
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

  const handleImageUpload = (file: File, stoneId: string) => {
    imageUploadMutation.mutate({ file, stoneId });
  };

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
    
    toast({
      title: "Upload em lote iniciado",
      description: `Processando ${files.length} imagens...`,
    });

    for (const file of Array.from(files)) {
      bulkCreateMutation.mutate(file);
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
      characteristics: stone.characteristics,
      origin: stone.origin,
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleSave = () => {
    if (editingStone) {
      updateMutation.mutate({ id: editingStone.id, stoneData: formData });
    } else if (isAddingNew) {
      createMutation.mutate(formData);
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
      characteristics: '',
      origin: '',
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error loading materials. Please try again later.
      </div>
    );
  }

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
      image_url: '',
      origin: '',
      image_filename: '',
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
            {isAddingNew ? 'Adicionar Novo Material' : 'Editar Material'}
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
                    placeholder="Formatos disponíveis (separados por vírgula)"
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

                <div>
                  <Label htmlFor="origin">Origem</Label>
                  <Input
                    id="origin"
                    type="text"
                    value={formData.origin}
                    onChange={(e) => handleInputChange('origin', e.target.value)}
                    placeholder="País de origem"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Imagem Atual</Label>
                  {currentStone.image_url && (
                    <div className="relative">
                      <img 
                        src={currentStone.image_url} 
                        alt={currentStone.name}
                        className="w-full h-48 object-cover border border-gray-300 rounded-lg cursor-pointer"
                        onClick={() => handleImageZoom(currentStone.image_url)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => handleImageZoom(currentStone.image_url)}
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </div>
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
              <Button 
                onClick={handleSave} 
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
          
          <div className="flex flex-wrap gap-4 mb-6">
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Material
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
            
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filtros {Object.values(filters).filter(f => f !== '').length > 0 && `(${Object.values(filters).filter(f => f !== '').length})`}
            </Button>
          </div>

          {showFilters && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="search-filter">Buscar</Label>
                  <Input
                    id="search-filter"
                    placeholder="Nome ou características..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="category-filter">Categoria</Label>
                  <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas</SelectItem>
                      {existingCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="rock-type-filter">Tipo de Rocha</Label>
                  <Select value={filters.rock_type} onValueChange={(value) => handleFilterChange('rock_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      {existingRockTypes.map(rockType => (
                        <SelectItem key={rockType} value={rockType}>{rockType}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="color-filter">Cor Base</Label>
                  <Select value={filters.base_color} onValueChange={(value) => handleFilterChange('base_color', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas</SelectItem>
                      {existingColors.map(color => (
                        <SelectItem key={color} value={color}>{color}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-600">
                  Mostrando {filteredStones.length} de {stones.length} materiais
                </p>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <X className="mr-2 h-4 w-4" />
                  Limpar Filtros
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStones.map((stone) => (
            <div key={stone.id} className="produto border border-gray-200 rounded-lg overflow-hidden shadow-lg bg-white">
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-800 pb-3 mb-4">
                  {stone.name}
                </h1>
                
                <div className="font-bold text-lg mb-6">
                  Item Name: {stone.name} ({stone.origin})
                </div>
                
                <div className="text-center my-8 relative">
                  <img 
                    src={stone.image_url} 
                    alt={stone.name}
                    className="w-full h-64 object-cover mx-auto border border-gray-300 rounded-lg shadow-lg cursor-pointer"
                    onClick={() => handleImageZoom(stone.image_url)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleImageZoom(stone.image_url)}
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
                      disabled={uploadingImages[stone.id] || imageUploadMutation.isPending}
                    />
                    <Label htmlFor={`upload-${stone.id}`} asChild>
                      <Button variant="outline" size="sm" disabled={uploadingImages[stone.id] || imageUploadMutation.isPending}>
                        {(uploadingImages[stone.id] || (imageUploadMutation.isPending && imageUploadMutation.variables?.stoneId === stone.id)) ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Trocar Imagem
                          </>
                        )}
                      </Button>
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
                    <li><strong>Origin:</strong> {stone.origin}</li>
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
                    disabled={deleteMutation.isPending && deleteMutation.variables === stone.id}
                  >
                    {deleteMutation.isPending && deleteMutation.variables === stone.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                    Deletar
                  </Button>
                </div>
              </div>
            </div>
          ))}
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
