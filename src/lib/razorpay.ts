interface RazorpayEnv {
  RAZORPAY_KEY_ID: string;
  RAZORPAY_KEY_SECRET: string;
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export async function createRazorpayOrder(
  amountPaise: number,
  receipt: string,
  env: RazorpayEnv
): Promise<RazorpayOrder> {
  const auth = btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`);

  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency: 'INR',
      receipt,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Razorpay order creation failed (${response.status}): ${errorBody}`);
  }

  return response.json();
}

export async function verifyPaymentSignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  signature: string,
  keySecret: string
): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(keySecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const mac = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(`${razorpayOrderId}|${razorpayPaymentId}`)
  );
  const expected = [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, '0')).join('');
  return expected === signature;
}
