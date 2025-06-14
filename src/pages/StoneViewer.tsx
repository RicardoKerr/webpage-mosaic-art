import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Filter, Search, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useImageUpload } from '@/hooks/useImageUpload';

interface Stone {
  id: string;
  name: string;
  category: string;
  rock_type: string;
  finishes: string;
  available_in: string;
  base_color: string;
  characteristics: string;
  image_url: string;
}

const fetchStones = async (): Promise<Stone[]> => {
  const { data, error } = await supabase
    .from('aralogo_simples')
    .select('"Nome", "Categoria", "Tipo de Rocha", "Acabamentos Disponíveis", "Disponível em", "Cor Base", "Características", "Caminho da Imagem"');

  if (error) {
    console.error('Error fetching stones:', error);
    throw new Error('Could not fetch stones');
  }

  if (!data) {
    return [];
  }

  return data
    .filter(item => item['Nome']) // Garante que a pedra tenha um nome
    .map((item: any, index: number) => ({
    id: item['Nome'] || `stone-${index}`,
    name: item['Nome'] || 'N/A',
    category: item['Categoria'] || 'N/A',
    rock_type: item['Tipo de Rocha'] || 'N/A',
    finishes: item['Acabamentos Disponíveis'] || 'N/A',
    available_in: item['Disponível em'] || 'N/A',
    base_color: item['Cor Base'] || 'N/A',
    characteristics: item['Características'] || 'N/A',
    image_url: item['Caminho da Imagem'] || item['Nome'] || '/placeholder.svg', // Usa o nome da pedra como fallback
  }));
};

const StoneViewer = () => {
  const navigate = useNavigate();
  const { getImageUrl } = useImageUpload();
  
  const { data: stones = [], isLoading, isError } = useQuery<Stone[]>({
    queryKey: ['aralogo_simples'],
    queryFn: fetchStones,
  });

  const [filteredStones, setFilteredStones] = useState<Stone[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [rockTypeFilter, setRockTypeFilter] = useState('all');
  const [colorFilter, setColorFilter] = useState('all');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Extrair valores únicos para os filtros, removendo valores nulos ou vazios
  const categories = [...new Set(stones.map(stone => stone.category))].filter(Boolean);
  const rockTypes = [...new Set(stones.map(stone => stone.rock_type))].filter(Boolean);
  const colors = [...new Set(stones.map(stone => stone.base_color))].filter(Boolean);

  // Função para aplicar filtros
  const applyFilters = () => {
    let filtered = stones;

    if (searchTerm) {
      filtered = filtered.filter(stone => 
        stone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (stone.characteristics && stone.characteristics.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (categoryFilter && categoryFilter !== 'all') {
      filtered = filtered.filter(stone => stone.category === categoryFilter);
    }

    if (rockTypeFilter && rockTypeFilter !== 'all') {
      filtered = filtered.filter(stone => stone.rock_type === rockTypeFilter);
    }

    if (colorFilter && colorFilter !== 'all') {
      filtered = filtered.filter(stone => stone.base_color === colorFilter);
    }

    setFilteredStones(filtered);
    setCurrentPage(1); // Reset para primeira página quando filtrar
  };

  // Aplicar filtros sempre que algo mudar
  useEffect(() => {
    if (!isLoading) {
      applyFilters();
    }
  }, [searchTerm, categoryFilter, rockTypeFilter, colorFilter, stones, isLoading]);

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setRockTypeFilter('all');
    setColorFilter('all');
  };

  const handleImageZoom = (imageUrl: string) => {
    setZoomedImage(imageUrl);
  };

  const closeZoom = () => {
    setZoomedImage(null);
  };

  // Calcular paginação
  const totalPages = Math.ceil(filteredStones.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStones = filteredStones.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={rockTypeFilter} onValueChange={setRockTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de Rocha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {rockTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={colorFilter} onValueChange={setColorFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Cor Base" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as cores</SelectItem>
                  {colors.map(color => (
                    <SelectItem key={color} value={color}>{color}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Mostrando {filteredStones.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, filteredStones.length)} de {filteredStones.length} pedras
              </p>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <p className="ml-4 text-gray-600">Carregando pedras...</p>
          </div>
        )}

        {isError && (
          <div className="text-center py-12 text-red-600">
            <p>Ocorreu um erro ao carregar o catálogo.</p>
            <p>Por favor, tente novamente mais tarde.</p>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {/* Grid de 3 colunas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentStones.map((stone) => {
                const imageUrl = getImageUrl(stone.name); // Usa o nome da pedra para buscar a imagem
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

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(page)}
                      className="w-10"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {filteredStones.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4">
                  Nenhuma pedra encontrada com os filtros aplicados
                </div>
                <Button variant="outline" onClick={clearFilters}>
                  Limpar Filtros
                </Button>
              </div>
            )}
          </>
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

export default StoneViewer;
