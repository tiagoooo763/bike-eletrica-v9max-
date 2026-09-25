import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Star, 
  MessageCircle, 
  Flame, 
  Video, 
  Package, 
  Clock, 
  Users 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { formatCompactNumber } from '../utils/formatters';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { ProductCard } from '../components/product/ProductCard';

export const StorePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { stores, products, videos, getStoreBySlug, getStoreById } = useStore();
  const { addToast } = useToast();

  const store = getStoreBySlug(slug || '') || getStoreById(slug || '') || stores[0];
  const [activeTab, setActiveTab] = useState<'products' | 'deals' | 'videos' | 'reviews'>('products');
  const [isFollowing, setIsFollowing] = useState(false);

  const storeProducts = products.filter((p) => p.storeId === store.id || p.storeName === store.name);
  const storeFlashDeals = storeProducts.filter((p) => p.isFlashDeal);
  const storeVideos = videos.filter((v) => v.product.storeId === store.id);

  const handleToggleFollow = () => {
    setIsFollowing(!isFollowing);
    addToast({
      type: isFollowing ? 'info' : 'success',
      message: isFollowing ? `Você deixou de seguir ${store.name}.` : `Você agora está seguindo ${store.name}!`,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-0">
      <Header />

      {/* STORE BANNER & HEADER */}
      <div className="relative bg-slate-900 text-white">
        <div className="h-44 sm:h-56 w-full overflow-hidden">
          <img
            src={store.banner}
            alt={store.name}
            className="w-full h-full object-cover brightness-60"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 -mt-12 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <img
                src={store.logo}
                alt={store.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-white shadow-medium bg-white"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                  <h1 className="text-xl sm:text-2xl font-black text-white">{store.name}</h1>
                  {store.isVerified && (
                    <ShieldCheck className="w-5 h-5 text-sky-400 fill-sky-400 text-slate-900" />
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-300 justify-center sm:justify-start">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {store.rating.toFixed(1)}
                  </span>
                  <span>•</span>
                  <span>{formatCompactNumber(store.followersCount)} seguidores</span>
                  <span>•</span>
                  <span>{formatCompactNumber(store.salesCount)} vendas</span>
                </div>

                <p className="text-xs text-slate-300 flex items-center gap-1 justify-center sm:justify-start pt-1">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span>{store.responseTime}</span>
                </p>
              </div>
            </div>

            {/* Store Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleFollow}
                className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all shadow-xs ${
                  isFollowing
                    ? 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-md'
                    : 'bg-brand text-white hover:bg-brand-600 shadow-glow'
                }`}
              >
                {isFollowing ? 'Seguindo' : '+ Seguir Loja'}
              </button>

              <Link
                to={`/chat?storeId=${store.id}`}
                className="px-4 py-2.5 bg-white text-slate-900 rounded-2xl text-xs font-bold hover:bg-slate-100 flex items-center gap-1.5 shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-brand" />
                <span>Conversar</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'products', label: 'Produtos', icon: Package, count: storeProducts.length },
            { id: 'deals', label: 'Ofertas Relâmpago', icon: Flame, count: storeFlashDeals.length },
            { id: 'videos', label: 'Vídeos', icon: Video, count: storeVideos.length },
            { id: 'reviews', label: 'Avaliações', icon: Star, count: store.reviewCount },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 py-4 border-b-2 font-bold text-xs sm:text-sm shrink-0 transition-colors ${
                  activeTab === tab.id
                    ? 'border-brand text-brand'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className="text-xs text-slate-400 font-normal">({tab.count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'products' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {storeProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {activeTab === 'deals' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {storeFlashDeals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {storeVideos.map((v) => (
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
                  <p className="text-[11px] text-amber-300 font-black mt-1">
                    {formatCompactNumber(v.likesCount)} curtidas
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs max-w-2xl mx-auto space-y-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl font-black text-slate-900">{store.rating.toFixed(1)}</div>
              <div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-500">{store.reviewCount} clientes avaliaram esta loja</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              98% dos compradores recomendam esta loja devido ao tempo de envio rápido e produtos originais com nota fiscal.
            </p>
          </div>
        )}
      </main>

      <Footer />
      <BottomNavigation />
    </div>
  );
};
