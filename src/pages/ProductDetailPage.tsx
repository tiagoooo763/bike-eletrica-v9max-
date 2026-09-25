import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Share2, 
  Store as StoreIcon, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  Flame,
  Truck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { MobileHeader } from '../components/layout/MobileHeader';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ProductGallery } from '../components/product/ProductGallery';
import { OfferBanner } from '../components/product/OfferBanner';
import { InstallmentSelector } from '../components/product/InstallmentSelector';
import { CouponSelector } from '../components/product/CouponSelector';
import { ShippingCalculator } from '../components/product/ShippingCalculator';
import { ReviewSection } from '../components/product/ReviewSection';
import { ProductBottomBar } from '../components/product/ProductBottomBar';
import { ProductCard } from '../components/product/ProductCard';
import { ProductVariant, Product } from '../types';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { getProductBySlug, products, getStoreById } = useStore();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addItem } = useCart();
  const { addToast } = useToast();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Find product by slug or default to reference item
  const product = getProductBySlug(slug || '') || products[0];
  const store = getStoreById(product.storeId);
  const favorite = isFavorite(product.id);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants?.[0]
  );
  const [isNameExpanded, setIsNameExpanded] = useState(false);
  const [isStoreFollowed, setIsStoreFollowed] = useState(false);

  const handleToggleFollow = () => {
    setIsStoreFollowed(!isStoreFollowed);
    addToast({
      type: isStoreFollowed ? 'info' : 'success',
      message: isStoreFollowed ? 'Você deixou de seguir a loja.' : 'Você agora está seguindo esta loja!',
    });
  };

  const relatedProducts = products.filter((p: Product) => p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-100/70 pb-24 md:pb-12 text-slate-900">
      {/* Desktop Header */}
      <div className="hidden md:block">
        <Header />
      </div>

      {/* Mobile Top Header */}
      <div className="md:hidden">
        <MobileHeader
          showSearch={true}
          searchPlaceholder="Pesquisar no PulseShop..."
          productToShare={{ name: product.name }}
        />
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto md:px-6 md:py-6">
        <div className="md:grid md:grid-cols-12 md:gap-8 bg-white md:rounded-3xl md:p-6 md:border md:border-slate-200/80 md:shadow-soft">
          {/* LEFT COLUMN: Gallery & Desktop Thumbnails */}
          <div className="md:col-span-6 lg:col-span-5">
            <div className="md:sticky md:top-24">
              <ProductGallery images={product.images} productName={product.name} />
            </div>
          </div>

          {/* RIGHT COLUMN: Offer, Pricing, Installments, Specs, Reviews */}
          <div className="md:col-span-6 lg:col-span-7 flex flex-col space-y-3.5">
            {/* Flash Deal / Offer Banner Strip */}
            <div className="rounded-b-2xl md:rounded-2xl overflow-hidden shadow-xs">
              <OfferBanner
                price={selectedVariant?.price ?? product.price}
                oldPrice={selectedVariant?.oldPrice ?? product.oldPrice}
                discountPercentage={product.discountPercentage}
                isFlashDeal={product.isFlashDeal}
                flashDealEndTimestamp={product.flashDealEndTimestamp}
              />
            </div>

            {/* Installments & Coupons */}
            <div className="px-3.5 md:px-0 space-y-2">
              <InstallmentSelector price={selectedVariant?.price ?? product.price} />
              <CouponSelector currentPrice={selectedVariant?.price ?? product.price} />
            </div>

            {/* Product Title, Rating & Favorite */}
            <div className="px-3.5 md:px-0 py-2 border-y border-slate-100">
              <div className="flex items-start justify-between gap-3">
                <h1
                  onClick={() => setIsNameExpanded(!isNameExpanded)}
                  className={`text-sm sm:text-base font-bold text-slate-900 leading-snug cursor-pointer ${
                    !isNameExpanded ? 'line-clamp-2 md:line-clamp-none' : ''
                  }`}
                >
                  {product.name}
                </h1>

                <button
                  onClick={() => toggleFavorite(product)}
                  className={`p-2 rounded-full transition-all shrink-0 ${
                    favorite
                      ? 'bg-rose-50 text-brand scale-110 shadow-xs'
                      : 'bg-slate-100 text-slate-500 hover:text-brand'
                  }`}
                  aria-label="Salvar favorito"
                >
                  <Heart className={`w-5 h-5 ${favorite ? 'fill-brand text-brand' : ''}`} />
                </button>
              </div>

              {/* Expand title button if long */}
              <button
                onClick={() => setIsNameExpanded(!isNameExpanded)}
                className="text-[11px] font-semibold text-brand md:hidden mt-0.5 inline-flex items-center gap-0.5"
              >
                <span>{isNameExpanded ? 'Menos detalhes' : 'Ver nome completo'}</span>
                {isNameExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {/* Rating & Sales count */}
              <div className="flex items-center gap-2 mt-2 pt-1 border-t border-slate-50 text-xs">
                <div className="flex items-center text-amber-500 font-bold">
                  <span>⭐ {product.rating.toFixed(1)}</span>
                </div>
                <span className="text-slate-500">({product.reviewCount} avaliações)</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-700 font-semibold">{product.salesCount} vendidos</span>
              </div>
            </div>

            {/* Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="px-3.5 md:px-0 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Selecione a Opção:</span>
                  <span className="text-brand font-bold">{selectedVariant?.name}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                  {product.variants.map((variant: ProductVariant) => {
                    const isSelected = selectedVariant?.id === variant.id;
                    return (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                          isSelected
                            ? 'border-brand bg-rose-50/70 ring-2 ring-brand/20 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        {variant.image && (
                          <img
                            src={variant.image}
                            alt={variant.name}
                            className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-100"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{variant.value}</p>
                          <p className="text-[11px] text-brand font-extrabold">
                            R$ {(variant.price ?? product.price).toFixed(2).replace('.', ',')}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Delivery / Shipping Calculator */}
            <div className="px-3.5 md:px-0">
              <ShippingCalculator price={selectedVariant?.price ?? product.price} />
            </div>

            {/* Store Information Card */}
            <div className="px-3.5 md:px-0">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={product.storeLogo}
                    alt={product.storeName}
                    className="w-11 h-11 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <h4 className="text-xs font-bold text-slate-900">{product.storeName}</h4>
                      {product.storeVerified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-sky-500 fill-sky-500 text-white" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      ⭐ {store?.rating || 4.9} • {store?.followersCount.toLocaleString('pt-BR') || '142k'} seguidores
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={handleToggleFollow}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isStoreFollowed
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-brand text-white hover:bg-brand-600'
                    }`}
                  >
                    {isStoreFollowed ? 'Seguindo' : '+ Seguir'}
                  </button>
                  <Link
                    to={`/loja/${product.storeId}`}
                    className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100"
                  >
                    Ver Loja
                  </Link>
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="px-3.5 md:px-0 space-y-2 pt-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Especificações do Produto
                </h3>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50">
                  {product.specifications.map((spec: { label: string; value: string }, i: number) => (
                    <div key={i} className="flex py-2 px-3 text-xs">
                      <span className="w-1/3 text-slate-500 font-medium">{spec.label}</span>
                      <span className="w-2/3 text-slate-900 font-semibold">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="px-3.5 md:px-0 space-y-2 pt-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Descrição Detalhada
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                {product.description}
              </p>
            </div>

            {/* Customer Reviews Section */}
            <div className="px-3.5 md:px-0 pt-4 border-t border-slate-100">
              <ReviewSection
                productId={product.id}
                rating={product.rating}
                reviewCount={product.reviewCount}
                salesCount={product.salesCount}
              />
            </div>
          </div>
        </div>

        {/* Recommended Products Carousel / Grid */}
        <div className="mt-8 px-4 md:px-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-extrabold text-slate-900">Quem viu este produto, também comprou:</h3>
            <Link to="/categoria/ferramentas" className="text-xs font-bold text-brand flex items-center gap-1 hover:underline">
              Ver mais <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {relatedProducts.map((p: Product) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </main>

      {/* Desktop Footer */}
      <div className="hidden md:block">
        <Footer />
      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <ProductBottomBar product={product} selectedVariant={selectedVariant} />
    </div>
  );
};
