import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart, Flame, ShieldCheck } from 'lucide-react';
import { Product } from '../../types';
import { formatCurrency, formatCompactNumber } from '../../utils/formatters';
import { useFavorites } from '../../context/FavoritesContext';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'horizontal';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  layout = 'grid',
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addItem } = useCart();
  const favorite = isFavorite(product.id);

  if (layout === 'horizontal') {
    return (
      <div className="flex bg-white rounded-2xl border border-slate-100 p-2.5 gap-3 shadow-xs hover:shadow-soft transition-all group">
        <Link to={`/produto/${product.slug}`} className="relative w-28 h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.discountPercentage > 0 && (
            <span className="absolute top-1.5 left-1.5 bg-brand text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-xs">
              -{product.discountPercentage}%
            </span>
          )}
        </Link>

        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <Link to={`/produto/${product.slug}`}>
              <h4 className="text-xs font-semibold text-slate-800 line-clamp-2 hover:text-brand transition-colors">
                {product.name}
              </h4>
            </Link>

            <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-500">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-800">{product.rating.toFixed(1)}</span>
              <span>• {formatCompactNumber(product.salesCount)} vendidos</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div>
              <div className="text-sm font-black text-brand">
                {formatCurrency(product.price)}
              </div>
              {product.oldPrice && (
                <div className="text-[10px] text-slate-400 line-through">
                  {formatCurrency(product.oldPrice)}
                </div>
              )}
            </div>

            <button
              onClick={() => addItem(product)}
              className="p-2 bg-slate-900 text-white rounded-xl hover:bg-brand transition-colors"
              aria-label="Adicionar ao carrinho"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs hover:shadow-medium transition-all group flex flex-col justify-between">
      <div>
        {/* Product Image & Badges */}
        <div className="relative aspect-square bg-slate-100 overflow-hidden">
          <Link to={`/produto/${product.slug}`}>
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </Link>

          {/* Discount Badge */}
          {product.discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-brand text-white text-[11px] font-black px-2 py-0.5 rounded-lg shadow-sm">
              -{product.discountPercentage}%
            </div>
          )}

          {/* Flash Deal Indicator */}
          {product.isFlashDeal && (
            <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-xs text-amber-300 text-[10px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <Flame className="w-3 h-3 fill-amber-300" />
              <span>RELÂMPAGO</span>
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(product);
            }}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              favorite
                ? 'bg-rose-50 text-brand scale-110 shadow-sm'
                : 'bg-white/80 backdrop-blur-xs text-slate-600 hover:text-brand'
            }`}
            aria-label="Favoritar"
          >
            <Heart className={`w-4 h-4 ${favorite ? 'fill-brand' : ''}`} />
          </button>
        </div>

        {/* Info Block */}
        <div className="p-3">
          <Link to={`/produto/${product.slug}`}>
            <h4 className="text-xs font-semibold text-slate-800 line-clamp-2 hover:text-brand transition-colors leading-snug">
              {product.name}
            </h4>
          </Link>

          {/* Rating & Sales */}
          <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-slate-500">
            <div className="flex items-center gap-0.5 text-amber-500">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-900">{product.rating.toFixed(1)}</span>
            </div>
            <span>•</span>
            <span>{formatCompactNumber(product.salesCount)} vendidos</span>
          </div>

          {/* Free Shipping or Store verified */}
          <div className="flex items-center gap-1 mt-1">
            {product.shipping.freeShipping ? (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                Frete Grátis
              </span>
            ) : (
              <span className="text-[10px] text-slate-400">Envio R$ 3,90</span>
            )}
          </div>
        </div>
      </div>

      {/* Price & Buy Button Footer */}
      <div className="px-3 pb-3 pt-1 flex items-end justify-between gap-2 border-t border-slate-50">
        <div>
          <div className="text-base font-black text-slate-950 leading-none">
            {formatCurrency(product.price)}
          </div>
          {product.oldPrice && (
            <div className="text-[10px] text-slate-400 line-through mt-0.5">
              {formatCurrency(product.oldPrice)}
            </div>
          )}
        </div>

        <button
          onClick={() => addItem(product)}
          className="w-8 h-8 bg-rose-50 text-brand hover:bg-brand hover:text-white rounded-xl flex items-center justify-center transition-colors shadow-xs active:scale-95 shrink-0"
          aria-label="Adicionar ao carrinho"
        >
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
