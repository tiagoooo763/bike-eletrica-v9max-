import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Send, Store, ArrowLeft, CheckCheck, Clock, ShoppingBag } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useStore } from '../context/StoreContext';
import { Header } from '../components/layout/Header';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { formatCurrency } from '../utils/formatters';

export const ChatPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const storeIdParam = searchParams.get('storeId');
  const productIdParam = searchParams.get('productId');

  const { conversations, sendMessage } = useChat();
  const { stores, getProductById } = useStore();

  const [selectedStoreId, setSelectedStoreId] = useState<string>(
    storeIdParam || conversations[0]?.storeId || 'store_1'
  );
  const [inputMessage, setInputMessage] = useState('');

  const currentStore = stores.find((s) => s.id === selectedStoreId) || stores[0];
  const currentConversation = conversations.find((c) => c.storeId === selectedStoreId);
  const activeProduct = productIdParam ? getProductById(productIdParam) : undefined;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    sendMessage(
      selectedStoreId,
      inputMessage,
      activeProduct
        ? {
            id: activeProduct.id,
            name: activeProduct.name,
            image: activeProduct.images[0],
            price: activeProduct.price,
          }
        : undefined
    );
    setInputMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between pb-16 md:pb-0">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full p-2 sm:p-6 grid grid-cols-12 gap-4">
        {/* CONVERSATION LIST (LEFT) */}
        <div className="col-span-12 md:col-span-4 bg-white rounded-3xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between h-[600px]">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-3">Minhas Conversas</h2>

            <div className="space-y-2">
              {stores.map((st) => {
                const isSelected = st.id === selectedStoreId;
                const conv = conversations.find((c) => c.storeId === st.id);

                return (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStoreId(st.id)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                      isSelected
                        ? 'border-brand bg-rose-50/60 ring-2 ring-brand/20 shadow-xs'
                        : 'border-slate-100 bg-white hover:border-slate-200'
                    }`}
                  >
                    <img
                      src={st.logo}
                      alt={st.name}
                      className="w-11 h-11 rounded-2xl object-cover border border-slate-100 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{st.name}</h4>
                        <span className="text-[10px] text-slate-400">
                          {conv?.lastMessageTime || '10:45'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {conv?.lastMessage || 'Clique para iniciar atendimento...'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* CHAT MESSAGES THREAD (RIGHT) */}
        <div className="col-span-12 md:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between h-[600px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-3">
              <img
                src={currentStore.logo}
                alt={currentStore.name}
                className="w-10 h-10 rounded-2xl object-cover border border-slate-200"
              />
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">{currentStore.name}</h3>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full" /> Online agora
                </span>
              </div>
            </div>

            <Link
              to={`/loja/${currentStore.id}`}
              className="text-xs font-bold text-brand bg-white border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-50"
            >
              Ver Loja
            </Link>
          </div>

          {/* Product Attached Banner if arriving from product page */}
          {activeProduct && (
            <div className="bg-rose-50/80 p-2.5 mx-4 mt-3 rounded-2xl border border-rose-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={activeProduct.images[0]}
                  alt={activeProduct.name}
                  className="w-10 h-10 rounded-xl object-cover shrink-0"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900 line-clamp-1">{activeProduct.name}</p>
                  <p className="text-xs text-brand font-black">
                    {formatCurrency(activeProduct.price)}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-brand bg-white px-2 py-1 rounded-md border border-rose-200">
                Produto em Dúvida
              </span>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {currentConversation?.messages.map((msg) => {
              const isUser = msg.senderRole === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-xs sm:max-w-md p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-brand text-white rounded-br-none'
                        : 'bg-slate-100 text-slate-800 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 px-1">
                    <span>{msg.timestamp}</span>
                    {isUser && <CheckCheck className="w-3 h-3 text-brand" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Digite sua mensagem para o vendedor..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white"
            />
            <button
              type="submit"
              className="bg-brand text-white p-2.5 rounded-2xl hover:bg-brand-600 transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};
