import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FlameIcon, MessageIcon, UserIcon, StarIcon, SparklesIcon, MapPinIcon } from './Icons';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-pulse-dark text-white flex justify-center">
      {/* Mobile-first Container: Max width on desktop to simulate app feel */}
      <div className="w-full max-w-md h-screen flex flex-col relative bg-pulse-dark shadow-2xl border-x border-zinc-800">
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto no-scrollbar pb-20">
          <Outlet />
        </main>

        {/* Bottom Navigation Bar */}
        <nav className="absolute bottom-0 w-full h-16 bg-pulse-dark/95 backdrop-blur-md border-t border-zinc-800 flex justify-around items-center z-50 px-2">
          <NavLink 
            to="/" 
            className={({ isActive }) => `p-3 rounded-full transition-all duration-200 ${isActive ? 'text-pulse-primary bg-pulse-primary/10' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <FlameIcon className="w-7 h-7" />
          </NavLink>
          
          <NavLink 
            to="/moments" 
            className={({ isActive }) => `p-3 rounded-full transition-all duration-200 ${isActive ? 'text-blue-500 bg-blue-500/10' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <StarIcon className="w-7 h-7" />
          </NavLink>

          <NavLink 
            to="/speed-match" 
            className={({ isActive }) => `p-3 rounded-full transition-all duration-200 ${isActive ? 'text-yellow-500 bg-yellow-500/10' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <SparklesIcon className="w-7 h-7" />
          </NavLink>

          <NavLink 
            to="/places" 
            className={({ isActive }) => `p-3 rounded-full transition-all duration-200 ${isActive ? 'text-emerald-500 bg-emerald-500/10' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <MapPinIcon className="w-7 h-7" />
          </NavLink>

          <NavLink 
            to="/chat" 
            className={({ isActive }) => `p-3 rounded-full transition-all duration-200 ${isActive ? 'text-pulse-accent bg-pulse-accent/10' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <MessageIcon className="w-7 h-7" />
          </NavLink>

          <NavLink 
            to="/profile" 
            className={({ isActive }) => `p-3 rounded-full transition-all duration-200 ${isActive ? 'text-white bg-white/10' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <UserIcon className="w-7 h-7" />
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default Layout;