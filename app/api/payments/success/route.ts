import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('user_id');
  const planId = searchParams.get('plan_id');
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');

  const supabase = await createClient();

  // Verify the user is authenticated and matches
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.id !== userId) {
    return NextResponse.redirect(new URL('/pricing?payment=error', request.url));
  }

  // If payment approved via auto_return, activate subscription directly
  if (status === 'approved' && userId && planId) {
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        plan_id: planId,
        status: 'active',
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
        payment_provider: 'mercadopago',
        payment_provider_id: paymentId || 'direct',
        updated_at: now.toISOString(),
      }, {
        onConflict: 'user_id',
      });
  }

  // Redirect to dashboard with success message
  return NextResponse.redirect(new URL('/dashboard?upgrade=success', request.url));
}
