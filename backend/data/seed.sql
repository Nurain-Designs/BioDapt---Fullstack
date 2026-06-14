CREATE TABLE IF NOT EXISTS materials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL
);

INSERT INTO materials (id, name, description) VALUES
('pla', 'PLA', 'Polylactic Acid - biodegradable polymer'),
('pha', 'PHA', 'Polyhydroxyalkanoate - biodegradable polymer'),
('cellulose', 'Cellulose', 'Natural polymer from plant fibers');
