import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  title?: string;
  message: string;
  type: ToastType;
}

interface ToastContextData {
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ title, message, type = 'info' }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 3500);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast Floating Container */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl shadow-floating text-white text-sm font-medium transition-all transform animate-scale-in ${
              toast.type === 'success'
                ? 'bg-slate-900 border border-emerald-500/40 text-emerald-300'
                : toast.type === 'error'
                ? 'bg-slate-900 border border-rose-500/40 text-rose-300'
                : 'bg-slate-900 border border-slate-700 text-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-pulse-cyan shrink-0" />}
              <div className="flex flex-col">
                {toast.title && <span className="font-semibold text-white text-xs">{toast.title}</span>}
                <span>{toast.message}</span>
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors ml-2"
              aria-label="Fechar"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
