import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useStore } from '../context/StoreContext';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { ProductCard } from '../components/product/ProductCard';

export const FavoritesPage: React.FC = () => {
  const { favorites } = useFavorites();
  const { products } = useStore();

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-0">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-pink-100 text-pink-600 rounded-xl">
            <Heart className="w-5 h-5 fill-pink-600" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-none">
              Meus Favoritos
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {favoriteProducts.length} {favoriteProducts.length === 1 ? 'produto salvo' : 'produtos salvos'}
            </p>
          </div>
        </div>

        {favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {favoriteProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-sm mx-auto space-y-3">
            <Heart className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">Nenhum favorito ainda</h3>
            <p className="text-xs text-slate-500">
              Clique no coração em qualquer produto para salvá-lo e acompanhar promoções.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 bg-brand text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-brand-600 transition-colors shadow-glow"
            >
              <span>Explorar Produtos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </main>

      <Footer />
      <BottomNavigation />
    </div>
  );
};
