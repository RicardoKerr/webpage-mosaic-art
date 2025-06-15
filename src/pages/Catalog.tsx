import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, LogOut } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

import { Stone, Filters, StoneFormData } from '@/components/catalog/types';
import CatalogHeader from '@/components/catalog/CatalogHeader';
import FilterBar from '@/components/catalog/FilterBar';
import StoneCard from '@/components/catalog/StoneCard';
import StoneForm from '@/components/catalog/StoneForm';
import ImageZoomModal from '@/components/catalog/ImageZoomModal';

interface AraUser {
  id: string;
  email: string;
  is_admin: boolean;
  status: string;
}

const Catalog = () => {
  const navigate = useNavigate();
  const { uploadImage, getImageUrl, isSupabaseConfigured } = useImageUpload();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState<AraUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('aralogo_user');
      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUser(user);
      } else {
        navigate('/user');
      }
      setLoadingAuth(false);
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('aralogo_user');
    setCurrentUser(null);
    toast({
      title: "Logout realizado com sucesso!",
    });
    navigate('/user');
  };

  const { data: fetchedStones, isLoading, isError, error } = useQuery<Stone[]>({
    queryKey: ['stones'],
    queryFn: async () => {
      console.log('--- NEW FETCH ATTEMPT ---');
      const { data, error: fetchError, status, statusText } = await supabase
        .from('aralogo_simples')
        .select('*')
        .order('id', { ascending: true });

      console.log('Supabase response status:', status, statusText);
      console.log('Supabase response error:', fetchError);
      console.log('Supabase raw data:', data);

      if (fetchError) {
        console.error('Error fetching stones:', fetchError.message);
        toast({
          title: "Erro ao buscar dados",
          description: `Não foi possível carregar o catálogo: ${fetchError.message}`,
          variant: "destructive",
        });
        throw new Error(fetchError.message);
      }
      
      if (!data) {
        console.log('No data object in response from Supabase.');
        return [];
      }
      
      if (data.length === 0) {
        console.log('Data array from Supabase is empty.');
        return [];
      }

      console.log(`Found ${data.length} stones raw from DB. Mapping them now.`);

      const mappedStones = data.map(stone => {
        if (!stone || typeof stone.id === 'undefined' || stone.id === null) {
            console.warn('Skipping an invalid stone object from DB:', stone);
            return null;
        }
        return {
            id: stone.id.toString(),
            name: stone['Nome'] || 'Nome não disponível',
            category: stone['Categoria'] || 'Sem categoria',
            rock_type: stone['Tipo de Rocha'] || 'Não especificado',
            finishes: stone['Acabamentos Disponíveis'] || 'Não especificado',
            available_in: stone['Disponível em'] || 'Não especificado',
            base_color: stone['Cor Base'] || 'Não especificado',
            characteristics: stone['Características'] || 'Sem descrição',
            image_filename: stone['Imagem_Name_Site'] || '',
            image_url: '',
        };
      }).filter(Boolean) as Stone[];

      console.log('Mapped stones ready for the app:', mappedStones);
      return mappedStones;
    },
    enabled: !!currentUser
  });

  const [stones, setStones] = useState<Stone[]>([]);
  const [editingStone, setEditingStone] = useState<Stone | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<{[key: string]: boolean}>({});
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    category: '',
    rock_type: '',
    base_color: '',
    search: ''
  });

  useEffect(() => {
    if (fetchedStones) {
      console.log('Setting stones from fetchedStones:', fetchedStones);
      setStones(fetchedStones);
    }
  }, [fetchedStones]);

  const createStoneMutation = useMutation({
    mutationFn: async (newStoneData: StoneFormData) => {
      const dbData = {
        'Nome': newStoneData.name,
        'Categoria': newStoneData.category,
        'Tipo de Rocha': newStoneData.rock_type,
        'Acabamentos Disponíveis': newStoneData.finishes,
        'Disponível em': newStoneData.available_in,
        'Cor Base': newStoneData.base_color,
        'Características': newStoneData.characteristics,
      };
      const { error } = await supabase.from('aralogo_simples').insert(dbData).select();
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Nova pedra adicionada." });
      queryClient.invalidateQueries({ queryKey: ['stones'] });
      setIsAddingNew(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({ title: "Erro", description: `Não foi possível adicionar a pedra: ${error.message}`, variant: "destructive" });
    },
  });

  const updateStoneMutation = useMutation({
    mutationFn: async ({ oldStone, newStoneData }: { oldStone: Stone, newStoneData: Partial<Stone> & { id: string } }) => {
      const { id, ...data } = newStoneData;
      
      const dbData = {
        'Nome': data.name,
        'Categoria': data.category,
        'Tipo de Rocha': data.rock_type,
        'Acabamentos Disponíveis': data.finishes,
        'Disponível em': data.available_in,
        'Cor Base': data.base_color,
        'Características': data.characteristics,
      };

      const { error: updateError } = await supabase.from('aralogo_simples').update(dbData).eq('id', Number(id));
      if (updateError) throw new Error(updateError.message);

      const changes: Record<string, { from: any; to: any }> = {};
      const keyMapping: { [key in keyof StoneFormData]: string } = {
          name: 'Nome',
          category: 'Categoria',
          rock_type: 'Tipo de Rocha',
          finishes: 'Acabamentos Disponíveis',
          available_in: 'Disponível em',
          base_color: 'Cor Base',
          characteristics: 'Características',
      };
      
      for (const key of Object.keys(keyMapping) as Array<keyof StoneFormData>) {
          if (oldStone[key] !== data[key]) {
              changes[keyMapping[key]] = {
                  from: oldStone[key],
                  to: data[key],
              };
          }
      }
      
      if (Object.keys(changes).length > 0 && currentUser) {
        const { error: logError } = await supabase.from('aralogo_changes').insert({
            stone_id: Number(id),
            user_email: currentUser.email,
            changes: changes,
        });

        if (logError) {
          console.error("Failed to log changes:", logError.message);
        }
      }
    },
    onSuccess: () => {
      toast({ title: "Sucesso", description: "Pedra atualizada." });
      queryClient.invalidateQueries({ queryKey: ['stones'] });
      setEditingStone(null);
      resetForm();
    },
    onError: (error: Error) => {
      toast({ title: "Erro", description: `Não foi possível atualizar a pedra: ${error.message}`, variant: "destructive" });
    },
  });

  const deleteStoneMutation = useMutation({
      mutationFn: async (stoneId: string) => {
          const { error } = await supabase.from('aralogo_simples').delete().eq('id', Number(stoneId));
          if (error) { throw new Error(error.message); }
      },
      onSuccess: () => {
          toast({ title: "Sucesso", description: "Pedra deletada." });
          queryClient.invalidateQueries({ queryKey: ['stones'] });
      },
      onError: (error: Error) => {
          toast({ title: "Erro", description: `Não foi possível deletar a pedra: ${error.message}`, variant: "destructive" });
      }
  });

  const updateImageMutation = useMutation({
    mutationFn: async ({ stoneId, fileName }: { stoneId: string, fileName: string }) => {
        const { error } = await supabase
            .from('aralogo_simples')
            .update({ 'Imagem_Name_Site': fileName })
            .eq('id', Number(stoneId));
        if (error) throw new Error(error.message);
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['stones'] });
        toast({ title: "Sucesso", description: "Imagem atualizada com sucesso!" });
    },
    onError: (error: Error) => {
        toast({ title: "Erro", description: `Não foi possível salvar a referência da imagem: ${error.message}`, variant: "destructive" });
    }
  });

  const existingCategories = [...new Set(stones.map(stone => stone.category))].filter(Boolean);
  const existingRockTypes = [...new Set(stones.map(stone => stone.rock_type))].filter(Boolean);
  const existingColors = [...new Set(stones.map(stone => stone.base_color))].filter(Boolean);

  const [formData, setFormData] = useState<StoneFormData>({
    name: '',
    category: '',
    rock_type: '',
    finishes: '',
    available_in: '',
    base_color: '',
    characteristics: ''
  });

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

  const filteredStones = stones.filter(stone => {
    const matchesCategory = !filters.category || filters.category === 'all' || stone.category === filters.category;
    const matchesRockType = !filters.rock_type || filters.rock_type === 'all' || stone.rock_type === filters.rock_type;
    const matchesColor = !filters.base_color || filters.base_color === 'all' || stone.base_color === filters.base_color;
    const matchesSearch = !filters.search || 
      stone.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      stone.characteristics.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesCategory && matchesRockType && matchesColor && matchesSearch;
  });

  console.log('Stones array:', stones);
  console.log('Filtered stones:', filteredStones);
  console.log('Is loading:', isLoading);
  console.log('Is error:', isError);

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

  const handleImageUpload = async (file: File, stoneId: string) => {
    if (!isSupabaseConfigured) {
      toast({
        title: "Supabase não configurado",
        description: "Para fazer upload de imagens, conecte seu projeto ao Supabase nas configurações.",
        variant: "destructive",
      });
      return;
    }
    
    setUploadingImages(prev => ({ ...prev, [stoneId]: true }));
    
    try {
      const fileName = `image_${stoneId}_${Date.now()}.${file.name.split('.').pop()}`;
      const imageUrl = await uploadImage(file, fileName);
      
      if (imageUrl) {
        updateImageMutation.mutate({ stoneId, fileName });
        
        if (editingStone && editingStone.id === stoneId) {
          setEditingStone(prev => prev ? { ...prev, image_filename: fileName } : null);
        }
      } else {
        toast({
          title: "Erro",
          description: "Falha ao enviar imagem. Verifique a configuração do Supabase.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro inesperado ao enviar imagem.",
        variant: "destructive",
      });
    } finally {
      setUploadingImages(prev => {
        const newState = { ...prev };
        delete newState[stoneId];
        return newState;
      });
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
    setIsAddingNew(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza de que deseja deletar esta pedra? Esta ação não pode ser desfeita.')) {
      deleteStoneMutation.mutate(id);
    }
  };

  const handleSave = () => {
    if (editingStone) {
      updateStoneMutation.mutate({ oldStone: editingStone, newStoneData: { id: editingStone.id, ...formData } });
    } else if (isAddingNew) {
      createStoneMutation.mutate(formData);
    }
  };

  const handleAdd = () => {
    setIsAddingNew(true);
    setEditingStone(null);
    resetForm();
  };

  const handleCancel = () => {
    setEditingStone(null);
    setIsAddingNew(false);
    resetForm();
  };

  const handleImageZoom = (imageUrl: string) => {
    setZoomedImage(imageUrl);
  };

  const closeZoom = () => {
    setZoomedImage(null);
  };

  if (loadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg">Carregando...</p>
          <p className="text-sm text-gray-500">Verificando autenticação</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null; // Will redirect to /user
  }

  if (editingStone || isAddingNew) {
    return (
      <StoneForm
        isAddingNew={isAddingNew}
        editingStone={editingStone}
        formData={formData}
        onInputChange={handleInputChange}
        onSave={handleSave}
        onCancel={handleCancel}
        onImageUpload={handleImageUpload}
        onImageZoom={handleImageZoom}
        getImageUrl={getImageUrl}
        isUploading={!!(editingStone && uploadingImages[editingStone.id])}
        isSaving={createStoneMutation.isPending || updateStoneMutation.isPending}
        existingCategories={existingCategories}
        existingRockTypes={existingRockTypes}
        existingColors={existingColors}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <CatalogHeader onAdd={handleAdd} />
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Logado como: <strong>{currentUser.email}</strong>
            </span>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
        
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

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="produto border border-gray-200 rounded-lg shadow-lg bg-white p-6 space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg font-semibold">
              Ocorreu um erro ao carregar o catálogo.
            </p>
            <p className="text-gray-500">
              Erro: {error?.message || 'Erro desconhecido'}
            </p>
            <Button 
              variant="outline" 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['stones'] })}
              className="mt-4"
            >
              Tentar Novamente
            </Button>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {stones.length > 0 ? (
              <>
                {filteredStones.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredStones.map((stone) => {
                      console.log('Rendering StoneCard for:', stone.name);
                      return (
                        <StoneCard
                          key={stone.id}
                          stone={stone}
                          imageUrl={getImageUrl(stone.image_filename)}
                          isUploading={!!uploadingImages[stone.id]}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onImageUpload={handleImageUpload}
                          onImageZoom={handleImageZoom}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                      Nenhuma pedra encontrada com os filtros aplicados.
                    </p>
                    <Button variant="outline" onClick={clearFilters} className="mt-4">
                      Limpar Filtros
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  Nenhuma pedra encontrada no catálogo. Adicione algumas pedras para começar.
                </p>
                <Button onClick={handleAdd} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Primeira Pedra
                </Button>
              </div>
            )}
          </>
        )}

        <ImageZoomModal imageUrl={zoomedImage} onClose={closeZoom} />
      </div>
    </div>
  );
};

export default Catalog;
