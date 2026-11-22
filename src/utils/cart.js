import { validateQuantity } from '../rules/quantityRule.js';

/** Keep only well-formed entries from saved data. Returns the clean list and how many were dropped. */
export function sanitizeStoredCart(stored) {
  if (!Array.isArray(stored)) return { items: [], dropped: stored ? 1 : 0 };
  const items = stored
    .filter((entry) => entry && typeof entry.productId === 'string' && Number.isInteger(entry.quantity) && entry.quantity > 0)
    .map((entry) => ({
      productId: entry.productId,
      quantity: entry.quantity,
      options: entry.options && typeof entry.options === 'object' ? entry.options : {},
    }));
  return { items, dropped: stored.length - items.length };
}

/** Join cart entries with current product data and check each against current rules. */
export function buildCartLines(items, products) {
  return items.map((item) => {
    const product = products.find((entry) => entry.id === item.productId) ?? null;
    if (!product) {
      return { ...item, product: null, issue: { status: 'missing', message: 'This product is no longer in the catalogue.', fixedQuantity: 0 } };
    }
    const check = validateQuantity(item.quantity, product.stock);
    const issue = check.valid
      ? null
      : { status: check.status, message: check.message, fixedQuantity: check.allowedMax };
    return { ...item, product, lineTotal: product.price * item.quantity, issue };
  });
}

export function cartTotals(lines) {
  const valid = lines.filter((line) => line.product);
  return {
    itemCount: valid.reduce((sum, line) => sum + line.quantity, 0),
    subtotal: valid.reduce((sum, line) => sum + line.lineTotal, 0),
  };
}

/** Apply suggested fixes: clamp quantity, remove lines that cannot be kept. */
export function applyFixes(items, lines) {
  return items
    .map((item) => {
      const line = lines.find((entry) => entry.productId === item.productId);
      return line?.issue ? { ...item, quantity: line.issue.fixedQuantity } : item;
    })
    .filter((item) => item.quantity > 0);
}
