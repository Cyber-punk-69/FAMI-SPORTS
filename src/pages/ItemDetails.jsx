import { Link, useNavigate, useParams } from 'react-router-dom';
import { ErrorState } from '../components/ErrorState.jsx';
import { Loader } from '../components/Loader.jsx';
import { useProducts } from '../hooks/useProducts.js';
import { useCart } from '../context/CartContext.jsx';
import { useState } from 'react';

export function ItemDetails() {
  const { id } = useParams();
  const { products, loading, error, retry } = useProducts();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
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
      {product.stock > 0 ? (
        <form onSubmit={(event) => {
          event.preventDefault();
          addItem(product.id, quantity);
          setAdded(true);
        }}>
          <label htmlFor="quantity">Quantity</label>
          <input id="quantity" type="number" min="1" max={Math.min(5, product.stock)} value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))} />
          <button type="submit">Add to cart</button>
          {added ? <Link to="/cart">View cart</Link> : null}
          <button type="button" onClick={() => navigate('/cart')} disabled={!added}>Go to cart</button>
        </form>
      ) : null}
    </article>
  );
}
