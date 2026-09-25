import React, { ReactNode } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children: ReactNode;
  variant?: 'flash' | 'discount' | 'verified' | 'free-shipping' | 'outline' | 'neutral' | 'live';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className,
}) => {
  const base = 'inline-flex items-center font-bold tracking-tight rounded-md select-none';

  const sizeStyles = {
    sm: 'text-[11px] px-1.5 py-0.5 leading-none',
    md: 'text-xs px-2.5 py-1 leading-tight',
  };

  const variantStyles = {
    flash: 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-xs',
    discount: 'bg-rose-100 text-brand-600 font-extrabold',
    verified: 'bg-sky-50 text-sky-600 border border-sky-200',
    'free-shipping': 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold',
    outline: 'bg-transparent border border-slate-300 text-slate-700',
    neutral: 'bg-slate-100 text-slate-700',
    live: 'bg-pulse-pink text-white animate-pulse',
  };

  return (
    <span className={twMerge(clsx(base, sizeStyles[size], variantStyles[variant], className))}>
      {children}
    </span>
  );
};
