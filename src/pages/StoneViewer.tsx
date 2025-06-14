
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Dados de exemplo baseados no HTML fornecido
const exampleStones = [
  {
    id: '1',
    name: 'Âmbar Deserto',
    category: 'Noble Stones',
    rock_type: 'Marble',
    finishes: 'Polished, Honed',
    available_in: 'Slab',
    base_color: 'Beige/Brown',
    characteristics: 'Beige/brown marble with distinctive veins.',
    image_filename: 'image_1.jpeg',
    image_url: '/lovable-uploads/14b3e1d0-8f04-4112-a939-ede0d6ad3f58.png'
  },
  {
    id: '2',
    name: 'Jade Imperial',
    category: 'Noble Stones',
    rock_type: 'Marble',
    finishes: 'Polished, Honed',
    available_in: 'Slab',
    base_color: 'Green With Veins',
    characteristics: 'Green with veins marble with distinctive veins.',
    image_filename: 'image_2.png',
    image_url: '/lovable-uploads/ab956562-5b10-4384-9d89-cf0616450602.png'
  }
];

const StoneViewer = () => {
  const navigate = useNavigate();
  const [stones] = useState(exampleStones);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            Catálogo de Pedras Naturais
          </h1>
        </div>

        {stones.map((stone, index) => (
          <div key={stone.id} className={`produto ${index < stones.length - 1 ? 'mb-16' : ''}`}>
            <h1 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-800 pb-3 mb-4">
              {stone.name}
            </h1>
            
            <div className="font-bold text-lg mb-6">
              Item Name: {stone.name}
            </div>
            
            <div className="text-center my-8">
              <img 
                src={stone.image_url} 
                alt={stone.name}
                className="max-w-full max-h-96 mx-auto border border-gray-300 rounded-lg shadow-lg"
              />
            </div>
            
            <div className="bg-gray-100 p-6 rounded-lg">
              <strong className="text-lg">Technical Specifications:</strong>
              <ul className="mt-4 space-y-2 pl-6">
                <li><strong>Category:</strong> {stone.category}</li>
                <li><strong>Rock type:</strong> {stone.rock_type}</li>
                <li><strong>Available finishes:</strong> {stone.finishes}</li>
                <li><strong>Available in:</strong> {stone.available_in}</li>
                <li><strong>Base color:</strong> {stone.base_color}</li>
                <li><strong>Characteristics:</strong> {stone.characteristics}</li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoneViewer;
