import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Heart, Users, Video, ShoppingBag, Sparkles } from 'lucide-react';
import { mockCreators } from '../data/mockData';
import { useStore } from '../context/StoreContext';
import { formatCompactNumber } from '../utils/formatters';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { ProductCard } from '../components/product/ProductCard';

export const CreatorPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { videos, products } = useStore();
  const [isFollowing, setIsFollowing] = useState(false);

  const creator = mockCreators.find((c) => c.username === username) || mockCreators[0];
  const creatorVideos = videos.filter((v) => v.creatorId === creator.id || v.creator.username === creator.username);
  const recommendedProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-0">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Creator Profile Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-pulse-pink shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">{creator.name}</h1>
                {creator.isVerified && (
                  <ShieldCheck className="w-5 h-5 text-sky-500 fill-sky-500 text-white" />
                )}
              </div>
              <p className="text-xs text-brand font-bold">@{creator.username}</p>
              <p className="text-xs text-slate-600 max-w-sm">{creator.bio}</p>
            </div>
          </div>

          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className={`px-6 py-3 rounded-2xl text-xs font-black transition-all shadow-xs shrink-0 ${
              isFollowing
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                : 'bg-brand text-white hover:bg-brand-600 shadow-glow'
            }`}
          >
            {isFollowing ? 'Seguindo' : '+ Seguir Criador'}
          </button>
        </div>

        {/* Creator Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
            <span className="text-base sm:text-xl font-black text-slate-900">
              {formatCompactNumber(creator.followersCount)}
            </span>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">Seguidores</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
            <span className="text-base sm:text-xl font-black text-slate-900">
              {formatCompactNumber(creator.likesCount)}
            </span>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">Curtidas Totais</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
            <span className="text-base sm:text-xl font-black text-slate-900">
              {creatorVideos.length}
            </span>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">Vídeos Postados</p>
          </div>
        </div>

        {/* Video Posts by Creator */}
        <div className="space-y-3">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Video className="w-5 h-5 text-brand" />
            <span>Vídeos de Achadinhos</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {creatorVideos.map((v) => (
              <Link
                key={v.id}
                to="/videos"
                className="bg-slate-900 rounded-3xl overflow-hidden shadow-soft relative group aspect-[9/16]"
              >
                <img
                  src={v.thumbnailUrl}
                  alt={v.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 flex flex-col justify-end">
                  <p className="text-xs font-bold text-white line-clamp-2">{v.title}</p>
                  <p className="text-[10px] text-amber-300 font-black mt-1">
                    {formatCompactNumber(v.likesCount)} curtidas
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recommended Products Vitrine */}
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand" />
            <span>Produtos Recomendados por {creator.name}</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {recommendedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <BottomNavigation />
    </div>
  );
};
