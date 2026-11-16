import { products } from '../data/products.js';

let shouldFail = false;
let stockOverrides = {};

export function setMockFailure(enabled) {
  shouldFail = enabled;
}

export function reduceMockStock(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) {
    throw new Error(`Unknown product: ${productId}`);
  }

  const currentStock = stockOverrides[productId] ?? product.stock;
  stockOverrides = { ...stockOverrides, [productId]: Math.max(0, currentStock - 1) };
}

export async function loadProducts({ delayMs = 250 } = {}) {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  if (shouldFail) {
    throw new Error('Demo loading failure. Retry after disabling the failure control.');
  }

  return products.map((product) => ({
    ...product,
    stock: stockOverrides[product.id] ?? product.stock,
  }));
}
