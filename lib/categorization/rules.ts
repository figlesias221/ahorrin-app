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

interface PreparedRule {
  id: string;
  category_id: string;
  rule_type: CategorizationRule['rule_type'];
  normValues: string[];
  numericValue: number;
}

function prepare(rules: CategorizationRule[]): PreparedRule[] {
  return rules
    .filter((r) => r.is_active)
    .map((r) => {
      const tokens = r.match_value
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
      return {
        id: r.id,
        category_id: r.category_id,
        rule_type: r.rule_type,
        normValues: tokens.map(norm),
        numericValue: parseFloat(tokens[0] ?? 'NaN'),
      };
    });
}

export function applyRules(
  txns: RuleInput[],
  rules: CategorizationRule[],
): RulesResult {
  const matched: RuleMatch[] = [];
  const unmatched: RuleInput[] = [];
  const prepared = prepare(rules);

  for (const tx of txns) {
    const vKey = norm(tx.vendor);
    const refKey = norm(tx.reference ?? tx.notes ?? '');
    let hit: { category_id: string; rule_id: string } | null = null;

    for (const rule of prepared) {
      let ok = false;
      switch (rule.rule_type) {
        case 'vendor_contains':
          ok = rule.normValues.some((v) => vKey.includes(v));
          break;
        case 'vendor_equals':
          ok = rule.normValues.some((v) => vKey === v);
          break;
        case 'description_contains':
          ok = rule.normValues.some((v) => refKey.includes(v));
          break;
        case 'amount_greater':
          ok = tx.amount > rule.numericValue;
          break;
        case 'amount_less':
          ok = tx.amount < rule.numericValue;
          break;
        case 'amount_equals':
          ok = tx.amount === rule.numericValue;
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
