import { Outlet } from 'react-router-dom';
import { Footer } from './Footer.jsx';
import { Header } from './Header.jsx';
import styles from './Layout.module.css';

export function Layout() {
  return (
    <div className={styles.layout}>
      <Header />
      <main id="main-content" className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
