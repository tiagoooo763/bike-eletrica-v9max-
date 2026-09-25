import React from 'react';
import { Zap, Flame } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { Countdown } from '../common/Countdown';

interface OfferBannerProps {
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  isFlashDeal?: boolean;
  flashDealEndTimestamp?: number;
}

export const OfferBanner: React.FC<OfferBannerProps> = ({
  price,
  oldPrice,
  discountPercentage,
  isFlashDeal = true,
  flashDealEndTimestamp,
}) => {
  // Default 6 hours timestamp if not provided
  const targetTime = flashDealEndTimestamp || Date.now() + (5 * 3600 + 58 * 60 + 33) * 1000;

  return (
    <div className="w-full bg-gradient-to-r from-[#FE2C55] via-[#FE2C55] to-[#FF5E00] text-white px-3.5 py-2.5 flex items-center justify-between shadow-md relative overflow-hidden">
      {/* Background Subtle Wave Decoration */}
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-white/10 skew-x-12 -mr-10 pointer-events-none" />

      {/* Left: Prices and Discount Tag */}
      <div className="flex items-baseline gap-2 z-10">
        {discountPercentage && (
          <div className="bg-white text-[#FE2C55] font-black text-xs px-1.5 py-0.5 rounded shadow-xs">
            -{discountPercentage}%
          </div>
        )}

        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black tracking-tight leading-none text-white">
              {formatCurrency(price)}
            </span>
          </div>

          {oldPrice && (
            <span className="text-[11px] text-white/80 line-through font-medium">
              {formatCurrency(oldPrice)}
            </span>
          )}
        </div>
      </div>

      {/* Right: Flash Deal Badge + Live Countdown */}
      {isFlashDeal && (
        <div className="flex flex-col items-end gap-1 z-10">
          <div className="flex items-center gap-1 text-white font-extrabold text-[11px] uppercase tracking-wide">
            <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-bounce" />
            <span>Oferta Relâmpago</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-white/90 font-medium hidden sm:inline">Termina em:</span>
            <Countdown targetTimestamp={targetTime} />
          </div>
        </div>
      )}
    </div>
  );
};
