import React from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  score: number;
  reviewCount?: number;
  salesCount?: number;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export const Rating: React.FC<RatingProps> = ({
  score,
  reviewCount,
  salesCount,
  showText = true,
  size = 'sm',
  className = '',
  onClick,
}) => {
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 text-xs text-slate-600 ${onClick ? 'cursor-pointer hover:opacity-80' : ''} ${className}`}
    >
      <div className="flex items-center gap-0.5 text-amber-400">
        <Star className={`${iconSizes[size]} fill-amber-400 text-amber-400`} />
        {showText && <span className="font-bold text-slate-900 ml-0.5">{score.toFixed(1)}</span>}
      </div>

      {reviewCount !== undefined && (
        <span className="text-slate-500 font-normal">
          ({reviewCount} avaliações)
        </span>
      )}

      {salesCount !== undefined && (
        <>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 font-medium">
            {salesCount.toLocaleString('pt-BR')} vendidos
          </span>
        </>
      )}
    </div>
  );
};
