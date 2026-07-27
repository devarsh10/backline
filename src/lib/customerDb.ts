export interface CustomerRow {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  phone: string | null;
  email_verified: number;
  pending_email: string | null;
}

export async function createCustomer(
  db: D1Database,
  email: string,
  passwordHash: string,
  name: string,
  phone: string | undefined
): Promise<number> {
  const result = await db
    .prepare(`INSERT INTO customers (email, password_hash, name, phone) VALUES (?, ?, ?, ?)`)
    .bind(email, passwordHash, name, phone ?? null)
    .run();
  return result.meta.last_row_id as number;
}

export async function getCustomerByEmail(db: D1Database, email: string): Promise<CustomerRow | null> {
  const row = await db.prepare(`SELECT * FROM customers WHERE email = ?`).bind(email).first<CustomerRow>();
  return row ?? null;
}

export async function getCustomerById(db: D1Database, id: number): Promise<CustomerRow | null> {
  const row = await db.prepare(`SELECT * FROM customers WHERE id = ?`).bind(id).first<CustomerRow>();
  return row ?? null;
}

export async function markCustomerEmailVerified(db: D1Database, email: string): Promise<void> {
  await db
    .prepare(`UPDATE customers SET email_verified = 1, updated_at = datetime('now') WHERE email = ?`)
    .bind(email)
    .run();
}

export async function updateCustomerProfile(db: D1Database, id: number, name: string, phone: string | undefined): Promise<void> {
  await db
    .prepare(`UPDATE customers SET name = ?, phone = ?, updated_at = datetime('now') WHERE id = ?`)
    .bind(name, phone ?? null, id)
    .run();
}

export async function setPendingEmail(db: D1Database, id: number, pendingEmail: string): Promise<void> {
  await db
    .prepare(`UPDATE customers SET pending_email = ?, updated_at = datetime('now') WHERE id = ?`)
    .bind(pendingEmail, id)
    .run();
}

export async function confirmPendingEmail(db: D1Database, id: number): Promise<void> {
  await db
    .prepare(
      `UPDATE customers SET email = pending_email, pending_email = NULL, updated_at = datetime('now')
       WHERE id = ? AND pending_email IS NOT NULL`
    )
    .bind(id)
    .run();
}

const OTP_TTL_MS = 10 * 60 * 1000;

export async function storeOtpCode(db: D1Database, email: string, code: string): Promise<void> {
  const expiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString();
  await db
    .prepare(
      `INSERT INTO email_otp_codes (email, code, expires_at) VALUES (?, ?, ?)
       ON CONFLICT(email) DO UPDATE SET code = excluded.code, expires_at = excluded.expires_at, created_at = datetime('now')`
    )
    .bind(email, code, expiresAt)
    .run();
}

export async function verifyOtpCode(db: D1Database, email: string, code: string): Promise<boolean> {
  const row = await db
    .prepare(`SELECT code, expires_at FROM email_otp_codes WHERE email = ?`)
    .bind(email)
    .first<{ code: string; expires_at: string }>();
  if (!row) return false;
  if (row.code !== code) return false;
  if (new Date(row.expires_at).getTime() < Date.now()) return false;

  await db.prepare(`DELETE FROM email_otp_codes WHERE email = ?`).bind(email).run();
  return true;
}
