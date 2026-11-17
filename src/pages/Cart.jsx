import { Link } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState.jsx';
import { ProductImage } from '../components/ProductImage.jsx';
import { useCart } from '../context/CartContext.jsx';
import { products } from '../data/products.js';
import styles from './Cart.module.css';

export function Cart() {
  const { items, updateQuantity, removeItem, message } = useCart();
  const cartItems = items.map((item) => ({ ...item, product: products.find((product) => product.id === item.productId) })).filter((item) => item.product);
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const delivery = subtotal >= 5000 ? 0 : 250;
  const remaining = Math.max(0, 5000 - subtotal);

  if (!cartItems.length) return <EmptyState title="Your cart is empty" message="Your next great session starts with the right gear." action={<Link to="/shop">Browse equipment</Link>} />;

  return (
    <section>
      <h1>Your cart</h1>
      {message ? <p role="alert">{message}</p> : null}
      <div className={styles.layout}>
        <div className={styles.list}>
          {cartItems.map(({ product, quantity }) => (
            <article className={styles.row} key={product.id}>
              <div className={styles.thumb}><ProductImage product={product} /></div>
              <div><h2>{product.name}</h2><p>PKR {product.price.toLocaleString()} each</p></div>
              <div className={styles.controls}>
                <label htmlFor={`quantity-${product.id}`}>Quantity</label>
                <input id={`quantity-${product.id}`} type="number" min="0" max={Math.min(5, product.stock)} value={quantity} onChange={(event) => updateQuantity(product.id, Number(event.target.value))} />
                <strong>PKR {(product.price * quantity).toLocaleString()}</strong>
                <button className={styles.remove} type="button" onClick={() => removeItem(product.id)}>Remove</button>
              </div>
            </article>
          ))}
        </div>
        <aside className={styles.summary}>
          <h2>Order summary</h2>
          <p>Items <strong>PKR {subtotal.toLocaleString()}</strong></p>
          <p>Delivery <strong>{delivery ? `PKR ${delivery}` : 'Free'}</strong></p>
          {remaining ? <><p>Add Rs. {remaining.toLocaleString()} for free delivery.</p><div className={styles.progress} aria-label="Progress toward free delivery"><span className={styles.progressPartial} /></div></> : <p>Free delivery unlocked</p>}
          <h2>Total: PKR {(subtotal + delivery).toLocaleString()}</h2>
          <Link className={styles.checkout} to="/checkout">Checkout</Link>
        </aside>
      </div>
    </section>
  );
}
