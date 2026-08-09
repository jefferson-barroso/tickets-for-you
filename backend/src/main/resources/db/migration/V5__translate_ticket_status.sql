ALTER TABLE tickets DROP CONSTRAINT ck_tickets_status;

ALTER TABLE tickets
    ALTER COLUMN status SET DEFAULT 'EMITIDO';

ALTER TABLE tickets
    ADD CONSTRAINT ck_tickets_status
    CHECK (status IN ('EMITIDO', 'UTILIZADO', 'CANCELADO'));