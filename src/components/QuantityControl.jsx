import { useEffect, useId, useState } from 'react';
import { MAX_PER_ORDER, validateQuantity } from '../rules/quantityRule.js';
import styles from './QuantityControl.module.css';

/**
 * Quantity stepper that applies the 1-5 per order / stock rule.
 * `onChange` receives a valid whole number, or null while the typed value is invalid.
 */
export function QuantityControl({ value, stock, onChange, label = 'Quantity', revertOnBlur = false }) {
  const id = useId();
  const [draft, setDraft] = useState(String(value));
  const [error, setError] = useState('');
  const allowedMax = Math.min(MAX_PER_ORDER, stock);

  // Keep the field in step with the committed value (e.g. after "Fix cart").
  useEffect(() => { setDraft(String(value)); setError(''); }, [value]);

  function handleInput(text) {
    setDraft(text);
    const result = text.trim() === ''
      ? { valid: false, message: 'Enter a quantity.' }
      : validateQuantity(Number(text), stock);
    setError(result.valid ? '' : result.message);
    onChange(result.valid ? Number(text) : null);
  }

  function step(delta) {
    const next = (Number.isInteger(Number(draft)) ? Number(draft) : value) + delta;
    handleInput(String(Math.min(allowedMax, Math.max(1, next))));
  }

  function handleBlur() {
    if (revertOnBlur && error) { setDraft(String(value)); setError(''); onChange(value); }
  }

  return (
    <div className={styles.wrap}>
      <label htmlFor={id} className={styles.label}>{label}</label>
      <div className={styles.row}>
        <button type="button" className={styles.step} onClick={() => step(-1)} disabled={Number(draft) <= 1} aria-label="Decrease quantity">−</button>
        <input
          id={id}
          className={styles.input}
          type="number"
          inputMode="numeric"
          min="1"
          max={allowedMax}
          value={draft}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={`${id}-hint`}
          onChange={(event) => handleInput(event.target.value)}
          onBlur={handleBlur}
        />
        <button type="button" className={styles.step} onClick={() => step(1)} disabled={Number(draft) >= allowedMax} aria-label="Increase quantity">+</button>
      </div>
      <p id={`${id}-hint`} className={error ? styles.error : styles.hint} role={error ? 'alert' : undefined}>
        {error ? `Error: ${error}` : `${MAX_PER_ORDER === allowedMax ? `1–${MAX_PER_ORDER}` : `1–${allowedMax}`} per order${stock < MAX_PER_ORDER ? ` · only ${stock} in stock` : ''}`}
      </p>
    </div>
  );
}
