import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Heart, 
  MapPin, 
  Ticket, 
  Settings, 
  LogOut, 
  Store, 
  ShieldCheck, 
  ChevronRight, 
  Plus, 
  User as UserIcon,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { Modal } from '../components/common/Modal';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, role, switchRole, logout } = useAuth();
  const { orders, userAddresses, addAddress, coupons } = useStore();
  const { favorites } = useFavorites();

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isCouponsModalOpen, setIsCouponsModalOpen] = useState(false);

  // Address form
  const [newRecipient, setNewRecipient] = useState('');
  const [newCep, setNewCep] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newNeighborhood, setNewNeighborhood] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('SP');

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    addAddress({
      userId: user?.id || 'usr_customer_1',
      recipientName: newRecipient,
      cep: newCep,
      street: newStreet,
      number: newNumber,
      neighborhood: newNeighborhood,
      city: newCity,
      state: newState,
      isDefault: false,
    });
    setIsAddressModalOpen(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-sm space-y-4">
          <UserIcon className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Você não está conectado</h2>
          <p className="text-xs text-slate-500">Faça login para gerenciar sua conta e pedidos.</p>
          <Link to="/login" className="inline-block bg-brand text-white font-bold text-xs px-5 py-2.5 rounded-xl">
            Fazer Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 md:pb-0">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* User Profile Header Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-rose-100"
            />
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h1 className="text-lg font-black text-slate-900">{user.name}</h1>
                <span className="bg-rose-50 text-brand text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">
                  {role}
                </span>
              </div>
              <p className="text-xs text-slate-500">{user.email}</p>
              {user.phone && <p className="text-xs text-slate-400">{user.phone}</p>}
            </div>
          </div>

          {/* Quick Role Switch for testing */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 p-1.5 rounded-2xl text-xs">
            <span className="text-[11px] font-semibold text-slate-500 pl-1">Alternar:</span>
            <button
              onClick={() => switchRole('customer')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                role === 'customer' ? 'bg-brand text-white' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Comprador
            </button>
            <button
              onClick={() => switchRole('seller')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                role === 'seller' ? 'bg-amber-500 text-slate-950' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Vendedor
            </button>
            <button
              onClick={() => switchRole('admin')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                role === 'admin' ? 'bg-pulse-cyan text-slate-950' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <Link
            to="/pedidos"
            className="bg-white p-4 rounded-2xl border border-slate-200 text-center hover:border-brand/40 transition-all group"
          >
            <span className="text-lg sm:text-2xl font-black text-slate-900 group-hover:text-brand">
              {orders.length}
            </span>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Meus Pedidos</p>
          </Link>

          <Link
            to="/favoritos"
            className="bg-white p-4 rounded-2xl border border-slate-200 text-center hover:border-brand/40 transition-all group"
          >
            <span className="text-lg sm:text-2xl font-black text-slate-900 group-hover:text-brand">
              {favorites.length}
            </span>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Favoritos</p>
          </Link>

          <button
            onClick={() => setIsCouponsModalOpen(true)}
            className="bg-white p-4 rounded-2xl border border-slate-200 text-center hover:border-brand/40 transition-all group"
          >
            <span className="text-lg sm:text-2xl font-black text-slate-900 group-hover:text-brand">
              {coupons.length}
            </span>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Cupons Ativos</p>
          </button>
        </div>

        {/* Management Menu */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-xs">
          <Link
            to="/pedidos"
            className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-brand flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-800">Meus Pedidos & Rastreamento</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>

          <Link
            to="/favoritos"
            className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
                <Heart className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-800">Lista de Favoritos</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>

          <button
            onClick={() => setIsAddressModalOpen(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-800">
                Endereços Salvos ({userAddresses.length})
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Seller Panel Direct Link */}
          {role === 'seller' && (
            <Link
              to="/vendedor"
              className="flex items-center justify-between p-4 bg-amber-50/50 hover:bg-amber-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Store className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-amber-950">Painel do Vendedor</span>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-700" />
            </Link>
          )}

          {/* Admin Panel Direct Link */}
          {role === 'admin' && (
            <Link
              to="/admin"
              className="flex items-center justify-between p-4 bg-sky-50/50 hover:bg-sky-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-sky-950">Painel do Administrador</span>
              </div>
              <ChevronRight className="w-4 h-4 text-sky-700" />
            </Link>
          )}

          <button
            onClick={logout}
            className="w-full flex items-center justify-between p-4 hover:bg-rose-50/50 transition-colors text-left text-rose-600"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold">Sair da Conta</span>
            </div>
          </button>
        </div>
      </main>

      {/* Address Modal */}
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        title="Gerenciar Endereços"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            {userAddresses.map((addr) => (
              <div key={addr.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <p className="font-bold text-slate-900">{addr.recipientName}</p>
                <p className="text-slate-600">{addr.street}, {addr.number} {addr.complement}</p>
                <p className="text-slate-500">{addr.neighborhood} - {addr.city}/{addr.state} • CEP {addr.cep}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddAddress} className="space-y-2.5 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900">+ Adicionar Novo Endereço</h4>
            <input
              type="text"
              required
              placeholder="Nome do Destinatário"
              value={newRecipient}
              onChange={(e) => setNewRecipient(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                placeholder="CEP"
                value={newCep}
                onChange={(e) => setNewCep(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
              />
              <input
                type="text"
                required
                placeholder="Rua"
                value={newStreet}
                onChange={(e) => setNewStreet(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                placeholder="Número"
                value={newNumber}
                onChange={(e) => setNewNumber(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
              />
              <input
                type="text"
                required
                placeholder="Bairro"
                value={newNeighborhood}
                onChange={(e) => setNewNeighborhood(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-slate-800"
            >
              Salvar Endereço
            </button>
          </form>
        </div>
      </Modal>

      {/* Coupons Modal */}
      <Modal
        isOpen={isCouponsModalOpen}
        onClose={() => setIsCouponsModalOpen(false)}
        title="Meus Cupons"
      >
        <div className="space-y-3">
          {coupons.map((c) => (
            <div key={c.id} className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex justify-between items-center">
              <div>
                <p className="font-bold text-amber-950 text-xs">{c.title}</p>
                <p className="text-[11px] text-amber-800">{c.description}</p>
                <p className="text-[10px] text-amber-600 mt-0.5">Cupom: <strong className="font-mono">{c.code}</strong></p>
              </div>
              <span className="bg-amber-200/80 text-amber-900 text-[10px] font-bold px-2 py-1 rounded-md">
                Disponível
              </span>
            </div>
          ))}
        </div>
      </Modal>

      <Footer />
      <BottomNavigation />
    </div>
  );
};
