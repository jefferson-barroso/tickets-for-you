CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT ck_users_role
        CHECK (role IN ('ORGANIZER', 'CUSTOMER', 'GATEKEEPER'))
);

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organizer_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(160) NOT NULL,
    description TEXT,
    event_type VARCHAR(20) NOT NULL,
    starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
    venue_name VARCHAR(160) NOT NULL,
    venue_address VARCHAR(255) NOT NULL,
    poster_url TEXT,
    external_provider VARCHAR(30),
    external_content_id VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT ck_events_type
        CHECK (event_type IN ('SHOW', 'MOVIE')),
    CONSTRAINT ck_events_status
        CHECK (status IN ('DRAFT', 'PUBLISHED', 'CANCELLED'))
);

CREATE TABLE ticket_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(80) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    total_quantity INTEGER NOT NULL,
    available_quantity INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_ticket_types_event_name UNIQUE (event_id, name),
    CONSTRAINT ck_ticket_types_price CHECK (price >= 0),
    CONSTRAINT ck_ticket_types_total_quantity CHECK (total_quantity > 0),
    CONSTRAINT ck_ticket_types_available_quantity
        CHECK (available_quantity >= 0 AND available_quantity <= total_quantity)
);

CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES users(id),
    event_id UUID NOT NULL REFERENCES events(id),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING_PAYMENT',
    total_amount NUMERIC(10, 2) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT ck_reservations_status
        CHECK (status IN ('PENDING_PAYMENT', 'PAID', 'CANCELLED', 'EXPIRED', 'PAYMENT_DECLINED')),
    CONSTRAINT ck_reservations_total_amount CHECK (total_amount >= 0)
);

CREATE TABLE reservation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    ticket_type_id UUID NOT NULL REFERENCES ticket_types(id),
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,

    CONSTRAINT uq_reservation_items_reservation_ticket_type
        UNIQUE (reservation_id, ticket_type_id),
    CONSTRAINT ck_reservation_items_quantity CHECK (quantity > 0),
    CONSTRAINT ck_reservation_items_unit_price CHECK (unit_price >= 0)
);

CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_item_id UUID NOT NULL REFERENCES reservation_items(id),
    event_id UUID NOT NULL REFERENCES events(id),
    customer_id UUID NOT NULL REFERENCES users(id),
    ticket_code UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    qr_token_hash VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'ISSUED',
    checked_in_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT ck_tickets_status
        CHECK (status IN ('ISSUED', 'USED', 'CANCELLED'))
);

CREATE TABLE ticket_share_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE,
    revoked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_status_starts_at
    ON events (status, starts_at);

CREATE INDEX idx_ticket_types_event_id
    ON ticket_types (event_id);

CREATE INDEX idx_reservations_customer_id
    ON reservations (customer_id);

CREATE INDEX idx_tickets_event_id
    ON tickets (event_id);