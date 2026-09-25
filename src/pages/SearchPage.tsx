import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, X, Star, Flame, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { ProductCard } from '../components/product/ProductCard';
import { Drawer } from '../components/common/Drawer';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const { products, categories } = useStore();

  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyFlashDeals, setOnlyFlashDeals] = useState<boolean>(false);
  const [onlyFreeShipping, setOnlyFreeShipping] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'sales' | 'price_asc' | 'price_desc' | 'rating'>('relevance');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Sync state when query param in URL changes
  React.useEffect(() => {
    setSearchTerm(queryParam);
  }, [queryParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: searchTerm });
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Query filter
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesCategory = p.categoryName.toLowerCase().includes(q);
        const matchesStore = p.storeName.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesStore) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
        return false;
      }

      // Rating filter
      if (minRating > 0 && p.rating < minRating) {
        return false;
      }

      // Flash deals only
      if (onlyFlashDeals && !p.isFlashDeal) {
        return false;
      }

      // Free shipping only
      if (onlyFreeShipping && !p.shipping.freeShipping) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'sales') return b.salesCount - a.salesCount;
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // relevance
    });
  }, [products, searchTerm, selectedCategory, minRating, onlyFlashDeals, onlyFreeShipping, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-0">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Search Bar & Header */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="O que você está procurando?"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
            <button
              type="submit"
              className="bg-brand text-white font-bold px-5 py-2.5 rounded-2xl hover:bg-brand-600 transition-colors text-sm shadow-xs"
            >
              Buscar
            </button>
          </form>

          {/* Quick Filters / Active Summary */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pt-1">
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsFilterDrawerOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filtros</span>
              </button>

              <button
                onClick={() => setOnlyFlashDeals(!onlyFlashDeals)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  onlyFlashDeals
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Ofertas Relâmpago</span>
              </button>

              <button
                onClick={() => setOnlyFreeShipping(!onlyFreeShipping)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  onlyFreeShipping
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Frete Grátis
              </button>
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-1.5 shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-100 border-none text-xs font-semibold rounded-xl px-2.5 py-1.5 text-slate-700 focus:ring-0 cursor-pointer"
              >
                <option value="relevance">Mais Relevantes</option>
                <option value="sales">Mais Vendidos</option>
                <option value="price_asc">Menor Preço</option>
                <option value="price_desc">Maior Preço</option>
                <option value="rating">Melhor Avaliação</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>
            Exibindo <strong>{filteredProducts.length}</strong> resultados {searchTerm ? `para "${searchTerm}"` : ''}
          </span>
          {(selectedCategory !== 'all' || minRating > 0 || onlyFlashDeals || onlyFreeShipping) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setMinRating(0);
                setOnlyFlashDeals(false);
                setOnlyFreeShipping(false);
              }}
              className="text-brand font-bold hover:underline"
            >
              Limpar Filtros
            </button>
          )}
        </div>

        {/* Product Grid or Empty State */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 bg-rose-50 text-brand rounded-2xl flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Nenhum produto encontrado</h3>
            <p className="text-xs text-slate-500">
              Tente buscar por termos mais genéricos como "furadeira", "fone" ou selecione outra categoria.
            </p>
          </div>
        )}
      </main>

      {/* Filter Drawer */}
      <Drawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        title="Filtrar Produtos"
      >
        <div className="space-y-4">
          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-2">Categoria</label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`p-2 rounded-xl text-xs font-semibold text-left border ${
                  selectedCategory === 'all'
                    ? 'border-brand bg-rose-50 text-brand'
                    : 'border-slate-200 text-slate-700'
                }`}
              >
                Todas as Categorias
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`p-2 rounded-xl text-xs font-semibold text-left border truncate ${
                    selectedCategory === c.id
                      ? 'border-brand bg-rose-50 text-brand'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Minimum Rating */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-2">Avaliação Mínima</label>
            <div className="flex gap-2">
              {[0, 4, 4.5, 4.8].map((score) => (
                <button
                  key={score}
                  onClick={() => setMinRating(score)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 ${
                    minRating === score
                      ? 'border-brand bg-rose-50 text-brand'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{score === 0 ? 'Todas' : `${score}+`}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsFilterDrawerOpen(false)}
            className="w-full bg-brand text-white font-bold py-3 rounded-2xl hover:bg-brand-600 transition-colors text-sm shadow-xs"
          >
            Aplicar Filtros ({filteredProducts.length} encontrados)
          </button>
        </div>
      </Drawer>

      <Footer />
      <BottomNavigation />
    </div>
  );
};
