import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'fami-sports-cart';
const CartContext = createContext(null);

function readStoredCart() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  const parsed = JSON.parse(stored);
  return Array.isArray(parsed) ? parsed : [];
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo(() => ({
    items,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    addItem(productId, quantity = 1, options = {}) {
      setItems((current) => {
        const existing = current.find((item) => item.productId === productId);
        if (existing) {
          return current.map((item) => (
            item.productId === productId
              ? { ...item, quantity: Math.min(5, item.quantity + quantity), options }
              : item
          ));
        }
        return [...current, { productId, quantity: Math.min(5, quantity), options }];
      });
    },
    updateQuantity(productId, quantity) {
      setItems((current) => current
        .map((item) => item.productId === productId ? { ...item, quantity: Math.min(5, Math.max(0, quantity)) } : item)
        .filter((item) => item.quantity > 0));
    },
    removeItem(productId) {
      setItems((current) => current.filter((item) => item.productId !== productId));
    },
    clearCart() {
      setItems([]);
    },
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
