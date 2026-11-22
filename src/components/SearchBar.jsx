export function SearchBar({ value, onChange }) {
  return (
    <div className="field">
      <label htmlFor="shop-search">Search products</label>
      <input
        id="shop-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Bat, football, KickLab…"
        autoComplete="off"
      />
    </div>
  );
}
