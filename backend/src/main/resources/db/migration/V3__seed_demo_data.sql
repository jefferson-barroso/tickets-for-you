INSERT INTO users (id, name, email, password_hash, role)
VALUES
    (
        '11111111-1111-1111-1111-111111111111',
        'Marina Costa',
        'organizador@ticketsforyou.com',
        crypt('T4U@2026', gen_salt('bf', 10)),
        'ORGANIZADOR'
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'João Silva',
        'cliente1@ticketsforyou.com',
        crypt('T4U@2026', gen_salt('bf', 10)),
        'CLIENTE'
    ),
    (
        '33333333-3333-3333-3333-333333333333',
        'Beatriz Santos',
        'cliente2@ticketsforyou.com',
        crypt('T4U@2026', gen_salt('bf', 10)),
        'CLIENTE'
    ),
    (
        '44444444-4444-4444-4444-444444444444',
        'Rafael Lima',
        'portaria@ticketsforyou.com',
        crypt('T4U@2026', gen_salt('bf', 10)),
        'PORTARIA'
    );

INSERT INTO events (
    id,
    organizer_id,
    title,
    description,
    event_type,
    starts_at,
    venue_name,
    venue_address,
    poster_url,
    external_provider,
    external_content_id,
    status
)
VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    'Noite de Cinema: De Volta para o Futuro',
    'Uma sessão especial de cinema com experiência nostálgica e ingressos por setor.',
    'FILME',
    '2026-09-20 20:00:00-03',
    'Cine T4U',
    'Av. Paulista, 1000 - São Paulo, SP',
    NULL,
    'TMDB',
    '105',
    'PUBLICADO'
);

INSERT INTO ticket_types (
    id,
    event_id,
    name,
    price,
    total_quantity,
    available_quantity
)
VALUES
    (
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        'Inteira',
        45.00,
        100,
        100
    ),
    (
        'cccccccc-cccc-cccc-cccc-cccccccccccc',
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        'Meia-entrada',
        22.50,
        50,
        50
    );