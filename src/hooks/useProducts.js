import { useCallback, useEffect, useState } from 'react';
import { loadProducts } from '../services/mockApi.js';

export function useProducts() {
  const [state, setState] = useState({
    products: [],
    loading: true,
    error: null,
  });

  const fetchProducts = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null }));
    try {
      const loadedProducts = await loadProducts();
      setState({ products: loadedProducts, loading: false, error: null });
    } catch (error) {
      setState((current) => ({
        ...current,
        loading: false,
        error: error instanceof Error ? error : new Error('Unable to load products.'),
      }));
    }
  }, []);

  useEffect(() => {
    let active = true;

    loadProducts()
      .then((loadedProducts) => {
        if (active) {
          setState({ products: loadedProducts, loading: false, error: null });
        }
      })
      .catch((error) => {
        if (active) {
          setState((current) => ({
            ...current,
            loading: false,
            error: error instanceof Error ? error : new Error('Unable to load products.'),
          }));
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return { ...state, retry: fetchProducts };
}
