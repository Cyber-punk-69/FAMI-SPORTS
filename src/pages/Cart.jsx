import { Link } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState.jsx';
import { ErrorState } from '../components/ErrorState.jsx';
import { Loader } from '../components/Loader.jsx';
import { ProductImage } from '../components/ProductImage.jsx';
import { QuantityControl } from '../components/QuantityControl.jsx';
import { OrderSummary } from '../components/OrderSummary.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import styles from './Cart.module.css';

export function Cart() {
  const { loading, error, reload } = useProducts();
  const { items, lines, issues, subtotal, notice, dismissNotice, setQuantity, setOption, removeItem, fixIssues } = useCart();

  if (loading && items.length) return <Loader label="Checking your cart against current stock" />;
  if (error && items.length) return <ErrorState message={error.message} onRetry={reload} />;

  if (!items.length) {
    return (
      <EmptyState title="Your cart is empty" message="Pick up some gear and it will wait here, even if you close the tab.">
        <Link className="btn btnPrimary" to="/shop">Browse equipment</Link>
      </EmptyState>
    );
  }

  return (
    <>
      <header className="pageHead">
        <p className="eyebrow">Step 1 of 3 · Review</p>
        <h1>Your cart</h1>
      </header>

      {notice ? (
        <div className="alert alertInfo" role="status">
          <p>{notice}</p>
          <button className="btn btnSecondary" type="button" onClick={dismissNotice}>Dismiss</button>
        </div>
      ) : null}

      {issues.length > 0 ? (
        <div className="alert" role="alert">
          <div>
            <p><strong>Your cart needs attention.</strong> Availability changed since you added these items:</p>
            <ul className={styles.issueList}>
              {issues.map((line) => (
                <li key={line.productId}>{line.product ? line.product.name : line.productId}: {line.issue.message}</li>
              ))}
            </ul>
          </div>
          <button className="btn btnPrimary" type="button" onClick={fixIssues}>Fix my cart</button>
        </div>
      ) : null}

      <div className={styles.layout}>
        <ul className={styles.list}>
          {lines.map((line) => {
            const { product } = line;
            if (!product) {
              return (
                <li key={line.productId} className={`${styles.row} ${styles.rowIssue}`}>
                  <p>Unknown product “{line.productId}” — {line.issue.message}</p>
                  <button className="btn btnSecondary" type="button" onClick={() => removeItem(line.productId)}>Remove</button>
                </li>
              );
            }
            return (
              <li key={product.id} className={`${styles.row} ${line.issue ? styles.rowIssue : ''}`}>
                <Link to={`/items/${product.id}`} className={styles.thumb} aria-label={`View ${product.name}`}><ProductImage product={product} /></Link>
                <div className={styles.info}>
                  <h2><Link to={`/items/${product.id}`}>{product.name}</Link></h2>
                  <p className={styles.unit}>Rs. {product.price.toLocaleString()} each</p>
                  {line.issue ? <p className="fieldError">⚠ {line.issue.message}</p> : null}
                  {Object.entries(product.options ?? {}).map(([key, values]) => (
                    <div className={`field ${styles.option}`} key={key}>
                      <label htmlFor={`${product.id}-${key}`}>{key === 'grip' ? 'Grip colour' : key.charAt(0).toUpperCase() + key.slice(1)}</label>
                      <select id={`${product.id}-${key}`} value={line.options[key] ?? values[0]} onChange={(event) => setOption(product.id, key, event.target.value)}>
                        {values.map((value) => <option key={value}>{value}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <div className={styles.controls}>
                  <QuantityControl
                    value={line.quantity}
                    stock={product.stock}
                    revertOnBlur
                    onChange={(quantity) => { if (quantity !== null) setQuantity(product.id, quantity); }}
                  />
                  <p className={styles.lineTotal}>Rs. {line.lineTotal.toLocaleString()}</p>
                  <button className={`btn btnGhost ${styles.remove}`} type="button" onClick={() => removeItem(product.id)} aria-label={`Remove ${product.name} from cart`}>Remove</button>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className={styles.summary} aria-label="Order summary">
          <OrderSummary subtotal={subtotal} fulfilment="delivery" showProgress />
          {issues.length > 0 ? (
            <p className="fieldError" role="status">Resolve the items above to continue.</p>
          ) : (
            <Link className="btn btnPrimary btnLarge" to="/checkout">Checkout →</Link>
          )}
          <Link className="btn btnSecondary" to="/shop">Continue shopping</Link>
        </aside>
      </div>
    </>
  );
}
