import React, { useState } from 'react';
import { Ticket, ChevronRight, Check } from 'lucide-react';
import { Coupon } from '../../types';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { Drawer } from '../common/Drawer';
import { formatCurrency } from '../../utils/formatters';

interface CouponSelectorProps {
  currentPrice: number;
}

export const CouponSelector: React.FC<CouponSelectorProps> = ({ currentPrice }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { appliedCoupon, applyCoupon, removeCoupon } = useCart();
  const { coupons } = useStore();

  const handleToggleCoupon = (coupon: Coupon) => {
    if (appliedCoupon?.id === coupon.id) {
      removeCoupon();
    } else {
      applyCoupon(coupon);
      setIsOpen(false);
    }
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-between py-2.5 px-3 bg-amber-50/70 hover:bg-amber-50 border border-amber-200/80 rounded-xl cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-2 text-xs">
          <Ticket className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="font-bold text-amber-950">
            {appliedCoupon ? `Cupom Ativo: ${appliedCoupon.title}` : 'Desconto de R$ 5 disponível'}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[11px] font-bold text-amber-700">
            {appliedCoupon ? 'Alterar' : 'Ver Cupons'}
          </span>
          <ChevronRight className="w-4 h-4 text-amber-600" />
        </div>
      </div>

      {/* Coupons Drawer */}
      <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} title="Cupons da Loja e Plataforma">
        <div className="space-y-3">
          <p className="text-xs text-slate-500">
            Selecione um cupom para aplicar no seu pedido e economizar agora:
          </p>

          <div className="space-y-2.5">
            {coupons.map((coupon) => {
              const isSelected = appliedCoupon?.id === coupon.id;
              const isEligible = currentPrice >= coupon.minOrderValue;

              return (
                <div
                  key={coupon.id}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-brand bg-rose-50/60 ring-2 ring-brand/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  } ${!isEligible ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 bg-amber-100 text-amber-700 rounded-xl shrink-0 mt-0.5">
                      <Ticket className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-slate-900 text-sm">{coupon.title}</span>
                        <span className="bg-slate-100 text-slate-700 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                          {coupon.code}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{coupon.description}</p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Mínimo de {formatCurrency(coupon.minOrderValue)} • Válido até {coupon.expiresAt}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleCoupon(coupon)}
                    disabled={!isEligible}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-brand text-white hover:bg-brand-600'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {isSelected ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Aplicado
                      </span>
                    ) : (
                      'Aplicar'
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </Drawer>
    </>
  );
};
