
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Edit, Trash2, Plus, Upload, Filter, X, ZoomIn, ZoomOut, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useImageStorage } from '@/hooks/useImageStorage';

interface Material {
  Nome: string;
  Categoria: string;
  "Tipo de Rocha": string;
  "Acabamentos Disponíveis": string;
  "Disponível em": string;
  "Cor Base": string;
  Características: string;
  "Caminho da Imagem": string;
}

interface MaterialFormData {
  Nome: string;
  Categoria: string;
  "Tipo de Rocha": string;
  "Acabamentos Disponíveis": string;
  "Disponível em": string;
  "Cor Base": string;
  Características: string;
}

interface Filters {
  Categoria: string;
  "Tipo de Rocha": string;
  "Cor Base": string;
  search: string;
}

const Catalog = () => {
  console.log('=== RENDERIZANDO CATALOG ===');
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { uploadImage } = useImageStorage();

  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<{[key: string]: boolean}>({});
  const [showFilters, setShowFilters] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    Categoria: '',
    "Tipo de Rocha": '',
    "Cor Base": '',
    search: ''
  });

  const fetchMaterials = async (): Promise<Material[]> => {
    console.log('Fetching materials from aralogo_simples table...');
    
    const { data, error } = await supabase
      .from('aralogo_simples')
      .select('*');

    if (error) {
      console.error('Error fetching materials:', error);
      throw new Error(`Could not fetch materials: ${error.message}`);
    }

    console.log('Fetched materials:', data?.length || 0);
    
    return data || [];
  };

  const { data: materials = [], isLoading, isError, error } = useQuery<Material[], Error>({
    queryKey: ['aralogo_materials'],
    queryFn: fetchMaterials,
  });

  const createMutation = useMutation({
    mutationFn: async (formData: MaterialFormData) => {
      console.log('Creating new material:', formData);
      
      const { error } = await supabase
        .from('aralogo_simples')
        .insert({
          Nome: formData.Nome,
          Categoria: formData.Categoria,
          "Tipo de Rocha": formData["Tipo de Rocha"],
          "Acabamentos Disponíveis": formData["Acabamentos Disponíveis"],
          "Disponível em": formData["Disponível em"],
          "Cor Base": formData["Cor Base"],
          Características: formData.Características,
          "Caminho da Imagem": '/placeholder.svg',
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aralogo_materials'] });
      toast({ title: "Success", description: "Material created successfully." });
      handleCancel();
    },
    onError: (error: Error) => {
      console.error('Create material error:', error);
      toast({ title: "Error", description: `Failed to create material: ${error.message}`, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ originalName, formData }: { originalName: string, formData: MaterialFormData }) => {
      console.log('Updating material:', originalName, formData);
      
      const { error } = await supabase
        .from('aralogo_simples')
        .update({
          Nome: formData.Nome,
          Categoria: formData.Categoria,
          "Tipo de Rocha": formData["Tipo de Rocha"],
          "Acabamentos Disponíveis": formData["Acabamentos Disponíveis"],
          "Disponível em": formData["Disponível em"],
          "Cor Base": formData["Cor Base"],
          Características: formData.Características,
        })
        .eq('Nome', originalName);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aralogo_materials'] });
      toast({ title: "Success", description: "Material updated successfully." });
      handleCancel();
    },
    onError: (error: Error) => {
      console.error('Update material error:', error);
      toast({ title: "Error", description: `Failed to update material: ${error.message}`, variant: "destructive" });
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (nome: string) => {
      console.log('Deleting material:', nome);
      
      const { error } = await supabase
        .from('aralogo_simples')
        .delete()
        .eq('Nome', nome);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aralogo_materials'] });
      toast({ title: 'Success', description: 'Material deleted successfully.' });
    },
    onError: (error: Error) => {
      console.error('Delete material error:', error);
      toast({ title: 'Error', description: `Failed to delete material: ${error.message}`, variant: 'destructive' });
    }
  });

  const imageUploadMutation = useMutation({
    mutationFn: async ({ file, materialName }: { file: File, materialName: string }) => {
      console.log('Uploading image for material:', materialName);
      
      const imageUrl = await uploadImage.mutateAsync({ file, materialId: materialName });
      
      const { error } = await supabase
        .from('aralogo_simples')
        .update({ "Caminho da Imagem": imageUrl })
        .eq('Nome', materialName);
      
      if (error) throw error;
      
      return imageUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aralogo_materials'] });
      toast({ title: "Success", description: "Image uploaded successfully!" });
    },
    onError: (error: Error) => {
      console.error('Image upload error:', error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
    onMutate: ({ materialName }) => {
       setUploadingImages(prev => ({ ...prev, [materialName]: true }));
    },
    onSettled: (_data, _error, { materialName }) => {
      setUploadingImages(prev => {
        const newState = { ...prev };
        delete newState[materialName];
        return newState;
      });
    }
  });
  
  const bulkCreateMutation = useMutation({
    mutationFn: async (file: File) => {
      console.log('Creating material from bulk upload:', file.name);
      
      const materialName = `New Material - ${file.name.split('.')[0]}`;
      
      await createMutation.mutateAsync({
        Nome: materialName,
        Categoria: 'New Releases',
        "Tipo de Rocha": 'Unknown',
        "Cor Base": 'Varied',
        "Acabamentos Disponíveis": 'Polished',
        "Disponível em": 'Slab',
        Características: 'Awaiting description',
      });

      await imageUploadMutation.mutateAsync({ file, materialName });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aralogo_materials'] });
    },
    onError: (error: Error) => {
      console.error('Bulk upload error:', error);
      toast({ title: 'Error during bulk upload', description: error.message, variant: 'destructive' });
    }
  });

  console.log('Current state:', {
    materialsCount: materials.length,
    editingMaterial: editingMaterial?.Nome,
    isAddingNew,
    uploadingImagesKeys: Object.keys(uploadingImages),
    showFilters,
    activeFilters: Object.values(filters).filter(f => f !== '').length,
    zoomedImage
  });

  const existingCategories = [...new Set(materials.map(m => m.Categoria).filter(Boolean))];
  const existingRockTypes = [...new Set(materials.map(m => m["Tipo de Rocha"]).filter(Boolean))];
  const existingColors = [...new Set(materials.map(m => m["Cor Base"]).filter(Boolean))];

  const [formData, setFormData] = useState<MaterialFormData>({
    Nome: '',
    Categoria: '',
    "Tipo de Rocha": '',
    "Cor Base": '',
    "Acabamentos Disponíveis": '',
    "Disponível em": '',
    Características: ''
  });

  const filteredMaterials = materials.filter(material => {
    const matchesCategory = !filters.Categoria || material.Categoria === filters.Categoria;
    const matchesRockType = !filters["Tipo de Rocha"] || material["Tipo de Rocha"] === filters["Tipo de Rocha"];
    const matchesColor = !filters["Cor Base"] || material["Cor Base"] === filters["Cor Base"];
    const matchesSearch = !filters.search || 
      material.Nome?.toLowerCase().includes(filters.search.toLowerCase()) ||
      material.Características?.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesCategory && matchesRockType && matchesColor && matchesSearch;
  });

  const handleInputChange = (key: keyof MaterialFormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      Categoria: '',
      "Tipo de Rocha": '',
      "Cor Base": '',
      search: ''
    });
  };

  const handleImageUpload = (file: File, materialName: string) => {
    imageUploadMutation.mutate({ file, materialName });
  };

  const handleBulkImageUpload = async (files: FileList) => {
    console.log('=== INÍCIO UPLOAD EM LOTE ===');
    console.log('Arquivos selecionados:', files.length);
    
    toast({
      title: "Upload em lote iniciado",
      description: `Processando ${files.length} imagens...`,
    });

    for (const file of Array.from(files)) {
      bulkCreateMutation.mutate(file);
    }
  };

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setFormData({
      Nome: material.Nome || '',
      Categoria: material.Categoria || '',
      "Tipo de Rocha": material["Tipo de Rocha"] || '',
      "Cor Base": material["Cor Base"] || '',
      "Acabamentos Disponíveis": material["Acabamentos Disponíveis"] || '',
      "Disponível em": material["Disponível em"] || '',
      Características: material.Características || '',
    });
  };

  const handleDelete = (nome: string) => {
    if (window.confirm('Tem certeza que deseja deletar este material?')) {
      deleteMutation.mutate(nome);
    }
  };

  const handleSave = () => {
    if (editingMaterial) {
      updateMutation.mutate({ originalName: editingMaterial.Nome, formData });
    } else if (isAddingNew) {
      createMutation.mutate(formData);
    }
  };

  const handleAdd = () => {
    setIsAddingNew(true);
    setFormData({
      Nome: '',
      Categoria: '',
      "Tipo de Rocha": '',
      "Cor Base": '',
      "Acabamentos Disponíveis": '',
      "Disponível em": '',
      Características: '',
    });
  };

  const handleCancel = () => {
    setEditingMaterial(null);
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
        <span className="ml-4 text-lg">Carregando materiais...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-red-500">
        <h2 className="text-xl font-bold mb-2">Erro ao carregar materiais</h2>
        <p className="text-gray-600 mb-4">{error?.message}</p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['aralogo_materials'] })}>
          Tentar Novamente
        </Button>
      </div>
    );
  }

  if (editingMaterial || isAddingNew) {
    const currentMaterial = editingMaterial || {
      Nome: '',
      Categoria: '',
      "Tipo de Rocha": '',
      "Cor Base": '',
      "Acabamentos Disponíveis": '',
      "Disponível em": '',
      Características: '',
      "Caminho da Imagem": '/placeholder.svg',
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
                  <Label htmlFor="Nome">Nome</Label>
                  <Input
                    id="Nome"
                    type="text"
                    value={formData.Nome}
                    onChange={(e) => handleInputChange('Nome', e.target.value)}
                    placeholder="Nome do material"
                  />
                </div>

                <div>
                  <Label htmlFor="Categoria">Categoria</Label>
                  <Select value={formData.Categoria} onValueChange={(value) => handleInputChange('Categoria', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {existingCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                      <SelectItem value="Noble Stones">Noble Stones</SelectItem>
                      <SelectItem value="New Releases">New Releases</SelectItem>
                      <SelectItem value="Exotics">Exotics</SelectItem>
                      <SelectItem value="Classics">Classics</SelectItem>
                      <SelectItem value="Granites">Granites</SelectItem>
                      <SelectItem value="Quartzites">Quartzites</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="Tipo de Rocha">Tipo de Rocha</Label>
                  <Select value={formData["Tipo de Rocha"]} onValueChange={(value) => handleInputChange('Tipo de Rocha', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de rocha" />
                    </SelectTrigger>
                    <SelectContent>
                      {existingRockTypes.map(rockType => (
                        <SelectItem key={rockType} value={rockType}>{rockType}</SelectItem>
                      ))}
                      <SelectItem value="Marble">Marble</SelectItem>
                      <SelectItem value="Granite">Granite</SelectItem>
                      <SelectItem value="Quartzite">Quartzite</SelectItem>
                      <SelectItem value="Quartz">Quartz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="Cor Base">Cor Base</Label>
                  <Select value={formData["Cor Base"]} onValueChange={(value) => handleInputChange('Cor Base', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a cor base" />
                    </SelectTrigger>
                    <SelectContent>
                      {existingColors.map(color => (
                        <SelectItem key={color} value={color}>{color}</SelectItem>
                      ))}
                      <SelectItem value="White">White</SelectItem>
                      <SelectItem value="Black">Black</SelectItem>
                      <SelectItem value="Gray">Gray</SelectItem>
                      <SelectItem value="Beige">Beige</SelectItem>
                      <SelectItem value="Green">Green</SelectItem>
                      <SelectItem value="Blue">Blue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="Acabamentos Disponíveis">Acabamentos Disponíveis</Label>
                  <Input
                    id="Acabamentos Disponíveis"
                    type="text"
                    value={formData["Acabamentos Disponíveis"]}
                    onChange={(e) => handleInputChange('Acabamentos Disponíveis', e.target.value)}
                    placeholder="Ex: Polished, Honed"
                  />
                </div>

                <div>
                  <Label htmlFor="Disponível em">Disponível em</Label>
                  <Input
                    id="Disponível em"
                    type="text"
                    value={formData["Disponível em"]}
                    onChange={(e) => handleInputChange('Disponível em', e.target.value)}
                    placeholder="Ex: Slab, Tiles"
                  />
                </div>

                <div>
                  <Label htmlFor="Características">Características</Label>
                  <Textarea
                    id="Características"
                    value={formData.Características}
                    onChange={(e) => handleInputChange('Características', e.target.value)}
                    placeholder="Descreva as características do material"
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Imagem Atual</Label>
                  {currentMaterial["Caminho da Imagem"] && (
                    <div className="relative">
                      <img 
                        src={currentMaterial["Caminho da Imagem"]} 
                        alt={currentMaterial.Nome}
                        className="w-full h-48 object-cover border border-gray-300 rounded-lg cursor-pointer"
                        onClick={() => handleImageZoom(currentMaterial["Caminho da Imagem"])}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => handleImageZoom(currentMaterial["Caminho da Imagem"])}
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
                        if (file && currentMaterial.Nome !== '') {
                          handleImageUpload(file, currentMaterial.Nome);
                        }
                      }}
                      disabled={uploadingImages[currentMaterial.Nome] || currentMaterial.Nome === ''}
                    />
                    {uploadingImages[currentMaterial.Nome] && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                  </div>
                  {currentMaterial.Nome === '' && (
                    <p className="text-sm text-gray-500 mt-1">
                      Salve o material primeiro para fazer upload da imagem
                    </p>
                  )}
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
                    placeholder="Nome ou descrição..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="category-filter">Categoria</Label>
                  <Select value={filters.Categoria} onValueChange={(value) => handleFilterChange('Categoria', value)}>
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
                  <Select value={filters["Tipo de Rocha"]} onValueChange={(value) => handleFilterChange('Tipo de Rocha', value)}>
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
                  <Select value={filters["Cor Base"]} onValueChange={(value) => handleFilterChange('Cor Base', value)}>
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
                  Mostrando {filteredMaterials.length} de {materials.length} materiais
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
          {filteredMaterials.map((material, index) => (
            <div key={`${material.Nome}-${index}`} className="produto border border-gray-200 rounded-lg overflow-hidden shadow-lg bg-white">
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-800 pb-3 mb-4">
                  {material.Nome}
                </h1>
                
                <div className="font-bold text-lg mb-6">
                  Item Name: {material.Nome}
                </div>
                
                <div className="text-center my-8 relative">
                  <img 
                    src={material["Caminho da Imagem"] || '/placeholder.svg'} 
                    alt={material.Nome}
                    className="w-full h-64 object-cover mx-auto border border-gray-300 rounded-lg shadow-lg cursor-pointer"
                    onClick={() => handleImageZoom(material["Caminho da Imagem"] || '/placeholder.svg')}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleImageZoom(material["Caminho da Imagem"] || '/placeholder.svg')}
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
                          handleImageUpload(file, material.Nome);
                        }
                      }}
                      className="hidden"
                      id={`upload-${material.Nome}-${index}`}
                      disabled={uploadingImages[material.Nome] || imageUploadMutation.isPending}
                    />
                    <Label htmlFor={`upload-${material.Nome}-${index}`} asChild>
                      <Button variant="outline" size="sm" disabled={uploadingImages[material.Nome] || (imageUploadMutation.isPending && imageUploadMutation.variables?.materialName === material.Nome)}>
                        {(uploadingImages[material.Nome] || (imageUploadMutation.isPending && imageUploadMutation.variables?.materialName === material.Nome)) ? (
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
                    <li><strong>Category:</strong> {material.Categoria}</li>
                    <li><strong>Rock type:</strong> {material["Tipo de Rocha"]}</li>
                    <li><strong>Available finishes:</strong> {material["Acabamentos Disponíveis"] || 'N/A'}</li>
                    <li><strong>Available in:</strong> {material["Disponível em"] || 'N/A'}</li>
                    <li><strong>Base color:</strong> {material["Cor Base"]}</li>
                    <li><strong>Characteristics:</strong> {material.Características || 'N/A'}</li>
                  </ul>
                </div>

                <div className="flex justify-between mt-4">
                  <Button 
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(material)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  <Button 
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(material.Nome)}
                    disabled={deleteMutation.isPending && deleteMutation.variables === material.Nome}
                  >
                    {deleteMutation.isPending && deleteMutation.variables === material.Nome ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                    Deletar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMaterials.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {materials.length === 0 ? 'Nenhum material cadastrado ainda.' : 'Nenhum material encontrado com os filtros aplicados.'}
            </p>
            {materials.length === 0 ? (
              <Button onClick={handleAdd} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Primeiro Material
              </Button>
            ) : (
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Limpar Filtros
              </Button>
            )}
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
