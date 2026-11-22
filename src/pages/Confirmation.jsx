import { Link, useLocation } from 'react-router-dom';
import { OrderSummary } from '../components/OrderSummary.jsx';
import { readSession } from '../utils/storage.js';
import styles from './Confirmation.module.css';

export function Confirmation() {
  const { state } = useLocation();
  // Router state is lost on refresh, so the last order is also kept in sessionStorage.
  const order = state?.order ?? readSession('fami-sports-last-order', null);

  if (!order) {
    return (
      <section className="statePanel">
        <p className="eyebrow">Step 3 of 3 · Done</p>
        <h1>No recent order</h1>
        <p>There is no completed order to show. Start by choosing some equipment.</p>
        <Link className="btn btnPrimary" to="/shop">Browse equipment</Link>
      </section>
    );
  }

  const units = order.items.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <section className={styles.panel} aria-labelledby="confirm-heading">
      <p className="eyebrow">Step 3 of 3 · Done</p>
      <p className={styles.tick} aria-hidden="true">✓</p>
      <h1 id="confirm-heading">Order confirmed</h1>
      <p className="lead">
        Thank you{state?.firstName ? `, ${state.firstName}` : ''}. This is a <strong>simulated</strong> order — nothing was charged or shipped.
      </p>

      <div className={styles.meta}>
        <div><span>Order ID</span><strong>{order.id}</strong></div>
        <div><span>{order.fulfilment === 'pickup' ? 'Pickup' : 'Delivery to'}</span><strong>{order.city}</strong></div>
        <div><span>Units</span><strong>{units}</strong></div>
      </div>

      <ul className={styles.items}>
        {order.items.map((item) => (
          <li key={item.productId}>
            <span>{item.name} × {item.quantity}{Object.values(item.options ?? {}).length ? ` (${Object.values(item.options).join(', ')})` : ''}</span>
            <strong>Rs. {(item.price * item.quantity).toLocaleString()}</strong>
          </li>
        ))}
      </ul>

      <OrderSummary subtotal={order.subtotal} fulfilment={order.fulfilment} heading="Final total" />

      <div className={styles.actions}>
        <Link className="btn btnPrimary btnLarge" to="/shop">Continue shopping</Link>
        <Link className="btn btnSecondary" to="/">Back to home</Link>
      </div>
    </section>
  );
}
