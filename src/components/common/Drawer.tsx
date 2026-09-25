import React, { useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer Container (Bottom Sheet Mobile Style) */}
      <div className="relative w-full max-w-lg mx-auto bg-white rounded-t-3xl shadow-floating z-10 animate-slide-up max-h-[85vh] flex flex-col pb-safe">
        {/* Drag Handle Bar */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-1 cursor-grab" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">{title || ''}</h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[70vh]">{children}</div>
      </div>
    </div>
  );
};
