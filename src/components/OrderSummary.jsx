import { FREE_DELIVERY_THRESHOLD, calculateDelivery } from '../rules/deliveryRule.js';
import styles from './OrderSummary.module.css';

// Derived values only: everything here is calculated from the subtotal and fulfilment choice.
export function OrderSummary({ subtotal, fulfilment, itemCount, showProgress = false, heading = 'Order summary' }) {
  const delivery = calculateDelivery(subtotal, fulfilment);
  const progress = Math.min(100, Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100));

  return (
    <div className={styles.summary}>
      <h2>{heading}</h2>
      <dl>
        {itemCount !== undefined ? <div><dt>Items</dt><dd>{itemCount}</dd></div> : null}
        <div><dt>Subtotal</dt><dd>Rs. {subtotal.toLocaleString()}</dd></div>
        <div><dt>{fulfilment === 'pickup' ? 'Pickup' : 'Delivery'}</dt><dd>{delivery.fee ? `Rs. ${delivery.fee}` : 'Free'}</dd></div>
        <div className={styles.total}><dt>Total</dt><dd>Rs. {(subtotal + delivery.fee).toLocaleString()}</dd></div>
      </dl>
      {showProgress && fulfilment === 'delivery' ? null : <p className={styles.reason}>{delivery.reason}</p>}
      {showProgress && fulfilment === 'delivery' ? (
        <div>
          <div className={styles.bar} role="progressbar" aria-label="Progress to free delivery" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>
            <span style={{ width: `${progress}%` }} />
          </div>
          <p className={styles.reason}>
            {delivery.free ? '✓ Free delivery unlocked.' : `Add Rs. ${delivery.remainingForFree.toLocaleString()} more for free delivery.`}
          </p>
        </div>
      ) : null}
    </div>
  );
}
