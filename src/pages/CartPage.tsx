import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Ticket, 
  Check, 
  Store 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { CouponSelector } from '../components/product/CouponSelector';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    totalItemsCount,
    subtotal,
    discount,
    shipping,
    total,
    removeItem,
    updateQuantity,
    toggleSelectItem,
    selectAll,
    appliedCoupon,
    removeCoupon
  } = useCart();

  const allSelected = items.length > 0 && items.every((i) => i.selected);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-0">
        <Header />
        <main className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
          <div className="w-20 h-20 bg-rose-50 text-brand rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Seu carrinho está vazio</h2>
          <p className="text-xs text-slate-500">
            Explore as melhores ofertas relâmpago e vídeos com produtos virais no PulseShop.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-brand text-white font-bold text-sm px-6 py-3 rounded-2xl hover:bg-brand-600 transition-colors shadow-glow"
          >
            <span>Ver Ofertas de Hoje</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </main>
        <Footer />
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-28 md:pb-12">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-6">
          Carrinho de Compras ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'itens'})
        </h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8 space-y-6 lg:space-y-0">
          {/* ITEMS LIST (LEFT COLUMN) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Select All Checkbox Header */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => selectAll(e.target.checked)}
                  className="w-4 h-4 text-brand rounded focus:ring-brand accent-brand cursor-pointer"
                />
                <span>Selecionar todos os itens</span>
              </label>

              <span className="text-xs text-slate-400 font-medium">
                Garantia de Entrega Pulse
              </span>
            </div>

            {/* Cart Items Cards */}
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex gap-3 sm:gap-4 items-start"
                >
                  {/* Item Checkbox */}
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => toggleSelectItem(item.id)}
                    className="w-4 h-4 mt-8 text-brand rounded focus:ring-brand accent-brand cursor-pointer shrink-0"
                  />

                  {/* Thumbnail */}
                  <Link
                    to={`/produto/${item.product.slug}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Info & Quantity controls */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link to={`/produto/${item.product.slug}`}>
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 hover:text-brand transition-colors">
                            {item.product.name}
                          </h3>
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                          aria-label="Remover item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.variantName && (
                        <span className="inline-block text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md mt-1 font-medium">
                          {item.variantName}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
                      <div className="text-sm sm:text-base font-black text-slate-900">
                        {formatCurrency(item.price * item.quantity)}
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 text-slate-700 transition-colors"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 text-slate-700 transition-colors"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ORDER SUMMARY (RIGHT COLUMN) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Coupon Integration */}
            <CouponSelector currentPrice={subtotal} />

            {/* Summary Box */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900">Resumo do Pedido</h2>

              <div className="space-y-2 text-xs divide-y divide-slate-100">
                <div className="flex justify-between py-1 text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between py-1 text-emerald-600 font-medium">
                    <span>Desconto do Cupom</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between py-1 text-slate-600">
                  <span>Frete</span>
                  <span className="font-semibold text-slate-900">
                    {shipping === 0 ? (
                      <span className="text-emerald-600 font-bold">GRÁTIS</span>
                    ) : (
                      formatCurrency(shipping)
                    )}
                  </span>
                </div>

                <div className="flex justify-between pt-3 text-base font-black text-slate-900">
                  <span>Total</span>
                  <span className="text-brand text-lg">{formatCurrency(total)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                disabled={subtotal === 0}
                className="w-full bg-gradient-to-r from-brand to-pulse-accent text-white font-extrabold py-3.5 rounded-2xl hover:brightness-105 transition-all shadow-glow text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>FINALIZAR COMPRA</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Compra 100% Segura e Protegida</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNavigation />
    </div>
  );
};
