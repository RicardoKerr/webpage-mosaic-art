import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LogOut, ZoomIn, ZoomOut, Plus } from 'lucide-react';
import FilterBar from '@/components/catalog/FilterBar';
import StoneCard from '@/components/catalog/StoneCard';
import StoneForm from '@/components/catalog/StoneForm';
import ImageZoomModal from '@/components/catalog/ImageZoomModal';
import { Filters, Stone, StoneFormData } from '@/components/catalog/types';
import { useImageUpload } from '@/hooks/useImageUpload';

const fetchStones = async (): Promise<Stone[]> => {
  const {
    data,
    error
  } = await supabase.from('aralogo_simples').select('"Nome", "Categoria", "Tipo de Rocha", "Acabamentos Disponíveis", "Disponível em", "Cor Base", "Características", "Caminho da Imagem", "Imagem_Name_Site", "Enable_On_Off"');
  if (error) {
    console.error('Error fetching stones:', error);
    throw new Error('Could not fetch stones');
  }
  if (!data) {
    return [];
  }
  return data.filter(item => item['Nome'] && item['Enable_On_Off'] === true).map((item: any, index: number) => ({
    id: item['Nome'] || `stone-${index}`,
    name: item['Nome'] || 'N/A',
    category: item['Categoria'] || 'N/A',
    rock_type: item['Tipo de Rocha'] || 'N/A',
    finishes: item['Acabamentos Disponíveis'] || 'N/A',
    available_in: item['Disponível em'] || 'N/A',
    base_color: item['Cor Base'] || 'N/A',
    characteristics: item['Características'] || 'N/A',
    image_filename: item['Imagem_Name_Site'] || '',
    image_url: item['Caminho da Imagem'] || undefined,
    enable_on_off: item['Enable_On_Off'] || false
  }));
};

