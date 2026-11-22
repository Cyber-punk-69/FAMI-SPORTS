import { useState } from 'react';
import { SportIcon } from './SportIcon.jsx';
import styles from './ProductImage.module.css';

export function ProductImage({ product, className = '' }) {
  const [failed, setFailed] = useState(!product.image);

  return (
    <div className={`${styles.frame} ${className}`}>
      {!failed ? (
        <img
          src={product.image}
          alt={product.imageAlt || product.name}
          width="600"
          height="450"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className={styles.placeholder} role="img" aria-label={`${product.name} (image unavailable)`}>
          <SportIcon sport={product.category} size={56} />
          <span>Image unavailable</span>
        </div>
      )}
    </div>
  );
}
