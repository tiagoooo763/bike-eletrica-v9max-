import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShoppingCart, 
  User as UserIcon, 
  Heart, 
  Video, 
  Radio, 
  Store as StoreIcon, 
  ShieldAlert, 
  Menu, 
  X,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { totalItemsCount } = useCart();
  const { favorites } = useFavorites();
  const { user, role, switchRole, logout } = useAuth();
  const { categories } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
      {/* Top Notification Announcement Bar */}
      <div className="bg-slate-950 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <span className="bg-brand text-white text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded">
              AO VIVO
            </span>
            <span className="hidden sm:inline">Festival de Ofertas Relâmpago com Cupons até 70% OFF</span>
            <span className="sm:hidden">Ofertas até 70% OFF</span>
          </div>

          <div className="flex items-center gap-3 text-slate-300">
            {/* Fast Role Switcher for seamless testing */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg px-2 py-0.5 text-[11px]">
              <span className="text-slate-400">Modo:</span>
              <button
                onClick={() => switchRole('customer')}
                className={`px-1.5 py-0.5 rounded ${role === 'customer' ? 'bg-brand text-white font-bold' : 'hover:text-white'}`}
              >
                Comprador
              </button>
              <button
                onClick={() => switchRole('seller')}
                className={`px-1.5 py-0.5 rounded ${role === 'seller' ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:text-white'}`}
              >
                Vendedor
              </button>
              <button
                onClick={() => switchRole('admin')}
                className={`px-1.5 py-0.5 rounded ${role === 'admin' ? 'bg-pulse-cyan text-slate-950 font-bold' : 'hover:text-white'}`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4 sm:gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-9 h-9 bg-gradient-to-br from-brand to-pulse-accent rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white animate-pulse-subtle" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 leading-none">
                PULSE<span className="text-brand">SHOP</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-600 tracking-wider">
                SOCIAL COMMERCE
              </span>
            </div>
          </Link>

          {/* Search Bar Desktop & Tablet */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquise furadeiras, eletrônicos, cosméticos e produtos virais..."
                className="w-full pl-11 pr-24 py-2.5 bg-slate-100/90 border border-slate-200 rounded-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:bg-white transition-all shadow-xs"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-brand text-white text-xs font-bold px-4 py-1.5 rounded-full hover:bg-brand-600 transition-colors shadow-xs"
              >
                Buscar
              </button>
            </div>
          </form>

          {/* Action Links */}
          <div className="flex items-center gap-1.5 sm:gap-4">
            {/* Social Commerce Shortcuts */}
            <Link
              to="/videos"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:bg-rose-50 hover:text-brand transition-colors"
            >
              <Video className="w-4 h-4 text-brand" />
              <span>Vídeos</span>
            </Link>

            <Link
              to="/live"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:bg-rose-50 hover:text-brand transition-colors"
            >
              <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>Lives</span>
            </Link>

            {/* Role Portals */}
            {role === 'seller' && (
              <Link
                to="/vendedor"
                className="hidden sm:flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-100 transition-colors"
              >
                <StoreIcon className="w-4 h-4 text-amber-600" />
                <span>Painel Vendedor</span>
              </Link>
            )}

            {role === 'admin' && (
              <Link
                to="/admin"
                className="hidden sm:flex items-center gap-1.5 bg-sky-50 border border-sky-200 text-sky-900 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-sky-100 transition-colors"
              >
                <ShieldAlert className="w-4 h-4 text-sky-600" />
                <span>Painel Admin</span>
              </Link>
            )}

            {/* Favorites Icon */}
            <Link
              to="/favoritos"
              className="relative p-2 text-slate-700 hover:text-brand hover:bg-slate-100 rounded-full transition-colors hidden sm:flex"
              aria-label="Favoritos"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 bg-brand text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              to="/carrinho"
              className="relative p-2 text-slate-700 hover:text-brand hover:bg-slate-100 rounded-full transition-colors"
              aria-label="Carrinho"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute top-1 right-1 bg-brand text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scale-in">
                  {totalItemsCount}
                </span>
              )}
            </Link>

            {/* User Profile / Login */}
            <div className="relative">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-brand/30"
                    />
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
                  </button>

                  {isUserDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-floating border border-slate-100 py-2 z-50 animate-scale-in"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-400">Conectado como</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 capitalize">{role}</p>
                      </div>

                      <Link to="/perfil" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        Meu Perfil
                      </Link>
                      <Link to="/pedidos" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        Meus Pedidos
                      </Link>
                      <Link to="/favoritos" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        Favoritos ({favorites.length})
                      </Link>

                      {role === 'seller' && (
                        <Link to="/vendedor" className="block px-4 py-2 text-sm font-semibold text-amber-600 hover:bg-amber-50">
                          Painel do Vendedor
                        </Link>
                      )}

                      {role === 'admin' && (
                        <Link to="/admin" className="block px-4 py-2 text-sm font-semibold text-sky-600 hover:bg-sky-50">
                          Painel Administrativo
                        </Link>
                      )}

                      <div className="border-t border-slate-100 my-1"></div>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium"
                      >
                        Sair da Conta
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-full hover:bg-slate-800 transition-colors"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Entrar</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg md:hidden"
              aria-label="Abrir Menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Dropdown */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquise produtos, marcas ou lojas..."
              className="w-full pl-10 pr-20 py-2 bg-slate-100 border border-slate-200 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-brand text-white text-[11px] font-bold px-3 py-1 rounded-full"
            >
              Buscar
            </button>
          </form>
        </div>
      </div>

      {/* Navigation Sub-Bar (Categories) Desktop */}
      <div className="hidden md:block bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 py-2 overflow-x-auto no-scrollbar text-xs font-medium text-slate-600">
            <Link to="/" className="text-brand font-bold shrink-0 hover:opacity-80">
              🔥 Ofertas Relâmpago
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/categoria/${cat.slug}`}
                className="shrink-0 hover:text-slate-900 hover:font-semibold transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
