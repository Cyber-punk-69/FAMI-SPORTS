import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { products } from '../data/products.js';
import styles from './Checkout.module.css';

export function Checkout() {
  const { items } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', address: '', age: '', delivery: 'delivery' });
  const [error, setError] = useState('');
  if (!items.length) return <Navigate to="/cart" replace />;
  const subtotal = items.reduce((sum, item) => sum + (products.find((product) => product.id === item.productId)?.price || 0) * item.quantity, 0);
  const delivery = subtotal >= 5000 || form.delivery === 'pickup' ? 0 : 250;

  function update(field, value) { setForm((current) => ({ ...current, [field]: value })); }
  function submit(event) {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.age || (form.delivery === 'delivery' && !form.address.trim())) {
      setError('Complete your name, phone, fulfilment, delivery address, and player age.');
      return;
    }
    navigate('/confirmation', { state: { name: form.name, delivery: form.delivery, items, subtotal, deliveryFee: delivery } });
  }

  return (
    <section>
      <h1>Checkout</h1>
      <div className={styles.layout}>
        <form className={styles.form} onSubmit={submit} noValidate>
          <span className={styles.simulated}>SIMULATED ORDER</span>
          <h2>Contact</h2>
          <label htmlFor="name">Name<input id="name" required value={form.name} onChange={(event) => update('name', event.target.value)} /></label>
          <label htmlFor="phone">Phone<input id="phone" required inputMode="tel" value={form.phone} onChange={(event) => update('phone', event.target.value)} /></label>
          <fieldset><legend>Delivery or pickup</legend>
            <label><span><input type="radio" name="delivery" value="delivery" checked={form.delivery === 'delivery'} onChange={(event) => update('delivery', event.target.value)} /> Delivery</span></label>
            <label><span><input type="radio" name="delivery" value="pickup" checked={form.delivery === 'pickup'} onChange={(event) => update('delivery', event.target.value)} /> Free pickup</span></label>
          </fieldset>
          {form.delivery === 'delivery' ? <label htmlFor="address">Delivery address<textarea id="address" required value={form.address} onChange={(event) => update('address', event.target.value)} /></label> : null}
          <label htmlFor="age">Player age group<select id="age" value={form.age} onChange={(event) => update('age', event.target.value)}><option value="">Select age group</option><option>Adult</option><option>Junior (Teens 13-17)</option></select></label>
          {error ? <p className={styles.error} role="alert">{error}</p> : null}
          <button type="submit">Place simulated order</button>
          <Link className={styles.back} to="/cart">Back to cart</Link>
        </form>
        <aside className={styles.summary}><h2>Order summary</h2><p>Items subtotal: PKR {subtotal.toLocaleString()}</p><p>Delivery: {delivery ? `PKR ${delivery}` : 'Free'}</p><h2>Total: PKR {(subtotal + delivery).toLocaleString()}</h2></aside>
      </div>
    </section>
  );
}
