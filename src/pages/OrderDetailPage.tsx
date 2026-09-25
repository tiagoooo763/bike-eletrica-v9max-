import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Truck, Package, Clock, ShieldCheck, MapPin, CreditCard } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../utils/formatters';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { BottomNavigation } from '../components/layout/BottomNavigation';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders } = useStore();

  const order = orders.find((o) => o.id === id) || orders[0];

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <p className="text-sm text-slate-500">Pedido não encontrado.</p>
          <Link to="/pedidos" className="text-brand font-bold text-xs underline">
            Voltar para Meus Pedidos
          </Link>
        </div>
      </div>
    );
  }

  const steps = [
    { title: 'Pedido Realizado', date: new Date(order.createdAt).toLocaleDateString('pt-BR'), done: true },
    { title: 'Pagamento Confirmado', date: 'Instantâneo', done: true },
    { title: 'Em Separação no Centro de Distribuição', date: 'Hoje', done: order.status !== 'pending_payment' },
    { title: 'Em Trânsito com a Transportadora', date: 'Previsão 2-4 dias', done: order.status === 'shipped' || order.status === 'delivered' },
    { title: 'Entregue no Endereço', date: 'Pendente', done: order.status === 'delivered' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-0">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Back Link */}
        <Link
          to="/pedidos"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar aos Pedidos</span>
        </Link>

        {/* Order Header Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-semibold text-slate-400">Detalhes do Pedido</span>
              <h1 className="text-xl font-black text-slate-900">{order.orderNumber}</h1>
              <p className="text-xs text-slate-500">
                Criado em {new Date(order.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400">Valor Total</span>
              <p className="text-lg font-black text-brand">{formatCurrency(order.total)}</p>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Linha do Tempo de Rastreamento
              </h3>
              {order.trackingCode && (
                <span className="text-[11px] font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  Rastreio: {order.trackingCode}
                </span>
              )}
            </div>

            <div className="space-y-4 pl-3 border-l-2 border-slate-200 my-4">
              {steps.map((step, idx) => (
                <div key={idx} className="relative pl-6">
                  <div
                    className={`absolute -left-[19px] top-0.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                      step.done
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-slate-300'
                    }`}
                  >
                    {step.done && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                  </div>
                  <p className={`text-xs font-bold ${step.done ? 'text-slate-900' : 'text-slate-400'}`}>
                    {step.title}
                  </p>
                  <p className="text-[10px] text-slate-400">{step.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products in this Order */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Itens do Pedido
          </h3>

          <div className="divide-y divide-slate-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-100"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900">{item.productName}</h4>
                    <p className="text-[11px] text-slate-500">Loja: {item.storeName}</p>
                    <p className="text-[11px] text-slate-500">Quantidade: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-black text-slate-900">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Address & Payment Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <MapPin className="w-4 h-4 text-brand" />
              <span>Endereço de Envio</span>
            </div>
            <p className="text-slate-700 font-semibold">{order.shippingAddress.recipientName}</p>
            <p className="text-slate-600">
              {order.shippingAddress.street}, {order.shippingAddress.number} {order.shippingAddress.complement}
            </p>
            <p className="text-slate-500">
              {order.shippingAddress.neighborhood} - {order.shippingAddress.city}/{order.shippingAddress.state} • CEP {order.shippingAddress.cep}
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <CreditCard className="w-4 h-4 text-brand" />
              <span>Dados de Pagamento</span>
            </div>
            <p className="text-slate-700 font-semibold uppercase">
              Método: {order.paymentMethod === 'pix' ? 'PIX Instantâneo' : 'Cartão de Crédito'}
            </p>
            <p className="text-slate-600">Subtotal: {formatCurrency(order.subtotal)}</p>
            <p className="text-slate-600">Frete: {formatCurrency(order.shippingCost)}</p>
            {order.discount > 0 && (
              <p className="text-emerald-600 font-bold">Desconto: -{formatCurrency(order.discount)}</p>
            )}
            <p className="text-brand font-black text-sm pt-1 border-t border-slate-100">
              Total Pago: {formatCurrency(order.total)}
            </p>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNavigation />
    </div>
  );
};
