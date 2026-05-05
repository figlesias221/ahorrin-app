'use client';

import { useRulePreview } from '@/lib/categorization/preview';
import type { CategorizationRule } from '@/lib/categorization/rules';

interface Props {
  ruleType: CategorizationRule['rule_type'];
  matchValues: string[];
  enabled?: boolean;
}

export function RuleMatchPreview({ ruleType, matchValues, enabled }: Props) {
  const { loading, total, count, samples } = useRulePreview({
    ruleType,
    matchValues,
    enabled,
  });

  const cleaned = matchValues.map((v) => v.trim()).filter(Boolean);
  if (cleaned.length === 0) return null;

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs">
      {loading ? (
        <p className="text-muted-foreground">Calculando coincidencias…</p>
      ) : count === 0 ? (
        <p className="text-muted-foreground">
          Ninguna transacción coincide{total > 0 ? ` (revisé las últimas ${total})` : ''}.
        </p>
      ) : (
        <>
          <p className="font-semibold text-foreground mb-2">
            {count === 1
              ? '1 transacción coincidiría'
              : `${count} transacciones coincidirían`}
            <span className="text-muted-foreground font-normal">
              {' '}· últimas {total}
            </span>
          </p>
          <ul className="space-y-1">
            {samples.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between gap-2 py-1 border-b border-border/40 last:border-0"
              >
                <span className="truncate font-mono text-[11px]">{t.vendor}</span>
                <span className="flex items-center gap-2 flex-shrink-0">
                  {t.category_name && t.category_color && (
                    <span
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] border"
                      style={{
                        backgroundColor: `${t.category_color}15`,
                        borderColor: `${t.category_color}40`,
                        color: t.category_color,
                      }}
                    >
                      {t.category_name}
                    </span>
                  )}
                  <span className="tabular-nums text-foreground">
                    {t.amount.toLocaleString('es-UY', { maximumFractionDigits: 0 })}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          {count > samples.length && (
            <p className="text-muted-foreground mt-1 text-[10px]">
              + {count - samples.length} más
            </p>
          )}
        </>
      )}
    </div>
  );
}
