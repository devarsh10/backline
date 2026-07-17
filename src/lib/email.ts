interface EmailEnv {
  EMAIL_ENABLED?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
}

export async function sendEmail(env: EmailEnv, to: string, subject: string, html: string): Promise<void> {
  if (env.EMAIL_ENABLED !== 'true' || !env.RESEND_API_KEY) {
    // Email sending is switched off until a real sending domain is configured.
    // See .dev.vars.example for the flag/keys that turn this on later.
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL || 'Backline India <onboarding@resend.dev>',
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Resend email failed (${response.status}): ${errorBody}`);
  }
}

export function paymentReceivedEmailHtml(orderRef: string, customerName: string, totalAmount: number): string {
  const trackUrl = `https://backlineindia.com/track?ref=${encodeURIComponent(orderRef)}`;
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>Payment received — thank you, ${customerName}!</h2>
      <p>Your order <strong>${orderRef}</strong> is confirmed. We've received your payment of ₹${totalAmount.toLocaleString('en-IN')}.</p>
      <p>Our team will be in touch about delivery. You can also <a href="${trackUrl}">track your delivery status</a> anytime using your order reference and phone number.</p>
      <p>— Backline India</p>
    </div>
  `;
}
