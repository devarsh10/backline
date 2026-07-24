CREATE TABLE equipment (
  slug                     TEXT PRIMARY KEY,
  name                     TEXT NOT NULL,
  brand                    TEXT NOT NULL,
  category                 TEXT NOT NULL,
  subcategory              TEXT NOT NULL,
  specs                    TEXT NOT NULL,
  price_per_day            INTEGER NOT NULL,
  min_days                 INTEGER NOT NULL,
  included                 TEXT NOT NULL,
  available                INTEGER NOT NULL DEFAULT 1,
  image                    TEXT,
  featured                 INTEGER NOT NULL DEFAULT 0,
  related_accessory_slugs  TEXT,
  total_units              INTEGER,
  created_at               TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at               TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_equipment_category ON equipment (category);
CREATE INDEX idx_equipment_featured ON equipment (featured);
