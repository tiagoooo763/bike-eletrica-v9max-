import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, MessageCircle, ShoppingBag, Zap } from 'lucide-react';
import { Product, ProductVariant } from '../../types';
import { useCart } from '../../context/CartContext';

interface ProductBottomBarProps {
  product: Product;
  selectedVariant?: ProductVariant;
}

export const ProductBottomBar: React.FC<ProductBottomBarProps> = ({
  product,
  selectedVariant,
}) => {
  const navigate = useNavigate();
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product, 1, selectedVariant);
  };

  const handleBuyNow = () => {
    addItem(product, 1, selectedVariant);
    navigate('/checkout');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 pb-safe shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Side Icons: Store & Chat */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <Link
            to={`/loja/${product.storeId}`}
            className="flex flex-col items-center justify-center w-12 h-10 text-slate-600 hover:text-brand transition-colors"
          >
            <Store className="w-4 h-4" />
            <span className="text-[10px] font-medium mt-0.5">Loja</span>
          </Link>

          <Link
            to={`/chat?storeId=${product.storeId}&productId=${product.id}`}
            className="flex flex-col items-center justify-center w-12 h-10 text-slate-600 hover:text-brand transition-colors relative"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-[10px] font-medium mt-0.5">Chat</span>
          </Link>
        </div>

        {/* Action Buttons: Add to Cart & Buy Now */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="flex-1 h-11 bg-rose-100/80 hover:bg-rose-100 text-brand-600 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] border border-rose-200 shadow-xs"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Adicionar</span>
          </button>

          {/* Buy Now (High impact CTA) */}
          <button
            onClick={handleBuyNow}
            className="flex-1 h-11 bg-gradient-to-r from-brand to-pulse-accent hover:brightness-105 text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] shadow-glow"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Comprar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
