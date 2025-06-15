
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Upload, ZoomIn } from 'lucide-react';
import { Stone, StoneFormData } from './types';

interface StoneFormProps {
  isAddingNew: boolean;
  editingStone: Stone | null;
  formData: StoneFormData;
  onInputChange: (key: keyof StoneFormData, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onImageUpload: (file: File, stoneId: string) => void;
  onImageZoom: (imageUrl: string) => void;
  getImageUrl: (fileName: string) => string;
  isUploading: boolean;
  isSaving: boolean;
  existingCategories: string[];
  existingRockTypes: string[];
  existingColors: string[];
}

const StoneForm: React.FC<StoneFormProps> = ({
  isAddingNew,
  editingStone,
  formData,
  onInputChange,
  onSave,
  onCancel,
  onImageUpload,
  onImageZoom,
  getImageUrl,
  isUploading,
  isSaving,
  existingCategories,
  existingRockTypes,
  existingColors,
}) => {
  const title = isAddingNew ? 'Add New Stone' : 'Edit Stone';
  
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-6">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{title}</h1>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className={`grid grid-cols-1 ${!isAddingNew ? 'md:grid-cols-2' : ''} gap-6`}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => onInputChange('name', e.target.value)}
                  placeholder="Stone name"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => onInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {existingCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="rock_type">Rock Type</Label>
                <Select value={formData.rock_type} onValueChange={(value) => onInputChange('rock_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rock type" />
                  </SelectTrigger>
                  <SelectContent>
                    {existingRockTypes.map(rockType => (
                      <SelectItem key={rockType} value={rockType}>{rockType}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="finishes">Finishes</Label>
                <Input
                  id="finishes"
                  type="text"
                  value={formData.finishes}
                  onChange={(e) => onInputChange('finishes', e.target.value)}
                  placeholder="Available finishes"
                />
              </div>

              <div>
                <Label htmlFor="available_in">Available in</Label>
                <Input
                  id="available_in"
                  type="text"
                  value={formData.available_in}
                  onChange={(e) => onInputChange('available_in', e.target.value)}
                  placeholder="Available formats"
                />
              </div>
              
              <div>
                <Label htmlFor="base_color">Base Color</Label>
                <Select value={formData.base_color} onValueChange={(value) => onInputChange('base_color', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select base color" />
                  </SelectTrigger>
                  <SelectContent>
                    {existingColors.map(color => (
                      <SelectItem key={color} value={color}>{color}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="characteristics">Characteristics</Label>
                <Textarea
                  id="characteristics"
                  value={formData.characteristics}
                  onChange={(e) => onInputChange('characteristics', e.target.value)}
                  placeholder="Describe the stone characteristics"
                  className="min-h-[100px]"
                />
              </div>
            </div>
            
            {!isAddingNew && editingStone && (
              <div className="space-y-4">
                <div>
                  <Label>Current Image</Label>
                  <div className="relative">
                    <img 
                      src={getImageUrl(editingStone.image_filename)}
                      alt={editingStone.name}
                      className="w-full h-48 object-cover border border-gray-300 rounded-lg cursor-pointer"
                      onClick={() => onImageZoom(getImageUrl(editingStone.image_filename))}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => onImageZoom(getImageUrl(editingStone.image_filename))}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="image_upload">Replace Image</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="image_upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onImageUpload(file, editingStone.id);
                        }
                      }}
                      disabled={isUploading}
                    />
                    {isUploading && (
                      <Upload className="h-4 w-4 animate-spin" />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-6">
            <Button onClick={onSave} disabled={isSaving}>
              {isSaving && <Upload className="mr-2 h-4 w-4 animate-spin" />}
              {isAddingNew ? 'Add' : 'Save'}
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoneForm;
