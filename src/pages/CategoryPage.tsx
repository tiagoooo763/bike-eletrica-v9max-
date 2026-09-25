import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { ProductCard } from '../components/product/ProductCard';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { categories, products, getCategoryBySlug } = useStore();

  const category = getCategoryBySlug(slug || '') || categories[0];
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'sales' | 'price_asc' | 'price_desc' | 'rating'>('sales');

  const categoryProducts = products.filter((p) => p.categorySlug === category.slug || p.categoryId === category.id);

  const sortedProducts = [...categoryProducts].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.salesCount - a.salesCount;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-0">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Category Header Hero */}
        <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <Link to="/" className="hover:text-white">Início</Link>
            <span>/</span>
            <span className="text-white font-bold">{category.name}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black">{category.name}</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md">
            Confira as melhores ofertas e produtos virais da categoria {category.name} com garantia e entrega rápida.
          </p>

          {/* Subcategories Tags */}
          {category.subcategories && category.subcategories.length > 0 && (
            <div className="flex items-center gap-2 mt-5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setSelectedSubcategory(null)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors ${
                  selectedSubcategory === null
                    ? 'bg-brand text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Todos
              </button>
              {category.subcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubcategory(sub.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors ${
                    selectedSubcategory === sub.id
                      ? 'bg-brand text-white'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Bar / Sorting */}
        <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200">
          <span className="text-xs font-bold text-slate-700">
            {sortedProducts.length} Produtos encontrados
          </span>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-100 border-none text-xs font-semibold rounded-xl px-3 py-1.5 text-slate-800 focus:ring-0 cursor-pointer"
            >
              <option value="sales">Mais Vendidos</option>
              <option value="price_asc">Menor Preço</option>
              <option value="price_desc">Maior Preço</option>
              <option value="rating">Melhor Avaliação</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      <Footer />
      <BottomNavigation />
    </div>
  );
};
