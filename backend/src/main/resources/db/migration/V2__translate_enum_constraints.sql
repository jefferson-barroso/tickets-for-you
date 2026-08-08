ALTER TABLE users DROP CONSTRAINT ck_users_role;
ALTER TABLE users
    ADD CONSTRAINT ck_users_role
    CHECK (role IN ('ORGANIZADOR', 'CLIENTE', 'PORTARIA'));

ALTER TABLE events DROP CONSTRAINT ck_events_type;
ALTER TABLE events
    ADD CONSTRAINT ck_events_type
    CHECK (event_type IN ('SHOW', 'FILME'));

ALTER TABLE events DROP CONSTRAINT ck_events_status;
ALTER TABLE events
    ADD CONSTRAINT ck_events_status
    CHECK (status IN ('RASCUNHO', 'PUBLICADO', 'CANCELADO'));