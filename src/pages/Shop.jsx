import { EmptyState } from '../components/EmptyState.jsx';
import { ErrorState } from '../components/ErrorState.jsx';
import { Loader } from '../components/Loader.jsx';
import { ProductGrid } from '../components/ProductGrid.jsx';
import { useProducts } from '../hooks/useProducts.js';

export function Shop() {
  const { products, loading, error, retry } = useProducts();

  return (
    <>
      <h1>Shop sports equipment</h1>
      <p>Browse equipment for cricket, football, badminton, tennis, and fitness.</p>
      {loading ? <Loader /> : null}
      {!loading && error ? <ErrorState message={error.message} onRetry={retry} /> : null}
      {!loading && !error && products.length === 0 ? (
        <EmptyState
          title="No products available"
          message="The catalogue is empty right now. Please try again later."
        />
      ) : null}
      {!loading && !error && products.length > 0 ? <ProductGrid products={products} /> : null}
    </>
  );
}
