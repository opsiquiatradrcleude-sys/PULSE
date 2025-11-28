import React from 'react';
import { Moment } from '../types';

const MOCK_MOMENTS: Moment[] = [
    { id: '1', user: 'Clara', avatar: 'https://picsum.photos/100/100?random=11', text: 'Morning workout done! 💪', timeAgo: '2h', likes: 24 },
    { id: '2', user: 'Lucas', avatar: 'https://picsum.photos/100/100?random=12', text: 'Trying to cook pasta from scratch. Wish me luck.', timeAgo: '5h', likes: 12 },
    { id: '3', user: 'Sophia', avatar: 'https://picsum.photos/100/100?random=13', text: 'Does anyone else think 2024 flew by?', timeAgo: '8h', likes: 45 },
];

const Moments: React.FC = () => {
  return (
    <div className="p-4 pt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Moments</h1>
        <button className="w-10 h-10 rounded-full bg-pulse-card flex items-center justify-center text-xl hover:bg-zinc-800 transition">+</button>
      </div>
      
      <div className="space-y-4">
        {MOCK_MOMENTS.map((moment) => (
            <div key={moment.id} className="bg-pulse-card rounded-2xl p-5 border border-zinc-800/50">
                <div className="flex items-center gap-3 mb-3">
                    <img src={moment.avatar} className="w-10 h-10 rounded-full object-cover border border-zinc-700" alt={moment.user} />
                    <div>
                        <h4 className="font-bold text-sm text-white">{moment.user}</h4>
                        <span className="text-xs text-zinc-500">{moment.timeAgo} ago</span>
                    </div>
                </div>
                <p className="text-zinc-200 mb-4 text-lg font-light leading-snug">
                    {moment.text}
                </p>
                <div className="flex items-center gap-4 text-sm text-zinc-500">
                    <button className="flex items-center gap-1 hover:text-pulse-primary transition group">
                        <svg className="w-5 h-5 group-hover:fill-current" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        {moment.likes}
                    </button>
                    <button className="flex items-center gap-1 hover:text-white transition">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        Reply
                    </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Moments;