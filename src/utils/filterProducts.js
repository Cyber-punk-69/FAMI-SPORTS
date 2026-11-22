export const DEFAULT_FILTERS = {
  search: '', category: '', ageGroup: '', minPrice: '', maxPrice: '', inStockOnly: false, sort: 'name',
};

export function matchesFilters(product, { search, category, ageGroup, minPrice, maxPrice, inStockOnly }) {
  const query = search.trim().toLowerCase();
  const searchable = [product.name, product.brand, product.category, product.description, ...product.tags]
    .join(' ').toLowerCase();
  return (!query || searchable.includes(query))
    && (!category || product.category === category)
    && (!ageGroup || product.ageGroup === ageGroup)
    && (minPrice === '' || product.price >= Number(minPrice))
    && (maxPrice === '' || product.price <= Number(maxPrice))
    && (!inStockOnly || product.stock > 0);
}

export function filterAndSortProducts(products, filters) {
  const { sort } = filters;
  return products.filter((product) => matchesFilters(product, filters)).sort((first, second) => {
    if (sort === 'price-asc') return first.price - second.price;
    if (sort === 'price-desc') return second.price - first.price;
    if (sort === 'availability') return second.stock - first.stock || first.name.localeCompare(second.name);
    return first.name.localeCompare(second.name);
  });
}

const RELAXABLE = [
  { key: 'search', label: (f) => `search "${f.search.trim()}"`, empty: '' },
  { key: 'category', label: (f) => `category ${f.category}`, empty: '' },
  { key: 'ageGroup', label: (f) => `age group ${f.ageGroup}`, empty: '' },
  { key: 'minPrice', label: (f) => `minimum price Rs. ${f.minPrice}`, empty: '' },
  { key: 'maxPrice', label: (f) => `maximum price Rs. ${f.maxPrice}`, empty: '' },
  { key: 'inStockOnly', label: () => 'in-stock only', empty: false },
];

/** For an empty result: which single filter, if removed, would bring products back? */
export function suggestRelaxations(products, filters) {
  return RELAXABLE
    .filter(({ key, empty }) => filters[key] !== empty && String(filters[key]).trim() !== '')
    .map(({ key, label, empty }) => ({
      key,
      empty,
      label: label(filters),
      count: products.filter((product) => matchesFilters(product, { ...filters, [key]: empty })).length,
    }))
    .filter((option) => option.count > 0)
    .sort((first, second) => second.count - first.count);
}
