export function EmptyState({ title, message, action }) {
  return (
    <section>
      <h2>{title}</h2>
      <p>{message}</p>
      {action}
    </section>
  );
}
