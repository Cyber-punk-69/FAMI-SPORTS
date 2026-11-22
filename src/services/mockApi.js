import { products } from '../data/products.js';
import { readJson, writeJson } from '../utils/storage.js';

const DEMO_KEY = 'fami-sports-demo';

// Demo settings survive a page refresh so "changed availability" can be tested
// against a cart restored from localStorage.
let demo = { failLoad: false, stockOverrides: {}, ...readJson(DEMO_KEY, {}) };
let orderedUnits = {}; // stock used by simulated orders (resets on refresh)

function saveDemo() {
  writeJson(DEMO_KEY, demo);
}

export function getDemoSettings() {
  return { failLoad: demo.failLoad, stockOverrides: { ...demo.stockOverrides } };
}

export function setMockFailure(enabled) {
  demo = { ...demo, failLoad: enabled };
  saveDemo();
}

export function setStockOverride(productId, stock) {
  demo = { ...demo, stockOverrides: { ...demo.stockOverrides, [productId]: Math.max(0, stock) } };
  saveDemo();
}

export function resetDemo() {
  demo = { failLoad: false, stockOverrides: {} };
  orderedUnits = {};
  saveDemo();
}

function currentStock(product) {
  const base = demo.stockOverrides[product.id] ?? product.stock;
  return Math.max(0, base - (orderedUnits[product.id] ?? 0));
}

/** Simulated network load of the local catalogue. */
export async function loadProducts({ delayMs = 400 } = {}) {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  if (demo.failLoad) {
    throw new Error('We could not load the catalogue (demo failure is switched on). Turn it off in Demo controls, then retry.');
  }
  return products.map((product) => ({ ...product, stock: currentStock(product) }));
}

/** Simulated order: re-checks stock, then reserves units. No real payment or data is sent. */
export async function placeOrder(lines, details) {
  await new Promise((resolve) => setTimeout(resolve, 600));
  if (demo.failLoad) throw new Error('The order service is unavailable (demo failure is on). Please retry.');
  const conflicts = lines.filter((line) => {
    const product = products.find((entry) => entry.id === line.productId);
    return !product || line.quantity > currentStock(product);
  });
  if (conflicts.length) {
    const error = new Error('Availability changed while you were checking out.');
    error.conflicts = conflicts.map((line) => line.productId);
    throw error;
  }
  orderedUnits = lines.reduce((acc, line) => ({ ...acc, [line.productId]: (acc[line.productId] ?? 0) + line.quantity }), orderedUnits);
  return { id: `FAMI-${Date.now().toString(36).toUpperCase().slice(-6)}`, placedAt: new Date().toISOString(), ...details };
}
