import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <p className={styles.logo}>FAMI SPORTS</p>
          <p className={styles.tagline}>Bold gear for local players.</p>
        </div>
        <p className={styles.delivery}>
          Delivery across Islamabad and Rawalpindi.
          <span>Free delivery from Rs. 5,000.</span>
        </p>
        <small className={styles.credit}>Product photography: Unsplash contributors.</small>
      </div>
    </footer>
  );
}
