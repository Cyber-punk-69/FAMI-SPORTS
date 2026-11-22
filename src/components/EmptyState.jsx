export function EmptyState({ title, message, children }) {
  return (
    <section className="statePanel">
      <h2>{title}</h2>
      <p>{message}</p>
      {children}
    </section>
  );
}
