
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validação das variáveis de ambiente
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

let supabase: any = null;

if (isSupabaseConfigured) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Supabase não configurado. Variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não foram encontradas.');
}

export const useImageUpload = () => {
  const uploadImage = async (file: File, fileName: string): Promise<string | null> => {
    try {
      console.log('=== INÍCIO DO UPLOAD ===');
      console.log('Arquivo:', file.name, 'Tamanho:', file.size, 'Tipo:', file.type);
      console.log('Nome do arquivo:', fileName);
      
      // Verificar se o Supabase está configurado
      if (!isSupabaseConfigured || !supabase) {
        console.error('ERRO: Supabase não configurado');
        console.error('Certifique-se de que as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão definidas');
        return null;
      }
      
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

  return { uploadImage, isSupabaseConfigured };
};
