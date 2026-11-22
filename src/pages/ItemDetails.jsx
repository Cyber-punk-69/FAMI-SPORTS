import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ErrorState } from '../components/ErrorState.jsx';
import { Loader } from '../components/Loader.jsx';
import { ProductGrid } from '../components/ProductGrid.jsx';
import { ProductImage } from '../components/ProductImage.jsx';
import { QuantityControl } from '../components/QuantityControl.jsx';
import { StockBadge } from '../components/StatusBadge.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import { isJuniorProduct } from '../rules/ageRule.js';
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from '../rules/deliveryRule.js';
import styles from './ItemDetails.module.css';

export function ItemDetails() {
  const { id } = useParams();
  const { products, loading, error, reload } = useProducts();
  const { addItem, items } = useCart();
  const [quantity, setQuantity] = useState(1);        // null while the typed value is invalid
  const [chosen, setChosen] = useState({});            // selected option values
  const [feedback, setFeedback] = useState(null);

  if (loading) return <Loader label="Loading product" />;
  if (error) return <ErrorState message={error.message} onRetry={reload} />;

  const product = products.find((item) => item.id === id);
  if (!product) {
    return (
      <section className="statePanel">
        <p className="eyebrow">Error 404</p>
        <h1>Item not found</h1>
        <p>There is no product with the code “{id}”. It may have been removed or the link may be wrong.</p>
        <div className={styles.actions}>
          <Link className="btn btnPrimary" to="/shop">Browse all equipment</Link>
          <Link className="btn btnSecondary" to="/">Back to home</Link>
        </div>
      </section>
    );
  }

  const inCart = items.find((item) => item.productId === product.id)?.quantity ?? 0;
  const optionEntries = Object.entries(product.options ?? {});
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3);
  const soldOut = product.stock === 0;

  function handleSubmit(event) {
    event.preventDefault();
    if (quantity === null) return;
    const options = Object.fromEntries(optionEntries.map(([key, values]) => [key, chosen[key] ?? values[0]]));
    setFeedback(addItem(product.id, quantity, options));
  }

  return (
    <>
      <nav className={styles.crumbs} aria-label="Breadcrumb">
        <Link to="/shop">Shop</Link><span aria-hidden="true">/</span>
        <Link to={`/shop?category=${product.category}`}>{product.category}</Link><span aria-hidden="true">/</span>
        <span aria-current="page">{product.name}</span>
      </nav>

      <article className={styles.layout}>
        <div className={styles.visual}><ProductImage product={product} /></div>

        <div className={styles.info}>
          <p className="eyebrow">{product.brand} · {product.category}</p>
          <h1>{product.name}</h1>
          <div className={styles.meta}>
            <p className={styles.price}><span>Rs.</span> {product.price.toLocaleString()}</p>
            <StockBadge stock={product.stock} />
          </div>
          <p className="lead">{product.description}</p>

          <dl className={styles.specs}>
            <div><dt>Size</dt><dd>{product.specs.size}</dd></div>
            <div><dt>Weight</dt><dd>{product.specs.weight}</dd></div>
            <div><dt>Material</dt><dd>{product.specs.material}</dd></div>
            <div><dt>Suitable for</dt><dd>{isJuniorProduct(product) ? 'Players aged 13–17 only' : 'Players aged 13 and over'}</dd></div>
          </dl>

          <form className={styles.buy} onSubmit={handleSubmit} aria-label="Add to cart">
            {soldOut ? (
              <p className="alert"><strong>Out of stock.</strong> <Link to={`/shop?category=${product.category}&stock=1`}>See in-stock {product.category} gear</Link></p>
            ) : (
              <>
                {optionEntries.map(([key, values]) => (
                  <div className="field" key={key}>
                    <label htmlFor={`option-${key}`}>{key === 'grip' ? 'Grip colour' : key.charAt(0).toUpperCase() + key.slice(1)}</label>
                    <select id={`option-${key}`} value={chosen[key] ?? values[0]} onChange={(event) => setChosen((current) => ({ ...current, [key]: event.target.value }))}>
                      {values.map((value) => <option key={value}>{value}</option>)}
                    </select>
                  </div>
                ))}
                <QuantityControl value={1} stock={product.stock} onChange={setQuantity} />
                <button className="btn btnPrimary btnLarge" type="submit" disabled={quantity === null}>Add to cart</button>
                <p className={feedback?.ok === false ? 'fieldError' : 'fieldHint'} role="status">
                  {feedback ? `${feedback.ok ? '✓' : 'Error:'} ${feedback.message}` : inCart ? `Already in your cart: ${inCart}` : ''}
                </p>
                {feedback?.ok ? <Link className="btn btnSecondary" to="/cart">View cart &amp; checkout</Link> : null}
              </>
            )}
          </form>

          <ul className={styles.notes}>
            <li><strong>Before checkout:</strong> delivery is Rs. {DELIVERY_FEE}, free from Rs. {FREE_DELIVERY_THRESHOLD.toLocaleString()}. Pickup in F-7, Islamabad is free.</li>
            <li>Delivery covers Islamabad and Rawalpindi only.</li>
            <li>Limit of 5 units per order, or the units in stock if fewer.</li>
          </ul>
        </div>
      </article>

      {related.length > 0 ? (
        <section className={styles.related} aria-labelledby="related-heading">
          <p className="eyebrow">Keep comparing</p>
          <h2 id="related-heading">More {product.category}</h2>
          <ProductGrid products={related} />
        </section>
      ) : null}
    </>
  );
}
