import { Link } from 'react-router-dom';
import { ErrorState } from '../components/ErrorState.jsx';
import { Loader } from '../components/Loader.jsx';
import { ProductGrid } from '../components/ProductGrid.jsx';
import { SportIcon } from '../components/SportIcon.jsx';
import { CATEGORIES } from '../components/FilterPanel.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from '../rules/deliveryRule.js';
import { MAX_PER_ORDER } from '../rules/quantityRule.js';
import { MIN_PLAYER_AGE } from '../rules/ageRule.js';
import styles from './Home.module.css';

export function Home() {
  const { products, loading, error, reload } = useProducts();
  const featured = products.filter((product) => product.stock > 0).slice(0, 4);

  return (
    <>
      <section className={styles.hero} aria-labelledby="hero-heading">
        <div className={styles.heroCopy}>
          <p className="eyebrow">Islamabad · Rawalpindi · Est. 2026</p>
          <h1 id="hero-heading">Gear up.<br /><span>Play bold.</span></h1>
          <p className={styles.heroText}>
            Match-ready cricket, football, badminton, tennis and fitness equipment for local players,
            clubs and families. See stock, limits and delivery costs <strong>before</strong> you check out.
          </p>
          <div className={styles.actions}>
            <Link className="btn btnPrimary btnLarge" to="/shop">Shop equipment</Link>
            <Link className="btn btnSecondary btnLarge" to="/shop?stock=1">In stock now</Link>
          </div>
        </div>
        <div className={styles.heroArt} aria-hidden="true">
          <span className={styles.bigWord}>FAMI</span>
          <SportIcon sport="Cricket" size={220} className={styles.heroIcon} />
        </div>
      </section>

      <p className={styles.ribbon} aria-hidden="true">
        {CATEGORIES.map((category) => <span key={category}>{category}<i>/</i></span>)}
        {CATEGORIES.map((category) => <span key={`${category}-2`}>{category}<i>/</i></span>)}
      </p>

      <section className={styles.section} aria-labelledby="sports-heading">
        <p className="eyebrow">01 — Categories</p>
        <h2 id="sports-heading">Shop by sport</h2>
        <ul className={styles.categories}>
          {CATEGORIES.map((category) => (
            <li key={category}>
              <Link to={`/shop?category=${category}`}>
                <SportIcon sport={category} size={44} />
                <span className={styles.catName}>{category}</span>
                <span className={styles.catCount}>
                  {loading ? '…' : `${products.filter((product) => product.category === category).length} products`}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="rules-heading">
        <p className="eyebrow">02 — Know before you buy</p>
        <h2 id="rules-heading">No surprises at checkout</h2>
        <ul className={styles.facts}>
          <li><strong>Rs. {FREE_DELIVERY_THRESHOLD.toLocaleString()}</strong><span>Free delivery from this subtotal. Otherwise Rs. {DELIVERY_FEE}. Pickup is always free.</span></li>
          <li><strong>{MAX_PER_ORDER} max</strong><span>Units of one product per order, and never above current stock.</span></li>
          <li><strong>{MIN_PLAYER_AGE}+</strong><span>Player age. Junior gear is sized for ages 13–17 and checked at checkout.</span></li>
          <li><strong>2 cities</strong><span>Delivery in Islamabad and Rawalpindi only.</span></li>
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="featured-heading">
        <p className="eyebrow">03 — Ready to ship</p>
        <div className={styles.rowHead}>
          <h2 id="featured-heading">Featured equipment</h2>
          <Link className="btn btnSecondary" to="/shop">View all</Link>
        </div>
        {loading ? <Loader /> : null}
        {!loading && error ? <ErrorState message={error.message} onRetry={reload} /> : null}
        {!loading && !error ? <ProductGrid products={featured} /> : null}
      </section>
    </>
  );
}
