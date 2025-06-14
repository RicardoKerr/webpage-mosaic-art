
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const useImageUpload = () => {
  const uploadImage = async (file: File, fileName: string): Promise<string | null> => {
    try {
      console.log('=== INÍCIO DO UPLOAD ===');
      console.log('Arquivo:', file.name, 'Tamanho:', file.size, 'Tipo:', file.type);
      console.log('Nome do arquivo:', fileName);
      
      // Upload to Supabase Storage
      console.log('Iniciando upload para Supabase...');
      const { data, error } = await supabase.storage
        .from('stone-images')
        .upload(fileName, file, {
          upsert: true
        });

      if (error) {
        console.error('ERRO NO UPLOAD:', error);
        return null;
      }

      console.log('Upload bem-sucedido:', data);

      // Get public URL
      console.log('Obtendo URL pública...');
      const { data: urlData } = supabase.storage
        .from('stone-images')
        .getPublicUrl(fileName);

      console.log('URL obtida:', urlData.publicUrl);
      console.log('=== FIM DO UPLOAD ===');
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('ERRO GERAL NO UPLOAD:', error);
      return null;
    }
  };

  return { uploadImage };
};
