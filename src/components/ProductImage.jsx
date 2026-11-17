import { useState } from 'react';
import styles from './ProductImage.module.css';

const icons = {
  Cricket: '🏏',
  Football: '⚽',
  Badminton: '🏸',
  Tennis: '🎾',
  Fitness: '🏋',
};

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
        <div className={styles.placeholder} role="img" aria-label={product.name}>
          <span aria-hidden="true">{icons[product.category] || '🏆'}</span>
          <strong>{product.name}</strong>
        </div>
      )}
    </div>
  );
}
