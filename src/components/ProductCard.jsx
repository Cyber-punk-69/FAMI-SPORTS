import { Link } from 'react-router-dom';
import styles from './ProductCard.module.css';

export function ProductCard({ product }) {
  return (
    <article className={styles.card}>
      <Link to={`/items/${product.id}`} className={styles.imageLink}>
        {product.image ? (
          <img
            className={styles.image}
            src={product.image}
            alt={product.imageAlt}
            onError={(event) => {
              event.currentTarget.hidden = true;
              event.currentTarget.nextElementSibling.hidden = false;
            }}
          />
        ) : null}
        <span className={styles.imageFallback} hidden={Boolean(product.image)}>
          Image unavailable
        </span>
      </Link>
      <div className={styles.content}>
        <p className={styles.category}>{product.category} · {product.brand}</p>
        <h2 className={styles.name}>{product.name}</h2>
        <p className={styles.price}>PKR {product.price.toLocaleString()}</p>
        <dl className={styles.specs}>
          <div><dt>Size</dt><dd>{product.specs.size}</dd></div>
          <div><dt>Weight</dt><dd>{product.specs.weight}</dd></div>
        </dl>
        <p className={product.stock === 0 ? styles.outOfStock : styles.stock}>
          {product.stock === 0 ? 'Out of stock' : `${product.stock} available`}
        </p>
      </div>
    </article>
  );
}
