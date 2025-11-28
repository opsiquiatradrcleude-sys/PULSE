import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { generateIcebreaker } from '../services/geminiService';
import { ChatSession, Message } from '../types';
import { SparklesIcon } from '../components/Icons';

const MOCK_CHATS: ChatSession[] = [
  { id: '1', profileId: '1', name: 'Clara', avatar: 'https://picsum.photos/400/600?random=1', lastMessage: 'See you then!', unread: 0 },
  { id: '2', profileId: '2', name: 'Lucas', avatar: 'https://picsum.photos/400/600?random=2', lastMessage: 'Haha exactly.', unread: 2 },
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
    { id: 'm1', text: 'Hey Clara! Love the bio.', fromMe: true, timestamp: 1633020000 },
    { id: 'm2', text: 'Thanks! Are you a dev too?', fromMe: false, timestamp: 1633020100 },
  ],
  '2': [
    { id: 'm3', text: 'That guitar solo was insane.', fromMe: true, timestamp: 1633030000 },
  ]
};

const ChatList: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="p-4 pt-10">
      <h1 className="text-3xl font-bold mb-6">Matches</h1>
      <div className="flex gap-4 overflow-x-auto no-scrollbar mb-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col items-center space-y-2 min-w-[70px]">
            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-pulse-primary to-pulse-accent">
                <img src={`https://picsum.photos/100/100?random=${i+10}`} className="w-full h-full rounded-full object-cover border-2 border-pulse-dark" alt="Match" />
            </div>
            <span className="text-xs font-semibold">Name</span>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-4">Messages</h2>
      <div className="flex flex-col gap-2">
        {MOCK_CHATS.map((chat) => (
          <div key={chat.id} onClick={() => navigate(`/chat/${chat.id}`)} className="flex items-center gap-4 p-3 bg-pulse-card/50 hover:bg-pulse-card rounded-xl cursor-pointer transition">
            <div className="relative">
                <img src={chat.avatar} className="w-14 h-14 rounded-full object-cover" alt={chat.name} />
                {chat.unread > 0 && <span className="absolute -top-1 -right-1 bg-pulse-primary w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold">{chat.unread}</span>}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-lg">{chat.name}</h3>
                <span className="text-xs text-zinc-500">2m</span>
              </div>
              <p className={`text-sm ${chat.unread > 0 ? 'text-white font-semibold' : 'text-zinc-500'} truncate`}>{chat.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChatDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  
  // Find chat details
  const chatInfo = MOCK_CHATS.find(c => c.id === id);

  useEffect(() => {
    if (id && MOCK_MESSAGES[id]) {
      setMessages(MOCK_MESSAGES[id]);
    } else {
        setMessages([]);
    }
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: Message = { id: Date.now().toString(), text: input, fromMe: true, timestamp: Date.now() };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
  };

  const handleAiWingman = async () => {
    if (!chatInfo) return;
    setIsGenerating(true);
    // In a real app, fetch bio from profile ID. Here we mock bio.
    const suggested = await generateIcebreaker("Loves cooking and hiking. Looking for something serious.", chatInfo.name);
    setInput(suggested);
    setIsGenerating(false);
  };

  if (!chatInfo) return <div className="p-10 text-center">Chat not found</div>;

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-zinc-800 bg-pulse-dark">
        <button onClick={() => navigate('/chat')} className="p-2 -ml-2 text-zinc-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <img src={chatInfo.avatar} className="w-10 h-10 rounded-full object-cover" alt={chatInfo.name} />
        <div>
            <h3 className="font-bold text-sm">{chatInfo.name}</h3>
            <span className="text-xs text-green-500 flex items-center gap-1">● Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${msg.fromMe ? 'bg-pulse-primary text-white rounded-tr-none' : 'bg-zinc-800 text-zinc-200 rounded-tl-none'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-pulse-dark border-t border-zinc-800">
        <div className="flex items-center gap-2">
            <button 
                onClick={handleAiWingman} 
                disabled={isGenerating}
                className="p-2 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full text-white animate-pulse-slow disabled:opacity-50"
                title="AI Wingman"
            >
                <SparklesIcon className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
            </button>
            <div className="flex-1 relative">
                <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-full py-2.5 px-4 text-white focus:outline-none focus:border-pulse-primary"
                />
            </div>
            <button onClick={handleSend} className="p-2.5 bg-pulse-primary rounded-full text-white hover:bg-red-600 transition">
                <svg className="w-5 h-5 translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9-2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
        </div>
      </div>
    </div>
  );
};

const ChatRouter: React.FC = () => {
    const { id } = useParams();
    return id ? <ChatDetail /> : <ChatList />;
}

export default ChatRouter;