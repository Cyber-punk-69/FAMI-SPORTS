import { Link, useParams } from 'react-router-dom';
import { ErrorState } from '../components/ErrorState.jsx';
import { Loader } from '../components/Loader.jsx';
import { useProducts } from '../hooks/useProducts.js';

export function ItemDetails() {
  const { id } = useParams();
  const { products, loading, error, retry } = useProducts();
  const product = products.find((item) => item.id === id);

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error.message} onRetry={retry} />;
  if (!product) {
    return (
      <section>
        <h1>Item not found</h1>
        <p>That product does not exist or is no longer available.</p>
        <Link to="/shop">Back to shop</Link>
      </section>
    );
  }

  return (
    <article>
      <p><Link to="/shop">Back to shop</Link></p>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>PKR {product.price.toLocaleString()}</p>
      <p>{product.stock === 0 ? 'Out of stock' : `${product.stock} available`}</p>
      <p>Maximum 5 units per order, limited by current stock.</p>
      <p>Age suitability: {product.ageGroup}</p>
      <h2>Specifications</h2>
      <dl>
        <div><dt>Size</dt><dd>{product.specs.size}</dd></div>
        <div><dt>Weight</dt><dd>{product.specs.weight}</dd></div>
        <div><dt>Material</dt><dd>{product.specs.material}</dd></div>
      </dl>
      <p>Delivery is available in Islamabad and Rawalpindi. Pickup is free.</p>
    </article>
  );
}
