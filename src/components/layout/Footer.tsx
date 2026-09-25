import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Truck, RefreshCw, Headphones } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 pb-20 md:pb-8 pt-12 mt-16">
      {/* Benefit Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 border-b border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-brand shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Envio Garantido</h4>
            <p className="text-slate-400">Rastreamento minuto a minuto</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Compra Protegida</h4>
            <p className="text-slate-400">Seu dinheiro seguro até a entrega</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-pulse-cyan shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Devolução Grátis</h4>
            <p className="text-slate-400">Até 7 dias após o recebimento</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-amber-400 shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Suporte 24/7</h4>
            <p className="text-slate-400">Atendimento humanizado</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* Brand Col */}
        <div className="col-span-2 space-y-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-brand to-pulse-accent rounded-xl flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-black tracking-tight text-white">
              PULSE<span className="text-brand">SHOP</span>
            </span>
          </Link>
          <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
            A plataforma líder em Social Commerce e Marketplace no Brasil. Compre com descontos exclusivos assistindo a vídeos virais e lives de criadores verificados.
          </p>
        </div>

        {/* Categorias */}
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm mb-3">Categorias</h4>
          <ul className="space-y-1.5">
            <li><Link to="/categoria/ferramentas" className="hover:text-white transition-colors">Ferramentas & Kits</Link></li>
            <li><Link to="/categoria/eletronicos" className="hover:text-white transition-colors">Eletrônicos & Áudio</Link></li>
            <li><Link to="/categoria/beleza" className="hover:text-white transition-colors">Beleza & Skincare</Link></li>
            <li><Link to="/categoria/moda-feminina" className="hover:text-white transition-colors">Moda Feminina</Link></li>
            <li><Link to="/categoria/casa-cozinha" className="hover:text-white transition-colors">Casa & Cozinha</Link></li>
          </ul>
        </div>

        {/* Social Commerce */}
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm mb-3">Social Commerce</h4>
          <ul className="space-y-1.5">
            <li><Link to="/videos" className="hover:text-white transition-colors">Feed de Vídeos</Link></li>
            <li><Link to="/live" className="hover:text-white transition-colors">Live Shopping</Link></li>
            <li><Link to="/vendedor" className="hover:text-white transition-colors">Venda na PulseShop</Link></li>
            <li><Link to="/criador/marcosferramentas" className="hover:text-white transition-colors">Portal de Criadores</Link></li>
          </ul>
        </div>

        {/* Institucional */}
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm mb-3">Ajuda & Segurança</h4>
          <ul className="space-y-1.5">
            <li><Link to="/pedidos" className="hover:text-white transition-colors">Rastrear Pedido</Link></li>
            <li><Link to="/perfil" className="hover:text-white transition-colors">Central de Ajuda</Link></li>
            <li><span className="text-slate-500">Termos de Uso</span></li>
            <li><span className="text-slate-500">Privacidade</span></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
        <p>© 2026 PulseShop Marketplace Ltda. Todos os direitos reservados. CNPJ: 00.000.000/0001-00.</p>
        <p className="text-slate-400 font-medium">Plataforma independente de Social Commerce.</p>
      </div>
    </footer>
  );
};
