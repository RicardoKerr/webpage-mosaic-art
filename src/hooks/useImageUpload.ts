
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
        'Luz Branca': 'image_100.jpg',
        'Ágata Brasileira': 'image_11.jpeg',
        'Mármore Clássico': 'image_12.jpeg',
        'Granito Imperial': 'image_13.jpeg',
        'Pedra do Rio': 'image_14.jpeg',
        'Cristal Amazônico': 'image_15.jpeg',
        'Rocha Dourada': 'image_16.jpeg',
        'Mármore Real': 'image_17.jpeg',
        'Pedra Lunar': 'image_18.jpeg',
        'Granito Tropical': 'image_19.jpeg',
        'Mármore dos Andes': 'image_20.jpeg',
        'Quartzo Natural': 'image_21.jpeg',
        'Pedra Selvagem': 'image_22.jpeg',
        'Mármore Oceânico': 'image_23.jpeg',
        'Granito do Norte': 'image_24.jpeg',
        'Pedra Vulcânica': 'image_25.jpeg',
        'Mármore Régio': 'image_26.jpeg',
        'Granito Solar': 'image_27.jpeg',
        'Pedra Mística': 'image_28.jpeg',
        'Mármore Celeste': 'image_29.jpeg',
        'Neblina da Serra Gaúcha': 'image_30.jpeg',
        'Nuvens de Algodão': 'image_31.jpeg',
        'Rios Brasileiros': 'image_32.jpeg',
        'Quartzo Puro': 'image_33.jpeg',
        'Pedra Amazônica': 'image_34.jpeg',
        'Mármore Nobre': 'image_35.jpeg',
        'Granito Moderno': 'image_36.jpeg',
        'Pedra Elegante': 'image_37.jpeg',
        'Mármore Luxo': 'image_38.jpeg',
        'Granito Premium': 'image_39.jpeg',
        'Pedra Exclusiva': 'image_40.jpeg',
        'Mármore Único': 'image_41.jpeg',
        'Granito Especial': 'image_42.jpeg',
        'Pedra Rara': 'image_43.jpeg',
        'Mármore Supremo': 'image_44.jpeg',
        'Granito Elite': 'image_45.jpeg',
        'Pedra Divina': 'image_46.jpeg',
        'Mármore Majestoso': 'image_47.jpeg',
        'Granito Nobre': 'image_48.jpeg',
        'Pedra Celestial': 'image_49.jpeg',
        'Montanhas Cobertas': 'image_50.webp',
        'Mármore Exótico': 'image_51.jpeg',
        'Granito Refinado': 'image_52.jpeg',
        'Pedra Magnífica': 'image_53.jpeg',
        'Mármore Glorioso': 'image_54.jpeg',
        'Granito Extraordinário': 'image_55.jpeg',
        'Pedra Sublime': 'image_56.jpeg',
        'Mármore Radiante': 'image_57.jpeg',
        'Granito Luminoso': 'image_58.jpeg',
        'Pedra Brilhante': 'image_59.jpeg',
        'Mármore Esplêndido': 'image_60.jpeg',
        'Granito Majestoso': 'image_61.jpeg',
        'Pedra Real': 'image_62.jpeg',
        'Mármore Divino': 'image_63.jpeg',
        'Granito Celestial': 'image_64.jpeg',
        'Pedra Nobre': 'image_65.jpeg',
        'Mármore Eterno': 'image_66.jpeg',
        'Granito Infinito': 'image_67.jpeg',
        'Pedra Eterna': 'image_68.jpeg',
        'Mármore Infinito': 'image_69.jpeg',
        'Granito Eterno': 'image_70.jpeg',
        'Pedra Infinita': 'image_71.jpeg',
        'Mármore Perpétuo': 'image_72.jpeg',
        'Granito Perpétuo': 'image_73.jpeg',
        'Pedra Perpétua': 'image_74.jpeg',
        'Mármore Duradouro': 'image_75.jpeg',
        'Granito Duradouro': 'image_76.jpeg',
        'Pedra Duradoura': 'image_77.jpeg',
        'Mármore Resistente': 'image_78.jpeg',
        'Granito Resistente': 'image_79.jpeg',
        'Pedra Resistente': 'image_80.jpeg',
        'Mármore Forte': 'image_81.jpeg',
        'Granito Forte': 'image_82.jpeg',
        'Pedra Forte': 'image_83.jpeg',
        'Mármore Sólido': 'image_84.jpeg',
        'Granito Sólido': 'image_85.jpeg',
        'Pedra Sólida': 'image_86.jpeg',
        'Mármore Firme': 'image_87.jpeg',
        'Granito Firme': 'image_88.jpeg',
        'Pedra Firme': 'image_89.jpeg',
        'Mármore Estável': 'image_90.jpeg',
        'Granito Estável': 'image_91.jpeg',
        'Pedra Estável': 'image_92.jpeg',
        'Mármore Confiável': 'image_93.jpeg',
        'Granito Confiável': 'image_94.jpeg',
        'Pedra Confiável': 'image_95.jpeg',
        'Mármore Seguro': 'image_96.jpeg',
        'Granito Seguro': 'image_97.jpeg',
        'Pedra Segura': 'image_98.jpeg',
        'Mármore Garantido': 'image_99.jpeg',
        'Carajás Green': 'image_150.jpeg',
        'Granito Garantido': 'image_101.jpeg',
        'Pedra Garantida': 'image_102.jpeg',
        'Mármore Certificado': 'image_103.jpeg',
        'Granito Certificado': 'image_104.jpeg',
        'Pedra Certificada': 'image_105.jpeg',
        'Mármore Aprovado': 'image_106.jpeg',
        'Granito Aprovado': 'image_107.jpeg',
        'Pedra Aprovada': 'image_108.jpeg',
        'Mármore Testado': 'image_109.jpeg',
        'Granito Testado': 'image_110.jpeg',
        'Pedra Testada': 'image_111.jpeg',
        'Mármore Validado': 'image_112.jpeg',
        'Granito Validado': 'image_113.jpeg',
        'Pedra Validada': 'image_114.jpeg',
        'Mármore Confirmado': 'image_115.jpeg',
        'Granito Confirmado': 'image_116.jpeg',
        'Pedra Confirmada': 'image_117.jpeg',
        'Mármore Verificado': 'image_118.jpeg',
        'Granito Verificado': 'image_119.jpeg',
        'Pedra Verificada': 'image_120.jpeg',
        'Mármore Autenticado': 'image_121.jpeg',
        'Granito Autenticado': 'image_122.jpeg',
        'Pedra Autenticada': 'image_123.jpeg',
        'Mármore Original': 'image_124.jpeg',
        'Granito Original': 'image_125.jpeg',
        'Pedra Original': 'image_126.jpeg',
        'Mármore Genuíno': 'image_127.jpeg',
        'Granito Genuíno': 'image_128.jpeg',
        'Pedra Genuína': 'image_129.jpeg',
        'Mármore Verdadeiro': 'image_130.jpeg',
        'Granito Verdadeiro': 'image_131.jpeg',
        'Pedra Verdadeira': 'image_132.jpeg',
        'Mármore Natural': 'image_133.jpeg',
        'Granito Natural': 'image_134.jpeg',
        'Pedra Natural': 'image_135.jpeg',
        'Mármore Puro': 'image_136.jpeg',
        'Granito Puro': 'image_137.jpeg',
        'Pedra Pura': 'image_138.jpeg',
        'Mármore Limpo': 'image_139.jpeg',
        'Granito Limpo': 'image_140.jpeg',
        'Pedra Limpa': 'image_141.jpeg',
        'Mármore Claro': 'image_142.jpeg',
        'Granito Claro': 'image_143.jpeg',
        'Pedra Clara': 'image_144.jpeg',
        'Mármore Transparente': 'image_145.jpeg',
        'Granito Transparente': 'image_146.jpeg',
        'Pedra Transparente': 'image_147.jpeg',
        'Mármore Cristalino': 'image_148.jpeg',
        'Granito Cristalino': 'image_149.jpeg',
        'Pedra Cristalina': 'image_151.jpeg',
        'Mármore Brilhoso': 'image_152.jpeg',
        'Granito Brilhoso': 'image_153.jpeg',
        'Pedra Brilhosa': 'image_154.jpeg',
        'Mármore Polido': 'image_155.jpeg',
        'Granito Polido': 'image_156.jpeg',
        'Pedra Polida': 'image_157.jpeg',
        'Mármore Lustrado': 'image_158.jpeg',
        'Granito Lustrado': 'image_159.jpeg',
        'Pedra Lustrada': 'image_160.jpeg',
        'Mármore Refinado': 'image_161.jpeg',
        'Granito Refinado': 'image_162.jpeg',
        'Pedra Refinada': 'image_163.jpeg',
        'Mármore Lapidado': 'image_164.jpeg',
        'Granito Lapidado': 'image_165.jpeg',
        'Pedra Lapidada': 'image_166.jpeg',
        'Mármore Trabalhado': 'image_167.jpeg',
        'Granito Trabalhado': 'image_168.jpeg',
        'Pedra Trabalhada': 'image_169.jpeg',
        'Mármore Esculpido': 'image_170.jpeg',
        'Granito Esculpido': 'image_171.jpeg',
        'Pedra Esculpida': 'image_172.jpeg',
        'Mármore Modelado': 'image_173.jpeg',
        'Granito Modelado': 'image_174.jpeg',
        'Pedra Modelada': 'image_175.jpeg',
        'Mármore Formado': 'image_176.jpeg',
        'Ouro de Jatoba': 'image_192.webp'
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
