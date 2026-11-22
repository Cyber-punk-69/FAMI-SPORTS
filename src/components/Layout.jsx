import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Footer } from './Footer.jsx';
import { Header } from './Header.jsx';
import styles from './Layout.module.css';

export function Layout() {
  const { pathname } = useLocation();
  // Start each page at the top when the route changes.
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <div className={styles.layout}>
      <Header />
      <main id="main-content" className={styles.main} tabIndex="-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
