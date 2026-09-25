import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Music, 
  ShoppingBag, 
  ChevronUp, 
  ChevronDown, 
  Sparkles,
  ArrowRight,
  Volume2,
  VolumeX,
  Play
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatCompactNumber, formatCurrency } from '../utils/formatters';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { Header } from '../components/layout/Header';

export const VideoFeedPage: React.FC = () => {
  const { videos, toggleVideoLike } = useStore();
  const { addItem } = useCart();
  const { addToast } = useToast();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const currentVideo = videos[currentIndex] || videos[0];

  const handleNextVideo = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0); // loop back
    }
  };

  const handlePrevVideo = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast({
      type: 'success',
      message: 'Link do vídeo copiado para a área de transferência!',
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
      {/* Desktop Header */}
      <div className="hidden md:block">
        <Header />
      </div>

      <main className="flex-1 flex items-center justify-center p-0 md:py-6">
        <div className="relative w-full max-w-sm h-[calc(100vh-60px)] md:h-[680px] bg-slate-900 md:rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between">
          {/* Background Video Simulation */}
          <div className="absolute inset-0 z-0">
            <img
              src={currentVideo.thumbnailUrl}
              alt={currentVideo.title}
              className="w-full h-full object-cover brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none" />
          </div>

          {/* Top Bar on Mobile */}
          <div className="relative z-10 flex items-center justify-between p-4">
            <Link to="/" className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-brand" />
              <span>PulseFeed</span>
            </Link>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Up / Down Navigation Controls Desktop */}
          <div className="hidden md:flex absolute right-[-55px] top-1/2 -translate-y-1/2 flex-col gap-3 z-30">
            <button
              onClick={handlePrevVideo}
              disabled={currentIndex === 0}
              className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center disabled:opacity-30 transition-all shadow-md"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextVideo}
              className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-all shadow-md"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Right Action Rail (Likes, Comments, Share, Creator Avatar) */}
          <div className="absolute right-3 bottom-28 z-20 flex flex-col items-center gap-4">
            {/* Creator Avatar with Follow Plus badge */}
            <div className="relative">
              <Link to={`/criador/${currentVideo.creator.username}`}>
                <img
                  src={currentVideo.creator.avatar}
                  alt={currentVideo.creator.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-brand"
                />
              </Link>
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-brand text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                +
              </span>
            </div>

            {/* Like */}
            <button
              onClick={() => toggleVideoLike(currentVideo.id)}
              className="flex flex-col items-center gap-1"
            >
              <div
                className={`w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center transition-transform active:scale-125 ${
                  currentVideo.isLiked ? 'text-brand' : 'text-white'
                }`}
              >
                <Heart className={`w-6 h-6 ${currentVideo.isLiked ? 'fill-brand' : ''}`} />
              </div>
              <span className="text-[11px] font-bold">
                {formatCompactNumber(currentVideo.likesCount)}
              </span>
            </button>

            {/* Comments */}
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
                <MessageCircle className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold">
                {formatCompactNumber(currentVideo.commentsCount)}
              </span>
            </div>

            {/* Share */}
            <button onClick={handleShare} className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold">
                {formatCompactNumber(currentVideo.sharesCount)}
              </span>
            </button>
          </div>

          {/* Bottom Info & Linked Product Card */}
          <div className="relative z-20 p-4 space-y-3">
            {/* Creator Info & Description */}
            <div className="space-y-1 max-w-[80%]">
              <Link
                to={`/criador/${currentVideo.creator.username}`}
                className="font-bold text-sm text-white hover:underline flex items-center gap-1"
              >
                <span>@{currentVideo.creator.username}</span>
              </Link>
              <p className="text-xs text-white/90 line-clamp-2 leading-relaxed">
                {currentVideo.description}
              </p>
              {currentVideo.songTitle && (
                <div className="flex items-center gap-1.5 text-[11px] text-white/70 pt-1">
                  <Music className="w-3 h-3 animate-spin" />
                  <span className="truncate">{currentVideo.songTitle}</span>
                </div>
              )}
            </div>

            {/* 1-CLICK PRODUCT PURCHASE POPUP CARD */}
            <div className="bg-white/95 backdrop-blur-md text-slate-900 p-2.5 rounded-2xl flex items-center justify-between gap-3 shadow-floating border border-white/40">
              <Link to={`/produto/${currentVideo.product.slug}`} className="flex items-center gap-2.5 min-w-0">
                <img
                  src={currentVideo.product.images[0]}
                  alt={currentVideo.product.name}
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <span className="bg-brand text-white text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                    Compre no Vídeo
                  </span>
                  <p className="text-xs font-bold text-slate-900 truncate mt-0.5">
                    {currentVideo.product.name}
                  </p>
                  <p className="text-xs font-black text-brand">
                    {formatCurrency(currentVideo.product.price)}
                  </p>
                </div>
              </Link>

              <button
                onClick={() => addItem(currentVideo.product)}
                className="bg-brand text-white font-extrabold text-xs px-3.5 py-2 rounded-xl hover:bg-brand-600 transition-all shrink-0 shadow-xs active:scale-95"
              >
                Comprar
              </button>
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};
