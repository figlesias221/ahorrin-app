import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyRules, type CategorizationRule } from '../rules';

const tx = (id: string, vendor: string, amount = 100, ref = '') => ({
  id,
  vendor,
  amount,
  reference: ref,
  notes: ref,
});

const rule = (
  partial: Partial<CategorizationRule> & {
    rule_type: CategorizationRule['rule_type'];
    match_value: string;
    category_id: string;
  },
): CategorizationRule => ({
  id: partial.id ?? `r-${Math.random()}`,
  is_active: partial.is_active ?? true,
  ...partial,
});

test('applyRules: vendor_contains hits regardless of case/accents', () => {
  const rules = [
    rule({ rule_type: 'vendor_contains', match_value: 'cafe', category_id: 'cat-food' }),
  ];
  const { matched, unmatched } = applyRules(
    [tx('1', 'Café Brasilero S.A.'), tx('2', 'Pharmacy')],
    rules,
  );
  assert.equal(matched.length, 1);
  assert.equal(matched[0]!.id, '1');
  assert.equal(matched[0]!.category_id, 'cat-food');
  assert.equal(unmatched.length, 1);
});

test('applyRules: comma-separated match_value matches any', () => {
  const rules = [
    rule({
      rule_type: 'vendor_contains',
      match_value: 'uber, cabify, taxi',
      category_id: 'cat-transport',
    }),
  ];
  const { matched } = applyRules([tx('1', 'CABIFY URUGUAY')], rules);
  assert.equal(matched.length, 1);
  assert.equal(matched[0]!.category_id, 'cat-transport');
});

test('applyRules: amount_greater / amount_less', () => {
  const rules = [
    rule({ rule_type: 'amount_greater', match_value: '500', category_id: 'cat-big' }),
    rule({ rule_type: 'amount_less', match_value: '20', category_id: 'cat-small' }),
  ];
  const { matched } = applyRules(
    [tx('big', 'X', 1000), tx('mid', 'X', 100), tx('small', 'X', 5)],
    rules,
  );
  const byId = new Map(matched.map((m) => [m.id, m.category_id]));
  assert.equal(byId.get('big'), 'cat-big');
  assert.equal(byId.get('small'), 'cat-small');
  assert.equal(byId.get('mid'), undefined);
});

test('applyRules: first matching rule wins', () => {
  const rules = [
    rule({ rule_type: 'vendor_contains', match_value: 'super', category_id: 'first' }),
    rule({ rule_type: 'vendor_contains', match_value: 'mercado', category_id: 'second' }),
  ];
  const { matched } = applyRules([tx('1', 'Supermercado Disco')], rules);
  assert.equal(matched.length, 1);
  assert.equal(matched[0]!.category_id, 'first');
});

test('applyRules: inactive rules are ignored', () => {
  const rules = [
    rule({
      rule_type: 'vendor_contains',
      match_value: 'cafe',
      category_id: 'cat-food',
      is_active: false,
    }),
  ];
  const { matched, unmatched } = applyRules([tx('1', 'Café')], rules);
  assert.equal(matched.length, 0);
  assert.equal(unmatched.length, 1);
});

test('applyRules: vendor_equals requires exact match after normalization', () => {
  const rules = [
    rule({ rule_type: 'vendor_equals', match_value: 'netflix', category_id: 'cat-stream' }),
  ];
  const { matched, unmatched } = applyRules(
    [tx('1', 'NETFLIX'), tx('2', 'Netflix Premium')],
    rules,
  );
  assert.equal(matched.length, 1);
  assert.equal(matched[0]!.id, '1');
  assert.equal(unmatched.length, 1);
});

test('applyRules: empty rules => all unmatched', () => {
  const { matched, unmatched } = applyRules([tx('1', 'X'), tx('2', 'Y')], []);
  assert.equal(matched.length, 0);
  assert.equal(unmatched.length, 2);
});
