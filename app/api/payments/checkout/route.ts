import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createCheckoutPreference } from '@/lib/payments/mercadopago';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { planId } = await request.json();

    if (planId !== 'pro') {
      return NextResponse.json({ error: 'Plan no válido' }, { status: 400 });
    }

    // Check if already subscribed
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .eq('plan_id', 'pro')
      .single();

    if (existingSub) {
      return NextResponse.json({ error: 'Ya tenés una suscripción activa' }, { status: 400 });
    }

    const preference = await createCheckoutPreference({
      userId: user.id,
      userEmail: user.email!,
      planId: 'pro',
      planName: 'Pro',
      priceUYU: 99,
    });

    return NextResponse.json({
      checkoutUrl: preference.init_point,
      preferenceId: preference.id,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Error al crear checkout', details: String(error) },
      { status: 500 }
    );
  }
}
