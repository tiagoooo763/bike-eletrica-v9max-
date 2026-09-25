import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { CartItem, Coupon, Product, ProductVariant } from '../types';
import { useToast } from './ToastContext';

interface CartContextData {
  items: CartItem[];
  appliedCoupon: Coupon | null;
  totalItemsCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  toggleSelectItem: (itemId: string) => void;
  selectAll: (selected: boolean) => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { addToast } = useToast();
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('@PulseShop:cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    const saved = localStorage.getItem('@PulseShop:coupon');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem('@PulseShop:cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('@PulseShop:coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('@PulseShop:coupon');
    }
  }, [appliedCoupon]);

  const totalItemsCount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const addItem = (product: Product, quantity = 1, variant?: ProductVariant) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.productId === product.id && i.variantId === variant?.id
      );

      const price = variant?.price ?? product.price;

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        const newItem: CartItem = {
          id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          productId: product.id,
          product,
          variantId: variant?.id,
          variantName: variant?.name,
          price,
          quantity,
          selected: true,
        };
        return [...prev, newItem];
      }
    });

    addToast({
      type: 'success',
      title: 'Produto Adicionado!',
      message: `${product.name.slice(0, 35)}... foi para o carrinho.`,
    });
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    addToast({
      type: 'info',
      message: 'Item removido do carrinho.',
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const toggleSelectItem = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const selectAll = (selected: boolean) => {
    setItems((prev) => prev.map((item) => ({ ...item, selected })));
  };

  const applyCoupon = (coupon: Coupon) => {
    setAppliedCoupon(coupon);
    addToast({
      type: 'success',
      title: 'Cupom Aplicado!',
      message: `${coupon.title} ativado com sucesso.`,
    });
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast({
      type: 'info',
      message: 'Cupom removido.',
    });
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  // Calculations for selected items
  const selectedItems = useMemo(() => items.filter((i) => i.selected), [items]);

  const subtotal = useMemo(() => {
    return selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [selectedItems]);

  const discount = useMemo(() => {
    if (!appliedCoupon || subtotal < appliedCoupon.minOrderValue) return 0;
    if (appliedCoupon.discountType === 'fixed') {
      return Math.min(appliedCoupon.discountValue, subtotal);
    } else {
      const val = (subtotal * appliedCoupon.discountValue) / 100;
      return appliedCoupon.maxDiscount ? Math.min(val, appliedCoupon.maxDiscount) : val;
    }
  }, [appliedCoupon, subtotal]);

  const shipping = useMemo(() => {
    if (selectedItems.length === 0) return 0;
    const hasFreeShipping = selectedItems.every((i) => i.product.shipping.freeShipping);
    if (hasFreeShipping || subtotal > 150) return 0;
    return 3.90; // Taxa de entrega reduzida promocional
  }, [selectedItems, subtotal]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discount + shipping);
  }, [subtotal, discount, shipping]);

  return (
    <CartContext.Provider
      value={{
        items,
        appliedCoupon,
        totalItemsCount,
        subtotal,
        discount,
        shipping,
        total,
        addItem,
        removeItem,
        updateQuantity,
        toggleSelectItem,
        selectAll,
        applyCoupon,
        removeCoupon,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
