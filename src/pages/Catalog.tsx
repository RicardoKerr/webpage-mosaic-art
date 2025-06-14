
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

interface Material {
  id: string;
  commercial_name: string;
  category: string;
  rock_type: string;
  base_color: string;
  origin: string;
  description: string;
  main_image_url: string;
  is_active: boolean;
  supplier_id: string | null;
  finishes: string[];
  applications: string[];
}

interface MaterialFormData {
  commercial_name: string;
  category: string;
  rock_type: string;
  base_color: string;
  origin: string;
  description: string;
  finishes: string;
  applications: string;
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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
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

  const fetchMaterials = async (): Promise<Material[]> => {
    console.log('Fetching materials from database...');
    
    const { data, error } = await supabase
      .from('materials')
      .select(`
        id,
        commercial_name,
        category,
        rock_type,
        base_color,
        origin,
        description,
        main_image_url,
        is_active,
        supplier_id,
        material_finishes(finish_name),
        material_applications(application_name)
      `)
      .eq('is_active', true)
      .order('commercial_name');

    if (error) {
      console.error('Error fetching materials:', error);
      throw new Error(`Could not fetch materials: ${error.message}`);
    }

    console.log('Fetched materials:', data?.length || 0);

    return data.map((material: any) => ({
      id: material.id,
      commercial_name: material.commercial_name,
      category: material.category,
      rock_type: material.rock_type,
      base_color: material.base_color,
      origin: material.origin,
      description: material.description || '',
      main_image_url: material.main_image_url || '/placeholder.svg',
      is_active: material.is_active,
      supplier_id: material.supplier_id,
      finishes: material.material_finishes?.map((f: any) => f.finish_name) || [],
      applications: material.material_applications?.map((a: any) => a.application_name) || [],
    }));
  };

  const { data: materials = [], isLoading, isError, error } = useQuery<Material[], Error>({
    queryKey: ['materials'],
    queryFn: fetchMaterials,
  });

