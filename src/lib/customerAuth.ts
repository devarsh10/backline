const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

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

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createCustomerSessionToken(secret: string, customerId: number): Promise<string> {
  const expiry = String(Date.now() + SESSION_TTL_MS);
  const payload = `${customerId}.${expiry}`;
  const sig = await hmac(secret, payload);
  return `${payload}.${sig}`;
}

export async function verifyCustomerSessionToken(token: string | undefined, secret: string): Promise<number | null> {
  if (!token) return null;
  const [customerId, expiry, sig] = token.split('.');
  if (!customerId || !expiry || !sig) return null;
  const expected = await hmac(secret, `${customerId}.${expiry}`);
  if (!constantTimeEqual(expected, sig)) return null;
  if (Date.now() >= Number(expiry)) return null;
  return Number(customerId);
}

const PBKDF2_ITERATIONS = 100_000;

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const bits = await deriveBits(password, salt);
  return `${bufferToHex(salt)}:${bufferToHex(bits)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(':');
  if (!saltHex || !hashHex) return false;
  const salt = hexToBuffer(saltHex);
  const bits = await deriveBits(password, salt);
  return constantTimeEqual(bufferToHex(bits), hashHex);
}

async function deriveBits(password: string, salt: Uint8Array): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, [
    'deriveBits',
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    key,
    256
  );
  return new Uint8Array(bits);
}

function bufferToHex(buf: Uint8Array): string {
  return Array.from(buf)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  return bytes;
}

export function generateOtpCode(): string {
  return String(crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000).padStart(6, '0');
}
