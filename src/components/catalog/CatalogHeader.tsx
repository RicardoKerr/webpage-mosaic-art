
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CatalogHeaderProps {
  onAdd: () => void;
}

const CatalogHeader: React.FC<CatalogHeaderProps> = ({ onAdd }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <Button 
        variant="outline" 
        onClick={() => navigate('/')}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Natural Stone Catalog
      </h1>
      <div className="flex flex-wrap gap-4 mb-6">
        <Button onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Stone
        </Button>
      </div>
    </div>
  );
};

export default CatalogHeader;