  const uploadImageToStorage = async (file: File, materialId: string): Promise<string | null> => {
    try {
      const fileName = `materials/${materialId}/${Date.now()}_${file.name}`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('catalogosimples')
        .upload(fileName, file, {
          upsert: true,
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      const { data: urlData } = supabase.storage
        .from('catalogosimples')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      return null;
    }
  };

  const createMutation = useMutation({
    mutationFn: async (formData: MaterialFormData) => {
      console.log('Creating new material:', formData);
      
      const { data: material, error: materialError } = await supabase
        .from('materials')
        .insert({
          commercial_name: formData.commercial_name,
          category: formData.category,
          rock_type: formData.rock_type,
          base_color: formData.base_color,
          origin: formData.origin,
          description: formData.description,
          main_image_url: '/placeholder.svg',
        })
        .select('id')
        .single();
      
      if (materialError) throw materialError;
      
      const materialId = material.id;
      
      // Add finishes
      const finishes = formData.finishes.split(',').map(f => f.trim()).filter(Boolean);
      if (finishes.length > 0) {
        const { error: finishesError } = await supabase
          .from('material_finishes')
          .insert(finishes.map(finish => ({ 
            material_id: materialId, 
            finish_name: finish 
          })));
        if (finishesError) throw finishesError;
      }

      // Add applications
      const applications = formData.applications.split(',').map(a => a.trim()).filter(Boolean);
      if (applications.length > 0) {
        const { error: applicationsError } = await supabase
          .from('material_applications')
          .insert(applications.map(app => ({ 
            material_id: materialId, 
            application_name: app 
          })));
        if (applicationsError) throw applicationsError;
      }

      return materialId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      toast({ title: "Success", description: "Material created successfully." });
      handleCancel();
    },
    onError: (error: Error) => {
      console.error('Create material error:', error);
      toast({ title: "Error", description: `Failed to create material: ${error.message}`, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string, formData: MaterialFormData }) => {
      console.log('Updating material:', id, formData);
      
      // Update main material
      const { error: materialError } = await supabase
        .from('materials')
        .update({
          commercial_name: formData.commercial_name,
          category: formData.category,
          rock_type: formData.rock_type,
          base_color: formData.base_color,
          origin: formData.origin,
          description: formData.description,
        })
        .eq('id', id);

      if (materialError) throw materialError;
      
      // Update finishes
      await supabase.from('material_finishes').delete().eq('material_id', id);
      const finishes = formData.finishes.split(',').map(f => f.trim()).filter(Boolean);
      if (finishes.length > 0) {
        const { error: finishesError } = await supabase
          .from('material_finishes')
          .insert(finishes.map(finish => ({ 
            material_id: id, 
            finish_name: finish 
          })));
        if (finishesError) throw finishesError;
      }

      // Update applications
      await supabase.from('material_applications').delete().eq('material_id', id);
      const applications = formData.applications.split(',').map(a => a.trim()).filter(Boolean);
      if (applications.length > 0) {
        const { error: applicationsError } = await supabase
          .from('material_applications')
          .insert(applications.map(app => ({ 
            material_id: id, 
            application_name: app 
          })));
        if (applicationsError) throw applicationsError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      toast({ title: "Success", description: "Material updated successfully." });
      handleCancel();
    },
    onError: (error: Error) => {
      console.error('Update material error:', error);
      toast({ title: "Error", description: `Failed to update material: ${error.message}`, variant: "destructive" });
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting material:', id);
      
      // Delete related records first
      await supabase.from('material_finishes').delete().eq('material_id', id);
      await supabase.from('material_applications').delete().eq('material_id', id);
      await supabase.from('material_images').delete().eq('material_id', id);
      
      // Delete main material
      const { error } = await supabase.from('materials').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      toast({ title: 'Success', description: 'Material deleted successfully.' });
    },
    onError: (error: Error) => {
      console.error('Delete material error:', error);
      toast({ title: 'Error', description: `Failed to delete material: ${error.message}`, variant: 'destructive' });
    }
  });

  const imageUploadMutation = useMutation({
    mutationFn: async ({ file, materialId }: { file: File, materialId: string }) => {
      console.log('Uploading image for material:', materialId);
      
      const imageUrl = await uploadImageToStorage(file, materialId);
      if (!imageUrl) throw new Error("Image upload failed");

      const { error } = await supabase
        .from('materials')
        .update({ main_image_url: imageUrl })
        .eq('id', materialId);
      
      if (error) throw error;
      
      return imageUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      toast({ title: "Success", description: "Image uploaded successfully!" });
    },
    onError: (error: Error) => {
      console.error('Image upload error:', error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
    onMutate: ({ materialId }) => {
       setUploadingImages(prev => ({ ...prev, [materialId]: true }));
    },
    onSettled: (_data, _error, { materialId }) => {
      setUploadingImages(prev => {
        const newState = { ...prev };
        delete newState[materialId];
        return newState;
      });
    }
  });
  
  const bulkCreateMutation = useMutation({
    mutationFn: async (file: File) => {
      console.log('Creating material from bulk upload:', file.name);
      
      const materialId = await createMutation.mutateAsync({
        commercial_name: `New Material - ${file.name.split('.')[0]}`,
        category: 'New Releases',
        rock_type: 'Unknown',
        base_color: 'Varied',
        origin: 'Unknown',
        description: 'Awaiting description',
        finishes: '',
        applications: '',
      });

      await imageUploadMutation.mutateAsync({ file, materialId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
    onError: (error: Error) => {
      console.error('Bulk upload error:', error);
      toast({ title: 'Error during bulk upload', description: error.message, variant: 'destructive' });
    }
  });

  console.log('Current state:', {
    materialsCount: materials.length,
    editingMaterial: editingMaterial?.id,
    isAddingNew,
    uploadingImagesKeys: Object.keys(uploadingImages),
    showFilters,
    activeFilters: Object.values(filters).filter(f => f !== '').length,
    zoomedImage
  });

  const existingCategories = [...new Set(materials.map(m => m.category))];
  const existingRockTypes = [...new Set(materials.map(m => m.rock_type))];
  const existingColors = [...new Set(materials.map(m => m.base_color))];

  const [formData, setFormData] = useState<MaterialFormData>({
    commercial_name: '',
    category: '',
    rock_type: '',
    base_color: '',
    origin: '',
    description: '',
    finishes: '',
    applications: ''
  });

  const filteredMaterials = materials.filter(material => {
    const matchesCategory = !filters.category || material.category === filters.category;
    const matchesRockType = !filters.rock_type || material.rock_type === filters.rock_type;
    const matchesColor = !filters.base_color || material.base_color === filters.base_color;
    const matchesSearch = !filters.search || 
      material.commercial_name.toLowerCase().includes(filters.search.toLowerCase()) ||
      material.description.toLowerCase().includes(filters.search.toLowerCase());
    
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
      category: '',
      rock_type: '',
      base_color: '',
      search: ''
    });
  };

  const handleImageUpload = (file: File, materialId: string) => {
    imageUploadMutation.mutate({ file, materialId });
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
      commercial_name: material.commercial_name,
      category: material.category,
      rock_type: material.rock_type,
      base_color: material.base_color,
      origin: material.origin,
      description: material.description,
      finishes: material.finishes.join(', '),
      applications: material.applications.join(', '),
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar este material?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = () => {
    if (editingMaterial) {
      updateMutation.mutate({ id: editingMaterial.id, formData });
    } else if (isAddingNew) {
      createMutation.mutate(formData);
    }
  };

  const handleAdd = () => {
    setIsAddingNew(true);
    setFormData({
      commercial_name: '',
      category: '',
      rock_type: '',
      base_color: '',
      origin: '',
      description: '',
      finishes: '',
      applications: '',
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
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['materials'] })}>
          Tentar Novamente
        </Button>
      </div>
    );
  }

  if (editingMaterial || isAddingNew) {
    const currentMaterial = editingMaterial || {
      id: 'new',
      commercial_name: '',
      category: '',
      rock_type: '',
      base_color: '',
      origin: '',
      description: '',
      main_image_url: '/placeholder.svg',
      is_active: true,
      supplier_id: null,
      finishes: [],
      applications: [],
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
                  <Label htmlFor="commercial_name">Nome Comercial</Label>
                  <Input
                    id="commercial_name"
                    type="text"
                    value={formData.commercial_name}
                    onChange={(e) => handleInputChange('commercial_name', e.target.value)}
                    placeholder="Nome comercial do material"
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
                      <SelectItem value="Granitos">Granitos</SelectItem>
                      <SelectItem value="Mármores">Mármores</SelectItem>
                      <SelectItem value="Quartzitos">Quartzitos</SelectItem>
                      <SelectItem value="New Releases">New Releases</SelectItem>
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
                      <SelectItem value="Granito">Granito</SelectItem>
                      <SelectItem value="Mármore">Mármore</SelectItem>
                      <SelectItem value="Quartzito">Quartzito</SelectItem>
                      <SelectItem value="Unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
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
                      <SelectItem value="Branco">Branco</SelectItem>
                      <SelectItem value="Preto">Preto</SelectItem>
                      <SelectItem value="Cinza">Cinza</SelectItem>
                      <SelectItem value="Bege">Bege</SelectItem>
                      <SelectItem value="Marrom">Marrom</SelectItem>
                      <SelectItem value="Verde">Verde</SelectItem>
                      <SelectItem value="Azul">Azul</SelectItem>
                      <SelectItem value="Varied">Varied</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="origin">Origem</Label>
                  <Input
                    id="origin"
                    type="text"
                    value={formData.origin}
                    onChange={(e) => handleInputChange('origin', e.target.value)}
                    placeholder="País/região de origem"
                  />
                </div>

                <div>
                  <Label htmlFor="finishes">Acabamentos</Label>
                  <Input
                    id="finishes"
                    type="text"
                    value={formData.finishes}
                    onChange={(e) => handleInputChange('finishes', e.target.value)}
                    placeholder="Acabamentos disponíveis (separados por vírgula)"
                  />
                </div>

                <div>
                  <Label htmlFor="applications">Aplicações</Label>
                  <Input
                    id="applications"
                    type="text"
                    value={formData.applications}
                    onChange={(e) => handleInputChange('applications', e.target.value)}
                    placeholder="Aplicações/formatos (separados por vírgula)"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Descreva as características do material"
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Imagem Atual</Label>
                  {currentMaterial.main_image_url && (
                    <div className="relative">
                      <img 
                        src={currentMaterial.main_image_url} 
                        alt={currentMaterial.commercial_name}
                        className="w-full h-48 object-cover border border-gray-300 rounded-lg cursor-pointer"
                        onClick={() => handleImageZoom(currentMaterial.main_image_url)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => handleImageZoom(currentMaterial.main_image_url)}
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
                        if (file && currentMaterial.id !== 'new') {
                          handleImageUpload(file, currentMaterial.id);
                        }
                      }}
                      disabled={uploadingImages[currentMaterial.id] || currentMaterial.id === 'new'}
                    />
                    {uploadingImages[currentMaterial.id] && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                  </div>
                  {currentMaterial.id === 'new' && (
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
          {filteredMaterials.map((material) => (
            <div key={material.id} className="produto border border-gray-200 rounded-lg overflow-hidden shadow-lg bg-white">
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-800 pb-3 mb-4">
                  {material.commercial_name}
                </h1>
                
                <div className="font-bold text-lg mb-6">
                  Item Name: {material.commercial_name} ({material.origin})
                </div>
                
                <div className="text-center my-8 relative">
                  <img 
                    src={material.main_image_url} 
                    alt={material.commercial_name}
                    className="w-full h-64 object-cover mx-auto border border-gray-300 rounded-lg shadow-lg cursor-pointer"
                    onClick={() => handleImageZoom(material.main_image_url)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleImageZoom(material.main_image_url)}
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
                          handleImageUpload(file, material.id);
                        }
                      }}
                      className="hidden"
                      id={`upload-${material.id}`}
                      disabled={uploadingImages[material.id] || imageUploadMutation.isPending}
                    />
                    <Label htmlFor={`upload-${material.id}`} asChild>
                      <Button variant="outline" size="sm" disabled={uploadingImages[material.id] || (imageUploadMutation.isPending && imageUploadMutation.variables?.materialId === material.id)}>
                        {(uploadingImages[material.id] || (imageUploadMutation.isPending && imageUploadMutation.variables?.materialId === material.id)) ? (
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
                    <li><strong>Category:</strong> {material.category}</li>
                    <li><strong>Rock type:</strong> {material.rock_type}</li>
                    <li><strong>Available finishes:</strong> {material.finishes.join(', ') || 'N/A'}</li>
                    <li><strong>Available in:</strong> {material.applications.join(', ') || 'N/A'}</li>
                    <li><strong>Base color:</strong> {material.base_color}</li>
                    <li><strong>Origin:</strong> {material.origin}</li>
                    <li><strong>Characteristics:</strong> {material.description || 'N/A'}</li>
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
                    onClick={() => handleDelete(material.id)}
                    disabled={deleteMutation.isPending && deleteMutation.variables === material.id}
                  >
                    {deleteMutation.isPending && deleteMutation.variables === material.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
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
