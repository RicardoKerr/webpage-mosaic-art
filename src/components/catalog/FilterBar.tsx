
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, X, Search } from 'lucide-react';
import { Filters } from './types';

interface FilterBarProps {
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: string) => void;
  onClearFilters: () => void;
  existingCategories: string[];
  existingRockTypes: string[];
  existingColors: string[];
  filteredCount: number;
  totalCount: number;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  existingCategories,
  existingRockTypes,
  existingColors,
  filteredCount,
  totalCount,
}) => {
  return (
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
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filters.category} onValueChange={(value) => onFilterChange('category', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {[...existingCategories].sort((a, b) => a.localeCompare(b)).map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.rock_type} onValueChange={(value) => onFilterChange('rock_type', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo de Rocha" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            {[...existingRockTypes].sort((a, b) => a.localeCompare(b)).map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.base_color} onValueChange={(value) => onFilterChange('base_color', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Cor Base" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as cores</SelectItem>
            {[...existingColors].sort((a, b) => a.localeCompare(b)).map(color => (
              <SelectItem key={color} value={color}>{color}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Mostrando {filteredCount} de {totalCount} pedras
        </p>
        <Button variant="outline" size="sm" onClick={onClearFilters}>
          <X className="mr-2 h-4 w-4" />
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;
