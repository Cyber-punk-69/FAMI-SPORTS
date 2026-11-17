import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export function Checkout() {
  const { items } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', address: '', delivery: 'delivery' });
  const [error, setError] = useState('');

  if (!items.length) return <Navigate to="/cart" replace />;

  function submit(event) {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || (form.delivery === 'delivery' && !form.address.trim())) {
      setError('Please complete the required fields.');
      return;
    }
    navigate('/confirmation', { state: { name: form.name, delivery: form.delivery } });
  }

  return (
    <section>
      <h1>Checkout</h1>
      <form onSubmit={submit}>
        <label htmlFor="name">Name</label>
        <input id="name" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <label htmlFor="phone">Phone</label>
        <input id="phone" required inputMode="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
        <fieldset>
          <legend>Fulfilment</legend>
          <label><input type="radio" name="delivery" value="delivery" checked={form.delivery === 'delivery'} onChange={(event) => setForm({ ...form, delivery: event.target.value })} /> Delivery</label>
          <label><input type="radio" name="delivery" value="pickup" checked={form.delivery === 'pickup'} onChange={(event) => setForm({ ...form, delivery: event.target.value })} /> Free pickup</label>
        </fieldset>
        {form.delivery === 'delivery' ? <><label htmlFor="address">Delivery address</label><textarea id="address" required value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} /></> : null}
        {error ? <p role="alert">{error}</p> : null}
        <button type="submit">Place order</button>
        <Link to="/cart">Back to cart</Link>
      </form>
    </section>
  );
}
