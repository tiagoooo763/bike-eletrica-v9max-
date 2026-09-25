import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Flame, 
  Sparkles, 
  TrendingUp, 
  Radio, 
  Video, 
  ChevronRight, 
  Wrench, 
  Smartphone, 
  Shirt, 
  Heart, 
  Home as HomeIcon, 
  Activity, 
  Watch,
  Zap
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { ProductCard } from '../components/product/ProductCard';
import { Countdown } from '../components/common/Countdown';

export const HomePage: React.FC = () => {
  const { products, categories, banners, videos, liveStreams } = useStore();

  const flashDeals = products.filter((p) => p.isFlashDeal);
  const bestSellers = [...products].sort((a, b) => b.salesCount - a.salesCount);
  const featuredVideo = videos[0];
  const liveNow = liveStreams[0];

  // Helper icon mapper for categories
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wrench': return <Wrench className="w-5 h-5 text-amber-500" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5 text-sky-500" />;
      case 'Shirt': return <Shirt className="w-5 h-5 text-indigo-500" />;
      case 'Heart': return <Heart className="w-5 h-5 text-rose-500" />;
      case 'Home': return <HomeIcon className="w-5 h-5 text-emerald-500" />;
      case 'Activity': return <Activity className="w-5 h-5 text-orange-500" />;
      case 'Watch': return <Watch className="w-5 h-5 text-purple-500" />;
      default: return <Sparkles className="w-5 h-5 text-brand" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-0">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8">
        {/* HERO BANNER CAROUSEL */}
        <section className="relative rounded-3xl overflow-hidden shadow-soft bg-gradient-to-r from-rose-600 via-brand to-pulse-accent text-white p-6 sm:p-10">
          <div className="max-w-xl space-y-3 z-10 relative">
            <span className="inline-block bg-white/20 backdrop-blur-md text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              {banners[0].badge}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              {banners[0].title}
            </h1>
            <p className="text-xs sm:text-sm text-white/90 font-medium">
              {banners[0].subtitle}
            </p>
            <div className="pt-2">
              <Link
                to={banners[0].linkUrl}
                className="inline-flex items-center gap-2 bg-slate-950 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-2xl hover:bg-slate-900 transition-transform active:scale-95 shadow-floating"
              >
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Aproveitar Agora</span>
              </Link>
            </div>
          </div>

          <div className="hidden md:block absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden">
            <img
              src={banners[0].imageUrl}
              alt="Promoção em Destaque"
              className="w-full h-full object-cover object-center opacity-80 mix-blend-luminosity mask-gradient"
            />
          </div>
        </section>

        {/* CATEGORIES GRID */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">Departamentos</h2>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 sm:gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/categoria/${cat.slug}`}
                className="flex flex-col items-center p-3 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-soft hover:border-brand/40 transition-all text-center group"
              >
                <div className="w-11 h-11 rounded-2xl bg-slate-50 group-hover:bg-rose-50 flex items-center justify-center transition-colors">
                  {getCategoryIcon(cat.icon)}
                </div>
                <span className="text-[11px] font-semibold text-slate-700 mt-2 group-hover:text-brand line-clamp-1">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* FLASH DEALS SECTION WITH LIVE COUNTDOWN */}
        <section className="bg-gradient-to-br from-rose-50 via-white to-amber-50 p-4 sm:p-6 rounded-3xl border border-rose-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-rose-100">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-brand text-white rounded-xl shadow-xs">
                <Flame className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 leading-none">
                  Ofertas Relâmpago
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Preços mais baixos do dia com estoque limitado</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Termina em:</span>
              <Countdown targetTimestamp={Date.now() + 5 * 3600 * 1000} />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {flashDeals.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>

        {/* SOCIAL COMMERCE HIGHLIGHT: VIDEOS & LIVES */}
        <section className="grid md:grid-cols-2 gap-4">
          {/* Live Shopping Card */}
          {liveNow && (
            <div className="bg-slate-950 text-white rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <span className="bg-pulse-pink text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                    <Radio className="w-3 h-3" /> AO VIVO
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    {liveNow.viewerCount.toLocaleString('pt-BR')} assistindo
                  </span>
                </div>

                <Link
                  to={`/live`}
                  className="text-xs font-bold text-pulse-cyan hover:underline flex items-center gap-1"
                >
                  Entrar na Live <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="my-6 z-10">
                <h3 className="text-base sm:text-lg font-black leading-tight">
                  {liveNow.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">Apresentado por {liveNow.creator.name}</p>
              </div>

              <div className="flex items-center justify-between bg-white/10 backdrop-blur-md p-2.5 rounded-2xl z-10">
                <div className="flex items-center gap-2.5">
                  <img
                    src={liveNow.products[0].images[0]}
                    alt={liveNow.products[0].name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold text-white line-clamp-1">{liveNow.products[0].name}</p>
                    <p className="text-xs text-amber-300 font-black">
                      R$ {liveNow.products[0].price.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/produto/${liveNow.products[0].slug}`}
                  className="bg-brand text-white text-xs font-bold px-3.5 py-1.5 rounded-xl hover:bg-brand-600 transition-colors shrink-0"
                >
                  Comprar
                </Link>
              </div>
            </div>
          )}

          {/* Viral Social Videos Banner */}
          {featuredVideo && (
            <div className="bg-gradient-to-br from-purple-900 to-slate-900 text-white rounded-3xl p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                    <Video className="w-4 h-4 text-pulse-cyan" />
                  </div>
                  <span className="text-xs font-bold text-slate-200">Vídeos Virais com Produtos</span>
                </div>

                <Link to="/videos" className="text-xs font-bold text-pulse-cyan hover:underline flex items-center gap-1">
                  Ver Feed <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="my-6">
                <h3 className="text-base sm:text-lg font-black leading-tight line-clamp-2">
                  "{featuredVideo.title}"
                </h3>
                <p className="text-xs text-purple-200 mt-1">Por @{featuredVideo.creator.username}</p>
              </div>

              <div className="flex items-center justify-between bg-white/10 backdrop-blur-md p-2.5 rounded-2xl">
                <div className="flex items-center gap-2.5">
                  <img
                    src={featuredVideo.product.images[0]}
                    alt={featuredVideo.product.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold text-white line-clamp-1">{featuredVideo.product.name}</p>
                    <p className="text-xs text-amber-300 font-black">
                      R$ {featuredVideo.product.price.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>

                <Link
                  to="/videos"
                  className="bg-pulse-cyan text-slate-950 text-xs font-black px-3.5 py-1.5 rounded-xl hover:brightness-110 transition-all shrink-0"
                >
                  Assistir & Comprar
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* BEST SELLERS GRID */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand" />
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                Mais Vendidos da Semana
              </h2>
            </div>
            <Link to="/categoria/ferramentas" className="text-xs font-bold text-brand hover:underline flex items-center gap-0.5">
              Ver todos <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {bestSellers.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <BottomNavigation />
    </div>
  );
};
