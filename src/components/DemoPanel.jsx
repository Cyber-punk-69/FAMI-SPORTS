import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import { getDemoSettings, resetDemo, setMockFailure, setStockOverride } from '../services/mockApi.js';
import styles from './DemoPanel.module.css';

// Labelled testing controls: simulate a loading failure and changed availability (Task 6.1).
export function DemoPanel() {
  const { products, reload } = useProducts();
  const { items } = useCart();
  const [settings, setSettings] = useState(getDemoSettings);
  const [productId, setProductId] = useState('');
  const [stock, setStock] = useState('0');
  const selected = productId || items[0]?.productId || products[0]?.id || '';

  function toggleFailure(enabled) {
    setMockFailure(enabled);
    setSettings(getDemoSettings());
    reload();
  }

  function applyStock(event) {
    event.preventDefault();
    const value = Number(stock);
    if (!selected || !Number.isInteger(value) || value < 0) return;
    setStockOverride(selected, value);
    setSettings(getDemoSettings());
    reload({ silent: true });
  }

  function handleReset() {
    resetDemo();
    setSettings(getDemoSettings());
    reload();
  }

  return (
    <details className={styles.panel}>
      <summary>Demo controls <span>(testing only)</span></summary>
      <div className={styles.body}>
        <p>These controls simulate failures for marking and testing. They are not part of the customer journey.</p>
        <label className="check" htmlFor="demo-fail">
          <input id="demo-fail" type="checkbox" checked={settings.failLoad} onChange={(event) => toggleFailure(event.target.checked)} />
          <span>Simulate catalogue loading failure</span>
        </label>
        <form className={styles.stockForm} onSubmit={applyStock}>
          <div className="field">
            <label htmlFor="demo-product">Product</label>
            <select id="demo-product" value={selected} onChange={(event) => setProductId(event.target.value)}>
              {products.map((product) => <option key={product.id} value={product.id}>{product.name.slice(0, 40)} (stock {product.stock})</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="demo-stock">New stock</label>
            <input id="demo-stock" type="number" min="0" value={stock} onChange={(event) => setStock(event.target.value)} />
          </div>
          <button className="btn btnSecondary" type="submit">Change availability</button>
        </form>
        <button className="btn btnGhost" type="button" onClick={handleReset}>Reset demo data</button>
      </div>
    </details>
  );
}
