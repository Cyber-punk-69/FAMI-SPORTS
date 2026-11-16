export function ErrorState({ message, onRetry }) {
  return (
    <section role="alert">
      <h2>Something went wrong</h2>
      <p>{message}</p>
      <button type="button" onClick={onRetry}>Retry</button>
    </section>
  );
}
