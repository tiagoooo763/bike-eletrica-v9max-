import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { useToast } from './ToastContext';

interface FavoritesContextData {
  favorites: string[]; // product IDs
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextData>({} as FavoritesContextData);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { addToast } = useToast();
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('@PulseShop:favorites');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('@PulseShop:favorites', JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = (productId: string) => favorites.includes(productId);

  const toggleFavorite = (product: Product) => {
    setFavorites((prev) => {
      const exists = prev.includes(product.id);
      if (exists) {
        addToast({
          type: 'info',
          message: 'Removido dos favoritos.',
        });
        return prev.filter((id) => id !== product.id);
      } else {
        addToast({
          type: 'success',
          title: 'Salvo!',
          message: 'Produto adicionado aos seus favoritos.',
        });
        return [...prev, product.id];
      }
    });
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
