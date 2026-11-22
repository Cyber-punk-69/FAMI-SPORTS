export function ErrorState({ message, onRetry }) {
  return (
    <section className="statePanel stateError" role="alert">
      <p className="eyebrow">Connection problem</p>
      <h2>We couldn’t load the catalogue</h2>
      <p>{message}</p>
      <button className="btn btnPrimary" type="button" onClick={onRetry}>Retry</button>
    </section>
  );
}
