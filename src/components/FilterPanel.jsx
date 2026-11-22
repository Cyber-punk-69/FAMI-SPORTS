import styles from './FilterPanel.module.css';

export const CATEGORIES = ['Cricket', 'Football', 'Badminton', 'Tennis', 'Fitness'];
const AGE_GROUPS = ['Adult', 'Junior (Teens 13-17)'];

export function FilterPanel({ filters, onChange, onClear, hasFilters }) {
  return (
    <fieldset className={styles.panel}>
      <legend>Filter products</legend>
      <div className="field">
        <label htmlFor="filter-category">Sport</label>
        <select id="filter-category" value={filters.category} onChange={(event) => onChange({ category: event.target.value })}>
          <option value="">All sports</option>
          {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="filter-age">Age group</label>
        <select id="filter-age" value={filters.ageGroup} onChange={(event) => onChange({ ageGroup: event.target.value })}>
          <option value="">All ages</option>
          {AGE_GROUPS.map((ageGroup) => <option key={ageGroup} value={ageGroup}>{ageGroup}</option>)}
        </select>
      </div>
      <div className={styles.priceRow}>
        <div className="field">
          <label htmlFor="filter-min">Min price (Rs.)</label>
          <input id="filter-min" type="number" inputMode="numeric" min="0" value={filters.minPrice} onChange={(event) => onChange({ minPrice: event.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="filter-max">Max price (Rs.)</label>
          <input id="filter-max" type="number" inputMode="numeric" min="0" value={filters.maxPrice} onChange={(event) => onChange({ maxPrice: event.target.value })} />
        </div>
      </div>
      <label className="check" htmlFor="filter-stock">
        <input id="filter-stock" type="checkbox" checked={filters.inStockOnly} onChange={(event) => onChange({ inStockOnly: event.target.checked })} />
        <span>In stock only</span>
      </label>
      <button className="btn btnSecondary" type="button" onClick={onClear} disabled={!hasFilters}>Clear all filters</button>
    </fieldset>
  );
}
