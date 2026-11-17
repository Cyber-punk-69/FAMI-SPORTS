import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { products } from '../data/products.js';
import styles from './Confirmation.module.css';

export function Confirmation() {
  const { state } = useLocation();
  const { clearCart } = useCart();
  useEffect(() => { if (state) clearCart(); }, [state]);
  const orderId = state ? `FAMI-${String(Date.now()).slice(-6)}` : '';
  return (
    <section className={styles.panel}>
      <h1>Order received</h1>
      <p>Thank you{state?.name ? `, ${state.name}` : ''}. Your simulated order is ready for confirmation.</p>
      {state ? <><p className={styles.orderId}>Order ID: {orderId}</p><ul className={styles.items}>{state.items?.map((item) => { const product = products.find((entry) => entry.id === item.productId); return <li key={item.productId}><span>{product?.name} × {item.quantity}</span><strong>PKR {((product?.price || 0) * item.quantity).toLocaleString()}</strong></li>; })}</ul><p>Fulfilment: {state.delivery === 'pickup' ? 'Free pickup' : 'Delivery in Islamabad or Rawalpindi'}</p><h2>Total: PKR {((state.subtotal || 0) + (state.deliveryFee || 0)).toLocaleString()}</h2></> : null}
      <Link className={styles.continue} to="/shop">Continue shopping</Link>
    </section>
  );
}
