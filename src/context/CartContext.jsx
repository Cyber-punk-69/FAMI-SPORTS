import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { validateQuantity } from '../rules/quantityRule.js';
import { applyFixes, buildCartLines, cartTotals, sanitizeStoredCart } from '../utils/cart.js';
import { readJson, writeJson } from '../utils/storage.js';
import { useProducts } from './ProductsContext.jsx';

const STORAGE_KEY = 'fami-sports-cart';
const CartContext = createContext(null);

function restoreCart() {
  return sanitizeStoredCart(readJson(STORAGE_KEY, []));
}

function defaultOptions(product) {
  return Object.fromEntries(Object.entries(product.options ?? {}).map(([key, values]) => [key, values[0]]));
}

export function CartProvider({ children }) {
  const { products } = useProducts();
  const [restored] = useState(restoreCart);
  const [items, setItems] = useState(restored.items);
  const [notice, setNotice] = useState(
    restored.dropped ? `${restored.dropped} saved cart entr${restored.dropped === 1 ? 'y was' : 'ies were'} invalid and removed.` : '',
  );

  // FR13: save the cart whenever it changes.
  useEffect(() => { writeJson(STORAGE_KEY, items); }, [items]);

  // Re-check the cart against the latest data and rules (restored or stale selections).
  const lines = useMemo(() => buildCartLines(items, products), [items, products]);
  const totals = useMemo(() => cartTotals(lines), [lines]);
  const issues = lines.filter((line) => line.issue);

  const addItem = useCallback((productId, quantity = 1, options) => {
    const product = products.find((entry) => entry.id === productId);
    if (!product) return { ok: false, message: 'This product is no longer available.' };
    const inCart = items.find((item) => item.productId === productId)?.quantity ?? 0;
    const check = validateQuantity(inCart + quantity, product.stock);
    if (!check.valid) {
      const message = inCart
        ? `You already have ${inCart} in your cart. ${check.message}`
        : check.message;
      return { ok: false, message };
    }
    setItems((current) => {
      const existing = current.find((item) => item.productId === productId);
      if (existing) {
        return current.map((item) => (
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity, options: options ?? item.options }
            : item
        ));
      }
      return [...current, { productId, quantity, options: options ?? defaultOptions(product) }];
    });
    return { ok: true, message: `${product.name} added to cart.` };
  }, [items, products]);

  const setQuantity = useCallback((productId, quantity) => {
    setItems((current) => current.map((item) => (item.productId === productId ? { ...item, quantity } : item)));
  }, []);

  const setOption = useCallback((productId, key, value) => {
    setItems((current) => current.map((item) => (
      item.productId === productId ? { ...item, options: { ...item.options, [key]: value } } : item
    )));
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }, []);

  const fixIssues = useCallback(() => {
    setItems((current) => applyFixes(current, buildCartLines(current, products)));
    setNotice('Cart updated to match current availability.');
  }, [products]);

  const clearCart = useCallback(() => { setItems([]); }, []);
  const dismissNotice = useCallback(() => setNotice(''), []);

  const value = useMemo(() => ({
    items, lines, issues, notice, dismissNotice, ...totals,
    addItem, setQuantity, setOption, removeItem, fixIssues, clearCart,
  }), [items, lines, issues, notice, dismissNotice, totals, addItem, setQuantity, setOption, removeItem, fixIssues, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
