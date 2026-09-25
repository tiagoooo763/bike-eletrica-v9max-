import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Radio, 
  Users, 
  Send, 
  ShoppingBag, 
  Heart, 
  Share2, 
  X, 
  Sparkles, 
  Flame 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { Header } from '../components/layout/Header';

interface ChatComment {
  id: string;
  name: string;
  avatar: string;
  text: string;
}

export const LiveShoppingPage: React.FC = () => {
  const { liveStreams } = useStore();
  const { addItem } = useCart();
  const { user } = useAuth();

  const currentLive = liveStreams[0];

  const [comments, setComments] = useState<ChatComment[]>([
    { id: '1', name: 'Rodrigo M.', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80', text: 'Esse kit de furadeira vem com as duas baterias mesmo?' },
    { id: '2', name: 'Camila Lima', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80', text: 'Acabei de comprar no Pix! Deu super certo 🔥' },
    { id: '3', name: 'Paulo Silva', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80', text: 'Tem cupom de primeira compra disponível na live?' },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [likesCount, setLikesCount] = useState(4890);

  // Auto-simulate incoming live stream comments
  useEffect(() => {
    const sampleComments = [
      'Gente, o preço tá muito barato!',
      'Fura concreto fácil essa de 48V?',
      'Comprei pra dar de presente pro meu pai!',
      'Entrega em quantos dias pra SP capital?',
      'Acabei de garantir a minha com frete reduzido! 🎉',
    ];
    const sampleNames = ['Lucas F.', 'Mariana C.', 'Bruno R.', 'Renata K.', 'Gabriel T.'];

    const interval = setInterval(() => {
      const randomText = sampleComments[Math.floor(Math.random() * sampleComments.length)];
      const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
      const newComment: ChatComment = {
        id: Math.random().toString(),
        name: randomName,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
        text: randomText,
      };

      setComments((prev) => [...prev.slice(-15), newComment]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newComment: ChatComment = {
      id: Date.now().toString(),
      name: user?.name || 'Você',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      text: inputMessage,
    };

    setComments((prev) => [...prev, newComment]);
    setInputMessage('');
  };

  const handleLikeLive = () => {
    setLikesCount((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      <div className="hidden md:block">
        <Header />
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full p-0 md:p-6 grid md:grid-cols-12 md:gap-6">
        {/* MAIN LIVE STREAM CONTAINER */}
        <div className="md:col-span-8 relative h-[calc(100vh-60px)] md:h-[650px] bg-slate-900 md:rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between">
          {/* Background Video / Presenter Stream */}
          <div className="absolute inset-0 z-0">
            <img
              src={currentLive.thumbnailUrl}
              alt={currentLive.title}
              className="w-full h-full object-cover brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/60 pointer-events-none" />
          </div>

          {/* Top Live Overlay Bar */}
          <div className="relative z-10 p-4 flex items-center justify-between">
            {/* Host info */}
            <div className="flex items-center gap-2.5 bg-black/40 backdrop-blur-md p-1.5 pr-3 rounded-full border border-white/10">
              <img
                src={currentLive.creator.avatar}
                alt={currentLive.creator.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-pulse-pink"
              />
              <div>
                <p className="text-xs font-bold leading-tight">{currentLive.creator.name}</p>
                <div className="flex items-center gap-1 text-[10px] text-slate-300">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                  <span>{currentLive.viewerCount.toLocaleString('pt-BR')} online</span>
                </div>
              </div>
              <button className="bg-brand text-white text-[11px] font-bold px-2.5 py-1 rounded-full ml-1 hover:bg-brand-600">
                + Seguir
              </button>
            </div>

            {/* Live Badge */}
            <div className="flex items-center gap-1 bg-rose-600 text-white font-extrabold text-xs px-3 py-1 rounded-full animate-pulse shadow-glow">
              <Radio className="w-3.5 h-3.5" />
              <span>AO VIVO</span>
            </div>
          </div>

          {/* Floating Featured Product Overlay in Live */}
          <div className="relative z-20 p-4 space-y-3">
            {/* Stream Title */}
            <div className="bg-black/40 backdrop-blur-xs p-2 rounded-xl inline-block max-w-md">
              <p className="text-xs font-bold text-amber-300 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-300" /> OFERTA EXCLUSIVA DA LIVE
              </p>
              <h2 className="text-sm font-black leading-snug">{currentLive.title}</h2>
            </div>

            {/* Live Product Card */}
            <div className="bg-white text-slate-900 p-3 rounded-2xl flex items-center justify-between gap-3 shadow-floating max-w-md">
              <img
                src={currentLive.products[0].images[0]}
                alt={currentLive.products[0].name}
                className="w-14 h-14 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="bg-brand text-white text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                  Item #1 em Destaque
                </span>
                <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                  {currentLive.products[0].name}
                </p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-black text-brand">
                    {formatCurrency(currentLive.products[0].price)}
                  </span>
                  <span className="text-[10px] text-slate-400 line-through">
                    {formatCurrency(currentLive.products[0].oldPrice)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => addItem(currentLive.products[0])}
                className="bg-gradient-to-r from-brand to-pulse-accent text-white font-black text-xs px-4 py-2.5 rounded-xl hover:brightness-105 transition-all shrink-0 shadow-glow"
              >
                Comprar
              </button>
            </div>
          </div>
        </div>

        {/* LIVE CHAT & AUDIENCE COLUMN */}
        <div className="md:col-span-4 bg-slate-900 p-4 md:rounded-3xl border border-slate-800 flex flex-col justify-between h-[450px] md:h-[650px]">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-pulse-cyan" />
              <h3 className="text-xs font-bold text-slate-200">Chat em Tempo Real</h3>
            </div>
            <button
              onClick={handleLikeLive}
              className="flex items-center gap-1 text-xs text-rose-400 font-bold bg-rose-500/10 px-2.5 py-1 rounded-full hover:bg-rose-500/20 active:scale-110 transition-transform"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500" />
              <span>{likesCount}</span>
            </button>
          </div>

          {/* Comments stream */}
          <div className="flex-1 overflow-y-auto space-y-2.5 py-3 text-xs pr-1">
            {comments.map((c) => (
              <div key={c.id} className="bg-black/30 backdrop-blur-xs p-2.5 rounded-xl border border-white/5 space-y-0.5">
                <span className="font-bold text-pulse-cyan text-[11px]">{c.name}</span>
                <p className="text-slate-200 text-xs leading-snug">{c.text}</p>
              </div>
            ))}
          </div>

          {/* Send comment form */}
          <form onSubmit={handleSendMessage} className="relative pt-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Envie uma pergunta ou comentário..."
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl pl-4 pr-10 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 mt-1 p-1.5 text-brand hover:text-white"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};
