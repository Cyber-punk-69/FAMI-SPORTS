import { Link } from 'react-router-dom';
import { DemoPanel } from './DemoPanel.jsx';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <p className={styles.logo}>FAMI<b>SPORTS</b></p>
          <p className={styles.tagline}>Bold gear for local players.</p>
          <p className={styles.note}>Fictional store built for CS4032 Web Programming. All orders are simulated — no payment is taken.</p>
        </div>
        <nav aria-label="Footer">
          <h2>Explore</h2>
          <ul>
            <li><Link to="/shop">Shop all gear</Link></li>
            <li><Link to="/shop?category=Cricket">Cricket</Link></li>
            <li><Link to="/shop?category=Football">Football</Link></li>
            <li><Link to="/cart">Your cart</Link></li>
          </ul>
        </nav>
        <div>
          <h2>Delivery &amp; pickup</h2>
          <ul>
            <li>Islamabad &amp; Rawalpindi</li>
            <li>Rs. 250 delivery · free from Rs. 5,000</li>
            <li>Free pickup: F-7 Markaz, Islamabad</li>
            <li>Max 5 units per product per order</li>
          </ul>
        </div>
      </div>
      <DemoPanel />
      <p className={styles.credit}>Product photography: Unsplash contributors. Images are shown in monochrome by design.</p>
    </footer>
  );
}
