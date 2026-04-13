import { createClient } from '@/lib/supabase/server';

export type PlanId = 'free' | 'pro';

export interface PlanLimits {
  uploads_per_month: number; // -1 = unlimited
  ai_messages_per_month: number; // -1 = unlimited
  categories: number; // -1 = unlimited
  rules: number; // -1 = unlimited
  transaction_history_months: number; // -1 = unlimited
}

export interface PlanFeatures {
  uploads: boolean;
  ai_chat: boolean;
  categories: boolean;
  rules: boolean;
  export_basic: boolean;
  export_full: boolean;
  receipts: boolean;
  multi_currency: boolean;
  custom_banks: boolean;
  monthly_report: boolean;
}

export async function getUserPlan(
  userId: string
): Promise<{ planId: PlanId; limits: PlanLimits; features: PlanFeatures }> {
  const supabase = await createClient();

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan_id, status, plans(features, limits)')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (subscription?.plans) {
    const plans = subscription.plans as unknown as {
      features: PlanFeatures;
      limits: PlanLimits;
    };
    return {
      planId: subscription.plan_id as PlanId,
      limits: plans.limits,
      features: plans.features,
    };
  }

  // Default to free plan
  return {
    planId: 'free',
    limits: {
      uploads_per_month: 3,
      ai_messages_per_month: 5,
      categories: 10,
      rules: 10,
      transaction_history_months: 3,
    },
    features: {
      uploads: true,
      ai_chat: true,
      categories: true,
      rules: true,
      export_basic: true,
      export_full: false,
      receipts: true,
      multi_currency: false,
      custom_banks: false,
      monthly_report: false,
    },
  };
}

export async function getUsage(
  userId: string
): Promise<{
  uploads: number;
  aiMessages: number;
  receipts: number;
  exports: number;
}> {
  const supabase = await createClient();
  const periodStart = new Date();
  periodStart.setDate(1);
  periodStart.setHours(0, 0, 0, 0);

  const { data } = await supabase
    .from('usage_tracking')
    .select('*')
    .eq('user_id', userId)
    .eq('period_start', periodStart.toISOString().split('T')[0])
    .single();

  return {
    uploads: data?.uploads_count ?? 0,
    aiMessages: data?.ai_messages_count ?? 0,
    receipts: data?.receipts_count ?? 0,
    exports: data?.exports_count ?? 0,
  };
}

export async function incrementUsage(
  userId: string,
  field:
    | 'uploads_count'
    | 'ai_messages_count'
    | 'receipts_count'
    | 'exports_count'
): Promise<void> {
  const supabase = await createClient();
  const periodStart = new Date();
  periodStart.setDate(1);
  periodStart.setHours(0, 0, 0, 0);
  const periodStr = periodStart.toISOString().split('T')[0];

  // Upsert: create row if doesn't exist, increment if it does
  const { data: existing } = await supabase
    .from('usage_tracking')
    .select('id, ' + field)
    .eq('user_id', userId)
    .eq('period_start', periodStr)
    .single();

  if (existing) {
    await supabase
      .from('usage_tracking')
      .update({
        [field]: (existing as Record<string, number>)[field] + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id);
  } else {
    await supabase
      .from('usage_tracking')
      .insert({ user_id: userId, period_start: periodStr, [field]: 1 });
  }
}

export async function checkLimit(
  userId: string,
  action: 'upload' | 'ai_message' | 'receipt' | 'export'
): Promise<{
  allowed: boolean;
  current: number;
  limit: number;
  planId: PlanId;
}> {
  const [plan, usage] = await Promise.all([
    getUserPlan(userId),
    getUsage(userId),
  ]);

  const fieldMap = {
    upload: { usage: usage.uploads, limit: plan.limits.uploads_per_month },
    ai_message: {
      usage: usage.aiMessages,
      limit: plan.limits.ai_messages_per_month,
    },
    receipt: { usage: usage.receipts, limit: plan.limits.uploads_per_month },
    export: { usage: usage.exports, limit: -1 }, // exports not limited by count
  };

  const { usage: current, limit } = fieldMap[action];

  // -1 means unlimited
  if (limit === -1) {
    return { allowed: true, current, limit, planId: plan.planId };
  }

  return {
    allowed: current < limit,
    current,
    limit,
    planId: plan.planId,
  };
}
