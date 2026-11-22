import { useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ErrorState } from '../components/ErrorState.jsx';
import { Loader } from '../components/Loader.jsx';
import { OrderSummary } from '../components/OrderSummary.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useProducts } from '../context/ProductsContext.jsx';
import { findAgeConflicts } from '../rules/ageRule.js';
import { SERVICE_AREAS } from '../rules/deliveryRule.js';
import { placeOrder } from '../services/mockApi.js';
import { writeSession } from '../utils/storage.js';
import { validateCheckout } from '../utils/validation.js';
import styles from './Checkout.module.css';

const FIELD_ORDER = ['name', 'phone', 'city', 'address', 'age'];
const INITIAL = { name: '', phone: '', fulfilment: 'delivery', city: '', address: '', age: '' };

export function Checkout() {
  const navigate = useNavigate();
  const { loading, error: loadError, reload } = useProducts();
  const { items, lines, issues, subtotal, itemCount, clearCart } = useCart();
  const [form, setForm] = useState(INITIAL);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const orderPlaced = useRef(false);

  if (loading && items.length) return <Loader label="Preparing checkout" />;
  if (loadError && items.length) return <ErrorState message={loadError.message} onRetry={reload} />;
  if (!items.length && !orderPlaced.current) return <Navigate to="/cart" replace />;

  const errors = validateCheckout(form);
  // Eligibility rule: compare the player age with the products in the cart.
  const ageNumber = Number(form.age);
  const ageConflicts = Number.isInteger(ageNumber) && form.age !== '' && !errors.age
    ? findAgeConflicts(ageNumber, lines.filter((line) => line.product).map((line) => line.product))
    : [];
  const showError = (field) => ((touched[field] || submitted) ? errors[field] : undefined);

  // Controlled form: copy the form object, change one field (no mutation).
  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setSubmitError('');
  }
  const touch = (field) => setTouched((current) => ({ ...current, [field]: true }));

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    const invalidField = FIELD_ORDER.find((field) => errors[field]);
    if (invalidField) {
      document.getElementById(`checkout-${invalidField}`)?.focus();
      return;
    }
    if (issues.length || ageConflicts.length) return;

    setSubmitting(true);
    try {
      const order = await placeOrder(
        items,
        {
          fulfilment: form.fulfilment,
          city: form.fulfilment === 'delivery' ? form.city : 'Pickup (F-7 Markaz, Islamabad)',
          items: lines.map((line) => ({ productId: line.productId, name: line.product.name, quantity: line.quantity, price: line.product.price, options: line.options })),
          subtotal,
          deliveryFee: form.fulfilment === 'pickup' || subtotal >= 5000 ? 0 : 250,
        },
      );
      orderPlaced.current = true;
      writeSession('fami-sports-last-order', order);
      clearCart();
      reload({ silent: true });
      navigate('/confirmation', { replace: true, state: { order, firstName: form.name.trim().split(' ')[0] } });
    } catch (error) {
      setSubmitError(error.conflicts
        ? 'Stock changed while you were checking out. Review your cart and try again.'
        : error.message);
      reload({ silent: true });
    } finally {
      setSubmitting(false);
    }
  }

  const listed = FIELD_ORDER.filter((field) => submitted && errors[field]);

  return (
    <>
      <header className="pageHead">
        <p className="eyebrow">Step 2 of 3 · Details</p>
        <h1>Checkout</h1>
        <p><strong>Simulated order.</strong> No payment is taken. Please use fictional details only.</p>
      </header>

      {issues.length > 0 ? (
        <div className="alert" role="alert">
          <p><strong>Your cart changed.</strong> Some items are no longer available in these quantities.</p>
          <Link className="btn btnPrimary" to="/cart">Review cart</Link>
        </div>
      ) : null}

      {submitError ? (
        <div className="alert" role="alert">
          <p><strong>Order not placed.</strong> {submitError}</p>
          <Link className="btn btnSecondary" to="/cart">Back to cart</Link>
        </div>
      ) : null}

      <div className={styles.layout}>
        <form className={styles.form} onSubmit={handleSubmit} noValidate aria-label="Checkout details">
          {listed.length > 0 ? (
            <div className="alert" role="alert">
              <div>
                <p><strong>Please fix {listed.length} field{listed.length === 1 ? '' : 's'}:</strong></p>
                <ul className={styles.errorList}>
                  {listed.map((field) => <li key={field}><a href={`#checkout-${field}`}>{errors[field]}</a></li>)}
                </ul>
              </div>
            </div>
          ) : null}

          <fieldset>
            <legend>Contact</legend>
            <Field id="name" label="Full name" error={showError('name')}>
              <input id="checkout-name" autoComplete="off" value={form.name} onChange={(event) => update('name', event.target.value)} onBlur={() => touch('name')} aria-invalid={Boolean(showError('name'))} aria-describedby="checkout-name-msg" />
            </Field>
            <Field id="phone" label="Mobile number" hint="Format: 0300-1234567" error={showError('phone')}>
              <input id="checkout-phone" type="tel" inputMode="tel" autoComplete="off" placeholder="0300-1234567" value={form.phone} onChange={(event) => update('phone', event.target.value)} onBlur={() => touch('phone')} aria-invalid={Boolean(showError('phone'))} aria-describedby="checkout-phone-msg" />
            </Field>
            <Field id="age" label="Player age" hint="Junior gear is for ages 13–17. Minimum age is 13." error={showError('age')}>
              <input id="checkout-age" type="number" inputMode="numeric" value={form.age} onChange={(event) => update('age', event.target.value)} onBlur={() => touch('age')} aria-invalid={Boolean(showError('age'))} aria-describedby="checkout-age-msg" />
            </Field>
            {ageConflicts.length > 0 ? (
              <div className="alert" role="alert">
                <div>
                  <p><strong>Age restriction</strong></p>
                  <ul className={styles.errorList}>{ageConflicts.map((conflict) => <li key={conflict.product.id}>{conflict.message}</li>)}</ul>
                </div>
                <Link className="btn btnSecondary" to="/cart">Edit cart</Link>
              </div>
            ) : null}
          </fieldset>

          <fieldset>
            <legend>Delivery or pickup</legend>
            <div className={styles.choices}>
              <label className={`${styles.choice} ${form.fulfilment === 'delivery' ? styles.choiceOn : ''}`}>
                <input type="radio" name="fulfilment" value="delivery" checked={form.fulfilment === 'delivery'} onChange={() => update('fulfilment', 'delivery')} />
                <span><strong>Delivery</strong><small>Rs. 250, free from Rs. 5,000</small></span>
              </label>
              <label className={`${styles.choice} ${form.fulfilment === 'pickup' ? styles.choiceOn : ''}`}>
                <input type="radio" name="fulfilment" value="pickup" checked={form.fulfilment === 'pickup'} onChange={() => update('fulfilment', 'pickup')} />
                <span><strong>Pickup</strong><small>Free · F-7 Markaz, Islamabad</small></span>
              </label>
            </div>
            {form.fulfilment === 'delivery' ? (
              <>
                <Field id="city" label="City" hint={`We deliver in ${SERVICE_AREAS.join(' and ')} only.`} error={showError('city')}>
                  <select id="checkout-city" value={form.city} onChange={(event) => update('city', event.target.value)} onBlur={() => touch('city')} aria-invalid={Boolean(showError('city'))} aria-describedby="checkout-city-msg">
                    <option value="">Select a city</option>
                    {SERVICE_AREAS.map((city) => <option key={city}>{city}</option>)}
                    <option>Lahore</option>
                    <option>Karachi</option>
                  </select>
                </Field>
                <Field id="address" label="Delivery address" error={showError('address')}>
                  <textarea id="checkout-address" value={form.address} onChange={(event) => update('address', event.target.value)} onBlur={() => touch('address')} aria-invalid={Boolean(showError('address'))} aria-describedby="checkout-address-msg" />
                </Field>
              </>
            ) : null}
          </fieldset>

          <div className={styles.actions}>
            <button className="btn btnPrimary btnLarge" type="submit" disabled={submitting || issues.length > 0}>
              {submitting ? 'Placing order…' : 'Place simulated order'}
            </button>
            <Link className="btn btnSecondary" to="/cart">Back to cart</Link>
          </div>
        </form>

        <aside className={styles.summary} aria-label="Order summary">
          <OrderSummary subtotal={subtotal} itemCount={itemCount} fulfilment={form.fulfilment} showProgress />
          <ul className={styles.mini}>
            {lines.filter((line) => line.product).map((line) => (
              <li key={line.productId}><span>{line.product.name} × {line.quantity}</span><strong>Rs. {line.lineTotal.toLocaleString()}</strong></li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}

// Label + control + message wrapper; the child supplies the input with a matching id.
function Field({ id, label, hint, error, children }) {
  return (
    <div className="field">
      <label htmlFor={`checkout-${id}`}>{label}</label>
      {children}
      <p id={`checkout-${id}-msg`} className={error ? 'fieldError' : 'fieldHint'}>{error ? `Error: ${error}` : hint ?? ''}</p>
    </div>
  );
}
