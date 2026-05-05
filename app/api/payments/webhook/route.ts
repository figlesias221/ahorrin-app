import { NextRequest, NextResponse } from 'next/server';
import { getPayment, verifyMercadoPagoSignature } from '@/lib/payments/mercadopago';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    // Use service role for webhook (no user session)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
    const body = await request.json();

    // MercadoPago sends different notification types
    if (body.type !== 'payment' && body.action !== 'payment.created') {
      return NextResponse.json({ received: true });
    }

    const paymentId = body.data?.id;
    if (!paymentId) {
      return NextResponse.json({ error: 'No payment ID' }, { status: 400 });
    }

    // Verify signature: rejects forged webhooks attempting to activate Pro for arbitrary users.
    const sig = verifyMercadoPagoSignature({
      signatureHeader: request.headers.get('x-signature'),
      requestId: request.headers.get('x-request-id'),
      dataId: String(paymentId),
    });
    if (!sig.ok) {
      console.error('MP webhook signature rejected:', sig.reason);
      return NextResponse.json({ error: 'invalid signature' }, { status: 401 });
    }

    // Get payment details from MercadoPago
    const paymentData = await getPayment(String(paymentId));

    if (paymentData.status !== 'approved') {
      console.log(`Payment ${paymentId} status: ${paymentData.status} - skipping`);
      return NextResponse.json({ received: true });
    }

    // Extract user_id and plan_id from external_reference
    const externalRef = paymentData.external_reference;
    if (!externalRef) {
      console.error('No external reference in payment');
      return NextResponse.json({ error: 'No reference' }, { status: 400 });
    }

    const [userId, planId] = externalRef.split('|');

    // Activate subscription
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    const { error: subError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        plan_id: planId,
        status: 'active',
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
        payment_provider: 'mercadopago',
        payment_provider_id: String(paymentId),
        updated_at: now.toISOString(),
      }, {
        onConflict: 'user_id',
      });

    if (subError) {
      console.error('Error activating subscription:', subError);
      return NextResponse.json({ error: 'Subscription error' }, { status: 500 });
    }

    console.log(`Subscription activated for user ${userId}, plan ${planId}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
