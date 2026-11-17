import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export function Confirmation() {
  const { state } = useLocation();
  const { clearCart } = useCart();
  useEffect(() => {
    if (state) clearCart();
  }, [state]);

  return (
    <section>
      <h1>Order received</h1>
      <p>Thank you{state?.name ? `, ${state.name}` : ''}. We will contact you to confirm your order.</p>
      <p>{state?.delivery === 'pickup' ? 'Your order will be ready for free pickup.' : 'Your order will be delivered in Islamabad or Rawalpindi.'}</p>
      <Link to="/shop">Continue shopping</Link>
    </section>
  );
}
