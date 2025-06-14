import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Edit, Trash2, Plus, Upload, Filter, ImageOff, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Estrutura dos dados da pedra baseada na tabela CSV completa
interface Stone {
  id: string;
  name: string;
  category: string;
  rock_type: string;
  finishes: string;
  available_in: string;
  base_color: string;
  characteristics: string;
  image_filename: string;
  image_url?: string;
}

// Lista completa das 174 pedras baseadas na tabela fornecida
const initialStones: Stone[] = [
  { id: '1', name: 'Âmbar Deserto', category: 'Noble Stones', rock_type: 'Marble', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Beige/Brown', characteristics: 'Beige/brown marble with distinctive veins.', image_filename: 'image_1.jpeg' },
  { id: '2', name: 'Jade Imperial', category: 'Noble Stones', rock_type: 'Marble', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Green With Veins', characteristics: 'Green with veins marble with distinctive veins.', image_filename: 'image_2.png' },
  { id: '3', name: 'Quartzo Rosado', category: 'Noble Stones', rock_type: 'Marble', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Pink/Reddish', characteristics: 'Pink marble with spots like rose quartz crystals', image_filename: 'image_3.png' },
  { id: '4', name: 'Turquesa Cristalina', category: 'Noble Stones', rock_type: 'Marble', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Blue-Green', characteristics: 'Blue-green marble reminiscent of crystalline turquoise stones', image_filename: 'image_4.jpeg' },
  { id: '5', name: 'Ametista Real', category: 'Noble Stones', rock_type: 'Marble', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Purple', characteristics: 'Purple marble with amethyst-like patterns', image_filename: 'image_5.jpeg' },
  { id: '6', name: 'Topázio Dourado', category: 'Noble Stones', rock_type: 'Marble', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Golden', characteristics: 'Golden marble with topaz-like crystalline formations', image_filename: 'image_6.png' },
  { id: '7', name: 'Esmeralda Profunda', category: 'Noble Stones', rock_type: 'Marble', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Deep Green', characteristics: 'Deep green marble reminiscent of emerald gemstones', image_filename: 'image_7.jpeg' },
  { id: '8', name: 'Safira Celeste', category: 'Noble Stones', rock_type: 'Marble', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Blue', characteristics: 'Blue marble with sapphire-like depth and clarity', image_filename: 'image_8.png' },
  { id: '9', name: 'Rubi Carmesim', category: 'Noble Stones', rock_type: 'Marble', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Red', characteristics: 'Red marble with ruby-like intensity and veining', image_filename: 'image_9.jpeg' },
  { id: '10', name: 'Diamante Negro', category: 'Noble Stones', rock_type: 'Marble', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Black', characteristics: 'Black marble with diamond-like crystalline sparkle', image_filename: 'image_10.png' },
  { id: '11', name: 'Coral Antigo', category: 'Ocean Collection', rock_type: 'Limestone', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Coral/Orange', characteristics: 'Coral-colored limestone with ancient marine fossils', image_filename: 'image_11.jpeg' },
  { id: '12', name: 'Pérola Oceânica', category: 'Ocean Collection', rock_type: 'Marble', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Pearl White', characteristics: 'Pearl white marble with oceanic wave patterns', image_filename: 'image_12.png' },
  { id: '13', name: 'Azul Profundo', category: 'Ocean Collection', rock_type: 'Marble', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Deep Blue', characteristics: 'Deep blue marble reminiscent of ocean depths', image_filename: 'image_13.jpeg' },
  { id: '14', name: 'Água Marinha', category: 'Ocean Collection', rock_type: 'Marble', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Aquamarine', characteristics: 'Aquamarine marble with flowing water-like veins', image_filename: 'image_14.png' },
  { id: '15', name: 'Espuma do Mar', category: 'Ocean Collection', rock_type: 'Travertine', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Cream/White', characteristics: 'Cream travertine with sea foam-like textures', image_filename: 'image_15.jpeg' },
  { id: '16', name: 'Madeira Petrificada', category: 'Fossil Collection', rock_type: 'Petrified Wood', finishes: 'Polished', available_in: 'Slab', base_color: 'Brown/Tan', characteristics: 'Petrified wood with preserved grain patterns', image_filename: 'image_16.png' },
  { id: '17', name: 'Âmbar Fóssil', category: 'Fossil Collection', rock_type: 'Limestone', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Amber/Yellow', characteristics: 'Amber-colored limestone with fossilized inclusions', image_filename: 'image_17.jpeg' },
  { id: '18', name: 'Concha Ancestral', category: 'Fossil Collection', rock_type: 'Limestone', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Beige/Cream', characteristics: 'Limestone rich in ancient shell fossils', image_filename: 'image_18.png' },
  { id: '19', name: 'Trilobita Clássico', category: 'Fossil Collection', rock_type: 'Limestone', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Gray/Brown', characteristics: 'Limestone featuring trilobite fossil impressions', image_filename: 'image_19.jpeg' },
  { id: '20', name: 'Fern Eterna', category: 'Fossil Collection', rock_type: 'Slate', finishes: 'Natural, Honed', available_in: 'Slab', base_color: 'Dark Gray', characteristics: 'Slate with preserved fern fossil imprints', image_filename: 'image_20.png' },
  { id: '21', name: 'Aurora Boreal', category: 'Crystal Collection', rock_type: 'Quartz', finishes: 'Polished', available_in: 'Slab', base_color: 'Iridescent', characteristics: 'Iridescent quartz with aurora-like color play', image_filename: 'image_21.jpeg' },
  { id: '22', name: 'Cristal de Gelo', category: 'Crystal Collection', rock_type: 'Quartz', finishes: 'Polished', available_in: 'Slab', base_color: 'Clear/White', characteristics: 'Clear quartz with ice-like crystalline structure', image_filename: 'image_22.png' },
  { id: '23', name: 'Ametista Violeta', category: 'Crystal Collection', rock_type: 'Quartz', finishes: 'Polished', available_in: 'Slab', base_color: 'Purple/Violet', characteristics: 'Violet amethyst quartz with natural crystal formations', image_filename: 'image_23.jpeg' },
  { id: '24', name: 'Citrino Solar', category: 'Crystal Collection', rock_type: 'Quartz', finishes: 'Polished', available_in: 'Slab', base_color: 'Yellow/Gold', characteristics: 'Golden citrine quartz with solar-like radiance', image_filename: 'image_24.png' },
  { id: '25', name: 'Quartzo Rosa', category: 'Crystal Collection', rock_type: 'Quartz', finishes: 'Polished', available_in: 'Slab', base_color: 'Pink/Rose', characteristics: 'Rose quartz with gentle pink crystalline beauty', image_filename: 'image_25.jpeg' },
  { id: '26', name: 'Obsidiana Negra', category: 'Volcanic Collection', rock_type: 'Obsidian', finishes: 'Polished', available_in: 'Slab', base_color: 'Black', characteristics: 'Black volcanic glass with mirror-like finish', image_filename: 'image_26.png' },
  { id: '27', name: 'Basalto Vesicular', category: 'Volcanic Collection', rock_type: 'Basalt', finishes: 'Natural, Honed', available_in: 'Slab', base_color: 'Dark Gray/Black', characteristics: 'Vesicular basalt with natural volcanic bubbles', image_filename: 'image_27.jpeg' },
  { id: '28', name: 'Pedra Pomes', category: 'Volcanic Collection', rock_type: 'Pumice', finishes: 'Natural', available_in: 'Slab', base_color: 'Light Gray', characteristics: 'Light pumice stone with volcanic texture', image_filename: 'image_28.png' },
  { id: '29', name: 'Lava Vermelha', category: 'Volcanic Collection', rock_type: 'Scoria', finishes: 'Natural, Honed', available_in: 'Slab', base_color: 'Red/Brown', characteristics: 'Red volcanic scoria with rugged texture', image_filename: 'image_29.jpeg' },
  { id: '30', name: 'Granito Vesúvio', category: 'Volcanic Collection', rock_type: 'Granite', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Gray/Black', characteristics: 'Granite with volcanic mineral composition', image_filename: 'image_30.png' },
  { id: '31', name: 'Mármore Branco Carrara', category: 'Classic Marbles', rock_type: 'Marble', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'White', characteristics: 'Classic white Carrara marble with subtle veining', image_filename: 'image_31.jpeg' },
  { id: '32', name: 'Mármore Calacatta', category: 'Classic Marbles', rock_type: 'Marble', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'White/Gold', characteristics: 'Calacatta marble with dramatic gold veining', image_filename: 'image_32.png' },
  { id: '33', name: 'Mármore Statuário', category: 'Classic Marbles', rock_type: 'Marble', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Pure White', characteristics: 'Pure white Statuario marble for sculpture quality', image_filename: 'image_33.jpeg' },
  { id: '34', name: 'Mármore Nero Marquina', category: 'Classic Marbles', rock_type: 'Marble', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Black/White', characteristics: 'Black marble with distinctive white veining', image_filename: 'image_34.png' },
  { id: '35', name: 'Mármore Emperador', category: 'Classic Marbles', rock_type: 'Marble', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Brown', characteristics: 'Brown Emperor marble with rich veining', image_filename: 'image_35.jpeg' },
  { id: '36', name: 'Granito Preto São Gabriel', category: 'Brazilian Granites', rock_type: 'Granite', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Black', characteristics: 'Brazilian black granite with uniform texture', image_filename: 'image_36.png' },
  { id: '37', name: 'Granito Azul Bahia', category: 'Brazilian Granites', rock_type: 'Granite', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Blue', characteristics: 'Brazilian blue granite with unique coloration', image_filename: 'image_37.jpeg' },
  { id: '38', name: 'Granito Verde Ubatuba', category: 'Brazilian Granites', rock_type: 'Granite', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Green', characteristics: 'Brazilian green granite with natural patterns', image_filename: 'image_38.png' },
  { id: '39', name: 'Granito Amarelo Ornamental', category: 'Brazilian Granites', rock_type: 'Granite', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Yellow/Gold', characteristics: 'Brazilian yellow granite with ornamental quality', image_filename: 'image_39.jpeg' },
  { id: '40', name: 'Granito Vermelho Capão Bonito', category: 'Brazilian Granites', rock_type: 'Granite', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Red', characteristics: 'Brazilian red granite with distinctive patterns', image_filename: 'image_40.png' },
  { id: '41', name: 'Travertino Romano', category: 'Travertines', rock_type: 'Travertine', finishes: 'Polished, Honed, Tumbled', available_in: 'Slab, Tile', base_color: 'Beige/Cream', characteristics: 'Classic Roman travertine with natural holes', image_filename: 'image_41.jpeg' },
  { id: '42', name: 'Travertino Navona', category: 'Travertines', rock_type: 'Travertine', finishes: 'Polished, Honed, Tumbled', available_in: 'Slab, Tile', base_color: 'Light Beige', characteristics: 'Light beige travertine with subtle patterns', image_filename: 'image_42.png' },
  { id: '43', name: 'Travertino Noce', category: 'Travertines', rock_type: 'Travertine', finishes: 'Polished, Honed, Tumbled', available_in: 'Slab, Tile', base_color: 'Walnut Brown', characteristics: 'Walnut brown travertine with rich coloring', image_filename: 'image_43.jpeg' },
  { id: '44', name: 'Travertino Silver', category: 'Travertines', rock_type: 'Travertine', finishes: 'Polished, Honed, Tumbled', available_in: 'Slab, Tile', base_color: 'Silver Gray', characteristics: 'Silver gray travertine with metallic undertones', image_filename: 'image_44.png' },
  { id: '45', name: 'Travertino Ouro', category: 'Travertines', rock_type: 'Travertine', finishes: 'Polished, Honed, Tumbled', available_in: 'Slab, Tile', base_color: 'Golden', characteristics: 'Golden travertine with warm honey tones', image_filename: 'image_45.jpeg' },
  { id: '46', name: 'Ardósia Preta', category: 'Slates', rock_type: 'Slate', finishes: 'Natural, Honed', available_in: 'Slab, Tile', base_color: 'Black', characteristics: 'Black slate with natural cleft texture', image_filename: 'image_46.png' },
  { id: '47', name: 'Ardósia Verde', category: 'Slates', rock_type: 'Slate', finishes: 'Natural, Honed', available_in: 'Slab, Tile', base_color: 'Green', characteristics: 'Green slate with natural mineral variations', image_filename: 'image_47.jpeg' },
  { id: '48', name: 'Ardósia Azul', category: 'Slates', rock_type: 'Slate', finishes: 'Natural, Honed', available_in: 'Slab, Tile', base_color: 'Blue', characteristics: 'Blue slate with distinctive color and texture', image_filename: 'image_48.png' },
  { id: '49', name: 'Ardósia Ferrugem', category: 'Slates', rock_type: 'Slate', finishes: 'Natural, Honed', available_in: 'Slab, Tile', base_color: 'Rust/Orange', characteristics: 'Rust-colored slate with iron oxide staining', image_filename: 'image_49.jpeg' },
  { id: '50', name: 'Ardósia Cinza', category: 'Slates', rock_type: 'Slate', finishes: 'Natural, Honed', available_in: 'Slab, Tile', base_color: 'Gray', characteristics: 'Gray slate with uniform texture and color', image_filename: 'image_50.png' },
  { id: '51', name: 'Calcário Jerusalem', category: 'Limestones', rock_type: 'Limestone', finishes: 'Polished, Honed, Antiqued', available_in: 'Slab, Tile', base_color: 'Cream/Beige', characteristics: 'Jerusalem limestone with biblical heritage', image_filename: 'image_51.jpeg' },
  { id: '52', name: 'Calcário Jura', category: 'Limestones', rock_type: 'Limestone', finishes: 'Polished, Honed, Antiqued', available_in: 'Slab, Tile', base_color: 'Beige/Yellow', characteristics: 'Jura limestone with fossilized inclusions', image_filename: 'image_52.png' },
  { id: '53', name: 'Calcário Moca Creme', category: 'Limestones', rock_type: 'Limestone', finishes: 'Polished, Honed, Antiqued', available_in: 'Slab, Tile', base_color: 'Cream', characteristics: 'Portuguese Moca Creme limestone', image_filename: 'image_53.jpeg' },
  { id: '54', name: 'Calcário Azul', category: 'Limestones', rock_type: 'Limestone', finishes: 'Polished, Honed, Antiqued', available_in: 'Slab, Tile', base_color: 'Blue/Gray', characteristics: 'Blue limestone with unique coloration', image_filename: 'image_54.png' },
  { id: '55', name: 'Calcário Fossil', category: 'Limestones', rock_type: 'Limestone', finishes: 'Polished, Honed, Antiqued', available_in: 'Slab, Tile', base_color: 'Beige/Brown', characteristics: 'Limestone rich in marine fossils', image_filename: 'image_55.jpeg' },
  { id: '56', name: 'Arenito Amarelo', category: 'Sandstones', rock_type: 'Sandstone', finishes: 'Natural, Honed', available_in: 'Slab, Tile', base_color: 'Yellow', characteristics: 'Yellow sandstone with natural grain texture', image_filename: 'image_56.png' },
  { id: '57', name: 'Arenito Vermelho', category: 'Sandstones', rock_type: 'Sandstone', finishes: 'Natural, Honed', available_in: 'Slab, Tile', base_color: 'Red', characteristics: 'Red sandstone with iron oxide coloring', image_filename: 'image_57.jpeg' },
  { id: '58', name: 'Arenito Branco', category: 'Sandstones', rock_type: 'Sandstone', finishes: 'Natural, Honed', available_in: 'Slab, Tile', base_color: 'White', characteristics: 'White sandstone with pure quartz composition', image_filename: 'image_58.png' },
  { id: '59', name: 'Arenito Cinza', category: 'Sandstones', rock_type: 'Sandstone', finishes: 'Natural, Honed', available_in: 'Slab, Tile', base_color: 'Gray', characteristics: 'Gray sandstone with uniform texture', image_filename: 'image_59.jpeg' },
  { id: '60', name: 'Arenito Multicolor', category: 'Sandstones', rock_type: 'Sandstone', finishes: 'Natural, Honed', available_in: 'Slab, Tile', base_color: 'Multi-colored', characteristics: 'Multicolored sandstone with natural banding', image_filename: 'image_60.png' },
  { id: '61', name: 'Quartzito Branco', category: 'Quartzites', rock_type: 'Quartzite', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'White', characteristics: 'White quartzite with crystalline structure', image_filename: 'image_61.jpeg' },
  { id: '62', name: 'Quartzito Taj Mahal', category: 'Quartzites', rock_type: 'Quartzite', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Cream/Gold', characteristics: 'Cream quartzite with golden veining', image_filename: 'image_62.png' },
  { id: '63', name: 'Quartzito Sea Pearl', category: 'Quartzites', rock_type: 'Quartzite', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'White/Pearl', characteristics: 'Pearl white quartzite with sea-like patterns', image_filename: 'image_63.jpeg' },
  { id: '64', name: 'Quartzito Monte Cristo', category: 'Quartzites', rock_type: 'Quartzite', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Gray/White', characteristics: 'Gray quartzite with dramatic white veining', image_filename: 'image_64.png' },
  { id: '65', name: 'Quartzito Blue Macauba', category: 'Quartzites', rock_type: 'Quartzite', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Blue/Gray', characteristics: 'Blue quartzite with unique Brazilian patterns', image_filename: 'image_65.jpeg' },
  { id: '66', name: 'Ônix Verde', category: 'Onyx Collection', rock_type: 'Onyx', finishes: 'Polished, Backlit', available_in: 'Slab', base_color: 'Green', characteristics: 'Green onyx with translucent properties', image_filename: 'image_66.png' },
  { id: '67', name: 'Ônix Mel', category: 'Onyx Collection', rock_type: 'Onyx', finishes: 'Polished, Backlit', available_in: 'Slab', base_color: 'Honey/Amber', characteristics: 'Honey-colored onyx with flowing patterns', image_filename: 'image_67.jpeg' },
  { id: '68', name: 'Ônix Branco', category: 'Onyx Collection', rock_type: 'Onyx', finishes: 'Polished, Backlit', available_in: 'Slab', base_color: 'White', characteristics: 'White onyx with pure translucent beauty', image_filename: 'image_68.png' },
  { id: '69', name: 'Ônix Rosa', category: 'Onyx Collection', rock_type: 'Onyx', finishes: 'Polished, Backlit', available_in: 'Slab', base_color: 'Pink/Rose', characteristics: 'Pink onyx with delicate rose coloring', image_filename: 'image_69.jpeg' },
  { id: '70', name: 'Ônix Azul', category: 'Onyx Collection', rock_type: 'Onyx', finishes: 'Polished, Backlit', available_in: 'Slab', base_color: 'Blue', characteristics: 'Blue onyx with ethereal translucency', image_filename: 'image_70.png' },
  { id: '71', name: 'Granito Preto Absoluto', category: 'Premium Granites', rock_type: 'Granite', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Pure Black', characteristics: 'Absolute black granite with mirror finish', image_filename: 'image_71.jpeg' },
  { id: '72', name: 'Granito Branco Dallas', category: 'Premium Granites', rock_type: 'Granite', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'White', characteristics: 'White granite with crystal sparkle', image_filename: 'image_72.png' },
  { id: '73', name: 'Granito Colonial Gold', category: 'Premium Granites', rock_type: 'Granite', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Gold/Cream', characteristics: 'Golden granite with elegant veining', image_filename: 'image_73.jpeg' },
  { id: '74', name: 'Granito Azul Klein', category: 'Premium Granites', rock_type: 'Granite', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Blue', characteristics: 'Klein blue granite with intense coloration', image_filename: 'image_74.png' },
  { id: '75', name: 'Granito Verde Eucalipto', category: 'Premium Granites', rock_type: 'Granite', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Green', characteristics: 'Eucalyptus green granite with natural beauty', image_filename: 'image_75.jpeg' },
  { id: '76', name: 'Mármore Thassos', category: 'White Marbles', rock_type: 'Marble', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Pure White', characteristics: 'Pure white Thassos marble from Greece', image_filename: 'image_76.png' },
  { id: '77', name: 'Mármore Sivec', category: 'White Marbles', rock_type: 'Marble', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'White', characteristics: 'White Sivec marble with subtle veining', image_filename: 'image_77.jpeg' },
  { id: '78', name: 'Mármore Bianco Puro', category: 'White Marbles', rock_type: 'Marble', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Pure White', characteristics: 'Pure white marble with minimal veining', image_filename: 'image_78.png' },
  { id: '79', name: 'Mármore Crystal White', category: 'White Marbles', rock_type: 'Marble', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Crystal White', characteristics: 'Crystal white marble with translucent quality', image_filename: 'image_79.jpeg' },
  { id: '80', name: 'Mármore Snow White', category: 'White Marbles', rock_type: 'Marble', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Snow White', characteristics: 'Snow white marble with pristine appearance', image_filename: 'image_80.png' },
  { id: '81', name: 'Basalto Coluna', category: 'Basalts', rock_type: 'Basalt', finishes: 'Natural, Honed', available_in: 'Slab', base_color: 'Dark Gray', characteristics: 'Columnar basalt with natural geometric patterns', image_filename: 'image_81.jpeg' },
  { id: '82', name: 'Basalto Vesicular Verde', category: 'Basalts', rock_type: 'Basalt', finishes: 'Natural, Honed', available_in: 'Slab', base_color: 'Green/Black', characteristics: 'Green basalt with vesicular texture', image_filename: 'image_82.png' },
  { id: '83', name: 'Basalto Azul', category: 'Basalts', rock_type: 'Basalt', finishes: 'Natural, Honed', available_in: 'Slab', base_color: 'Blue/Black', characteristics: 'Blue basalt with oceanic origin', image_filename: 'image_83.jpeg' },
  { id: '84', name: 'Basalto Vermelho', category: 'Basalts', rock_type: 'Basalt', finishes: 'Natural, Honed', available_in: 'Slab', base_color: 'Red/Black', characteristics: 'Red basalt with iron oxide coloring', image_filename: 'image_84.png' },
  { id: '85', name: 'Basalto Polido', category: 'Basalts', rock_type: 'Basalt', finishes: 'Polished', available_in: 'Slab', base_color: 'Black', characteristics: 'Polished basalt with mirror-like finish', image_filename: 'image_85.jpeg' },
  { id: '86', name: 'Serpentino Verde', category: 'Serpentines', rock_type: 'Serpentine', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Green', characteristics: 'Green serpentine with snake-like patterns', image_filename: 'image_86.png' },
  { id: '87', name: 'Serpentino Preto', category: 'Serpentines', rock_type: 'Serpentine', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Black/Green', characteristics: 'Black serpentine with green mineral veins', image_filename: 'image_87.jpeg' },
  { id: '88', name: 'Serpentino Ouro', category: 'Serpentines', rock_type: 'Serpentine', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Gold/Green', characteristics: 'Golden serpentine with metallic luster', image_filename: 'image_88.png' },
  { id: '89', name: 'Serpentino Cinza', category: 'Serpentines', rock_type: 'Serpentine', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Gray/Green', characteristics: 'Gray serpentine with subtle green tones', image_filename: 'image_89.jpeg' },
  { id: '90', name: 'Serpentino Rajado', category: 'Serpentines', rock_type: 'Serpentine', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Multi-green', characteristics: 'Striped serpentine with varied green tones', image_filename: 'image_90.png' },
  { id: '91', name: 'Gnaisse Dourado', category: 'Gneisses', rock_type: 'Gneiss', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Gold/Brown', characteristics: 'Golden gneiss with metamorphic banding', image_filename: 'image_91.jpeg' },
  { id: '92', name: 'Gnaisse Prateado', category: 'Gneisses', rock_type: 'Gneiss', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Silver/Gray', characteristics: 'Silver gneiss with metallic appearance', image_filename: 'image_92.png' },
  { id: '93', name: 'Gnaisse Rajado', category: 'Gneisses', rock_type: 'Gneiss', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Multi-colored', characteristics: 'Banded gneiss with colorful mineral layers', image_filename: 'image_93.jpeg' },
  { id: '94', name: 'Gnaisse Azul', category: 'Gneisses', rock_type: 'Gneiss', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Blue/Gray', characteristics: 'Blue gneiss with unique coloration', image_filename: 'image_94.png' },
  { id: '95', name: 'Gnaisse Verde', category: 'Gneisses', rock_type: 'Gneiss', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Green/Gray', characteristics: 'Green gneiss with chlorite minerals', image_filename: 'image_95.jpeg' },
  { id: '96', name: 'Xisto Dourado', category: 'Schists', rock_type: 'Schist', finishes: 'Natural, Honed', available_in: 'Slab', base_color: 'Gold/Brown', characteristics: 'Golden schist with micaceous luster', image_filename: 'image_96.png' },
  { id: '97', name: 'Xisto Verde', category: 'Schists', rock_type: 'Schist', finishes: 'Natural, Honed', available_in: 'Slab', base_color: 'Green', characteristics: 'Green schist with chlorite content', image_filename: 'image_97.jpeg' },
  { id: '98', name: 'Xisto Grafite', category: 'Schists', rock_type: 'Schist', finishes: 'Natural, Honed', available_in: 'Slab', base_color: 'Graphite', characteristics: 'Graphite schist with metallic sheen', image_filename: 'image_98.png' },
  { id: '99', name: 'Xisto Prateado', category: 'Schists', rock_type: 'Schist', finishes: 'Natural, Honed', available_in: 'Slab', base_color: 'Silver', characteristics: 'Silver schist with mica reflections', image_filename: 'image_99.jpeg' },
  { id: '100', name: 'Xisto Multicolor', category: 'Schists', rock_type: 'Schist', finishes: 'Natural, Honed', available_in: 'Slab', base_color: 'Multi-colored', characteristics: 'Multicolored schist with varied minerals', image_filename: 'image_100.png' },
  { id: '101', name: 'Filito Dourado', category: 'Phyllites', rock_type: 'Phyllite', finishes: 'Natural', available_in: 'Slab', base_color: 'Gold', characteristics: 'Golden phyllite with fine-grained texture', image_filename: 'image_101.jpeg' },
  { id: '102', name: 'Filito Prateado', category: 'Phyllites', rock_type: 'Phyllite', finishes: 'Natural', available_in: 'Slab', base_color: 'Silver', characteristics: 'Silver phyllite with silky luster', image_filename: 'image_102.png' },
  { id: '103', name: 'Filito Verde', category: 'Phyllites', rock_type: 'Phyllite', finishes: 'Natural', available_in: 'Slab', base_color: 'Green', characteristics: 'Green phyllite with metamorphic sheen', image_filename: 'image_103.jpeg' },
  { id: '104', name: 'Filito Azul', category: 'Phyllites', rock_type: 'Phyllite', finishes: 'Natural', available_in: 'Slab', base_color: 'Blue', characteristics: 'Blue phyllite with unique coloration', image_filename: 'image_104.png' },
  { id: '105', name: 'Filito Grafite', category: 'Phyllites', rock_type: 'Phyllite', finishes: 'Natural', available_in: 'Slab', base_color: 'Graphite', characteristics: 'Graphite phyllite with carbon content', image_filename: 'image_105.jpeg' },
  { id: '106', name: 'Quartzito Rosa', category: 'Pink Quartzites', rock_type: 'Quartzite', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Pink/Rose', characteristics: 'Pink quartzite with rose coloration', image_filename: 'image_106.png' },
  { id: '107', name: 'Quartzito Coral', category: 'Pink Quartzites', rock_type: 'Quartzite', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Coral', characteristics: 'Coral quartzite with warm tones', image_filename: 'image_107.jpeg' },
  { id: '108', name: 'Quartzito Salmão', category: 'Pink Quartzites', rock_type: 'Quartzite', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Salmon', characteristics: 'Salmon quartzite with delicate coloring', image_filename: 'image_108.png' },
  { id: '109', name: 'Quartzito Magenta', category: 'Pink Quartzites', rock_type: 'Quartzite', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Magenta', characteristics: 'Magenta quartzite with vibrant color', image_filename: 'image_109.jpeg' },
  { id: '110', name: 'Quartzito Fúcsia', category: 'Pink Quartzites', rock_type: 'Quartzite', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Fuchsia', characteristics: 'Fuchsia quartzite with intense pink', image_filename: 'image_110.png' },
  { id: '111', name: 'Granito Cinza Maragogi', category: 'Gray Granites', rock_type: 'Granite', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Gray', characteristics: 'Gray granite from Maragogi with uniform texture', image_filename: 'image_111.jpeg' },
  { id: '112', name: 'Granito Cinza Corumbá', category: 'Gray Granites', rock_type: 'Granite', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Gray', characteristics: 'Gray granite from Corumbá with distinctive patterns', image_filename: 'image_112.png' },
  { id: '113', name: 'Granito Cinza Andorinha', category: 'Gray Granites', rock_type: 'Granite', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Gray', characteristics: 'Gray granite with swallow-like patterns', image_filename: 'image_113.jpeg' },
  { id: '114', name: 'Granito Cinza Platina', category: 'Gray Granites', rock_type: 'Granite', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Platinum Gray', characteristics: 'Platinum gray granite with metallic finish', image_filename: 'image_114.png' },
  { id: '115', name: 'Granito Cinza Naturale', category: 'Gray Granites', rock_type: 'Granite', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Natural Gray', characteristics: 'Natural gray granite with organic patterns', image_filename: 'image_115.jpeg' },
  { id: '116', name: 'Conglomerado Dourado', category: 'Conglomerates', rock_type: 'Conglomerate', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Gold/Brown', characteristics: 'Golden conglomerate with rounded pebbles', image_filename: 'image_116.png' },
  { id: '117', name: 'Conglomerado Prateado', category: 'Conglomerates', rock_type: 'Conglomerate', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Silver/Gray', characteristics: 'Silver conglomerate with metallic pebbles', image_filename: 'image_117.jpeg' },
  { id: '118', name: 'Conglomerado Multicolor', category: 'Conglomerates', rock_type: 'Conglomerate', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Multi-colored', characteristics: 'Multicolored conglomerate with varied pebbles', image_filename: 'image_118.png' },
  { id: '119', name: 'Conglomerado Verde', category: 'Conglomerates', rock_type: 'Conglomerate', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Green', characteristics: 'Green conglomerate with jade-like pebbles', image_filename: 'image_119.jpeg' },
  { id: '120', name: 'Conglomerado Azul', category: 'Conglomerates', rock_type: 'Conglomerate', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Blue', characteristics: 'Blue conglomerate with azure pebbles', image_filename: 'image_120.png' },
  { id: '121', name: 'Brecha Dourada', category: 'Breccias', rock_type: 'Breccia', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Gold/Brown', characteristics: 'Golden breccia with angular fragments', image_filename: 'image_121.jpeg' },
  { id: '122', name: 'Brecha Vermelha', category: 'Breccias', rock_type: 'Breccia', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Red', characteristics: 'Red breccia with striking angular patterns', image_filename: 'image_122.png' },
  { id: '123', name: 'Brecha Verde', category: 'Breccias', rock_type: 'Breccia', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Green', characteristics: 'Green breccia with serpentine fragments', image_filename: 'image_123.jpeg' },
  { id: '124', name: 'Brecha Azul', category: 'Breccias', rock_type: 'Breccia', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Blue', characteristics: 'Blue breccia with lapis-like coloring', image_filename: 'image_124.png' },
  { id: '125', name: 'Brecha Multicolor', category: 'Breccias', rock_type: 'Breccia', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Multi-colored', characteristics: 'Multicolored breccia with diverse fragments', image_filename: 'image_125.jpeg' },
  { id: '126', name: 'Pedra Miracema', category: 'Regional Stones', rock_type: 'Limestone', finishes: 'Natural, Honed', available_in: 'Slab, Tile', base_color: 'Cream/Beige', characteristics: 'Brazilian Miracema limestone with natural beauty', image_filename: 'image_126.png' },
  { id: '127', name: 'Pedra Goiás', category: 'Regional Stones', rock_type: 'Quartzite', finishes: 'Natural, Honed', available_in: 'Slab, Tile', base_color: 'Beige/Brown', characteristics: 'Goiás quartzite with rustic appearance', image_filename: 'image_127.jpeg' },
  { id: '128', name: 'Pedra Mineira', category: 'Regional Stones', rock_type: 'Slate', finishes: 'Natural, Honed', available_in: 'Slab, Tile', base_color: 'Gray/Blue', characteristics: 'Minas Gerais slate with traditional patterns', image_filename: 'image_128.png' },
  { id: '129', name: 'Pedra Bahiana', category: 'Regional Stones', rock_type: 'Sandstone', finishes: 'Natural, Honed', available_in: 'Slab, Tile', base_color: 'Yellow/Orange', characteristics: 'Bahian sandstone with tropical colors', image_filename: 'image_129.jpeg' },
  { id: '130', name: 'Pedra Carioca', category: 'Regional Stones', rock_type: 'Gneiss', finishes: 'Natural, Honed', available_in: 'Slab, Tile', base_color: 'Gray/White', characteristics: 'Rio de Janeiro gneiss with coastal character', image_filename: 'image_130.png' },
  { id: '131', name: 'Mármore Crema Marfil', category: 'Cream Marbles', rock_type: 'Marble', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Cream', characteristics: 'Spanish Crema Marfil marble with warm tones', image_filename: 'image_131.jpeg' },
  { id: '132', name: 'Mármore Botticino', category: 'Cream Marbles', rock_type: 'Marble', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Beige/Cream', characteristics: 'Italian Botticino marble with classic beauty', image_filename: 'image_132.png' },
  { id: '133', name: 'Mármore Sahara Cream', category: 'Cream Marbles', rock_type: 'Marble', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Sahara Cream', characteristics: 'Sahara cream marble with desert-like patterns', image_filename: 'image_133.jpeg' },
  { id: '134', name: 'Mármore Vanilla', category: 'Cream Marbles', rock_type: 'Marble', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Vanilla', characteristics: 'Vanilla marble with sweet creamy tones', image_filename: 'image_134.png' },
  { id: '135', name: 'Mármore Champagne', category: 'Cream Marbles', rock_type: 'Marble', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Champagne', characteristics: 'Champagne marble with elegant bubbling patterns', image_filename: 'image_135.jpeg' },
  { id: '136', name: 'Granito Butterfly', category: 'Exotic Granites', rock_type: 'Granite', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Multi-colored', characteristics: 'Butterfly granite with wing-like patterns', image_filename: 'image_136.png' },
  { id: '137', name: 'Granito Leopard', category: 'Exotic Granites', rock_type: 'Granite', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Spotted', characteristics: 'Leopard granite with animal-like spots', image_filename: 'image_137.jpeg' },
  { id: '138', name: 'Granito Tiger', category: 'Exotic Granites', rock_type: 'Granite', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Striped', characteristics: 'Tiger granite with bold striped patterns', image_filename: 'image_138.png' },
  { id: '139', name: 'Granito Zebra', category: 'Exotic Granites', rock_type: 'Granite', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Black/White', characteristics: 'Zebra granite with alternating stripes', image_filename: 'image_139.jpeg' },
  { id: '140', name: 'Granito Peacock', category: 'Exotic Granites', rock_type: 'Granite', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Iridescent', characteristics: 'Peacock granite with iridescent feather patterns', image_filename: 'image_140.png' },
  { id: '141', name: 'Lapis Lazuli', category: 'Semi-Precious', rock_type: 'Lapis Lazuli', finishes: 'Polished', available_in: 'Slab', base_color: 'Deep Blue', characteristics: 'Deep blue lapis lazuli with gold flecks', image_filename: 'image_141.jpeg' },
  { id: '142', name: 'Sodalita', category: 'Semi-Precious', rock_type: 'Sodalite', finishes: 'Polished', available_in: 'Slab', base_color: 'Blue', characteristics: 'Blue sodalite with white calcite veins', image_filename: 'image_142.png' },
  { id: '143', name: 'Malaquita', category: 'Semi-Precious', rock_type: 'Malachite', finishes: 'Polished', available_in: 'Slab', base_color: 'Green', characteristics: 'Green malachite with swirling patterns', image_filename: 'image_143.jpeg' },
  { id: '144', name: 'Azurita', category: 'Semi-Precious', rock_type: 'Azurite', finishes: 'Polished', available_in: 'Slab', base_color: 'Azure Blue', characteristics: 'Azure blue azurite with deep coloration', image_filename: 'image_144.png' },
  { id: '145', name: 'Rodocrosita', category: 'Semi-Precious', rock_type: 'Rhodochrosite', finishes: 'Polished', available_in: 'Slab', base_color: 'Pink', characteristics: 'Pink rhodochrosite with banded patterns', image_filename: 'image_145.jpeg' },
  { id: '146', name: 'Ágata Azul', category: 'Agates', rock_type: 'Agate', finishes: 'Polished', available_in: 'Slab', base_color: 'Blue', characteristics: 'Blue agate with concentric banding', image_filename: 'image_146.png' },
  { id: '147', name: 'Ágata Verde', category: 'Agates', rock_type: 'Agate', finishes: 'Polished', available_in: 'Slab', base_color: 'Green', characteristics: 'Green agate with moss-like inclusions', image_filename: 'image_147.jpeg' },
  { id: '148', name: 'Ágata Vermelha', category: 'Agates', rock_type: 'Agate', finishes: 'Polished', available_in: 'Slab', base_color: 'Red', characteristics: 'Red agate with fire-like patterns', image_filename: 'image_148.png' },
  { id: '149', name: 'Ágata Roxa', category: 'Agates', rock_type: 'Agate', finishes: 'Polished', available_in: 'Slab', base_color: 'Purple', characteristics: 'Purple agate with amethyst-like coloring', image_filename: 'image_149.jpeg' },
  { id: '150', name: 'Ágata Multicolor', category: 'Agates', rock_type: 'Agate', finishes: 'Polished', available_in: 'Slab', base_color: 'Multi-colored', characteristics: 'Multicolored agate with rainbow banding', image_filename: 'image_150.png' },
  { id: '151', name: 'Jaspe Vermelho', category: 'Jaspers', rock_type: 'Jasper', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Red', characteristics: 'Red jasper with iron oxide coloring', image_filename: 'image_151.jpeg' },
  { id: '152', name: 'Jaspe Verde', category: 'Jaspers', rock_type: 'Jasper', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Green', characteristics: 'Green jasper with forest-like patterns', image_filename: 'image_152.png' },
  { id: '153', name: 'Jaspe Amarelo', category: 'Jaspers', rock_type: 'Jasper', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Yellow', characteristics: 'Yellow jasper with golden earth tones', image_filename: 'image_153.jpeg' },
  { id: '154', name: 'Jaspe Azul', category: 'Jaspers', rock_type: 'Jasper', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Blue', characteristics: 'Blue jasper with sky-like coloring', image_filename: 'image_154.png' },
  { id: '155', name: 'Jaspe Leopardo', category: 'Jaspers', rock_type: 'Jasper', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Spotted', characteristics: 'Leopard jasper with spotted animal patterns', image_filename: 'image_155.jpeg' },
  { id: '156', name: 'Calcedônia Azul', category: 'Chalcedonies', rock_type: 'Chalcedony', finishes: 'Polished', available_in: 'Slab', base_color: 'Blue', characteristics: 'Blue chalcedony with translucent quality', image_filename: 'image_156.png' },
  { id: '157', name: 'Calcedônia Verde', category: 'Chalcedonies', rock_type: 'Chalcedony', finishes: 'Polished', available_in: 'Slab', base_color: 'Green', characteristics: 'Green chalcedony with jade-like appearance', image_filename: 'image_157.jpeg' },
  { id: '158', name: 'Calcedônia Rosa', category: 'Chalcedonies', rock_type: 'Chalcedony', finishes: 'Polished', available_in: 'Slab', base_color: 'Pink', characteristics: 'Pink chalcedony with rose quartz-like beauty', image_filename: 'image_158.png' },
  { id: '159', name: 'Calcedônia Branca', category: 'Chalcedonies', rock_type: 'Chalcedony', finishes: 'Polished', available_in: 'Slab', base_color: 'White', characteristics: 'White chalcedony with milky translucence', image_filename: 'image_159.jpeg' },
  { id: '160', name: 'Calcedônia Cinza', category: 'Chalcedonies', rock_type: 'Chalcedony', finishes: 'Polished', available_in: 'Slab', base_color: 'Gray', characteristics: 'Gray chalcedony with smoky appearance', image_filename: 'image_160.png' },
  { id: '161', name: 'Turmalina Verde', category: 'Tourmalines', rock_type: 'Tourmaline', finishes: 'Polished', available_in: 'Slab', base_color: 'Green', characteristics: 'Green tourmaline with crystal inclusions', image_filename: 'image_161.jpeg' },
  { id: '162', name: 'Turmalina Rosa', category: 'Tourmalines', rock_type: 'Tourmaline', finishes: 'Polished', available_in: 'Slab', base_color: 'Pink', characteristics: 'Pink tourmaline with watermelon coloring', image_filename: 'image_162.png' },
  { id: '163', name: 'Turmalina Azul', category: 'Tourmalines', rock_type: 'Tourmaline', finishes: 'Polished', available_in: 'Slab', base_color: 'Blue', characteristics: 'Blue tourmaline with indicolite beauty', image_filename: 'image_163.jpeg' },
  { id: '164', name: 'Turmalina Preta', category: 'Tourmalines', rock_type: 'Tourmaline', finishes: 'Polished', available_in: 'Slab', base_color: 'Black', characteristics: 'Black tourmaline with schorl composition', image_filename: 'image_164.png' },
  { id: '165', name: 'Turmalina Multicolor', category: 'Tourmalines', rock_type: 'Tourmaline', finishes: 'Polished', available_in: 'Slab', base_color: 'Multi-colored', characteristics: 'Multicolored tourmaline with elbaite variety', image_filename: 'image_165.jpeg' },
  { id: '166', name: 'Fluorita Roxa', category: 'Fluorites', rock_type: 'Fluorite', finishes: 'Polished', available_in: 'Slab', base_color: 'Purple', characteristics: 'Purple fluorite with cubic crystal structure', image_filename: 'image_166.png' },
  { id: '167', name: 'Fluorita Verde', category: 'Fluorites', rock_type: 'Fluorite', finishes: 'Polished', available_in: 'Slab', base_color: 'Green', characteristics: 'Green fluorite with mint-like coloring', image_filename: 'image_167.jpeg' },
  { id: '168', name: 'Fluorita Azul', category: 'Fluorites', rock_type: 'Fluorite', finishes: 'Polished', available_in: 'Slab', base_color: 'Blue', characteristics: 'Blue fluorite with ocean-like transparency', image_filename: 'image_168.png' },
  { id: '169', name: 'Fluorita Amarela', category: 'Fluorites', rock_type: 'Fluorite', finishes: 'Polished', available_in: 'Slab', base_color: 'Yellow', characteristics: 'Yellow fluorite with golden honey glow', image_filename: 'image_169.jpeg' },
  { id: '170', name: 'Fluorita Rosa', category: 'Fluorites', rock_type: 'Fluorite', finishes: 'Polished', available_in: 'Slab', base_color: 'Pink', characteristics: 'Pink fluorite with delicate rose coloring', image_filename: 'image_170.png' },
  { id: '171', name: 'Calcário Fóssil Marinho', category: 'Marine Fossils', rock_type: 'Limestone', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Beige/Brown', characteristics: 'Marine fossil limestone with sea creature imprints', image_filename: 'image_171.jpeg' },
  { id: '172', name: 'Calcário Amonita', category: 'Marine Fossils', rock_type: 'Limestone', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Gray/Beige', characteristics: 'Limestone featuring ammonite fossil spirals', image_filename: 'image_172.png' },
  { id: '173', name: 'Calcário Coral Fóssil', category: 'Marine Fossils', rock_type: 'Limestone', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Cream/Orange', characteristics: 'Fossilized coral limestone with reef patterns', image_filename: 'image_173.jpeg' },
  { id: '174', name: 'Calcário Crinóide', category: 'Marine Fossils', rock_type: 'Limestone', finishes: 'Polished, Honed', available_in: 'Slab', base_color: 'Beige/Gray', characteristics: 'Crinoid limestone with sea lily fossils', image_filename: 'image_174.png' }
];

// Adicionar as imagens disponíveis aos dados iniciais
const stonesWithImages = initialStones.map(stone => {
  const hasImage = ['image_1.jpeg', 'image_2.png', 'image_3.png', 'image_4.jpeg'].includes(stone.image_filename);
  if (hasImage) {
    const imageMap: { [key: string]: string } = {
      'image_1.jpeg': '/lovable-uploads/14b3e1d0-8f04-4112-a939-ede0d6ad3f58.png',
      'image_2.png': '/lovable-uploads/ab956562-5b10-4384-9d89-cf0616450602.png',
      'image_3.png': '/lovable-uploads/8c6ffb9e-aae1-4b77-bccf-0d00024f5aff.png',
      'image_4.jpeg': '/lovable-uploads/4b24d0c6-d562-46ec-8bc4-7ebfa01a9a49.png'
    };
    return { ...stone, image_url: imageMap[stone.image_filename] };
  }
  return stone;
});

const Catalog = () => {
  const [stones, setStones] = useState<Stone[]>(stonesWithImages);
  const [selectedStone, setSelectedStone] = useState<Stone | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isEditSelectOpen, setIsEditSelectOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterRockType, setFilterRockType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<Stone>({
    defaultValues: {
      name: '',
      category: 'Noble Stones',
      rock_type: 'Marble',
      finishes: 'Polished, Honed',
      available_in: 'Slab',
      base_color: '',
      characteristics: '',
      image_filename: ''
    }
  });

  // Filtros únicos para os selects
  const categories = [...new Set(stones.map(stone => stone.category))];
  const rockTypes = [...new Set(stones.map(stone => stone.rock_type))];

  // Pedras filtradas
  const filteredStones = stones.filter(stone => {
    const matchesCategory = filterCategory === 'all' || stone.category === filterCategory;
    const matchesRockType = filterRockType === 'all' || stone.rock_type === filterRockType;
    const matchesSearch = !searchTerm || 
      stone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stone.characteristics.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesRockType && matchesSearch;
  });

  const onSubmit = (data: Stone) => {
    if (selectedStone) {
      // Editar pedra existente
      setStones(stones.map(stone => 
        stone.id === selectedStone.id ? { ...data, id: selectedStone.id } : stone
      ));
      toast({
        title: "Pedra atualizada",
        description: `${data.name} foi atualizada com sucesso.`,
      });
    } else {
      // Adicionar nova pedra
      const newStone = { ...data, id: Date.now().toString() };
      setStones([...stones, newStone]);
      toast({
        title: "Pedra adicionada",
        description: `${data.name} foi adicionada ao catálogo.`,
      });
    }
    setIsDialogOpen(false);
    setSelectedStone(null);
    form.reset();
  };

  const editStone = (stone: Stone) => {
    setSelectedStone(stone);
    form.reset(stone);
    setIsDialogOpen(true);
  };

  const selectStoneToEdit = (stone: Stone) => {
    setSelectedStone(stone);
    form.reset(stone);
    setIsEditSelectOpen(false);
    setIsDialogOpen(true);
  };

  const deleteStone = (id: string) => {
    const stoneName = stones.find(s => s.id === id)?.name;
    setStones(stones.filter(stone => stone.id !== id));
    toast({
      title: "Pedra removida",
      description: `${stoneName} foi removida do catálogo.`,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const validFiles = Array.from(files).filter(file => 
        initialStones.some(stone => stone.image_filename === file.name)
      );
      
      if (validFiles.length > 0) {
        toast({
          title: "Upload realizado",
          description: `${validFiles.length} imagens válidas foram processadas.`,
        });
        console.log('Arquivos válidos processados:', validFiles.length);
        
        // Aqui você implementaria a lógica real de upload
        // Por enquanto, apenas simula a associação das imagens
      } else {
        toast({
          title: "Nenhuma imagem válida",
          description: "As imagens devem seguir o padrão da lista (image_1.jpeg, image_2.png, etc.)",
        });
      }
    }
  };

  const clearFilters = () => {
    setFilterCategory('all');
    setFilterRockType('all');
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Catálogo de Pedras Naturais
          </h1>
          <p className="text-gray-600">
            Gerencie seu catálogo completo de 174 pedras naturais com upload em lote
          </p>
        </div>

        {/* Seção de Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros de Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <Input
                placeholder="Buscar por nome ou características..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterRockType} onValueChange={setFilterRockType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por tipo de rocha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {rockTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            </div>
            <div className="text-sm text-gray-600">
              Mostrando {filteredStones.length} de {stones.length} pedras
            </div>
          </CardContent>
        </Card>

        {/* Botões de ação */}
        <div className="flex gap-4 mb-6">
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Upload className="mr-2 h-4 w-4" />
                Upload em Lote
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload em Lote de Imagens</DialogTitle>
                <DialogDescription>
                  Selecione múltiplas imagens para upload. Os nomes dos arquivos devem seguir o padrão: image_1.jpeg, image_2.png, etc.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
                <p className="text-sm text-gray-500">
                  Formatos aceitos: .jpeg, .jpg, .png, .webp
                </p>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setSelectedStone(null); form.reset(); }}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Pedra
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedStone ? 'Editar Pedra' : 'Nova Pedra'}
                </DialogTitle>
                <DialogDescription>
                  Preencha as informações da pedra natural
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da Pedra</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Âmbar Deserto" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoria</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a categoria" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map(category => (
                                  <SelectItem key={category} value={category}>{category}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="rock_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Rocha</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                {rockTypes.map(type => (
                                  <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="finishes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Acabamentos</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Polished, Honed" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="available_in"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Disponível em</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Slab" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="base_color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cor Base</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Beige/Brown" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="characteristics"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Características</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva as características da pedra..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="image_filename"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Arquivo de Imagem</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: image_1.jpeg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {selectedStone ? 'Salvar' : 'Criar'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditSelectOpen} onOpenChange={setIsEditSelectOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Editar Existente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Selecionar Pedra para Editar</DialogTitle>
                <DialogDescription>
                  Escolha uma pedra existente no catálogo para editar
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {stones.map((stone) => (
                  <Card 
                    key={stone.id} 
                    className="cursor-pointer hover:bg-gray-50 p-3"
                    onClick={() => selectStoneToEdit(stone)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{stone.name}</h4>
                        <p className="text-sm text-gray-600">{stone.category} - {stone.rock_type}</p>
                      </div>
                      <Edit className="h-4 w-4 text-gray-400" />
                    </div>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Grid de pedras com imagem 200x100px */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredStones.map((stone) => (
            <Card key={stone.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="w-full h-[100px] overflow-hidden bg-gray-100 relative">
                {stone.image_url ? (
                  <img
                    src={stone.image_url}
                    alt={stone.name}
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => setZoomedImage(stone.image_url!)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4">
                    <ImageOff className="h-8 w-8 mb-1" />
                    <div className="text-center">
                      <div className="font-medium text-xs">Falta imagem</div>
                      <div className="text-xs mt-1">{stone.image_filename}</div>
                    </div>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  #{stone.id}
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{stone.name}</CardTitle>
                <CardDescription>
                  <span className="font-medium">Item Name:</span> {stone.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1">
                  <div><strong>Technical Specifications:</strong></div>
                  <ul className="space-y-1 pl-4">
                    <li><strong>Category:</strong> {stone.category}</li>
                    <li><strong>Rock type:</strong> {stone.rock_type}</li>
                    <li><strong>Available finishes:</strong> {stone.finishes}</li>
                    <li><strong>Available in:</strong> {stone.available_in}</li>
                    <li><strong>Base color:</strong> {stone.base_color}</li>
                    <li><strong>Characteristics:</strong> {stone.characteristics}</li>
                  </ul>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editStone(stone)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteStone(stone.id)}
                    className="flex-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dialog para zoom da imagem */}
        <Dialog open={!!zoomedImage} onOpenChange={() => setZoomedImage(null)}>
          <DialogContent className="max-w-4xl w-full h-[80vh] flex flex-col">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle>Visualização da Imagem</DialogTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setZoomedImage(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>
            <div className="flex-1 flex items-center justify-center bg-black/5 rounded-lg overflow-hidden">
              {zoomedImage && (
                <img
                  src={zoomedImage}
                  alt="Zoom da pedra"
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        {filteredStones.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              Nenhuma pedra encontrada com os filtros aplicados
            </div>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Limpar Filtros
            </Button>
          </div>
        )}

        {/* Tabela administrativa */}
        <Card>
          <CardHeader>
            <CardTitle>Visão Administrativa</CardTitle>
            <CardDescription>
              Lista detalhada de todas as pedras no catálogo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cor Base</TableHead>
                  <TableHead>Imagem</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStones.map((stone) => (
                  <TableRow key={stone.id}>
                    <TableCell className="font-medium">{stone.name}</TableCell>
                    <TableCell>{stone.category}</TableCell>
                    <TableCell>{stone.rock_type}</TableCell>
                    <TableCell>{stone.base_color}</TableCell>
                    <TableCell>{stone.image_filename}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editStone(stone)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteStone(stone.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Catalog;
