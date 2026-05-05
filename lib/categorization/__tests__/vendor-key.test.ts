import { test } from 'node:test';
import assert from 'node:assert/strict';
import { vendorKey } from '../vendor-key';

test('vendorKey: lowercases and collapses whitespace', () => {
  assert.equal(vendorKey('STARBUCKS  COFFEE'), 'starbucks coffee');
});

test('vendorKey: strips accents (Spanish/UY)', () => {
  assert.equal(vendorKey('Pagó Café'), 'pago cafe');
});

test('vendorKey: trims and handles internal tabs/newlines', () => {
  assert.equal(vendorKey('  ITAÚ\tMASTER\n123  '), 'itau master 123');
});

test('vendorKey: returns null for empty/whitespace/null/undefined', () => {
  assert.equal(vendorKey(''), null);
  assert.equal(vendorKey('   '), null);
  assert.equal(vendorKey(null), null);
  assert.equal(vendorKey(undefined), null);
});

test('vendorKey: caps at 80 chars', () => {
  const k = vendorKey('A'.repeat(200));
  assert.equal(k!.length, 80);
});

test('vendorKey: idempotent on already-normalized input', () => {
  const once = vendorKey('mc donalds av brasil');
  const twice = vendorKey(once!);
  assert.equal(once, twice);
});
