import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, Truck, CheckCircle2, ChevronRight, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/formatters';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { OrderStatus } from '../types';

export const OrdersPage: React.FC = () => {
  const { orders } = useStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'all') return true;
    return o.status === filterStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending_payment':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Aguardando Pagamento</span>;
      case 'confirmed':
        return <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Pagamento Confirmado</span>;
      case 'preparing':
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Em Separação</span>;
      case 'shipped':
        return <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Enviado / Em Trânsito</span>;
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Entregue</span>;
      case 'cancelled':
        return <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Cancelado</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-0">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">Meus Pedidos</h1>

        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'confirmed', label: 'Confirmados' },
            { id: 'preparing', label: 'Em Preparação' },
            { id: 'shipped', label: 'Enviados' },
            { id: 'delivered', label: 'Entregues' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                filterStatus === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4"
              >
                {/* Header: Order Number & Status */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-bold text-slate-900">{order.orderNumber}</span>
                    <p className="text-[10px] text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR')} às {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div>{getStatusBadge(order.status)}</div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-100"
                        />
                        <div>
                          <p className="font-semibold text-slate-900 line-clamp-1">{item.productName}</p>
                          <p className="text-[10px] text-slate-500">
                            Loja: {item.storeName} • Qtd: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900 shrink-0">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer: Tracking & Details Link */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                  <div>
                    <span className="text-slate-500">Total: </span>
                    <strong className="text-brand font-black text-sm">{formatCurrency(order.total)}</strong>
                  </div>

                  <Link
                    to={`/pedido/${order.id}`}
                    className="flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-brand transition-colors"
                  >
                    <span>Ver Detalhes do Pedido</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-sm mx-auto space-y-3">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">Nenhum pedido encontrado</h3>
            <p className="text-xs text-slate-500">Você ainda não realizou compras nesta categoria.</p>
            <Link to="/" className="inline-block bg-brand text-white font-bold text-xs px-5 py-2.5 rounded-xl">
              Explorar Ofertas
            </Link>
          </div>
        )}
      </main>

      <Footer />
      <BottomNavigation />
    </div>
  );
};
