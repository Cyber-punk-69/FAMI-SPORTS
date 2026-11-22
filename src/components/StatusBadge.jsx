import styles from './StatusBadge.module.css';

// Status always carries text (and a symbol), never colour alone.
export function StockBadge({ stock }) {
  if (stock === 0) return <span className={`${styles.badge} ${styles.out}`}>✕ Out of stock</span>;
  if (stock <= 3) return <span className={`${styles.badge} ${styles.low}`}>! Only {stock} left</span>;
  return <span className={`${styles.badge} ${styles.in}`}>✓ In stock</span>;
}
