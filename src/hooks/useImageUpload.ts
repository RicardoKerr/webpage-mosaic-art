
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const useImageUpload = () => {
  const uploadImage = async (file: File, fileName: string): Promise<string | null> => {
    try {
      console.log('Uploading image:', fileName);
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('stone-images')
        .upload(fileName, file, {
          upsert: true // This will overwrite if file exists
        });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('stone-images')
        .getPublicUrl(fileName);

      console.log('Upload successful, URL:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  return { uploadImage };
};
