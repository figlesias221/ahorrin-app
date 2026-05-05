// Deterministic rules pass. Extracted verbatim from the original synchronous
// path in app/api/statements/upload/route.ts, generalized to a pure function
// that returns matched + unmatched partitions instead of mutating in place.

import { vendorKey } from './vendor-key';

export interface CategorizationRule {
  id: string;
  category_id: string;
  rule_type:
    | 'vendor_contains'
    | 'vendor_equals'
    | 'description_contains'
    | 'amount_greater'
    | 'amount_less'
    | 'amount_equals';
  match_value: string;
  is_active: boolean;
}

export interface RuleInput {
  id: string;
  vendor: string;
  amount: number;
  reference?: string | null;
  notes?: string | null;
}

export interface RuleMatch {
  id: string;
  category_id: string;
  rule_id: string;
}

export interface RulesResult {
  matched: RuleMatch[];
  unmatched: RuleInput[];
}

const norm = (s: string | null | undefined): string =>
  vendorKey(s ?? '') ?? '';

export function applyRules(
  txns: RuleInput[],
  rules: CategorizationRule[],
): RulesResult {
  const matched: RuleMatch[] = [];
  const unmatched: RuleInput[] = [];

  const activeRules = rules.filter((r) => r.is_active);

  for (const tx of txns) {
    const vKey = norm(tx.vendor);
    const refKey = norm(tx.reference ?? tx.notes ?? '');
    let hit: { category_id: string; rule_id: string } | null = null;

    for (const rule of activeRules) {
      const values = rule.match_value
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
      let ok = false;

      switch (rule.rule_type) {
        case 'vendor_contains':
          ok = values.some((v) => vKey.includes(norm(v)));
          break;
        case 'vendor_equals':
          ok = values.some((v) => vKey === norm(v));
          break;
        case 'description_contains':
          ok = values.some((v) => refKey.includes(norm(v)));
          break;
        case 'amount_greater':
          ok = tx.amount > parseFloat(values[0] ?? 'NaN');
          break;
        case 'amount_less':
          ok = tx.amount < parseFloat(values[0] ?? 'NaN');
          break;
        case 'amount_equals':
          ok = tx.amount === parseFloat(values[0] ?? 'NaN');
          break;
      }

      if (ok) {
        hit = { category_id: rule.category_id, rule_id: rule.id };
        break;
      }
    }

    if (hit) {
      matched.push({ id: tx.id, category_id: hit.category_id, rule_id: hit.rule_id });
    } else {
      unmatched.push(tx);
    }
  }

  return { matched, unmatched };
}
