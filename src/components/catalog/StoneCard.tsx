
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
    <Card className="produto flex flex-col h-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden group">
      <div className="relative">
        <img
          src={imageUrl}
          alt={stone.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
            <Button
                variant="outline"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 hover:bg-white"
                onClick={() => onImageZoom(imageUrl)}
            >
                <ZoomIn className="h-5 w-5" />
            </Button>
        </div>
      </div>
      
      <CardContent className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-gray-800 truncate mb-2" title={stone.name}>
          {stone.name}
        </h3>
        
        <div className="text-xs text-gray-500 space-y-1 mb-4 flex-grow">
          <p><strong>Categoria:</strong> {stone.category || 'N/A'}</p>
          <p><strong>Cor Base:</strong> {stone.base_color || 'N/A'}</p>
        </div>
        
        <div>
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
            <Label htmlFor={`upload-${stone.id}`} className="text-xs text-blue-600 cursor-pointer hover:underline flex items-center justify-center gap-1">
              {isUploading ? (
                  <>
                    <Upload className="h-3 w-3 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="h-3 w-3" />
                    <span>Trocar Imagem</span>
                  </>
                )}
            </Label>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between p-4 bg-gray-50 border-t">
        <Button 
          variant="secondary"
          size="sm"
          onClick={() => onEdit(stone)}
          className="flex-1 mr-2"
        >
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </Button>
        <Button 
          variant="destructive"
          size="sm"
          onClick={() => onDelete(stone.id)}
          className="flex-1 ml-2"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Deletar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StoneCard;
