import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <section className="statePanel">
      <p className="eyebrow">Error 404</p>
      <h1>Page not found</h1>
      <p>We couldn’t find that page. Check the address, or head back to the shop.</p>
      <Link className="btn btnPrimary" to="/shop">Browse the shop</Link>
    </section>
  );
}
