import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <a className={styles.skipLink} href="#main-content">Skip to content</a>
      <div className={styles.inner}>
        <NavLink className={styles.logo} to="/">FAMI SPORTS</NavLink>
        <nav aria-label="Primary navigation">
          <ul className={styles.navigation}>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/shop">Shop</NavLink></li>
            <li><NavLink to="/cart">Cart</NavLink></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
