CREATE TABLE courts (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(100) NOT NULL,
  surface        VARCHAR(20)  NOT NULL,
  indoor         BOOLEAN      NOT NULL DEFAULT false,
  price_per_hour INTEGER      NOT NULL,
  image          VARCHAR(10),
  description    TEXT
);

CREATE TABLE bookings (
  id          SERIAL PRIMARY KEY,
  court_id    INTEGER      NOT NULL REFERENCES courts(id),
  court_name  VARCHAR(100) NOT NULL,
  date        DATE         NOT NULL,
  time        VARCHAR(5)   NOT NULL,
  player_name VARCHAR(100) NOT NULL,
  price       INTEGER      NOT NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT now(),
  UNIQUE (court_id, date, time)
);

INSERT INTO courts (name, surface, indoor, price_per_hour, image, description) VALUES
  ('Court 1',         'Hard', false, 15, '🎾', 'Freshly resurfaced outdoor hard court with LED lighting.'),
  ('Court 2',         'Hard', false, 15, '🎾', 'Outdoor hard court ideal for doubles play.'),
  ('Court 3 – Clay',  'Clay', false, 18, '🎾', 'Classic red clay court. Rakes provided.'),
  ('Court 4 – Indoor','Hard', true,  25, '🏟️', 'Climate-controlled indoor court. Available year-round.');
