export function filterAndSortProducts(products, { search, category, ageGroup, minPrice, maxPrice, inStockOnly, sort }) {
  const query = search.trim().toLowerCase();
  const filtered = products.filter((product) => {
    const searchableText = [
      product.name,
      product.brand,
      product.category,
      product.description,
      ...product.tags,
    ].join(' ').toLowerCase();
    const matchesQuery = !query || searchableText.includes(query);
    const matchesCategory = !category || product.category === category;
    const matchesAge = !ageGroup || product.ageGroup === ageGroup;
    const matchesMin = !minPrice || product.price >= Number(minPrice);
    const matchesMax = !maxPrice || product.price <= Number(maxPrice);
    const matchesStock = !inStockOnly || product.stock > 0;
    return matchesQuery && matchesCategory && matchesAge && matchesMin && matchesMax && matchesStock;
  });

  return [...filtered].sort((first, second) => {
    if (sort === 'price-asc') return first.price - second.price;
    if (sort === 'price-desc') return second.price - first.price;
    if (sort === 'availability') return second.stock - first.stock;
    return first.name.localeCompare(second.name);
  });
}
