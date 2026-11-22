// Rule 1 (Availability / capacity): 1 to 5 units of one product per order,
// and never more than the units currently in stock.
export const MIN_PER_ORDER = 1;
export const MAX_PER_ORDER = 5;

/**
 * Check a requested quantity against the order limit and current stock.
 * Pure function: the UI and the automated test use this same code.
 * @returns {{ valid: boolean, status: string, allowedMax: number, message: string }}
 */
export function validateQuantity(quantity, stock, maxPerOrder = MAX_PER_ORDER) {
  const allowedMax = Math.max(0, Math.min(maxPerOrder, stock));

  if (!Number.isInteger(quantity)) {
    return { valid: false, status: 'not-integer', allowedMax, message: 'Enter a whole number.' };
  }
  if (stock <= 0) {
    return { valid: false, status: 'out-of-stock', allowedMax: 0, message: 'This product is out of stock.' };
  }
  if (quantity < MIN_PER_ORDER) {
    return { valid: false, status: 'too-low', allowedMax, message: `Minimum quantity is ${MIN_PER_ORDER}.` };
  }
  if (quantity > allowedMax) {
    // Say which limit was hit: stock or the per-order cap.
    return stock < maxPerOrder
      ? { valid: false, status: 'over-stock', allowedMax, message: `Only ${stock} in stock. Choose ${allowedMax} or fewer.` }
      : { valid: false, status: 'over-limit', allowedMax, message: `Maximum ${maxPerOrder} per order. Choose ${maxPerOrder} or fewer.` };
  }
  return { valid: true, status: 'ok', allowedMax, message: '' };
}
