import React, { useState, useEffect } from 'react';
import { 
  BeerIcon, 
  UtensilsIcon, 
  MusicIcon, 
  BedIcon, 
  HeartIcon, 
  ShoppingBagIcon, 
  GiftIcon,
  MapPinIcon
} from '../components/Icons';
import { findPlacesNearby } from '../services/geminiService';
import { Place } from '../types';

interface Category {
  id: number;
  name: string;
  icon: React.FC<{ className?: string }>;
  color: string;
}

const CATEGORIES: Category[] = [
  { id: 1, name: "Barzinhos", icon: BeerIcon, color: "text-[#FF5FA2]" },
  { id: 2, name: "Restaurantes", icon: UtensilsIcon, color: "text-[#E63946]" },
  { id: 3, name: "Baladas", icon: MusicIcon, color: "text-[#6A4CFF]" },
  { id: 4, name: "Motéis", icon: BedIcon, color: "text-[#8A2BE2]" },
  { id: 5, name: "Sexy Shops", icon: HeartIcon, color: "text-[#FF1493]" },
  { id: 6, name: "Lojas de Roupas", icon: ShoppingBagIcon, color: "text-[#4CC9F0]" },
  { id: 7, name: "Presentes Especiais", icon: GiftIcon, color: "text-[#FFD700]" }
];

const SAMPLE_PLACES: Record<string, Place[]> = {
  "Barzinhos": [
    { name: "Boteco do Zé", rating: 4.6 },
    { name: "Bar Alto Astral", rating: 4.8 }
  ],
  "Restaurantes": [
    { name: "Cantina da Vila", rating: 4.9 },
    { name: "Steak House Prime", rating: 4.7 }
  ],
  "Baladas": [
    { name: "Club 21", rating: 4.8 },
    { name: "Neon Night", rating: 4.5 }
  ],
  "Motéis": [
    { name: "Motel Eclipse", rating: 4.9 },
    { name: "Paradise Motel", rating: 4.6 }
  ],
  "Sexy Shops": [
    { name: "Hot Dreams", rating: 4.7 },
    { name: "Sensual House", rating: 4.8 }
  ],
  "Lojas de Roupas": [
    { name: "Urban Style", rating: 4.5 },
    { name: "Lux Fashion", rating: 4.9 }
  ],
  "Presentes Especiais": [
    { name: "Gift & Love", rating: 4.7 },
    { name: "Presentes Deluxe", rating: 4.9 }
  ]
};

const PlacesScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn("Location permission denied, falling back to mock data.");
        }
      );
    }
  }, []);

  const handleCategorySelect = async (category: string) => {
    setSelectedCategory(category);
    // Optimistically set mock data first for instant feedback
    setPlaces(SAMPLE_PLACES[category] || []);

    if (location) {
      setLoading(true);
      const aiResults = await findPlacesNearby(category, location.lat, location.lng);
      if (aiResults && aiResults.length > 0) {
        setPlaces(aiResults);
      }
      setLoading(false);
    }
  };

  return (
    <div className="p-4 pt-10 h-full flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Lugares Perfeitos</h1>
      
      <div className="flex overflow-x-auto no-scrollbar space-x-3 mb-6 pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategorySelect(cat.name)}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl min-w-[100px] transition-all duration-200 border ${
              selectedCategory === cat.name 
                ? 'bg-zinc-800 border-zinc-600' 
                : 'bg-pulse-card border-transparent hover:bg-zinc-800'
            }`}
          >
            <div className={`mb-2 ${cat.color}`}>
              <cat.icon className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold whitespace-nowrap">{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {!selectedCategory ? (
          <div className="flex flex-col items-center justify-center h-40 text-zinc-500">
            <MapPinIcon className="w-12 h-12 mb-2 opacity-50" />
            <p>Selecione uma categoria acima</p>
          </div>
        ) : (
          <div className="space-y-3 animate-fade-in pb-4">
             <div className="flex justify-between items-center px-1 mb-2">
                <h2 className="text-xl font-bold">{selectedCategory}</h2>
                {loading && <span className="text-xs text-pulse-accent animate-pulse">Finding nearby gems...</span>}
             </div>
             
            {places.map((place, index) => (
              <div key={index} className="bg-pulse-card p-4 rounded-xl flex flex-col gap-2 border border-zinc-800 hover:border-zinc-700 transition">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-lg">{place.name}</span>
                  <span className="text-pulse-primary font-bold flex items-center gap-1 text-sm">
                    ⭐ {place.rating}
                  </span>
                </div>
                {place.uri && (
                  <a 
                    href={place.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="self-start text-xs text-blue-400 hover:underline flex items-center gap-1 mt-1"
                  >
                    <MapPinIcon className="w-3 h-3" />
                    View on Maps
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlacesScreen;