export function SortSelect({ value, onChange }) {
  return (
    <div className="field">
      <label htmlFor="shop-sort">Sort by</label>
      <select id="shop-sort" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="name">Name (A–Z)</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
        <option value="availability">Availability</option>
      </select>
    </div>
  );
}
