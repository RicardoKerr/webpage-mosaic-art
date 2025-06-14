
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

  // Função para gerar URL da imagem no bucket baseada no filename ou nome da pedra
  const getImageUrl = (imagePathOrName: string): string => {
    if (!imagePathOrName) return '/placeholder.svg';
    
    let filename = '';
    
    // Se já é um caminho com ./images/, extrai o nome do arquivo
    if (imagePathOrName.includes('./images/')) {
      filename = imagePathOrName.replace('./images/', '');
    } 
    // Se é apenas um nome de arquivo (ex: image_1.jpeg)
    else if (imagePathOrName.includes('image_')) {
      filename = imagePathOrName;
    }
    // Se é um nome de pedra, tenta encontrar o arquivo correspondente
    else {
      // Mapeia nomes de pedras para arquivos de imagem baseado nos dados fornecidos
      const stoneToImageMap: Record<string, string> = {
        'Âmbar Deserto': 'image_1.jpeg',
        'Jade Imperial': 'image_2.png', 
        'Quartzo Rosado': 'image_3.png',
        'Turquesa Cristalina': 'image_4.jpeg',
        'Terra do Sertão': 'image_5.jpeg',
        'Tempestade Carioca': 'image_6.png',
        'Ouro de Minas Gerais': 'image_7.png',
        'Amazônia Dourada': 'image_8.png',
        'Mármore Imperial': 'image_9.png',
        'Ondas de Copacabana': 'image_10.png',
        'Luz Branca': 'image_100.jpg'
        // Adicione mais mapeamentos conforme necessário
      };
      
      filename = stoneToImageMap[imagePathOrName] || `${imagePathOrName.toLowerCase().replace(/\s+/g, '_')}.webp`;
    }
    
    console.log('Buscando imagem:', filename, 'para:', imagePathOrName);
    
    // Gera a URL pública do Supabase Storage
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filename);
    
    return data?.publicUrl || '/placeholder.svg';
  };

  // Retorna a função de upload, função para obter URLs e um booleano indicando se o Supabase está configurado.
  return { uploadImage, getImageUrl, isSupabaseConfigured: !!supabase };
};
