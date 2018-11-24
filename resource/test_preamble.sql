CREATE SCHEMA IF NOT EXISTS tap;
GRANT USAGE ON SCHEMA tap TO PUBLIC;

ALTER DEFAULT PRIVILEGES IN SCHEMA tap GRANT EXECUTE ON FUNCTIONS TO PUBLIC;
ALTER DEFAULT PRIVILEGES IN SCHEMA tap GRANT USAGE ON TYPES TO PUBLIC;

CREATE EXTENSION IF NOT EXISTS pgtap SCHEMA tap;