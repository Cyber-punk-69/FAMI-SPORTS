import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import styles from './Header.module.css';

export function Header() {
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  return (
    <header className={styles.header}>
      <a className={styles.skipLink} href="#main-content">Skip to content</a>
      <div className={styles.announce}>Free delivery over Rs. 5,000 · Islamabad &amp; Rawalpindi · Simulated store for CS4032</div>
      <div className={styles.inner}>
        <Link className={styles.logo} to="/" onClick={close} aria-label="FAMI SPORTS home">
          <span className={styles.mark} aria-hidden="true">F</span>
          <span>FAMI<b>SPORTS</b></span>
        </Link>
        <button className={styles.menuButton} type="button" aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? 'Close' : 'Menu'}
        </button>
        <nav id="primary-navigation" className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`} aria-label="Primary">
          <ul>
            <li><NavLink onClick={close} to="/" end>Home</NavLink></li>
            <li><NavLink onClick={close} to="/shop">Shop</NavLink></li>
            <li>
              <NavLink onClick={close} to="/cart" className={styles.cartLink}>
                Cart <span className={styles.badge} aria-label={`${itemCount} items in cart`}>{itemCount}</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
