import React, { useState, useEffect } from 'react';
import { SparklesIcon } from '../components/Icons';

const SpeedMatch: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'searching' | 'connected'>('idle');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: any;
    if (status === 'searching') {
        setTimer(0);
        interval = setInterval(() => {
            setTimer(t => t + 1);
            if (Math.random() > 0.95) { // Random chance to connect
                setStatus('connected');
                setTimer(300); // 5 minutes
            }
        }, 100);
    } else if (status === 'connected') {
        interval = setInterval(() => {
            setTimer(t => t - 1);
        }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  if (status === 'connected') {
      return (
          <div className="flex flex-col h-full p-6 items-center justify-center text-center bg-gradient-to-br from-indigo-900 to-black">
              <div className="w-full max-w-sm bg-black/30 backdrop-blur-lg p-8 rounded-2xl border border-white/10">
                <h2 className="text-3xl font-bold text-white mb-2">Connected!</h2>
                <div className="text-6xl font-mono font-bold text-yellow-400 mb-6">
                    {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                </div>
                <div className="flex items-center gap-4 bg-zinc-800/80 p-4 rounded-xl mb-6">
                    <div className="w-12 h-12 bg-zinc-600 rounded-full animate-pulse"></div>
                    <div className="flex-1 text-left">
                        <div className="h-4 bg-zinc-600 rounded w-24 mb-2"></div>
                        <div className="h-3 bg-zinc-700 rounded w-32"></div>
                    </div>
                </div>
                <button onClick={() => setStatus('idle')} className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold transition">
                    End Session
                </button>
              </div>
          </div>
      )
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-black to-black -z-10"></div>
      
      <div className="mb-8 relative">
        <div className={`absolute inset-0 bg-pulse-accent blur-2xl opacity-50 ${status === 'searching' ? 'animate-pulse' : ''}`}></div>
        <SparklesIcon className="w-24 h-24 text-white relative z-10" />
      </div>

      <h1 className="text-4xl font-black italic mb-4">SPEED<span className="text-pulse-accent">MATCH</span></h1>
      
      {status === 'searching' ? (
        <div className="space-y-4">
             <p className="text-xl text-zinc-300">Searching for a vibe...</p>
             <div className="w-64 h-2 bg-zinc-800 rounded-full overflow-hidden mx-auto">
                 <div className="h-full bg-pulse-accent animate-[loading_1s_ease-in-out_infinite]"></div>
             </div>
             <button onClick={() => setStatus('idle')} className="mt-8 text-zinc-500 underline text-sm">Cancel</button>
        </div>
      ) : (
        <>
            <p className="text-zinc-400 mb-8 max-w-xs leading-relaxed">
                Skip the swiping. Get paired instantly for a 5-minute blind chat. If the vibe is right, reveal your profiles.
            </p>
            <button 
                onClick={() => setStatus('searching')}
                className="w-full max-w-xs py-4 bg-white text-black font-bold text-lg rounded-full hover:scale-105 transition shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
                Start Matching
            </button>
            <p className="mt-4 text-xs text-zinc-600">1 free session remaining today.</p>
        </>
      )}
      
      <style>{`
        @keyframes loading {
            0% { width: 0%; margin-left: 0; }
            50% { width: 100%; margin-left: 0; }
            100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );
};

export default SpeedMatch;