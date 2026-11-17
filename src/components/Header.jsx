import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import styles from './Header.module.css';

export function Header() {
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <a className={styles.skipLink} href="#main-content">Skip to content</a>
      <div className={styles.inner}>
        <NavLink className={styles.logo} to="/">FAMI SPORTS</NavLink>
        <button className={styles.menuButton} type="button" aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen((open) => !open)}>
          <span aria-hidden="true">☰</span>
          <span className={styles.srOnly}>Menu</span>
        </button>
        <nav id="primary-navigation" className={menuOpen ? styles.navOpen : styles.nav} aria-label="Primary navigation">
          <ul className={styles.navigation}>
            <li><NavLink onClick={() => setMenuOpen(false)} to="/">Home</NavLink></li>
            <li><NavLink onClick={() => setMenuOpen(false)} to="/shop">Shop</NavLink></li>
            <li><NavLink onClick={() => setMenuOpen(false)} to="/cart">Cart <span className={styles.badge}>{itemCount}</span></NavLink></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