const Catalog = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { uploadImage, getImageUrl } = useImageUpload();
  const queryClient = useQueryClient();
  
  const [user, setUser] = useState<{
    id: string;
    email: string;
    is_admin: boolean;
    status: string;
  } | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStone, setEditingStone] = useState<Stone | null>(null);
  const [uploadingImages, setUploadingImages] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState<StoneFormData>({
    name: '',
    category: '',
    rock_type: '',
    finishes: '',
    available_in: '',
    base_color: '',
    characteristics: ''
  });
  
  useEffect(() => {
    const storedUser = localStorage.getItem('aralogo_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/auth');
    }
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('aralogo_user');
    navigate('/auth');
    toast({
      title: "Logout realizado com sucesso!",
      description: "Redirecionando para a página de autenticação."
    });
  };
  
  const handleImageZoom = (imageUrl: string) => {
    setZoomedImage(imageUrl);
  };
  
  const closeZoom = () => {
    setZoomedImage(null);
  };
  
  const {
    data: stones = [],
    isLoading,
    isError
  } = useQuery<Stone[]>({
    queryKey: ['aralogo_simples'],
    queryFn: fetchStones
  });
  
  const [filters, setFilters] = useState<Filters>({
    search: '',
    category: 'all',
    rock_type: 'all',
    base_color: 'all'
  });
  
  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: value
    }));
  };
  
  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      rock_type: 'all',
      base_color: 'all'
    });
  };

  const resetForm = () => {
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

  // Add Stone Mutation
  const addStoneMutation = useMutation({
    mutationFn: async (stoneData: StoneFormData) => {
      const { data, error } = await supabase
        .from('aralogo_simples')
        .insert([{
          'Nome': stoneData.name,
          'Categoria': stoneData.category,
          'Tipo de Rocha': stoneData.rock_type,
          'Acabamentos Disponíveis': stoneData.finishes,
          'Disponível em': stoneData.available_in,
          'Cor Base': stoneData.base_color,
          'Características': stoneData.characteristics,
          'Enable_On_Off': true
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aralogo_simples'] });
      setIsFormOpen(false);
      resetForm();
      toast({
        title: "Pedra adicionada com sucesso!",
        description: "A nova pedra foi cadastrada no catálogo."
      });
    },
    onError: (error) => {
      console.error('Error adding stone:', error);
      toast({
        title: "Erro ao adicionar pedra",
        description: "Não foi possível adicionar a pedra. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  // Update Stone Mutation
  const updateStoneMutation = useMutation({
    mutationFn: async ({ id, stoneData }: { id: string, stoneData: StoneFormData }) => {
      const { data, error } = await supabase
        .from('aralogo_simples')
        .update({
          'Nome': stoneData.name,
          'Categoria': stoneData.category,
          'Tipo de Rocha': stoneData.rock_type,
          'Acabamentos Disponíveis': stoneData.finishes,
          'Disponível em': stoneData.available_in,
          'Cor Base': stoneData.base_color,
          'Características': stoneData.characteristics
        })
        .eq('Nome', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aralogo_simples'] });
      setIsFormOpen(false);
      setEditingStone(null);
      resetForm();
      toast({
        title: "Pedra atualizada com sucesso!",
        description: "As informações da pedra foram atualizadas."
      });
    },
    onError: (error) => {
      console.error('Error updating stone:', error);
      toast({
        title: "Erro ao atualizar pedra",
        description: "Não foi possível atualizar a pedra. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  // Delete Stone Mutation
  const deleteStoneMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('aralogo_simples')
        .delete()
        .eq('Nome', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aralogo_simples'] });
      toast({
        title: "Pedra removida com sucesso!",
        description: "A pedra foi removida do catálogo."
      });
    },
    onError: (error) => {
      console.error('Error deleting stone:', error);
      toast({
        title: "Erro ao remover pedra",
        description: "Não foi possível remover a pedra. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  const handleAddStone = () => {
    setEditingStone(null);
    resetForm();
    setIsFormOpen(true);
  };

  const handleEditStone = (stone: Stone) => {
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
    setIsFormOpen(true);
  };

  const handleDeleteStone = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover esta pedra?')) {
      deleteStoneMutation.mutate(id);
    }
  };

  const handleInputChange = (key: keyof StoneFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    if (editingStone) {
      updateStoneMutation.mutate({ id: editingStone.id, stoneData: formData });
    } else {
      addStoneMutation.mutate(formData);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingStone(null);
    resetForm();
  };

  const handleImageUpload = async (file: File, stoneId: string) => {
    setUploadingImages(prev => new Set(prev).add(stoneId));
    
    try {
      const imageUrl = await uploadImage(file, stoneId);
      
      const { error } = await supabase
        .from('aralogo_simples')
        .update({
          'Caminho da Imagem': imageUrl,
          'Imagem_Name_Site': file.name
        })
        .eq('Nome', stoneId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['aralogo_simples'] });
      
      toast({
        title: "Imagem carregada com sucesso!",
        description: "A imagem foi associada à pedra."
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erro ao carregar imagem",
        description: "Não foi possível carregar a imagem. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setUploadingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(stoneId);
        return newSet;
      });
    }
  };
  
  const filteredStones = stones.filter(stone => {
    const searchRegex = new RegExp(filters.search, 'i');
    const searchMatch = searchRegex.test(stone.name) || searchRegex.test(stone.characteristics);
    const categoryMatch = filters.category === 'all' || stone.category === filters.category;
    const rockTypeMatch = filters.rock_type === 'all' || stone.rock_type === filters.rock_type;
    const colorMatch = filters.base_color === 'all' || stone.base_color === filters.base_color;
    return searchMatch && categoryMatch && rockTypeMatch && colorMatch;
  });
  
  // Ordenação crescente (alfabética) dos filtros
  const existingCategories = [...new Set(stones.map(stone => stone.category))].filter(Boolean).sort() as string[];
  const existingRockTypes = [...new Set(stones.map(stone => stone.rock_type))].filter(Boolean).sort() as string[];
  const existingColors = [...new Set(stones.map(stone => stone.base_color))].filter(Boolean).sort() as string[];
  
  if (isLoading) {
    return <div className="min-h-screen bg-white flex items-center justify-center">
      <p>Carregando pedras...</p>
    </div>;
  }
  if (isError) {
    return <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-red-500">Erro ao carregar as pedras. Tente novamente.</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900">Natural Stones Catalog</h1>
        </div>

        {/* User Info and Logout */}
        {user && (
          <div className="flex items-center gap-4">
            {user.is_admin && (
              <span className="flex items-center px-4 py-1 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-800 font-medium text-sm gap-1">
                <svg className="h-4 w-4 text-yellow-700 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4V8a4 4 0 1 0-8 0v0c0 2.21 1.79 4 4 4Zm0 0v6m-6 0a6 6 0 0 1 12 0H6Z" />
                </svg>
                Administrator
              </span>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" alt={user.email} />
                    <AvatarFallback>{user.email.substring(0, 1).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>{user.email}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <FilterBar 
              filters={filters} 
              onFilterChange={handleFilterChange} 
              onClearFilters={clearFilters} 
              existingCategories={existingCategories} 
              existingRockTypes={existingRockTypes} 
              existingColors={existingColors} 
              filteredCount={filteredStones.length} 
              totalCount={stones.length} 
            />
          </div>
          
          {user?.is_admin && (
            <Button onClick={handleAddStone} className="ml-4">
              <Plus className="mr-2 h-4 w-4" />
              Add Stone
            </Button>
          )}
        </div>

        {/* Grid com StoneCard components */}
        <div className="mt-6">
          {filteredStones.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-700 font-semibold">Nenhuma pedra encontrada.</p>
              <p className="text-gray-500">Tente ajustar os filtros de pesquisa.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredStones.map(stone => {
                const imageIdentifier = stone.image_filename || stone.name;
                const imageUrl = getImageUrl(imageIdentifier);
                const isUploading = uploadingImages.has(stone.id);

                return user?.is_admin ? (
                  <StoneCard
                    key={stone.id}
                    stone={stone}
                    imageUrl={imageUrl}
                    isUploading={isUploading}
                    onEdit={handleEditStone}
                    onDelete={handleDeleteStone}
                    onImageUpload={handleImageUpload}
                    onImageZoom={handleImageZoom}
                  />
                ) : (
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
                            console.error('Error loading image:', imageUrl, 'for stone:', stone.name);
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
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Stone Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingStone ? 'Edit Stone' : 'Add New Stone'}
              </DialogTitle>
            </DialogHeader>
            <StoneForm
              isAddingNew={!editingStone}
              editingStone={editingStone}
              formData={formData}
              onInputChange={handleInputChange}
              onSave={handleSave}
              onCancel={handleCancel}
              onImageUpload={handleImageUpload}
              onImageZoom={handleImageZoom}
              getImageUrl={getImageUrl}
              isUploading={uploadingImages.has(editingStone?.id || '')}
              isSaving={addStoneMutation.isPending || updateStoneMutation.isPending}
              existingCategories={existingCategories}
              existingRockTypes={existingRockTypes}
              existingColors={existingColors}
            />
          </DialogContent>
        </Dialog>

        {/* Image Zoom Modal */}
        <ImageZoomModal 
          imageUrl={zoomedImage} 
          onClose={closeZoom} 
        />
      </div>
    </div>
  );
};

export default Catalog;
