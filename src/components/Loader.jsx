export function Loader({ label = 'Loading catalogue' }) {
  return (
    <div role="status" aria-live="polite" className="skeletonWrap">
      <p className="srOnly">{label}…</p>
      <div className="skeletonGrid" aria-hidden="true">{[1, 2, 3, 4].map((item) => <div className="skeletonCard" key={item} />)}</div>
    </div>
  );
}
