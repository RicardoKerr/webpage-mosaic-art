
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
    <Card className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
      <CardContent className="p-6 flex-grow flex flex-col">
        <h2 className="text-2xl font-bold pb-2 mb-2 border-b border-gray-300 text-gray-800" title={stone.name}>
          {stone.name}
        </h2>
        <p className="text-sm text-gray-600 mb-4"><strong>Item Name:</strong> {stone.name}</p>

        <div className="relative group mb-4">
          <img
            src={imageUrl}
            alt={stone.name}
            className="w-full h-64 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center rounded-lg">
            <Button
              variant="outline"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 hover:bg-white"
              onClick={() => onImageZoom(imageUrl)}
            >
              <ZoomIn className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <div className="flex justify-center mb-6">
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
          <Label htmlFor={`upload-${stone.id}`} className="text-sm text-blue-600 cursor-pointer hover:underline flex items-center justify-center gap-2">
            {isUploading ? (
              <>
                <Upload className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                <span className="truncate max-w-[200px]" title={stone.image_filename || 'Upload new image'}>
                  {stone.image_filename || 'Upload Image'}
                </span>
              </>
            )}
          </Label>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg flex-grow">
          <h4 className="font-bold text-md mb-3 text-gray-700">Technical Specifications:</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Category:</strong> {stone.category || 'N/A'}</p>
            <p><strong>Rock type:</strong> {stone.rock_type || 'N/A'}</p>
            <p><strong>Available finishes:</strong> {stone.finishes || 'N/A'}</p>
            <p><strong>Available in:</strong> {stone.available_in || 'N/A'}</p>
            <p><strong>Base color:</strong> {stone.base_color || 'N/A'}</p>
            <p><strong>Characteristics:</strong> {stone.characteristics || 'N/A'}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between p-4 bg-gray-50 border-t mt-auto">
        <Button 
          variant="secondary"
          size="sm"
          onClick={() => onEdit(stone)}
          className="flex-1 mr-2"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button 
          variant="destructive"
          size="sm"
          onClick={() => onDelete(stone.id)}
          className="flex-1 ml-2"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StoneCard;
