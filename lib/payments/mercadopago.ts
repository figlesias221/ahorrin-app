import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { createHmac, timingSafeEqual } from 'crypto';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

const preference = new Preference(client);
const payment = new Payment(client);

export interface CreateCheckoutParams {
  userId: string;
  userEmail: string;
  planId: string;
  planName: string;
  priceUYU: number;
}

export async function createCheckoutPreference({
  userId,
  userEmail,
  planId,
  planName,
  priceUYU,
}: CreateCheckoutParams) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.ahorrin.app';

  const result = await preference.create({
    body: {
      items: [
        {
          id: planId,
          title: `Ahorrin ${planName} - Mensual`,
          description: `Suscripción mensual al plan ${planName} de Ahorrin`,
          quantity: 1,
          unit_price: priceUYU,
          currency_id: 'UYU',
        },
      ],
      payer: {
        email: userEmail,
      },
      back_urls: {
        success: `${baseUrl}/api/payments/success?user_id=${userId}&plan_id=${planId}`,
        failure: `${baseUrl}/pricing?payment=failed`,
        pending: `${baseUrl}/pricing?payment=pending`,
      },
      auto_return: 'approved',
      external_reference: `${userId}|${planId}`,
      notification_url: `${baseUrl}/api/payments/webhook`,
      statement_descriptor: 'AHORRIN PRO',
    },
  });

  return result;
}

export async function getPayment(paymentId: string) {
  return payment.get({ id: paymentId });
}

// Verifies MercadoPago webhook signature.
// MP sends `x-signature: ts=<unix>,v1=<hex>` and `x-request-id: <uuid>`.
// Manifest = `id:<dataId>;request-id:<xRequestId>;ts:<ts>;`
// v1 = HMAC_SHA256(MP_WEBHOOK_SECRET, manifest).
export function verifyMercadoPagoSignature(params: {
  signatureHeader: string | null;
  requestId: string | null;
  dataId: string | null;
  maxAgeSeconds?: number;
}): { ok: true } | { ok: false; reason: string } {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return { ok: false, reason: 'MP_WEBHOOK_SECRET not configured' };
  if (!params.signatureHeader) return { ok: false, reason: 'missing x-signature' };
  if (!params.requestId) return { ok: false, reason: 'missing x-request-id' };
  if (!params.dataId) return { ok: false, reason: 'missing data.id' };

  const parts = Object.fromEntries(
    params.signatureHeader.split(',').map((kv) => {
      const [k, ...rest] = kv.trim().split('=');
      return [k, rest.join('=')];
    }),
  );
  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return { ok: false, reason: 'malformed x-signature' };

  const maxAge = params.maxAgeSeconds ?? 300;
  const tsNum = Number(ts);
  if (!Number.isFinite(tsNum)) return { ok: false, reason: 'invalid ts' };
  const ageSec = Math.abs(Date.now() / 1000 - tsNum);
  if (ageSec > maxAge) return { ok: false, reason: 'stale signature' };

  const manifest = `id:${params.dataId};request-id:${params.requestId};ts:${ts};`;
  const expected = createHmac('sha256', secret).update(manifest).digest('hex');

  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(v1, 'hex');
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, reason: 'signature mismatch' };
  }
  return { ok: true };
}

export { client };
