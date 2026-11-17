import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { products } from '../data/products.js';

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
  const [message, setMessage] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo(() => ({
    items,
    message,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    addItem(productId, quantity = 1, options = {}) {
      const product = products.find((item) => item.id === productId);
      if (!product || product.stock === 0) {
        setMessage('This product is out of stock.');
        return;
      }
      setItems((current) => {
        const existing = current.find((item) => item.productId === productId);
        const nextQuantity = Math.min(5, product.stock, (existing?.quantity || 0) + quantity);
        if (nextQuantity <= (existing?.quantity || 0)) {
          setMessage(`Only ${product.stock} unit${product.stock === 1 ? '' : 's'} available.`);
          return current;
        }
        setMessage('');
        if (existing) {
          return current.map((item) => (
            item.productId === productId
              ? { ...item, quantity: nextQuantity, options }
              : item
          ));
        }
        return [...current, { productId, quantity: nextQuantity, options }];
      });
    },
    updateQuantity(productId, quantity) {
      const product = products.find((item) => item.id === productId);
      const limit = Math.min(5, product?.stock || 0);
      if (quantity > limit) setMessage(`Only ${limit} unit${limit === 1 ? '' : 's'} available.`);
      else setMessage('');
      setItems((current) => current
        .map((item) => item.productId === productId ? { ...item, quantity: Math.min(limit, Math.max(0, quantity)) } : item)
        .filter((item) => item.quantity > 0));
    },
    removeItem(productId) {
      setItems((current) => current.filter((item) => item.productId !== productId));
    },
    clearCart() {
      setItems([]);
      setMessage('');
    },
  }), [items, message]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
