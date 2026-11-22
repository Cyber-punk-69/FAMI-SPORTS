import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { isJuniorProduct } from '../rules/ageRule.js';
import { ProductImage } from './ProductImage.jsx';
import { StockBadge } from './StatusBadge.jsx';
import styles from './ProductCard.module.css';

export function ProductCard({ product }) {
  const { addItem, items } = useCart();
  const [feedback, setFeedback] = useState(null);
  const inCart = items.find((item) => item.productId === product.id)?.quantity ?? 0;
  const soldOut = product.stock === 0;

  function handleAdd() {
    setFeedback(addItem(product.id, 1));
  }

  return (
    <article className={`${styles.card} ${inCart ? styles.selected : ''}`}>
      <Link to={`/items/${product.id}`} className={styles.imageLink} aria-label={`View details for ${product.name}`}>
        <ProductImage product={product} />
        {inCart ? <span className={styles.inCart}>✓ In cart × {inCart}</span> : null}
      </Link>
      <div className={styles.content}>
        <p className={styles.category}>{product.category} · {product.brand}</p>
        <h3 className={styles.name}><Link to={`/items/${product.id}`}>{product.name}</Link></h3>
        <div className={styles.badges}>
          <StockBadge stock={product.stock} />
          <span className={styles.age}>{isJuniorProduct(product) ? 'Ages 13–17' : 'Adult 13+'}</span>
        </div>
        <dl className={styles.specs}>
          <div><dt>Size</dt><dd>{product.specs.size}</dd></div>
          <div><dt>Weight</dt><dd>{product.specs.weight}</dd></div>
        </dl>
        <div className={styles.footer}>
          <p className={styles.price}><span>Rs.</span> {product.price.toLocaleString()}</p>
          <button className="btn btnPrimary" type="button" disabled={soldOut} onClick={handleAdd}>
            {soldOut ? 'Unavailable' : 'Add to cart'}
          </button>
        </div>
        <p className={feedback?.ok === false ? styles.error : styles.success} role="status">
          {feedback ? `${feedback.ok ? '✓' : 'Error:'} ${feedback.message}` : ''}
        </p>
      </div>
    </article>
  );
}
