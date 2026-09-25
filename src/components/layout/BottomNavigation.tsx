import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Video, Radio, MessageCircle, User } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export const BottomNavigation: React.FC = () => {
  const { unreadTotal } = useChat();
  const location = useLocation();

  // Hide global bottom navigation on product page (because product page has its own specialized bottom buy bar)
  if (location.pathname.startsWith('/produto/') || location.pathname.startsWith('/checkout')) {
    return null;
  }

  const navItems = [
    { to: '/', label: 'Início', icon: Home },
    { to: '/videos', label: 'Vídeos', icon: Video },
    { to: '/live', label: 'Live', icon: Radio, isLive: true },
    { to: '/chat', label: 'Mensagens', icon: MessageCircle, badge: unreadTotal },
    { to: '/perfil', label: 'Perfil', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 md:hidden pb-safe shadow-lg">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
                  isActive ? 'text-brand font-bold' : 'text-slate-500 font-medium hover:text-slate-800'
                }`
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.isLive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-pulse-pink rounded-full animate-ping" />
                )}
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2.5 bg-brand text-white text-[9px] font-bold px-1 rounded-full min-w-4 h-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};
