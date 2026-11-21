const categories = ['Cricket', 'Football', 'Badminton', 'Tennis', 'Fitness'];
const ageGroups = ['Adult', 'Junior (Teens 13-17)'];

export function FilterPanel({ filters, onChange, onClear }) {
  return (
    <fieldset>
      <legend>Filter products</legend>
      <label>
        Category
        <select
          value={filters.category}
          onChange={(event) => onChange({ category: event.target.value })}
        >
          <option value="">All categories</option>
          {categories.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
      </label>
      <label>
        Age group
        <select
          value={filters.ageGroup}
          onChange={(event) => onChange({ ageGroup: event.target.value })}
        >
          <option value="">All ages</option>
          {ageGroups.map((ageGroup) => <option key={ageGroup} value={ageGroup}>{ageGroup}</option>)}
        </select>
      </label>
      <label>
        Minimum price
        <input
          type="number"
          min="0"
          value={filters.minPrice}
          onChange={(event) => onChange({ minPrice: event.target.value })}
        />
      </label>
      <label>
        Maximum price
        <input
          type="number"
          min="0"
          value={filters.maxPrice}
          onChange={(event) => onChange({ maxPrice: event.target.value })}
        />
      </label>
      <label className="checkboxLabel">
        <input
          type="checkbox"
          checked={filters.inStockOnly}
          onChange={(event) => onChange({ inStockOnly: event.target.checked })}
        />
        In stock only
      </label>
      <button type="button" onClick={onClear}>Clear filters</button>
    </fieldset>
  );
}
