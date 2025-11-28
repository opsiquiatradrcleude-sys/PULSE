import React, { useState } from 'react';
import { HeartIcon, XIcon, StarIcon } from '../components/Icons';
import { Profile } from '../types';
import { useNavigate } from 'react-router-dom';

const MOCK_PROFILES: Profile[] = [
  {
    id: '1',
    name: 'Clara',
    age: 28,
    headline: 'Coffee & Code ☕️',
    bio: 'Software engineer by day, amateur chef by night. Looking for someone who knows the difference between Java and JavaScript.',
    photos: ['https://picsum.photos/400/600?random=1'],
    verified: true,
    distance: 3
  },
  {
    id: '2',
    name: 'Lucas',
    age: 31,
    headline: 'Musician & Dreamer',
    bio: 'I play guitar and piano. Let’s make some music together or just chill and listen to vinyls.',
    photos: ['https://picsum.photos/400/600?random=2'],
    verified: false,
    distance: 12
  },
  {
    id: '3',
    name: 'Sophia',
    age: 24,
    headline: 'Adventure awaits 🌍',
    bio: 'Always planning the next trip. Hiking, surfing, and finding the best tacos in town.',
    photos: ['https://picsum.photos/400/600?random=3'],
    verified: true,
    distance: 5
  }
];

const Home: React.FC = () => {
  const [profiles, setProfiles] = useState(MOCK_PROFILES);
  const [lastDirection, setLastDirection] = useState<string | null>(null);
  const navigate = useNavigate();

  const currentProfile = profiles[0];

  const handleSwipe = (direction: 'left' | 'right' | 'super') => {
    setLastDirection(direction);
    setTimeout(() => {
      setProfiles((prev) => prev.slice(1));
      setLastDirection(null);
    }, 200); // Animation duration
  };

  const openProfile = () => {
    if (currentProfile) {
        navigate(`/profile/${currentProfile.id}`, { state: { profile: currentProfile } });
    }
  }

  if (!currentProfile) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in">
        <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <HeartIcon className="w-10 h-10 text-zinc-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">That's everyone!</h2>
        <p className="text-zinc-400">You've seen all profiles nearby. Check back later for more matches.</p>
        <button onClick={() => setProfiles(MOCK_PROFILES)} className="mt-8 px-6 py-3 bg-pulse-card border border-zinc-700 rounded-full text-sm hover:bg-zinc-800 transition">
            Reset Demo
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-full flex flex-col p-2 pt-4">
      {/* Header */}
      <div className="flex justify-between items-center px-4 mb-2">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-pulse-primary to-pulse-accent bg-clip-text text-transparent">Pulse</h1>
        <button className="p-2 bg-zinc-800 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
        </button>
      </div>

      {/* Card Container */}
      <div className="flex-1 relative w-full h-full max-h-[75vh]">
        <div 
          className={`relative w-full h-full rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 transform cursor-pointer
            ${lastDirection === 'left' ? '-translate-x-full rotate-[-20deg] opacity-0' : ''}
            ${lastDirection === 'right' ? 'translate-x-full rotate-[20deg] opacity-0' : ''}
            ${lastDirection === 'super' ? '-translate-y-full opacity-0' : ''}
          `}
          onClick={openProfile}
        >
          <img 
            src={currentProfile.photos[0]} 
            alt={currentProfile.name} 
            className="w-full h-full object-cover"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90"></div>
          
          {/* Content Info */}
          <div className="absolute bottom-0 left-0 w-full p-6 text-white">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-3xl font-bold">{currentProfile.name}, {currentProfile.age}</h2>
              {currentProfile.verified && (
                <span className="bg-blue-500 p-1 rounded-full" aria-label="Verified">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </span>
              )}
            </div>
            <p className="text-pulse-primary font-semibold text-sm uppercase tracking-wide mb-2">{currentProfile.headline}</p>
            <p className="text-zinc-300 line-clamp-2 text-sm opacity-90">{currentProfile.bio}</p>
            <div className="mt-2 flex items-center text-xs text-zinc-400">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                {currentProfile.distance} km away
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="h-24 flex items-center justify-center gap-6 pb-2">
        <button 
            onClick={(e) => { e.stopPropagation(); handleSwipe('left'); }}
            className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-700 text-pulse-primary flex items-center justify-center hover:scale-110 hover:bg-zinc-800 transition-all shadow-lg"
            aria-label="Pass"
        >
          <XIcon className="w-8 h-8" />
        </button>

        <button 
            onClick={(e) => { e.stopPropagation(); handleSwipe('super'); }}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700 text-blue-500 flex items-center justify-center hover:scale-110 hover:bg-zinc-800 transition-all shadow-lg"
            aria-label="Super Like"
        >
          <StarIcon className="w-5 h-5" />
        </button>

        <button 
            onClick={(e) => { e.stopPropagation(); handleSwipe('right'); }}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-pulse-primary to-rose-500 text-white flex items-center justify-center hover:scale-110 hover:shadow-red-500/50 transition-all shadow-lg"
            aria-label="Like"
        >
          <HeartIcon className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default Home;