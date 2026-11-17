export function Loader() {
  return <div role="status" aria-label="Loading products" className="skeletonGrid">{[1, 2, 3, 4].map((item) => <div className="skeletonCard" key={item} />)}</div>;
}
