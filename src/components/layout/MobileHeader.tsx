import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  Search, 
  Share2, 
  ShoppingCart, 
  MoreVertical, 
  Home, 
  Heart, 
  MessageCircle, 
  Check, 
  Copy 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../common/Modal';

interface MobileHeaderProps {
  title?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onShareClick?: () => void;
  productToShare?: {
    name: string;
    url?: string;
  };
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  showSearch = true,
  searchPlaceholder = 'Inacreditável o preço desse kit...',
  productToShare,
}) => {
  const navigate = useNavigate();
  const { totalItemsCount } = useCart();
  const { addToast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleShare = async () => {
    const currentUrl = window.location.href;
    const shareTitle = productToShare?.name || 'Olha esse produto no PulseShop!';

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          url: currentUrl,
        });
        return;
      } catch (err) {
        // Fallback to modal if dismissed or error
      }
    }
    setIsShareModalOpen(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    addToast({
      type: 'success',
      message: 'Link copiado para a área de transferência!',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-2 py-2 flex items-center justify-between gap-1.5 shadow-xs">
        {/* Back / Close Button */}
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-full text-slate-700 active:bg-slate-100 transition-colors shrink-0"
          aria-label="Voltar"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Search Bar / Title */}
        {showSearch ? (
          <form onSubmit={handleSearchSubmit} className="flex-1 min-w-0">
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-slate-100 text-slate-900 placeholder:text-slate-400 text-xs rounded-full pl-8 pr-3 py-2 border border-transparent focus:border-slate-300 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </form>
        ) : (
          <div className="flex-1 text-center font-bold text-sm text-slate-900 truncate px-2">
            {title}
          </div>
        )}

        {/* Action Icons Right: Share, Cart, Menu */}
        <div className="flex items-center gap-0.5 shrink-0">
          {/* Share */}
          <button
            onClick={handleShare}
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-700 active:bg-slate-100 transition-colors"
            aria-label="Compartilhar"
          >
            <Share2 className="w-5 h-5" />
          </button>

          {/* Cart with Badge */}
          <Link
            to="/carrinho"
            className="relative w-8 h-8 flex items-center justify-center rounded-full text-slate-700 active:bg-slate-100 transition-colors"
            aria-label="Carrinho de Compras"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-brand text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-scale-in">
                {totalItemsCount > 99 ? '99+' : totalItemsCount}
              </span>
            )}
          </Link>

          {/* More Options Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-8 h-8 flex items-center justify-center rounded-full text-slate-700 active:bg-slate-100 transition-colors"
              aria-label="Menu"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {isMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-floating border border-slate-100 py-1.5 z-50 animate-scale-in"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to="/" className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
                  <Home className="w-4 h-4 text-slate-400" />
                  <span>Página Inicial</span>
                </Link>
                <Link to="/favoritos" className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
                  <Heart className="w-4 h-4 text-slate-400" />
                  <span>Meus Favoritos</span>
                </Link>
                <Link to="/chat" className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
                  <MessageCircle className="w-4 h-4 text-slate-400" />
                  <span>Mensagens</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal Fallback */}
      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Compartilhar Produto"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Copie o link abaixo para enviar para seus amigos no WhatsApp, Instagram ou Telegram:
          </p>
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
            <input
              type="text"
              readOnly
              value={window.location.href}
              className="bg-transparent text-xs text-slate-700 flex-1 outline-none truncate"
            />
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 bg-brand text-white text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 hover:bg-brand-600 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
