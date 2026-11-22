import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { loadProducts } from '../services/mockApi.js';

const ProductsContext = createContext(null);

// One shared source of truth for catalogue data: listings, details, cart and
// checkout all read the same products (FR08).
export function ProductsProvider({ children }) {
  const [state, setState] = useState({ products: [], loading: true, error: null });
  const requestId = useRef(0);

  // silent = keep showing current data while refreshing (used after stock changes)
  const reload = useCallback(async ({ silent = false } = {}) => {
    const id = ++requestId.current;
    if (!silent) setState((current) => ({ ...current, loading: true, error: null }));
    try {
      const products = await loadProducts();
      if (id === requestId.current) setState({ products, loading: false, error: null });
    } catch (error) {
      if (id === requestId.current) {
        setState((current) => ({ ...current, loading: false, error: error instanceof Error ? error : new Error('Unable to load products.') }));
      }
    }
  }, []);

  useEffect(() => {
    reload();
    return () => { requestId.current += 1; }; // ignore results after unmount
  }, [reload]);

  const value = useMemo(() => ({ ...state, reload }), [state, reload]);
  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) throw new Error('useProducts must be used within ProductsProvider');
  return context;
}
