
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useImageStorage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadImageToStorage = async (file: File, materialName: string): Promise<string | null> => {
    try {
      const fileName = `materials/${materialName}/${Date.now()}_${file.name}`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('catalogosimples')
        .upload(fileName, file, {
          upsert: true,
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      const { data: urlData } = supabase.storage
        .from('catalogosimples')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      return null;
    }
  };

  const uploadImage = useMutation({
    mutationFn: async ({ file, materialId }: { file: File, materialId: string }) => {
      console.log('Uploading image for material:', materialId);
      
      const imageUrl = await uploadImageToStorage(file, materialId);
      if (!imageUrl) throw new Error("Image upload failed");

      const { error } = await supabase
        .from('aralogo_simples')
        .update({ "Caminho da Imagem": imageUrl })
        .eq('Nome', materialId);
      
      if (error) throw error;
      
      return imageUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aralogo_materials'] });
      toast({ title: "Success", description: "Image uploaded successfully!" });
    },
    onError: (error: Error) => {
      console.error('Image upload error:', error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  return {
    uploadImage,
    uploadImageToStorage,
  };
};
