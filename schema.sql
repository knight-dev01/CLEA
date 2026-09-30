-- CLEA content schema (run once in Vercel Postgres dashboard → Query)
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  title_it TEXT DEFAULT '',
  body TEXT DEFAULT '',
  body_it TEXT DEFAULT '',
  date TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('youtube','facebook')),
  url TEXT NOT NULL,
  title TEXT DEFAULT '',
  ratio TEXT DEFAULT 'auto',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  title_it TEXT DEFAULT '',
  date TEXT DEFAULT '',
  time TEXT DEFAULT '',
  location TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
