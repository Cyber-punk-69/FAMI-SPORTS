import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const categories = ['Cricket', 'Football', 'Badminton', 'Tennis', 'Fitness'];

export function Home() {
  return (
    <>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>PLAY LOCAL. PLAY BOLD.</p>
        <h1>Gear up for your next game.</h1>
        <p>Original sports equipment for players, clubs, and families in Islamabad and Rawalpindi.</p>
        <Link className={styles.primaryAction} to="/shop">Shop equipment</Link>
      </section>
      <section aria-labelledby="categories-heading">
        <h2 id="categories-heading">Shop by sport</h2>
        <ul className={styles.categories}>
          {categories.map((category) => <li key={category}>{category}</li>)}
        </ul>
      </section>
      <section className={styles.delivery} aria-labelledby="delivery-heading">
        <h2 id="delivery-heading">Simple local fulfilment</h2>
        <p>Delivery is Rs. 250 in Islamabad and Rawalpindi, free from Rs. 5,000. Pickup is always free.</p>
      </section>
    </>
  );
}
