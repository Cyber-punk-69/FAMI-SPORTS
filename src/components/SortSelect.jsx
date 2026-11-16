export function SortSelect({ value, onChange }) {
  return (
    <label>
      Sort by
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="name">Name</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
        <option value="availability">Availability</option>
      </select>
    </label>
  );
}
