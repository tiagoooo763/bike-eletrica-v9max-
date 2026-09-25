import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ChatConversation, ChatMessage } from '../types';

interface ChatContextData {
  conversations: ChatConversation[];
  activeConversation: ChatConversation | null;
  setActiveConversationId: (id: string | null) => void;
  sendMessage: (storeId: string, text: string, productContext?: ChatMessage['product']) => void;
  getConversationByStoreId: (storeId: string) => ChatConversation | undefined;
  unreadTotal: number;
}

const ChatContext = createContext<ChatContextData>({} as ChatContextData);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<ChatConversation[]>(() => {
    const saved = localStorage.getItem('@PulseShop:chat');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [
      {
        id: 'conv_1',
        storeId: 'store_1',
        storeName: 'Ferramentas PRO Oficial',
        storeLogo: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=150&q=80',
        lastMessage: 'Olá! Sim, o kit de 48V acompanha 2 baterias de lítio e carregador bivolt.',
        lastMessageTime: '10:45',
        unreadCount: 1,
        messages: [
          {
            id: 'm_1',
            conversationId: 'conv_1',
            senderId: 'store_1',
            senderRole: 'store',
            text: 'Olá! Bem-vindo à Ferramentas PRO Oficial. Como podemos te ajudar hoje?',
            timestamp: '10:40',
          },
          {
            id: 'm_2',
            conversationId: 'conv_1',
            senderId: 'usr_customer_1',
            senderRole: 'user',
            text: 'Boa tarde! O kit 48V vem com quantas baterias e qual a voltagem do carregador?',
            timestamp: '10:42',
          },
          {
            id: 'm_3',
            conversationId: 'conv_1',
            senderId: 'store_1',
            senderRole: 'store',
            text: 'Olá! Sim, o kit de 48V acompanha 2 baterias de lítio e carregador bivolt automático (110V/220V).',
            timestamp: '10:45',
          }
        ]
      }
    ];
  });

  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('@PulseShop:chat', JSON.stringify(conversations));
  }, [conversations]);

  const activeConversation = conversations.find((c) => c.id === activeId) || null;

  const unreadTotal = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const getConversationByStoreId = (storeId: string) => {
    return conversations.find((c) => c.storeId === storeId);
  };

  const sendMessage = (storeId: string, text: string, productContext?: ChatMessage['product']) => {
    const existing = getConversationByStoreId(storeId);
    const nowTime = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date());

    if (existing) {
      const newMsg: ChatMessage = {
        id: `msg_${Date.now()}`,
        conversationId: existing.id,
        senderId: 'usr_customer_1',
        senderRole: 'user',
        text,
        timestamp: nowTime,
        product: productContext,
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                lastMessage: text,
                lastMessageTime: nowTime,
                messages: [...c.messages, newMsg],
              }
            : c
        )
      );

      // Auto-reply simulation from seller after 1.5 seconds
      setTimeout(() => {
        const replyMsg: ChatMessage = {
          id: `msg_reply_${Date.now()}`,
          conversationId: existing.id,
          senderId: storeId,
          senderRole: 'store',
          text: 'Recebemos sua mensagem! Nosso atendente já está conferindo seu pedido no sistema. Envio imediato em 24h úteis!',
          timestamp: new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date()),
        };

        setConversations((prev) =>
          prev.map((c) =>
            c.id === existing.id
              ? {
                  ...c,
                  lastMessage: replyMsg.text,
                  lastMessageTime: replyMsg.timestamp,
                  messages: [...c.messages, replyMsg],
                }
              : c
          )
        );
      }, 1500);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversation,
        setActiveConversationId: setActiveId,
        sendMessage,
        getConversationByStoreId,
        unreadTotal,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
