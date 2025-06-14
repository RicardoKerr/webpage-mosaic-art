
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Assegure que as envs estão presentes via painel do Lovable
const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;

let supabase: any = null;

if (isSupabaseConfigured) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('Supabase configurado com sucesso!');
} else {
  console.warn('Supabase não configurado. Verifique variáveis no painel Lovable.');
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? 'Definida' : 'Não definida');
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Definida' : 'Não definida');
}

/**
 * Antes de usar, certifique-se de que:
 * - O bucket 'catalogosimples' existe no Storage do Supabase
 * - As policies do bucket permitem upload público pelo anon key, ou você esteja autenticado adequadamente
 */
export const useImageUpload = () => {
  const bucketName = 'catalogosimples';

  const uploadImage = async (file: File, fileName: string): Promise<string | null> => {
    try {
      if (!isSupabaseConfigured || !supabase) {
        console.error('ERRO: Supabase não configurado');
        return null;
      }

      // Confirma se o bucket existe
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      if (bucketsError) {
        console.error('Erro ao listar buckets:', bucketsError);
        return null;
      }
      const bucketExists = buckets?.some((bucket: any) => bucket.name === bucketName);
      if (!bucketExists) {
        console.error(
          `O bucket '${bucketName}' não existe no seu Supabase. Crie manualmente via painel antes do upload.`
        );
        return null;
      }

      // Upload
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          upsert: true,
        });

      if (error) {
        console.error('Erro ao fazer upload:', error);
        return null;
      }
      if (!data) {
        console.error('Upload falhou: resposta sem data.');
        return null;
      }

      // URL pública
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      if (!urlData?.publicUrl) {
        console.error('Falha ao obter URL pública.');
        return null;
      }

      return urlData.publicUrl;
    } catch (error) {
      console.error('ERRO GERAL NO UPLOAD:', error);
      return null;
    }
  };

  return { uploadImage, isSupabaseConfigured };
};
