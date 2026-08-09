ALTER TABLE reservations DROP CONSTRAINT ck_reservations_status;

ALTER TABLE reservations
    ALTER COLUMN status SET DEFAULT 'AGUARDANDO_PAGAMENTO';

ALTER TABLE reservations
    ADD CONSTRAINT ck_reservations_status
    CHECK (
        status IN (
            'AGUARDANDO_PAGAMENTO',
            'PAGA',
            'CANCELADA',
            'EXPIRADA',
            'PAGAMENTO_RECUSADO'
        )
    );