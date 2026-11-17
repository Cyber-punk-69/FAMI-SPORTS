import { Link } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState.jsx';
import { useCart } from '../context/CartContext.jsx';
import { products } from '../data/products.js';

export function Cart() {
  const { items, updateQuantity, removeItem } = useCart();
  const cartItems = items.map((item) => ({ ...item, product: products.find((product) => product.id === item.productId) })).filter((item) => item.product);
  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (!cartItems.length) {
    return <EmptyState title="Your cart is empty" message="Add equipment from the shop to get started." action={<Link to="/shop">Browse equipment</Link>} />;
  }

  return (
    <section>
      <h1>Your cart</h1>
      {cartItems.map(({ product, quantity }) => (
        <article key={product.id}>
          <h2>{product.name}</h2>
          <p>PKR {product.price.toLocaleString()} each</p>
          <label htmlFor={`quantity-${product.id}`}>Quantity</label>
          <input id={`quantity-${product.id}`} type="number" min="0" max={Math.min(5, product.stock)} value={quantity}
            onChange={(event) => updateQuantity(product.id, Number(event.target.value))} />
          <button type="button" onClick={() => removeItem(product.id)}>Remove</button>
        </article>
      ))}
      <h2>Total: PKR {total.toLocaleString()}</h2>
      <Link to="/checkout">Proceed to checkout</Link>
    </section>
  );
}
