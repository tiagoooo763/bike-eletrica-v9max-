import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  TrendingUp, 
  Plus, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  Clock, 
  CheckCircle2,
  Store as StoreIcon,
  Tag,
  BarChart3
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatCompactNumber } from '../../utils/formatters';
import { Header } from '../../components/layout/Header';
import { Modal } from '../../components/common/Modal';
import { Product } from '../../types';

export const SellerDashboardPage: React.FC = () => {
  const { products, orders, categories, addProduct, updateProduct, deleteProduct, updateOrderStatus } = useStore();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'inventory' | 'offers'>('dashboard');

  // Add Product Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newOldPrice, setNewOldPrice] = useState('');
  const [newCategory, setNewCategory] = useState(categories[0].id);
  const [newStock, setNewStock] = useState('50');
  const [newSku, setNewSku] = useState('');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80');
  const [newDesc, setNewDesc] = useState('');

  // Metrics
  const sellerProducts = products.filter((p) => p.storeId === 'store_1');
  const sellerOrders = orders; // simulated for demo
  const totalRevenue = sellerOrders.reduce((acc, o) => acc + o.total, 0) + 14890.50;
  const totalSalesCount = sellerProducts.reduce((acc, p) => acc + p.salesCount, 0);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(newPrice.replace(',', '.')) || 99.90;
    const oldPriceNum = parseFloat(newOldPrice.replace(',', '.')) || priceNum * 1.5;
    const discount = Math.round(((oldPriceNum - priceNum) / oldPriceNum) * 100);
    const cat = categories.find((c) => c.id === newCategory) || categories[0];

    const slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    addProduct({
      slug: slug || `prod-${Date.now()}`,
      name: newName,
      description: newDesc || 'Produto de alta qualidade com garantia estendida e envio em 24h úteis.',
      storeId: 'store_1',
      storeName: 'Ferramentas PRO Oficial',
      storeLogo: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=150&q=80',
      storeRating: 4.9,
      storeVerified: true,
      categoryId: cat.id,
      categorySlug: cat.slug,
      categoryName: cat.name,
      price: priceNum,
      oldPrice: oldPriceNum,
      discountPercentage: discount > 0 ? discount : 20,
      rating: 5.0,
      reviewCount: 1,
      salesCount: 0,
      stock: parseInt(newStock) || 50,
      sku: newSku || `SKU-${Date.now()}`,
      images: [newImage],
      isFlashDeal: false,
      shipping: {
        freeShipping: true,
        standardPrice: 0.00,
        expressPrice: 14.90,
        estimatedDaysMin: 2,
        estimatedDaysMax: 5,
      },
      tags: ['Lançamento', 'Garantia PRO'],
      specifications: [
        { label: 'Garantia', value: '12 meses direto de fábrica' },
        { label: 'Condição', value: 'Novo Lacrado' },
      ],
      featured: false,
    });

    setIsAddModalOpen(false);
    addToast({
      type: 'success',
      title: 'Produto Cadastrado!',
      message: `${newName} já está disponível para venda na loja.`,
    });

    setNewName('');
    setNewPrice('');
    setNewOldPrice('');
    setNewSku('');
    setNewDesc('');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20 md:pb-12">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Seller Banner Header */}
        <div className="bg-slate-950 text-white p-6 rounded-3xl border border-slate-800 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <StoreIcon className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h1 className="text-xl font-black">Painel do Vendedor</h1>
                <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  Loja Oficial Pro
                </span>
              </div>
              <p className="text-xs text-slate-400">Gerencie estoque, pedidos e ofertas em tempo real</p>
            </div>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-brand text-white font-extrabold text-xs px-5 py-3 rounded-2xl hover:bg-brand-600 transition-colors flex items-center gap-2 shadow-glow"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Novo Produto</span>
          </button>
        </div>

        {/* METRICS CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Receita Total</span>
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-lg sm:text-2xl font-black text-slate-900">
              {formatCurrency(totalRevenue)}
            </div>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
              +18.4% este mês
            </span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Total de Pedidos</span>
              <ShoppingBag className="w-4 h-4 text-brand" />
            </div>
            <div className="text-lg sm:text-2xl font-black text-slate-900">
              {sellerOrders.length + 84}
            </div>
            <span className="text-[10px] text-brand font-bold bg-rose-50 px-1.5 py-0.5 rounded">
              12 aguardando envio
            </span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Produtos Vendidos</span>
              <TrendingUp className="w-4 h-4 text-pulse-cyan" />
            </div>
            <div className="text-lg sm:text-2xl font-black text-slate-900">
              {formatCompactNumber(totalSalesCount)}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">98.5% positivos</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Catálogo Ativo</span>
              <Package className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-lg sm:text-2xl font-black text-slate-900">
              {sellerProducts.length} itens
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">Estoque saudável</span>
          </div>
        </div>

        {/* TABS CONTROLLER */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto no-scrollbar pb-2">
          {[
            { id: 'dashboard', label: 'Visão Geral' },
            { id: 'products', label: 'Gerenciar Produtos' },
            { id: 'orders', label: 'Pedidos & Envios' },
            { id: 'inventory', label: 'Controle de Estoque' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-colors ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: PRODUCTS MANAGER */}
        {(activeTab === 'dashboard' || activeTab === 'products') && (
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Catálogo de Produtos da Loja</h3>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-slate-800"
              >
                + Adicionar
              </button>
            </div>

            <div className="divide-y divide-slate-100 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 font-semibold border-b border-slate-100">
                    <th className="pb-2">Produto</th>
                    <th className="pb-2">Preço</th>
                    <th className="pb-2">Estoque</th>
                    <th className="pb-2">Vendas</th>
                    <th className="pb-2 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sellerProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-100"
                        />
                        <div className="min-w-0 max-w-xs">
                          <Link to={`/produto/${p.slug}`} className="font-bold text-slate-900 line-clamp-1 hover:text-brand">
                            {p.name}
                          </Link>
                          <span className="text-[10px] text-slate-400">{p.sku}</span>
                        </div>
                      </td>

                      <td className="py-3 font-bold text-slate-900">
                        {formatCurrency(p.price)}
                      </td>

                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.stock < 10 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {p.stock} un
                        </span>
                      </td>

                      <td className="py-3 text-slate-600 font-medium">
                        {p.salesCount}
                      </td>

                      <td className="py-3 text-right">
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                          aria-label="Excluir produto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGER */}
        {activeTab === 'orders' && (
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Gerenciador de Pedidos Recebidos</h3>

            {orders.length > 0 ? (
              <div className="space-y-3">
                {orders.map((o) => (
                  <div key={o.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{o.orderNumber}</span>
                        <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {o.status}
                        </span>
                      </div>
                      <p className="text-slate-500 mt-1">Cliente: {o.shippingAddress.recipientName} • Total: {formatCurrency(o.total)}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateOrderStatus(o.id, 'shipped')}
                        className="bg-brand text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-brand-600"
                      >
                        Marcar como Enviado
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-8">Nenhum pedido pendente de envio.</p>
            )}
          </div>
        )}

        {/* TAB 3: INVENTORY */}
        {activeTab === 'inventory' && (
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Alerta de Estoque Crítico</h3>

            <div className="space-y-2">
              {sellerProducts.map((p) => (
                <div key={p.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <p className="font-bold text-slate-900 line-clamp-1">{p.name}</p>
                      <p className="text-[10px] text-slate-400">SKU: {p.sku}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">{p.stock} unidades disponíveis</span>
                    <button
                      onClick={() => updateProduct(p.id, { stock: p.stock + 20 })}
                      className="bg-slate-900 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg"
                    >
                      + Repor 20
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODAL: ADD PRODUCT */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Cadastrar Novo Produto">
        <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nome do Produto</label>
            <input
              type="text"
              required
              placeholder="Ex: Parafusadeira 20V com Bateria Extra"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Preço de Venda (R$)</label>
              <input
                type="text"
                required
                placeholder="Ex: 89,90"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Preço Original Riscado</label>
              <input
                type="text"
                placeholder="Ex: 199,00"
                value={newOldPrice}
                onChange={(e) => setNewOldPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Categoria</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Estoque Inicial</label>
              <input
                type="number"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">URL da Imagem</label>
            <input
              type="url"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-brand text-white font-bold py-3 rounded-2xl hover:bg-brand-600 transition-colors text-sm shadow-glow mt-2"
          >
            Publicar Produto na Loja
          </button>
        </form>
      </Modal>
    </div>
  );
};
