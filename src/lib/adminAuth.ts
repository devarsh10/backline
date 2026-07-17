const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

async function hmac(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

export function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionToken(secret: string): Promise<string> {
  const expiry = String(Date.now() + SESSION_TTL_MS);
  const sig = await hmac(secret, expiry);
  return `${expiry}.${sig}`;
}

export async function verifySessionToken(token: string | undefined, secret: string): Promise<boolean> {
  if (!token) return false;
  const [expiry, sig] = token.split('.');
  if (!expiry || !sig) return false;
  const expected = await hmac(secret, expiry);
  if (!constantTimeEqual(expected, sig)) return false;
  return Date.now() < Number(expiry);
}
