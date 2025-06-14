
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook para gerenciar o upload de imagens para o Supabase Storage.
 * Ele usa o bucket 'catalogosimples'.
 */
export const useImageUpload = () => {
  const bucketName = 'catalogosimples';

  const uploadImage = async (file: File, fileName: string): Promise<string | null> => {
    try {
      if (!supabase) {
        console.error('ERRO: Cliente Supabase não está disponível.');
        return null;
      }

      // Upload da imagem para o bucket 'catalogosimples'
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          upsert: true, // Se um arquivo com o mesmo nome existir, ele será substituído.
        });

      if (error) {
        console.error('Erro ao fazer upload da imagem:', error);
        return null;
      }

      if (!data) {
        console.error('O upload da imagem falhou sem retornar dados.');
        return null;
      }

      // Obter a URL pública da imagem recém-enviada
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      if (!urlData?.publicUrl) {
        console.error('Falha ao obter a URL pública da imagem.');
        return null;
      }

      console.log('Upload bem-sucedido! URL:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error('Ocorreu um erro inesperado durante o upload da imagem:', error);
      return null;
    }
  };

  // Retorna a função de upload e um booleano indicando se o Supabase está configurado.
  // Como estamos importando o cliente diretamente, ele deve estar sempre configurado se o app estiver funcionando.
  return { uploadImage, isSupabaseConfigured: !!supabase };
};
