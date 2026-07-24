-- Collapse the separate `available` flag into total_units: 0 units means
-- unavailable, 1+ means available. One number for admin to manage instead of two.
UPDATE equipment SET total_units = 0 WHERE available = 0;
UPDATE equipment SET total_units = 1 WHERE available = 1 AND total_units IS NULL;

ALTER TABLE equipment DROP COLUMN available;
