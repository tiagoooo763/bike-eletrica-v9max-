import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Share2, 
  ShoppingCart, 
  MoreHorizontal, 
  Bookmark, 
  Star, 
  Check, 
  Zap, 
  Store, 
  MessageCircle, 
  Play, 
  Info, 
  X, 
  ShieldCheck, 
  RotateCcw, 
  CreditCard, 
  Clock, 
  ArrowUp,
  Search,
  Truck,
  Flame,
  ThumbsUp,
  Tag,
  Volume2,
  Heart,
  BatteryCharging,
  Gauge,
  Disc,
  Layers,
  Settings,
  CircleDot,
  Radio,
  SunMedium,
  Weight
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const FerramentaPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  // Scroll tab state
  const [activeTab, setActiveTab] = useState<'visao' | 'avaliacoes' | 'descricao' | 'recomendacoes'>('visao');
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isNameExpanded, setIsNameExpanded] = useState(false);
  
  // Gallery
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  
  // Modals & Sheets
  const [isVariantSheetOpen, setIsVariantSheetOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<'preto' | 'cinza'>('preto');
  const [isProtectionModalOpen, setIsProtectionModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Active Video Modal in creator carousel
  const [activeVideoCreator, setActiveVideoCreator] = useState<{
    name: string;
    poster: string;
    badge?: string;
  } | null>(null);

  // Free shipping countdown timer (00:08:10)
  const [shippingTime, setShippingTime] = useState({
    minutes: 8,
    seconds: 10
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setShippingTime(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          return { minutes: 8, seconds: 10 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatShippingTimer = () => {
    const m = String(shippingTime.minutes).padStart(2, '0');
    const s = String(shippingTime.seconds).padStart(2, '0');
    return `00:${m}:${s}`;
  };

  // Section refs for scroll syncing
  const containerRef = useRef<HTMLDivElement>(null);
  const visaoRef = useRef<HTMLDivElement>(null);
  const avaliacoesRef = useRef<HTMLDivElement>(null);
  const descricaoRef = useRef<HTMLDivElement>(null);
  const recomendacoesRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    
    setShowStickyHeader(scrollTop > 220);
    setShowBackToTop(scrollTop > 500);

    const avaliacoesTop = avaliacoesRef.current?.offsetTop || 9999;
    const descricaoTop = descricaoRef.current?.offsetTop || 9999;
    const recomendacoesTop = recomendacoesRef.current?.offsetTop || 9999;

    if (scrollTop + 120 >= recomendacoesTop) {
      setActiveTab('recomendacoes');
    } else if (scrollTop + 120 >= descricaoTop) {
      setActiveTab('descricao');
    } else if (scrollTop + 120 >= avaliacoesTop) {
      setActiveTab('avaliacoes');
    } else {
      setActiveTab('visao');
    }
  };

  const scrollToSection = (section: 'visao' | 'avaliacoes' | 'descricao' | 'recomendacoes') => {
    setActiveTab(section);
    let targetRef = visaoRef;
    if (section === 'avaliacoes') targetRef = avaliacoesRef;
    if (section === 'descricao') targetRef = descricaoRef;
    if (section === 'recomendacoes') targetRef = recomendacoesRef;

    if (targetRef.current && containerRef.current) {
      containerRef.current.scrollTo({
        top: targetRef.current.offsetTop - 95,
        behavior: 'smooth'
      });
    }
  };

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Product Images for Carousel (8 High Definition Images in order from left to right)
  const productImages = [
    '/images/v9max/bike_1.webp',
    '/images/v9max/bike_2.webp',
    '/images/v9max/bike_3.webp',
    '/images/v9max/bike_4.webp',
    '/images/v9max/bike_5.webp',
    '/images/v9max/bike_6.webp',
    '/images/v9max/bike_7.webp',
    '/images/v9max/bike_8.webp',
  ];

  // Creator Videos
  const creatorVideos = [
    {
      name: 'Lucas E-Bikes',
      badge: 'REVIEW',
      poster: '/images/v9max/bike_2.webp',
    },
    {
      name: 'Rodrigo Ciclismo',
      badge: 'TOP 1',
      poster: '/images/v9max/bike_5.webp',
    },
    {
      name: 'Canal Mobilidade',
      poster: '/images/v9max/bike_8.webp',
    }
  ];

  // Key Specifications
  const keySpecs = [
    { label: 'Motor elétrico de 1000W de alta potência', icon: Zap },
    { label: 'Bateria de lítio 48V 15,6Ah', icon: BatteryCharging },
    { label: 'Bateria removível com chave de segurança', icon: BatteryCharging },
    { label: 'Autonomia anunciada de até 50 km', icon: Gauge },
    { label: 'Velocidade máxima informada de até 48 km/h', icon: Gauge },
    { label: 'Freios a disco hidráulicos dianteiro e traseiro', icon: Disc },
    { label: 'Suspensão dianteira e traseira de alto impacto', icon: Layers },
    { label: 'Câmbio Shimano de 7 marchas original', icon: Settings },
    { label: 'Rodas aro 20 Fat Tire todo terreno', icon: CircleDot },
    { label: 'Pneus largos para máxima estabilidade', icon: CircleDot },
    { label: 'Sistema NFC com desbloqueio inteligente', icon: Radio },
    { label: 'Farol dianteiro LED de alta visibilidade', icon: SunMedium },
    { label: 'Acelerador independente e modo assistido', icon: Gauge },
    { label: 'Capacidade declarada de até 150 kg', icon: Weight },
  ];

  const handleOpenLightbox = (images: string[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
  };

  return (
    <div className="min-h-screen w-full bg-[#e5e5e7] flex justify-center selection:bg-[#fe2c55]/20">
      {/* Mobile App Container (440px max width) */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="relative h-screen w-full max-w-[440px] bg-[#f5f5f5] overflow-y-auto overflow-x-hidden shadow-[0_0_40px_rgba(0,0,0,0.08)]"
      >
        {/* TikTok Top App Bar (Native App Style Header) */}
        <div className="sticky top-0 z-30 flex items-center justify-between bg-white px-3 py-2 border-b border-[#f0f0f0]">
          <button 
            onClick={() => navigate(-1)} 
            className="p-1 text-[#161823] active:opacity-70"
            aria-label="Voltar"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Search Input Bar */}
          <div className="flex-1 mx-2 flex items-center bg-[#f1f1f2] rounded-full px-3 py-1.5 text-[13px] text-[#5a5b60]">
            <Search className="w-4 h-4 text-[#8a8b91] mr-2 shrink-0" />
            <span className="truncate text-[#161823]">bicicleta eletrica v9 max 1000w</span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: 'Bicicleta Elétrica V9 Max 1000W | Monster E Bikes', url: window.location.href });
                } else {
                  addToast({ type: 'info', message: 'Link copiado para a área de transferência!' });
                }
              }}
              className="p-1 text-[#161823] active:opacity-70" 
              aria-label="Compartilhar"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <div className="relative">
              <button 
                onClick={() => navigate('/carrinho')}
                className="p-1 text-[#161823] active:opacity-70"
                aria-label="Carrinho de compras"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
              <span className="absolute -top-1 -right-1 bg-[#fe2c55] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                7
              </span>
            </div>
            <button className="p-1 text-[#161823] active:opacity-70" aria-label="Mais opções">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sticky Tabs Navigation */}
        <div className="sticky top-[49px] z-20 bg-white border-b border-[#f0f0f0] shadow-xs">
          <div className="flex h-11 items-center px-2 text-center">
            <button 
              onClick={() => scrollToSection('visao')} 
              className="relative flex-1 py-3 text-[13.5px] font-medium"
            >
              <span className={activeTab === 'visao' ? 'text-[#161823] font-bold' : 'text-[#8a8b91]'}>Visão geral</span>
              {activeTab === 'visao' && (
                <span className="absolute inset-x-0 -bottom-px mx-auto h-[2.5px] w-8 rounded-full bg-[#fe2c55]" />
              )}
            </button>
            <button 
              onClick={() => scrollToSection('avaliacoes')} 
              className="relative flex-1 py-3 text-[13.5px] font-medium"
            >
              <span className={activeTab === 'avaliacoes' ? 'text-[#161823] font-bold' : 'text-[#8a8b91]'}>Avaliações</span>
              {activeTab === 'avaliacoes' && (
                <span className="absolute inset-x-0 -bottom-px mx-auto h-[2.5px] w-8 rounded-full bg-[#fe2c55]" />
              )}
            </button>
            <button 
              onClick={() => scrollToSection('descricao')} 
              className="relative flex-1 py-3 text-[13.5px] font-medium"
            >
              <span className={activeTab === 'descricao' ? 'text-[#161823] font-bold' : 'text-[#8a8b91]'}>Descrição</span>
              {activeTab === 'descricao' && (
                <span className="absolute inset-x-0 -bottom-px mx-auto h-[2.5px] w-8 rounded-full bg-[#fe2c55]" />
              )}
            </button>
            <button 
              onClick={() => scrollToSection('recomendacoes')} 
              className="relative flex-1 py-3 text-[13.5px] font-medium"
            >
              <span className={activeTab === 'recomendacoes' ? 'text-[#161823] font-bold' : 'text-[#8a8b91]'}>Recomendações</span>
              {activeTab === 'recomendacoes' && (
                <span className="absolute inset-x-0 -bottom-px mx-auto h-[2.5px] w-8 rounded-full bg-[#fe2c55]" />
              )}
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 1: Visão Geral (Hero & Anúncio) */}
        {/* ========================================================================= */}
        <div ref={visaoRef}>
          {/* Main Hero Image Carousel */}
          <div className="relative bg-white">
            <div 
              className="flex aspect-square w-full snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              onScroll={(e) => {
                const scrollLeft = e.currentTarget.scrollLeft;
                const width = e.currentTarget.clientWidth;
                const index = Math.round(scrollLeft / width);
                setCurrentImageIndex(index);
              }}
            >
              {productImages.map((src, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleOpenLightbox(productImages, idx)}
                  className="relative h-full w-full shrink-0 snap-start bg-neutral-100 cursor-zoom-in"
                >
                  <img 
                    src={src} 
                    alt={`Foto ${idx + 1}`} 
                    className="block h-full w-full object-cover object-center"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
                </div>
              ))}
            </div>

            {/* Photo Counter Badge */}
            <div className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-black/55 px-2 py-[3px] text-[11px] font-medium leading-none text-white">
              {currentImageIndex + 1}/{productImages.length}
            </div>
          </div>

          {/* Price & Discount Banner */}
          <div className="bg-white px-4 pt-3 pb-1">
            <div className="flex items-center gap-2">
              <span className="rounded bg-[#fe2c55] px-1.5 py-0.5 text-[11px] font-black leading-none text-white">
                -90%
              </span>
              <div className="flex items-baseline gap-1 text-[#fe2c55]">
                <span className="text-[13px] font-bold">R$</span>
                <span className="text-[26px] font-black leading-none">
                  89<span className="text-[16px] font-bold">,75</span>
                </span>
                <Tag className="w-3.5 h-3.5 ml-0.5 fill-[#fe2c55]" />
              </div>
              <span className="text-[13px] font-normal text-[#8a8b91] line-through ml-1">
                R$ 899,90
              </span>
            </div>

            {/* Installment Row */}
            <div 
              onClick={() => addToast({ type: 'info', message: 'Parcelamento em até 10x sem juros disponível no checkout.' })}
              className="mt-2 flex items-center justify-between text-[12px] text-[#161823] cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#161823]" />
                <span className="font-semibold">10x R$ 8,97,</span>
                <span className="font-semibold text-[#fe2c55]">com desconto de 18% de juros</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-[#c8c8cc]" />
            </div>

            {/* Coupon badges row */}
            <div className="mt-2.5 flex items-center gap-2 overflow-x-auto pb-1 text-[11px] font-bold text-[#fe2c55]">
              <button 
                onClick={() => setIsCouponModalOpen(true)}
                className="flex items-center gap-1 bg-[#fff0f3] border border-[#ffccd5] rounded px-2 py-0.5 shrink-0 active:scale-95 transition"
              >
                <span>🎟</span>
                <span>Desconto de 50%</span>
              </button>
              <button 
                onClick={() => setIsCouponModalOpen(true)}
                className="flex items-center gap-1 bg-[#fff0f3] border border-[#ffccd5] rounded px-2 py-0.5 shrink-0 active:scale-95 transition"
              >
                <span>🎟</span>
                <span>Desconto de 15%, máximo de R$</span>
                <ChevronRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>
          </div>

          {/* Product Title & Bookmark */}
          <div className="bg-white px-4 pt-2 pb-3">
            <div className="flex items-start justify-between gap-3">
              <h1 
                onClick={() => setIsNameExpanded(!isNameExpanded)}
                className="cursor-pointer text-[14.5px] font-bold leading-[1.3] tracking-tight text-[#161823]"
              >
                {isNameExpanded ? (
                  'Bicicleta Bike Elétrica V9 Max 1000W 48km Freio Hidráulico com bateria removível e suspensão dupla'
                ) : (
                  'Bicicleta Bike Eletrica V9 Max 1000w 48km Freio Hidraulico...'
                )}
              </h1>
              <button 
                onClick={() => {
                  const next = !isSaved;
                  setIsSaved(next);
                  addToast({ 
                    type: next ? 'success' : 'info', 
                    message: next ? 'Adicionado aos favoritos!' : 'Removido dos favoritos' 
                  });
                }}
                className="mt-0.5 shrink-0 p-1"
                aria-label="Salvar"
              >
                <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-[#161823] text-[#161823]' : 'text-[#161823]'}`} strokeWidth={1.8} />
              </button>
            </div>

            {/* Rating & Sales Counter */}
            <div className="mt-1.5 flex items-center gap-1.5 text-[12px] text-[#5a5b60]">
              <div className="flex items-center gap-0.5 font-bold text-[#161823]">
                <Star className="h-3.5 w-3.5 fill-[#f2b900] text-[#f2b900]" />
                <span>4.9</span>
              </div>
              <span className="text-[#2f7fff]">(3,4 mil)</span>
              <span className="text-[#d0d0d3]">|</span>
              <span className="font-semibold text-[#161823]">8.2K vendidos</span>
              <span className="text-[#d0d0d3]">|</span>
              <span className="text-[#fe2c55] font-bold">Restam apenas 5</span>
            </div>
          </div>

          {/* Shipping & Delivery card */}
          <div className="mt-2 bg-white px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[13px]">
                <Truck className="h-4 w-4 text-[#00b8a9]" />
                <span className="font-bold text-[#00b8a9]">Frete grátis</span>
                <span className="text-[#8a8b91] line-through text-[12px]">R$ 38,90</span>
              </div>
            </div>

            {/* Shipping countdown warning */}
            <div className="mt-2 flex items-center justify-between bg-[#f0faf8] border border-[#c6ece5] rounded-lg px-3 py-1.5 text-[12px]">
              <div className="flex items-center gap-1.5 text-[#008f82] font-semibold">
                <Truck className="h-3.5 w-3.5" />
                <span>O frete grátis expira em breve</span>
              </div>
              <span className="font-mono font-bold text-[#008f82] tabular-nums">
                {formatShippingTimer()}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 2: Avaliações (Vídeos & Comentários) */}
        {/* ========================================================================= */}
        <div ref={avaliacoesRef}>
          {/* Creator Videos Section */}
          <div className="mt-2 bg-white px-4 py-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-[14.5px] font-bold text-[#161823]">Vídeos de criadores (30+)</h3>
              <ChevronRight className="w-4 h-4 text-[#8a8b91]" />
            </div>

            <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {creatorVideos.map((video, idx) => (
                <div 
                  key={idx}
                  onClick={() => setActiveVideoCreator(video)}
                  className="relative h-[160px] w-[110px] shrink-0 rounded-xl overflow-hidden cursor-pointer group bg-black shadow-xs active:scale-95 transition"
                >
                  <img src={video.poster} alt={video.name} className="h-full w-full object-cover group-hover:scale-105 transition duration-300" />
                  
                  {/* Play icon top right */}
                  <div className="absolute top-2 right-2 bg-black/40 rounded-full p-1 text-white backdrop-blur-xs">
                    <Play className="w-3 h-3 fill-white" />
                  </div>

                  {/* Red Alert Pill if present */}
                  {video.badge && (
                    <div className="absolute bottom-7 left-2 bg-[#fe2c55] text-white text-[8px] font-black px-1.5 py-0.5 rounded">
                      {video.badge}
                    </div>
                  )}

                  {/* Creator name */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1 text-white text-[10px] font-bold truncate">
                    <div className="w-3.5 h-3.5 rounded-full bg-neutral-300 shrink-0" />
                    <span className="truncate">{video.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Reviews Overview & Items */}
          <div className="mt-2 bg-white px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-[#f2b900] text-[#f2b900]" />
                <span className="text-[14.5px] font-bold text-[#161823]">4,9 Avaliações dos clientes (3,4 mil)</span>
              </div>
              <button 
                onClick={() => addToast({ type: 'info', message: 'Visualizando todas as 3.412 avaliações 5 estrelas' })}
                className="flex items-center gap-0.5 text-[12px] text-[#8a8b91] hover:text-[#161823]"
              >
                <Info className="w-3 h-3" />
                <span>Ver mais</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Reviews list */}
            <div className="mt-4 space-y-4">
              {/* Review 1 */}
              <div className="border-b border-neutral-100 pb-3.5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-1 text-[#f2b900]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-[#f2b900]" />
                      ))}
                      <span className="text-[#8a8b91] text-[11px] ml-1">· Preto Fosco</span>
                    </div>
                    <p className="mt-1.5 text-[13px] text-[#161823] leading-snug">
                      Simplesmente incrível! A potência do motor de 1000W é surreal nas subidas e a bateria dura muito. Melhor aquisição!
                    </p>
                  </div>
                  <div 
                    onClick={() => handleOpenLightbox(['/images/v9max/bike_3.webp', '/images/v9max/bike_4.webp'], 0)}
                    className="relative h-14 w-14 rounded-lg overflow-hidden shrink-0 ml-3 bg-neutral-100 border cursor-pointer active:scale-95 transition"
                  >
                    <img src="/images/v9max/bike_3.webp" alt="" className="h-full w-full object-cover" />
                    <span className="absolute bottom-0.5 right-0.5 bg-black/60 text-white text-[8px] font-bold px-1 rounded">
                      +4
                    </span>
                  </div>
                </div>
              </div>

              {/* Review 2 */}
              <div className="border-b border-neutral-100 pb-3.5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-1 text-[#f2b900]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-[#f2b900]" />
                      ))}
                      <span className="text-[#8a8b91] text-[11px] ml-1">· Preto Fosco</span>
                    </div>
                    <div className="mt-1.5 text-[12.5px] text-[#5a5b60] space-y-0.5 leading-snug">
                      <div><b>Aparência:</b> Acabamento premium impecável e robusto</div>
                      <div><b>Desempenho:</b> Freios hidráulicos com resposta imediata e câmbio suave...</div>
                    </div>
                  </div>
                  <div 
                    onClick={() => handleOpenLightbox(['/images/v9max/bike_4.webp', '/images/v9max/bike_2.webp'], 0)}
                    className="relative h-14 w-14 rounded-lg overflow-hidden shrink-0 ml-3 bg-neutral-100 border cursor-pointer active:scale-95 transition"
                  >
                    <img src="/images/v9max/bike_4.webp" alt="" className="h-full w-full object-cover" />
                    <span className="absolute bottom-0.5 right-0.5 bg-black/60 text-white text-[8px] font-bold px-1 rounded">
                      +4
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Avaliações da loja pill */}
            <div className="mt-4 pt-1 flex items-center justify-between border-t border-neutral-100">
              <span className="text-[13.5px] font-bold text-[#161823]">Avaliações da loja (9,8 mil)</span>
              <ChevronRight className="w-4 h-4 text-[#8a8b91]" />
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <div className="bg-[#fff8eb] border border-[#fde8c2] text-[#b27600] text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                <span>📷</span>
                <span>Inclui fotos e vídeos (1.842)</span>
              </div>
              <div className="bg-[#fff8eb] border border-[#fde8c2] text-[#b27600] text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                <span>★ 5</span>
                <span>(8,9 mil)</span>
              </div>
            </div>
          </div>

          {/* Store Card (Monster E Bikes) */}
          <div className="mt-2 bg-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-neutral-900 overflow-hidden flex items-center justify-center p-1 border">
                <img src="/images/v9max/monster_logo.webp" alt="Monster E Bikes" className="h-full w-full object-contain" />
              </div>
              <div>
                <div className="text-[14px] font-bold text-[#161823]">Monster E Bikes</div>
                <div className="text-[11.5px] text-[#8a8b91]">Loja Oficial Verificada · 100% de Confiança</div>
              </div>
            </div>
            <button 
              onClick={() => addToast({ type: 'info', message: 'Abrindo catálogo da Monster E Bikes' })}
              className="rounded-full border border-[#d0d0d3] px-3 py-1 text-[12px] font-bold text-[#161823] hover:bg-neutral-50"
            >
              Visitar loja
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 3: Descrição & Especificações */}
        {/* ========================================================================= */}
        <div ref={descricaoRef} className="mt-2 bg-white px-4 py-4">
          <h2 className="text-[16px] font-extrabold text-[#161823]">Sobre este produto</h2>
          
          {/* Key Specifications Grid */}
          <div className="mt-4 border-b border-neutral-100 pb-4">
            <h3 className="text-[13.5px] font-bold text-[#161823] mb-2.5">Especificações Técnicas</h3>
            <div className="grid grid-cols-1 gap-2">
              {keySpecs.map((spec, i) => {
                const IconComponent = spec.icon;
                return (
                  <div key={i} className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg bg-[#f8f9fa] border border-neutral-100">
                    <IconComponent className="w-4 h-4 text-[#fe2c55] shrink-0" />
                    <span className="text-[12.5px] font-medium text-[#161823]">{spec.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Descrição Detalhada */}
          <div className="mt-4 space-y-3.5 text-[13px] text-[#333333] leading-relaxed">
            <h3 className="text-[14px] font-bold text-[#161823]">Descrição Completa:</h3>
            
            <div className="p-3 bg-[#fdf2f4] rounded-xl border border-[#ffdce2]">
              <h4 className="font-extrabold text-[#fe2c55] text-[13.5px]">
                Bicicleta Elétrica V9 Max 1000W — potência, conforto e tecnologia para seus trajetos
              </h4>
              <p className="mt-1 text-[#5a5b60]">
                A V9 Max 1000W combina desempenho, autonomia e um visual robusto para quem busca mais praticidade e liberdade na mobilidade do dia a dia.
              </p>
            </div>

            <div className="space-y-3 text-[#444444]">
              <p>
                Equipada com <b>motor elétrico de 1000W</b>, a V9 Max entrega força para deslocamentos urbanos, subidas e diferentes tipos de percurso. Sua <b>bateria de lítio 48V 15,6Ah removível</b> proporciona autonomia para trajetos mais longos e pode ser recarregada com praticidade em qualquer tomada.
              </p>

              <p>
                O conjunto conta com <b>freios a disco hidráulicos</b>, oferecendo frenagens mais precisas e maior controle, além de <b>suspensão dianteira e traseira</b>, que ajuda a absorver impactos e proporcionar uma condução mais confortável em qualquer terreno.
              </p>

              <p>
                Para quem também gosta de pedalar, o <b>câmbio Shimano de 7 velocidades</b> permite adaptar a marcha ao percurso. Os <b>pneus largos aro 20 Fat Tire</b> contribuem para estabilidade superior e segurança em diferentes superfícies (asfalto, terra, areia e chuva).
              </p>
            </div>

            <div className="mt-4 rounded-xl bg-[#fff8eb] p-3.5 border border-[#fde8c2]">
              <h4 className="font-bold text-[#b27600] text-[12.5px] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#b27600]" />
                <span>Garantia e Segurança Monster E Bikes</span>
              </h4>
              <p className="mt-1 text-[12px] text-[#8a5a1e] leading-snug">
                Produto original com garantia de 1 ano contra defeitos de fabricação, nota fiscal e suporte técnico especializado em todo o Brasil.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 4: Recomendações (Acessórios para E-Bike) */}
        {/* ========================================================================= */}
        <div ref={recomendacoesRef} className="mt-2 bg-white px-4 py-4 pb-28">
          <h2 className="text-[16px] font-extrabold text-[#161823] mb-3">Recomendações para você</h2>
          
          <div className="grid grid-cols-2 gap-2.5">
            {/* Card 1: Capacete com LED */}
            <div 
              onClick={() => addToast({ type: 'info', message: 'Item adicionado à lista de desejos!' })}
              className="bg-[#fcfcfc] rounded-xl overflow-hidden border border-neutral-100 shadow-xs cursor-pointer active:scale-95 transition"
            >
              <img src="/images/v9max/bike_2.webp" alt="Capacete" className="w-full aspect-square object-cover" />
              <div className="p-2.5">
                <h4 className="text-[12px] font-bold text-[#161823] line-clamp-2">Capacete Ciclismo Urbano com LED Traseiro</h4>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-[13px] font-extrabold text-[#fe2c55]">R$ 89,90</span>
                  <span className="text-[10px] text-[#8a8b91] line-through">R$ 179,00</span>
                </div>
                <div className="mt-1 inline-flex items-center gap-0.5 bg-[#fff0f3] text-[#fe2c55] text-[9px] font-bold px-1 py-0.5 rounded">
                  <Zap className="w-2.5 h-2.5 fill-[#fe2c55]" />
                  <span>Oferta Relâmpago</span>
                </div>
                <div className="mt-1 text-[10.5px] text-[#8a8b91]">★ 4.8 · 542 vendidos</div>
              </div>
            </div>

            {/* Card 2: Trava Antifurto */}
            <div 
              onClick={() => addToast({ type: 'info', message: 'Item adicionado à lista de desejos!' })}
              className="bg-[#fcfcfc] rounded-xl overflow-hidden border border-neutral-100 shadow-xs cursor-pointer active:scale-95 transition"
            >
              <img src="/images/v9max/bike_5.webp" alt="Trava Antifurto" className="w-full aspect-square object-cover" />
              <div className="p-2.5">
                <h4 className="text-[12px] font-bold text-[#161823] line-clamp-2">Trava Antifurto de Aço com Alarme 110dB</h4>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-[13px] font-extrabold text-[#fe2c55]">R$ 69,90</span>
                  <span className="text-[10px] text-[#8a8b91] line-through">R$ 139,00</span>
                </div>
                <div className="mt-1 text-[10px] font-bold text-[#fe2c55]">50% OFF</div>
                <div className="mt-1 text-[10.5px] text-[#8a8b91]">★ 4.9 · 1.2K vendidos</div>
              </div>
            </div>

            {/* Card 3: Bolsa para Quadro */}
            <div 
              onClick={() => addToast({ type: 'info', message: 'Item adicionado à lista de desejos!' })}
              className="bg-[#fcfcfc] rounded-xl overflow-hidden border border-neutral-100 shadow-xs cursor-pointer active:scale-95 transition"
            >
              <img src="/images/v9max/bike_7.webp" alt="Bolsa de Quadro" className="w-full aspect-square object-cover" />
              <div className="p-2.5">
                <h4 className="text-[12px] font-bold text-[#161823] line-clamp-2">Bolsa Impermeável para Quadro com Suporte</h4>
                <div className="mt-1 text-[13px] font-extrabold text-[#fe2c55]">R$ 49,90</div>
                <div className="mt-1 text-[10.5px] text-[#8a8b91]">★ 4.7 · 890 vendidos</div>
              </div>
            </div>

            {/* Card 4: Bomba Portátil */}
            <div 
              onClick={() => addToast({ type: 'info', message: 'Item adicionado à lista de desejos!' })}
              className="bg-[#fcfcfc] rounded-xl overflow-hidden border border-neutral-100 shadow-xs cursor-pointer active:scale-95 transition"
            >
              <img src="/images/v9max/bike_6.webp" alt="Bomba" className="w-full aspect-square object-cover" />
              <div className="p-2.5">
                <h4 className="text-[12px] font-bold text-[#161823] line-clamp-2">Bomba de Ar Elétrica Portátil Recarregável</h4>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-[13px] font-extrabold text-[#fe2c55]">R$ 99,90</span>
                  <span className="text-[10px] text-[#8a8b91] line-through">R$ 199,00</span>
                </div>
                <div className="mt-1 text-[10px] font-bold text-[#fe2c55]">15% OFF</div>
                <div className="mt-1 text-[10.5px] text-[#8a8b91]">740 vendidos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Top Floating Button */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-24 right-4 z-40 bg-white/90 backdrop-blur-xs p-2.5 rounded-full shadow-lg border border-neutral-200 text-[#161823] hover:bg-white active:scale-90 transition"
            aria-label="Voltar ao topo"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}

        {/* BOTTOM FIXED FLOATING BAR */}
        <div className="fixed bottom-0 z-40 w-full max-w-[440px] bg-white border-t border-neutral-200 shadow-lg">
          {/* Free Shipping Strip */}
          <div className="flex items-center justify-between bg-[#eefaf7] px-4 py-1.5 text-[11.5px] text-[#008f82] border-b border-[#c6ece5]">
            <div className="flex items-center gap-1.5 font-bold">
              <Truck className="h-3.5 w-3.5" />
              <span>O frete grátis expira em breve</span>
            </div>
            <span className="font-mono font-extrabold tabular-nums">
              {formatShippingTimer()}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 px-4 py-2.5">
            {/* Store Icon */}
            <button 
              onClick={() => addToast({ type: 'info', message: 'Abrindo Loja Monster E Bikes' })}
              className="flex flex-col items-center justify-center text-[#161823] active:opacity-70"
            >
              <Store className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Loja</span>
            </button>

            {/* Chat Icon */}
            <button 
              onClick={() => addToast({ type: 'info', message: 'Iniciando chat com Monster E Bikes' })}
              className="flex flex-col items-center justify-center text-[#161823] active:opacity-70"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Chat</span>
            </button>

            {/* Cart Icon */}
            <button 
              onClick={() => setIsVariantSheetOpen(true)}
              className="flex flex-col items-center justify-center text-[#161823] active:opacity-70"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Carrinho</span>
            </button>

            {/* Big Red Button (Comprar agora Frete grátis) */}
            <button
              onClick={() => setIsVariantSheetOpen(true)}
              className="flex-1 rounded-full bg-[#fe2c55] py-2.5 text-center text-white shadow-md font-extrabold hover:bg-[#e0264b] active:scale-[0.98]"
            >
              <div className="text-[14.5px] leading-tight">Comprar agora</div>
              <div className="text-[10px] font-normal leading-tight opacity-90">Frete grátis</div>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MODALS & OVERLAYS */}
        {/* ========================================================================= */}

        {/* VARIANT & QUANTITY BOTTOM SHEET */}
        {isVariantSheetOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-[440px] rounded-t-2xl bg-white p-4 animate-in slide-in-from-bottom duration-200">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <img 
                    src="/images/v9max/bike_1.webp" 
                    alt="Bicicleta Elétrica V9 Max" 
                    className="h-20 w-20 rounded-lg object-cover border border-neutral-100" 
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="bg-[#fe2c55] text-white text-[10px] font-bold px-1 rounded">-90%</span>
                      <span className="text-[#fe2c55] font-extrabold text-[20px]">R$ 89,75</span>
                    </div>
                    <div className="text-[11px] text-[#8a8b91] line-through">R$ 899,90</div>
                    <div className="mt-1 text-[12px] text-[#00b8a9] font-bold">Taxa de envio: Grátis</div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsVariantSheetOpen(false)}
                  className="p-1 rounded-full hover:bg-neutral-100"
                >
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </div>

              {/* Variations selector */}
              <div className="mt-4 border-t border-neutral-100 pt-3">
                <div className="text-[13px] font-bold text-[#161823]">Cor</div>
                <div className="mt-2 flex gap-2">
                  <button 
                    onClick={() => setSelectedVariant('preto')}
                    className={`border-2 rounded-lg p-2 flex items-center gap-2 ${selectedVariant === 'preto' ? 'border-[#fe2c55] bg-[#fff0f3]' : 'border-neutral-200 bg-white'}`}
                  >
                    <div className="w-4 h-4 rounded-full bg-neutral-900 border" />
                    <span className="text-[12px] font-bold text-[#161823]">Preto Fosco (Original)</span>
                  </button>

                  <button 
                    onClick={() => setSelectedVariant('cinza')}
                    className={`border-2 rounded-lg p-2 flex items-center gap-2 ${selectedVariant === 'cinza' ? 'border-[#fe2c55] bg-[#fff0f3]' : 'border-neutral-200 bg-white'}`}
                  >
                    <div className="w-4 h-4 rounded-full bg-neutral-500 border" />
                    <span className="text-[12px] font-bold text-[#161823]">Cinza Grafite</span>
                  </button>
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
                <span className="text-[14px] font-bold text-[#161823]">Quantidade</span>
                <div className="flex items-center gap-3 bg-[#f1f1f2] rounded-full px-3 py-1">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-lg font-bold text-[#161823]"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="font-bold text-[14px]">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-lg font-bold text-[#161823]"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-5">
                <button
                  onClick={() => {
                    setIsVariantSheetOpen(false);
                    navigate('/checkout');
                  }}
                  className="w-full rounded-full bg-[#fe2c55] py-3 text-white font-extrabold text-[15px] shadow-md hover:bg-[#e0264b] active:scale-[0.98] transition"
                >
                  Avançar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CREATOR VIDEO MODAL PLAYER */}
        {activeVideoCreator && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-in fade-in">
            <div className="relative w-full max-w-[360px] aspect-[9/16] bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between">
              <img src={activeVideoCreator.poster} alt={activeVideoCreator.name} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />

              {/* Video Header */}
              <div className="relative z-10 p-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-xs">
                    {activeVideoCreator.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-bold">{activeVideoCreator.name}</div>
                    <div className="text-[11px] opacity-80">Criador Verificado TikTok</div>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveVideoCreator(null)}
                  className="p-1 rounded-full bg-black/40 text-white hover:bg-black/60"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Center Play Simulation */}
              <div className="relative z-10 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#fe2c55]/90 text-white flex items-center justify-center shadow-lg animate-pulse">
                  <Play className="w-8 h-8 fill-white ml-1" />
                </div>
                <span className="mt-3 text-white text-xs font-semibold bg-black/50 px-3 py-1 rounded-full backdrop-blur-xs">
                  Demonstração da Bicicleta Elétrica V9 Max 1000W
                </span>
              </div>

              {/* Video Footer */}
              <div className="relative z-10 p-4 space-y-3">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-1 text-xs font-bold">
                      <Heart className="w-5 h-5 fill-[#fe2c55] text-[#fe2c55]" />
                      <span>34.2K</span>
                    </button>
                    <button className="flex items-center gap-1 text-xs font-bold">
                      <MessageCircle className="w-5 h-5" />
                      <span>1.4K</span>
                    </button>
                  </div>
                  <Volume2 className="w-5 h-5" />
                </div>

                <button
                  onClick={() => {
                    setActiveVideoCreator(null);
                    setIsVariantSheetOpen(true);
                  }}
                  className="w-full bg-[#fe2c55] text-white py-2.5 rounded-full font-bold text-sm shadow-lg flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Comprar por R$ 89,75</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LIGHTBOX PHOTO GALLERY MODAL */}
        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 p-4 animate-in fade-in select-none">
            {/* Top Bar with Counter and Close Button */}
            <div className="flex items-center justify-between text-white pt-2 px-2 z-10">
              <span className="font-mono text-sm font-semibold tracking-wider bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                {lightboxIndex + 1} / {lightboxImages.length}
              </span>
              <button 
                onClick={() => setLightboxIndex(null)}
                className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 active:scale-95 transition"
                aria-label="Fechar"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Image with Navigation Arrows */}
            <div className="relative flex-1 flex items-center justify-center my-auto">
              {/* Previous Button */}
              {lightboxImages.length > 1 && (
                <button
                  onClick={() => setLightboxIndex((lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length)}
                  className="absolute left-2 z-20 p-2.5 rounded-full bg-black/50 text-white hover:bg-black/80 active:scale-90 transition backdrop-blur-md"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              <img 
                src={lightboxImages[lightboxIndex]} 
                alt={`Foto do produto ${lightboxIndex + 1}`} 
                className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-2xl transition-transform duration-300"
              />

              {/* Next Button */}
              {lightboxImages.length > 1 && (
                <button
                  onClick={() => setLightboxIndex((lightboxIndex + 1) % lightboxImages.length)}
                  className="absolute right-2 z-20 p-2.5 rounded-full bg-black/50 text-white hover:bg-black/80 active:scale-90 transition backdrop-blur-md"
                  aria-label="Próximo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Bottom Thumbnails Strip */}
            <div className="flex justify-center gap-2 pb-4 pt-2 overflow-x-auto z-10">
              {lightboxImages.map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className={`h-14 w-14 rounded-lg overflow-hidden shrink-0 border-2 transition duration-200 ${lightboxIndex === idx ? 'border-[#fe2c55] scale-105 shadow-md' : 'border-white/30 opacity-60 hover:opacity-100'}`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* COUPONS MODAL */}
        {isCouponModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-[440px] rounded-t-2xl bg-white p-4 animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h3 className="text-[15px] font-bold text-[#161823]">Cupons de Desconto Disponíveis</h3>
                <button onClick={() => setIsCouponModalOpen(false)} className="p-1 rounded-full hover:bg-neutral-100">
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <div className="p-3 rounded-xl bg-[#fff0f3] border border-[#ffccd5] flex items-center justify-between">
                  <div>
                    <div className="text-[14px] font-extrabold text-[#fe2c55]">Desconto de 50%</div>
                    <div className="text-[11px] text-[#8a8b91]">Válido para primeira compra nesta loja</div>
                  </div>
                  <span className="bg-[#fe2c55] text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                    Aplicado ✓
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#fff0f3] border border-[#ffccd5] flex items-center justify-between">
                  <div>
                    <div className="text-[14px] font-extrabold text-[#fe2c55]">Desconto de 15%</div>
                    <div className="text-[11px] text-[#8a8b91]">Máximo de R$ 50,00 no Pix</div>
                  </div>
                  <span className="bg-[#fe2c55] text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                    Ativo ✓
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsCouponModalOpen(false)}
                className="mt-5 w-full rounded-full bg-[#161823] py-2.5 text-white font-bold text-[14px]"
              >
                Fechar
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
export default FerramentaPage;
