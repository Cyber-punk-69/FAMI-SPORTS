import assert from 'node:assert/strict';
import { test } from 'node:test';
import { MAX_PER_ORDER, validateQuantity } from '../src/rules/quantityRule.js';

test('accepts an ordinary valid quantity', () => {
  const result = validateQuantity(3, 10);
  assert.equal(result.valid, true);
  assert.equal(result.status, 'ok');
});

test('accepts exactly the per-order limit (boundary)', () => {
  const result = validateQuantity(MAX_PER_ORDER, 10);
  assert.equal(result.valid, true);
  assert.equal(result.allowedMax, 5);
});

test('rejects one above the limit with a specific message', () => {
  const result = validateQuantity(MAX_PER_ORDER + 1, 10);
  assert.equal(result.valid, false);
  assert.equal(result.status, 'over-limit');
  assert.match(result.message, /Maximum 5 per order/);
});

test('rejects a quantity above current stock and names the stock', () => {
  const result = validateQuantity(3, 2);
  assert.equal(result.valid, false);
  assert.equal(result.status, 'over-stock');
  assert.equal(result.allowedMax, 2);
  assert.match(result.message, /Only 2 in stock/);
});

test('accepts exactly the remaining stock when stock is below the limit', () => {
  assert.equal(validateQuantity(2, 2).valid, true);
});

test('rejects zero, negatives, decimals and out-of-stock products', () => {
  assert.equal(validateQuantity(0, 10).status, 'too-low');
  assert.equal(validateQuantity(-1, 10).status, 'too-low');
  assert.equal(validateQuantity(1.5, 10).status, 'not-integer');
  assert.equal(validateQuantity(1, 0).status, 'out-of-stock');
});
