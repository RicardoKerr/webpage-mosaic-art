
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validação das variáveis de ambiente
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

let supabase: any = null;

if (isSupabaseConfigured) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('Supabase configurado com sucesso!');
} else {
  console.warn('Supabase não configurado. Verificando variáveis de ambiente...');
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? 'Definida' : 'Não definida');
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Definida' : 'Não definida');
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
        console.error('URL:', supabaseUrl);
        console.error('Key disponível:', !!supabaseAnonKey);
        return null;
      }
      
      // Verificar se o bucket existe, se não existir, criar
      console.log('Verificando bucket stone-images...');
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        console.error('Erro ao listar buckets:', bucketsError);
        return null;
      }
      
      const bucketExists = buckets?.some((bucket: any) => bucket.name === 'stone-images');
      
      if (!bucketExists) {
        console.log('Bucket não existe, criando...');
        const { error: createError } = await supabase.storage.createBucket('stone-images', {
          public: true
        });
        
        if (createError) {
          console.error('Erro ao criar bucket:', createError);
          return null;
        }
        console.log('Bucket criado com sucesso!');
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
