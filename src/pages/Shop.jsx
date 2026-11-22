import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState.jsx';
import { ErrorState } from '../components/ErrorState.jsx';
import { FilterPanel } from '../components/FilterPanel.jsx';
import { Loader } from '../components/Loader.jsx';
import { ProductGrid } from '../components/ProductGrid.jsx';
import { SearchBar } from '../components/SearchBar.jsx';
import { SortSelect } from '../components/SortSelect.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import { useDebounce } from '../hooks/useDebounce.js';
import { useShopFilters } from '../hooks/useShopFilters.js';
import { filterAndSortProducts, suggestRelaxations } from '../utils/filterProducts.js';
import styles from './Shop.module.css';

export function Shop() {
  const { products, loading, error, reload } = useProducts();
  const { items, itemCount } = useCart();
  const { filters, update, clear, hasFilters } = useShopFilters();
  const [searchText, setSearchText] = useState(filters.search);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const debouncedSearch = useDebounce(searchText);

  // Keep the box in step when the URL changes without typing (Back, links, Clear).
  useEffect(() => { setSearchText(filters.search); }, [filters.search]);

  function handleSearch(text) {
    setSearchText(text);
    update({ search: text });
  }

  const activeFilters = { ...filters, search: debouncedSearch };
  const visible = useMemo(() => filterAndSortProducts(products, activeFilters), [products, filters, debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps
  const relaxations = useMemo(() => (visible.length === 0 ? suggestRelaxations(products, activeFilters) : []), [visible.length, products, filters, debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  // P1: selections stay visible even when filters hide those products.
  const hiddenSelected = items.filter((item) => !visible.some((product) => product.id === item.productId));
  const chips = [
    filters.search && { key: 'search', text: `Search: ${filters.search}`, clear: { search: '' } },
    filters.category && { key: 'category', text: filters.category, clear: { category: '' } },
    filters.ageGroup && { key: 'ageGroup', text: filters.ageGroup, clear: { ageGroup: '' } },
    filters.minPrice && { key: 'minPrice', text: `Min Rs. ${filters.minPrice}`, clear: { minPrice: '' } },
    filters.maxPrice && { key: 'maxPrice', text: `Max Rs. ${filters.maxPrice}`, clear: { maxPrice: '' } },
    filters.inStockOnly && { key: 'stock', text: 'In stock only', clear: { inStockOnly: false } },
  ].filter(Boolean);

  function handleClear() {
    setSearchText('');
    clear();
  }

  return (
    <>
      <header className="pageHead">
        <p className="eyebrow">The catalogue</p>
        <h1>Shop equipment</h1>
        <p>Compare size, weight, age fit and live stock. Your filters are saved if you open a product and come back.</p>
      </header>

      <div className={styles.toolbar}>
        <SearchBar value={searchText} onChange={handleSearch} />
        <SortSelect value={filters.sort} onChange={(sort) => update({ sort })} />
        <button className={`btn btnSecondary ${styles.filterToggle}`} type="button" aria-expanded={filtersOpen} aria-controls="shop-filters" onClick={() => setFiltersOpen((open) => !open)}>
          Filters{chips.length ? ` (${chips.length})` : ''}
        </button>
      </div>

      <div className={styles.content}>
        <aside id="shop-filters" className={`${styles.filters} ${filtersOpen ? styles.filtersOpen : ''}`} aria-label="Filters">
          <FilterPanel filters={filters} onChange={update} onClear={handleClear} hasFilters={hasFilters} />
        </aside>

        <section className={styles.results} aria-label="Results">
          {itemCount > 0 ? (
            <div className={`alert alertInfo ${styles.cartStrip}`}>
              <p>
                <strong>Your cart: {itemCount} item{itemCount === 1 ? '' : 's'}.</strong>
                {hiddenSelected.length > 0 ? ` ${hiddenSelected.length} selected product${hiddenSelected.length === 1 ? ' is' : 's are'} hidden by the current filters.` : ''}
              </p>
              <Link className="btn btnSecondary" to="/cart">View cart</Link>
            </div>
          ) : null}

          {chips.length > 0 ? (
            <ul className={styles.chips} aria-label="Active filters">
              {chips.map((chip) => (
                <li key={chip.key}>
                  <button type="button" onClick={() => (chip.key === 'search' ? handleSearch('') : update(chip.clear))} aria-label={`Remove filter ${chip.text}`}>
                    {chip.text} <span aria-hidden="true">✕</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          {!loading && !error ? <p className={styles.count} role="status">Showing {visible.length} of {products.length} products</p> : null}

          {loading ? <Loader /> : null}
          {!loading && error ? <ErrorState message={error.message} onRetry={reload} /> : null}
          {!loading && !error && products.length === 0 ? (
            <EmptyState title="No products available" message="The catalogue is empty right now. New stock is added regularly, so please check back soon." />
          ) : null}
          {!loading && !error && products.length > 0 && visible.length === 0 ? (
            <EmptyState title="No products match" message="Nothing fits every filter you have set. Remove one to see what is available:">
              {relaxations.length > 0 ? (
                <ul className={styles.relax}>
                  {relaxations.map((option) => (
                    <li key={option.key}>
                      <button className="btn btnSecondary" type="button" onClick={() => (option.key === 'search' ? handleSearch('') : update({ [option.key]: option.empty }))}>
                        Remove {option.label} → {option.count} product{option.count === 1 ? '' : 's'}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
              <button className="btn btnPrimary" type="button" onClick={handleClear}>Clear all filters</button>
            </EmptyState>
          ) : null}
          {!loading && !error && visible.length > 0 ? <ProductGrid products={visible} /> : null}
        </section>
      </div>
    </>
  );
}
