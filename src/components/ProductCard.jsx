import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { ProductImage } from './ProductImage.jsx';
import styles from './ProductCard.module.css';

export function ProductCard({ product }) {
  const { addItem, message } = useCart();
  const lowStock = product.stock > 0 && product.stock <= 3;

  return (
    <article className={styles.card}>
      <Link to={`/items/${product.id}`} className={styles.imageLink}><ProductImage product={product} /></Link>
      <div className={styles.content}>
        <p className={styles.category}>{product.category} · {product.brand}</p>
        <h2 className={styles.name}>{product.name}</h2>
        <p className={styles.price}>PKR {product.price.toLocaleString()}</p>
        <dl className={styles.specs}>
          <div><dt>Size</dt><dd>{product.specs.size}</dd></div>
          <div><dt>Weight</dt><dd>{product.specs.weight}</dd></div>
        </dl>
        {product.ageGroup.startsWith('Junior') ? <span className={styles.badge}>Junior</span> : null}
        {product.stock === 0 ? <span className={styles.outOfStock}>Out of stock</span> : null}
        {lowStock ? <span className={styles.lowStock}>Low stock</span> : null}
        <button className={styles.addButton} type="button" disabled={product.stock === 0} onClick={() => addItem(product.id)}>
          {product.stock === 0 ? 'Out of stock' : 'Add to cart'}
        </button>
        {message ? <span className={styles.message} role="status">{message}</span> : null}
      </div>
    </article>
  );
}
