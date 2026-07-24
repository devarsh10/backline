ALTER TABLE orders ADD COLUMN stage_dimensions TEXT NOT NULL DEFAULT '';
ALTER TABLE orders ADD COLUMN venue_reach_time TEXT;
ALTER TABLE orders ADD COLUMN backline_ready_time TEXT;
ALTER TABLE orders ADD COLUMN soundcheck_time TEXT;
ALTER TABLE orders ADD COLUMN show_end_time TEXT;
