ALTER TABLE orders ADD COLUMN customer_id INTEGER;
CREATE INDEX idx_orders_customer_id ON orders (customer_id);
