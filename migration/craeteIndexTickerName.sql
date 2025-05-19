CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_instruments_ticker_trgm ON instruments USING GIN (ticker gin_trgm_ops);
CREATE INDEX idx_instruments_name_trgm ON instruments USING GIN (name gin_trgm_ops);
