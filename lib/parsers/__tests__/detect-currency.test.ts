import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectCurrencyFromText, detectCurrencyFromAmount } from '../detect-currency';

// --- detectCurrencyFromText -----------------------------------------------

test('detectCurrencyFromText: U$S marker => USD', () => {
  assert.equal(detectCurrencyFromText('Saldo: U$S 1.234,50'), 'USD');
});

test('detectCurrencyFromText: US$ marker => USD', () => {
  assert.equal(detectCurrencyFromText('Total US$ 50,00'), 'USD');
});

test('detectCurrencyFromText: USD code => USD', () => {
  assert.equal(detectCurrencyFromText('Moneda: USD'), 'USD');
});

test('detectCurrencyFromText: DÓLARES (with accent) => USD', () => {
  assert.equal(detectCurrencyFromText('Estado de cuenta en DÓLARES'), 'USD');
});

test('detectCurrencyFromText: DOLARES (no accent) => USD', () => {
  assert.equal(detectCurrencyFromText('Operaciones en DOLARES americanos'), 'USD');
});

test('detectCurrencyFromText: DÓLAR singular => USD', () => {
  assert.equal(detectCurrencyFromText('Cuenta en DÓLAR'), 'USD');
});

test('detectCurrencyFromText: $U marker => UYU', () => {
  assert.equal(detectCurrencyFromText('Saldo: $U 1.234,50'), 'UYU');
});

test('detectCurrencyFromText: UYU code => UYU', () => {
  assert.equal(detectCurrencyFromText('Moneda: UYU'), 'UYU');
});

test('detectCurrencyFromText: PESOS => UYU', () => {
  assert.equal(detectCurrencyFromText('Importes expresados en PESOS uruguayos'), 'UYU');
});

test('detectCurrencyFromText: PESO singular => UYU', () => {
  assert.equal(detectCurrencyFromText('Cuenta en PESO uruguayo'), 'UYU');
});

test('detectCurrencyFromText: MONEDA NACIONAL => UYU', () => {
  assert.equal(detectCurrencyFromText('Cuenta en MONEDA NACIONAL'), 'UYU');
});

test('detectCurrencyFromText: USD + UYU markers => null (ambiguous)', () => {
  assert.equal(detectCurrencyFromText('Total en USD y también PESOS'), null);
});

test('detectCurrencyFromText: empty string => null', () => {
  assert.equal(detectCurrencyFromText(''), null);
});

test('detectCurrencyFromText: no markers => null', () => {
  assert.equal(detectCurrencyFromText('Solo texto sin moneda'), null);
});

test('detectCurrencyFromText: "DÓLARES ... pesos" caveat does not flip to UYU', () => {
  // Real-world phrasing where USD section mentions pesos parenthetically.
  assert.equal(
    detectCurrencyFromText('DÓLARES estadounidenses (en pesos equivalentes)'),
    'USD',
  );
});

test('detectCurrencyFromText: case-insensitive', () => {
  assert.equal(detectCurrencyFromText('moneda: usd'), 'USD');
  assert.equal(detectCurrencyFromText('moneda: uyu'), 'UYU');
});

// --- detectCurrencyFromAmount ---------------------------------------------

test('detectCurrencyFromAmount: U$S 123,45 => USD', () => {
  assert.equal(detectCurrencyFromAmount('U$S 123,45'), 'USD');
});

test('detectCurrencyFromAmount: $U 500 => UYU', () => {
  assert.equal(detectCurrencyFromAmount('$U 500'), 'UYU');
});

test('detectCurrencyFromAmount: bare $ prefix => UYU', () => {
  assert.equal(detectCurrencyFromAmount('$ 1.234,50'), 'UYU');
});

test('detectCurrencyFromAmount: empty => null', () => {
  assert.equal(detectCurrencyFromAmount(''), null);
});

test('detectCurrencyFromAmount: just a number => null', () => {
  assert.equal(detectCurrencyFromAmount('1.234,50'), null);
});
