export function SearchBar({ value, onChange }) {
  return (
    <label>
      Search products
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by name, brand, or sport"
      />
    </label>
  );
}
