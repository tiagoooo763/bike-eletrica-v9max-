import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Store as StoreIcon, 
  Package, 
  TrendingUp, 
  DollarSign, 
  Flame, 
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Search
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { mockUsers } from '../../data/mockData';
import { formatCurrency, formatCompactNumber } from '../../utils/formatters';
import { Header } from '../../components/layout/Header';

export const AdminDashboardPage: React.FC = () => {
  const { products, stores, categories, banners, orders } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'sellers' | 'products' | 'categories'>('overview');

  const totalGMV = orders.reduce((acc, o) => acc + o.total, 0) + 148900.00;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-20 md:pb-12">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Admin Header */}
        <div className="bg-slate-950 text-white p-6 rounded-3xl border border-slate-800 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-pulse-cyan">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h1 className="text-xl font-black">Painel Administrativo PulseShop</h1>
                <span className="bg-pulse-cyan text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-400">Controle global de vendedores, usuários, moderação e métricas da plataforma</p>
            </div>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">GMV da Plataforma</span>
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-lg sm:text-2xl font-black text-slate-900">
              {formatCurrency(totalGMV)}
            </div>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
              +24.8% YoY
            </span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Usuários Cadastrados</span>
              <Users className="w-4 h-4 text-brand" />
            </div>
            <div className="text-lg sm:text-2xl font-black text-slate-900">
              {formatCompactNumber(124800)}
            </div>
            <span className="text-[10px] text-brand font-medium">94% compradores ativos</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Lojas Verificadas</span>
              <StoreIcon className="w-4 h-4 text-sky-500" />
            </div>
            <div className="text-lg sm:text-2xl font-black text-slate-900">
              {stores.length + 42}
            </div>
            <span className="text-[10px] text-sky-600 font-bold bg-sky-50 px-1.5 py-0.5 rounded">
              100% auditadas
            </span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Total de Produtos</span>
              <Package className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-lg sm:text-2xl font-black text-slate-900">
              {products.length * 25}
            </div>
            <span className="text-[10px] text-slate-500">Em 8 categorias</span>
          </div>
        </div>

        {/* TABS */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto no-scrollbar pb-2">
          {[
            { id: 'overview', label: 'Visão Geral & Lojas' },
            { id: 'users', label: 'Gerenciar Usuários' },
            { id: 'categories', label: 'Departamentos' },
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

        {/* TAB: OVERVIEW & STORES */}
        {activeTab === 'overview' && (
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Lojas Parceiras Registradas</h3>

            <div className="divide-y divide-slate-100">
              {stores.map((st) => (
                <div key={st.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img src={st.logo} alt={st.name} className="w-11 h-11 rounded-2xl object-cover border" />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-slate-900">{st.name}</span>
                        {st.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />}
                      </div>
                      <p className="text-slate-500">{st.description.slice(0, 70)}...</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-bold text-slate-900">{formatCompactNumber(st.salesCount)} vendas</span>
                    <p className="text-[10px] text-emerald-600 font-bold">Status: Ativo</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: USERS */}
        {activeTab === 'users' && (
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Usuários da Plataforma</h3>

            <div className="divide-y divide-slate-100">
              {mockUsers.map((u) => (
                <div key={u.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-bold text-slate-900">{u.name}</p>
                      <p className="text-slate-400">{u.email}</p>
                    </div>
                  </div>

                  <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-full text-[10px] capitalize">
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Departamentos e Taxonomias</h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {categories.map((c) => (
                <div key={c.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                  <p className="font-bold text-slate-900">{c.name}</p>
                  <p className="text-slate-500 mt-1">{c.itemCount} produtos listados</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
