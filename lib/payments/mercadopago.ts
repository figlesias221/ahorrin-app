import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

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

export { client };
