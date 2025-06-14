
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Trash2, Upload, ZoomIn } from 'lucide-react';
import { Stone } from './types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

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
    <Card className="produto flex flex-col h-full bg-white border border-gray-200 rounded-lg shadow-lg">
      <CardContent className="p-6 flex-grow flex flex-col space-y-4">
        <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3">
          {stone.name}
        </h3>
        
        <p className="text-sm text-gray-600"><strong>Item Name:</strong> {stone.name}</p>

        <div className="text-center relative">
          <img
            src={imageUrl}
            alt={stone.name}
            className="w-full h-48 object-cover mx-auto border border-gray-300 rounded-lg shadow-md cursor-pointer"
            onClick={() => onImageZoom(imageUrl)}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
          <Button
            variant="outline"
            size="sm"
            className="absolute top-2 right-2 bg-white/90 hover:bg-white shadow-md"
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
            <Label htmlFor={`upload-${stone.id}`} className="text-sm text-blue-600 cursor-pointer hover:text-blue-800 hover:underline flex items-center justify-center">
              {isUploading ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    <span>Trocar Imagem</span>
                  </>
                )}
            </Label>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mt-auto">
          <strong className="text-md font-semibold text-gray-900">Technical Specifications:</strong>
          <ul className="mt-3 space-y-1 text-sm text-gray-700">
            <li><strong>Category:</strong> {stone.category || 'N/A'}</li>
            <li><strong>Rock type:</strong> {stone.rock_type || 'N/A'}</li>
            <li><strong>Available finishes:</strong> {stone.finishes || 'N/A'}</li>
            <li><strong>Available in:</strong> {stone.available_in || 'N/A'}</li>
            <li><strong>Base color:</strong> {stone.base_color || 'N/A'}</li>
            <li><strong>Characteristics:</strong> {stone.characteristics || 'N/A'}</li>
          </ul>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between p-6 pt-0">
        <Button 
          variant="secondary"
          size="sm"
          onClick={() => onEdit(stone)}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          Editar
        </Button>
        <Button 
          variant="destructive"
          size="sm"
          onClick={() => onDelete(stone.id)}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Deletar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StoneCard;
