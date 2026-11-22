import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEFAULT_FILTERS } from '../utils/filterProducts.js';
import { readJson, writeJson } from '../utils/storage.js';

const STORAGE_KEY = 'fami-sports-filters';
const PARAM_NAMES = { search: 'q', category: 'category', ageGroup: 'age', minPrice: 'min', maxPrice: 'max', sort: 'sort', inStockOnly: 'stock' };

function toParams(filters) {
  const params = new URLSearchParams();
  Object.entries(PARAM_NAMES).forEach(([key, name]) => {
    const value = filters[key];
    if (key === 'inStockOnly') { if (value) params.set(name, '1'); return; }
    if (key === 'sort') { if (value !== DEFAULT_FILTERS.sort) params.set(name, value); return; }
    if (value !== '') params.set(name, value);
  });
  return params;
}

function fromParams(params) {
  return {
    search: params.get('q') ?? '',
    category: params.get('category') ?? '',
    ageGroup: params.get('age') ?? '',
    minPrice: params.get('min') ?? '',
    maxPrice: params.get('max') ?? '',
    inStockOnly: params.get('stock') === '1',
    sort: params.get('sort') ?? DEFAULT_FILTERS.sort,
  };
}

/**
 * Shop filters live in the URL (shareable, Back/Forward safe) and are also saved
 * in localStorage so they are restored when the customer returns to /shop.
 */
export function useShopFilters() {
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => fromParams(params), [params]);
  // Read once, before any effect can overwrite the saved value.
  const [saved] = useState(() => readJson(STORAGE_KEY, null));

  // First visit without a query string: restore the last saved filters.
  useEffect(() => {
    if (params.toString() === '' && saved && typeof saved === 'object') {
      setParams(toParams({ ...DEFAULT_FILTERS, ...saved }), { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  useEffect(() => { writeJson(STORAGE_KEY, filters); }, [filters]);

  const update = useCallback((changes) => {
    setParams((current) => {
      const next = { ...fromParams(current), ...changes };
      writeJson(STORAGE_KEY, next); // save immediately so a fast navigation cannot lose it
      return toParams(next);
    }, { replace: true });
  }, [setParams]);

  const clear = useCallback(() => {
    writeJson(STORAGE_KEY, DEFAULT_FILTERS);
    setParams(new URLSearchParams(), { replace: true });
  }, [setParams]);

  const hasFilters = Boolean(filters.search || filters.category || filters.ageGroup || filters.minPrice || filters.maxPrice || filters.inStockOnly);
  return { filters, update, clear, hasFilters };
}
