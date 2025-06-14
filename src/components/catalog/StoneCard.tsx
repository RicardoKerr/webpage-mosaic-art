
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Trash2, Upload, ZoomIn } from 'lucide-react';
import { Stone } from './types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

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
    <Card className="produto flex flex-col h-full">
      <CardHeader>
        <CardTitle className="border-b border-gray-200 pb-3">
          {stone.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="text-center relative">
          <img
            src={imageUrl}
            alt={stone.name}
            className="w-full h-64 object-cover mx-auto border border-gray-300 rounded-lg shadow-md cursor-pointer"
            onClick={() => onImageZoom(imageUrl)}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
          <Button
            variant="outline"
            size="sm"
            className="absolute top-2 right-2 bg-white/70 hover:bg-white"
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
            <Label htmlFor={`upload-${stone.id}`} className="text-sm text-gray-600 cursor-pointer hover:underline flex items-center justify-center">
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
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <strong className="text-md font-semibold">Especificações Técnicas:</strong>
          <ul className="mt-3 space-y-1 text-sm text-gray-700 list-disc pl-5">
            <li><strong>Categoria:</strong> {stone.category}</li>
            <li><strong>Tipo de Rocha:</strong> {stone.rock_type}</li>
            <li><strong>Acabamentos:</strong> {stone.finishes}</li>
            <li><strong>Disponível em:</strong> {stone.available_in}</li>
            <li><strong>Cor Base:</strong> {stone.base_color}</li>
            <li><strong>Características:</strong> {stone.characteristics}</li>
          </ul>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
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
      </CardFooter>
    </Card>
  );
};

export default StoneCard;
