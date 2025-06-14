
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Trash2, Upload, ZoomIn } from 'lucide-react';
import { Stone } from './types';

interface StoneCardProps {
  stone: Stone;
  imageUrl: string;
  isUploading: boolean;
  onEdit: (stone: Stone) => void;
  onDelete: (id: string) => void;
  onImageUpload: (file: File, stoneId: string) => void;
  onImageZoom: (imageUrl: string) => void;
}

const StoneCard: React.FC<StoneCardProps> = ({
  stone,
  imageUrl,
  isUploading,
  onEdit,
  onDelete,
  onImageUpload,
  onImageZoom,
}) => {
  return (
    <div className="produto border border-gray-200 rounded-lg overflow-hidden shadow-lg bg-white">
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
            onClick={() => onImageZoom(imageUrl)}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
          <Button
            variant="outline"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => onImageZoom(imageUrl)}
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
                  onImageUpload(file, stone.id);
                }
              }}
              className="hidden"
              id={`upload-${stone.id}`}
              disabled={isUploading}
            />
            <Label htmlFor={`upload-${stone.id}`} className="text-sm text-gray-500 cursor-pointer hover:underline flex items-center justify-center">
              {isUploading ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    <span>{stone.image_filename ? "Trocar Imagem" : "Adicionar Imagem"}</span>
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
            onClick={() => onEdit(stone)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button 
            variant="destructive"
            size="sm"
            onClick={() => onDelete(stone.id)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Deletar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StoneCard;
