CREATE TABLE orders (
  id                   INTEGER PRIMARY KEY AUTOINCREMENT,
  order_ref            TEXT NOT NULL UNIQUE,
  customer_name        TEXT NOT NULL,
  customer_phone       TEXT NOT NULL,
  customer_email       TEXT NOT NULL,
  city                 TEXT NOT NULL,
  venue                TEXT,
  notes                TEXT,
  rental_start_date    TEXT NOT NULL,
  rental_end_date      TEXT NOT NULL,
  rental_days          INTEGER NOT NULL,
  items_json           TEXT NOT NULL,
  subtotal_per_day      INTEGER NOT NULL,
  discount_pct          INTEGER NOT NULL DEFAULT 0,
  discount_amount       INTEGER NOT NULL DEFAULT 0,
  total_amount          INTEGER NOT NULL,
  currency              TEXT NOT NULL DEFAULT 'INR',
  status                TEXT NOT NULL DEFAULT 'order_placed',
  razorpay_order_id     TEXT,
  razorpay_payment_id   TEXT,
  paid_at               TEXT,
  created_at            TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at            TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_orders_phone ON orders (customer_phone);
CREATE INDEX idx_orders_status_created ON orders (status, created_at);
CREATE UNIQUE INDEX idx_orders_razorpay_order_id ON orders (razorpay_order_id);
