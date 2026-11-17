import { useMemo, useState } from 'react';
import { EmptyState } from '../components/EmptyState.jsx';
import { ErrorState } from '../components/ErrorState.jsx';
import { FilterPanel } from '../components/FilterPanel.jsx';
import { Loader } from '../components/Loader.jsx';
import { ProductGrid } from '../components/ProductGrid.jsx';
import { SearchBar } from '../components/SearchBar.jsx';
import { SortSelect } from '../components/SortSelect.jsx';
import { useDebounce } from '../hooks/useDebounce.js';
import { useProducts } from '../hooks/useProducts.js';
import { filterAndSortProducts } from '../utils/filterProducts.js';
import styles from './Shop.module.css';

export function Shop() {
  const { products, loading, error, retry } = useProducts();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    ageGroup: '',
    minPrice: '',
    maxPrice: '',
    inStockOnly: false,
    sort: 'name',
  });
  const debouncedSearch = useDebounce(search);
  const visibleProducts = useMemo(
    () => filterAndSortProducts(products, { ...filters, search: debouncedSearch }),
    [products, filters, debouncedSearch],
  );
  const hasFilters = Boolean(search || filters.category || filters.ageGroup || filters.minPrice || filters.maxPrice || filters.inStockOnly);

  return (
    <>
      <h1>Shop sports equipment</h1>
      <p>Browse equipment for cricket, football, badminton, tennis, and fitness.</p>
      <div className={styles.toolbar}><SearchBar value={search} onChange={setSearch} /><SortSelect
        value={filters.sort}
        onChange={(sort) => setFilters((current) => ({ ...current, sort }))}
      /></div>
      <div className={styles.content}><aside className={styles.filters}><FilterPanel
        filters={filters}
        onChange={(changes) => setFilters((current) => ({ ...current, ...changes }))}
        onClear={() => {
          setSearch('');
          setFilters({
            category: '',
            ageGroup: '',
            minPrice: '',
            maxPrice: '',
            inStockOnly: false,
            sort: 'name',
          });
        }}
      /></aside><div className={styles.grid}>
      <p className={styles.results}>{visibleProducts.length} products</p>
      {loading ? <Loader /> : null}
      {!loading && error ? <ErrorState message={error.message} onRetry={retry} /> : null}
      {!loading && !error && products.length === 0 ? (
        <EmptyState
          title="No products available"
          message="The catalogue is empty right now. Please try again later."
        />
      ) : null}
      {!loading && !error && products.length > 0 && visibleProducts.length === 0 ? (
        <EmptyState
          title="No products match"
          message="Try a different search or clear the current filters."
          action={hasFilters ? <button type="button" onClick={() => setSearch('')}>Clear search</button> : null}
        />
      ) : null}
      {!loading && !error && visibleProducts.length > 0 ? <ProductGrid products={visibleProducts} /> : null}</div></div>
    </>
  );
}
