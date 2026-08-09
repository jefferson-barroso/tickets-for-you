# Arquitetura

## Visão geral

O TicketsForYou é uma plataforma de eventos e ingressos baseada em uma API REST. O backend concentra as regras de negócio, persistência, autenticação, emissão de ingressos e validação de portaria.

```text
React + Tailwind
       ↓ HTTP / JWT
Spring Boot API
       ↓ JPA / Flyway
PostgreSQL
       ↓
TMDb API
```

## Módulos do backend

- `auth`: login, JWT e validação de token.
- `catalog`: integração com o catálogo externo TMDb.
- `event`: criação, publicação e consulta de eventos.
- `reservation`: reservas, estoque, expiração e pagamento simulado.
- `ticket`: emissão, QR, compartilhamento e validação de ingresso.
- `user`: usuários e papéis de acesso.
- `config`: segurança, CORS e OpenAPI.

## Segurança

A API usa JWT. Após o login, o token inclui o e-mail do usuário e seu papel:

- `ORGANIZADOR`
- `CLIENTE`
- `PORTARIA`

As rotas públicas incluem consulta de eventos, login e compartilhamento por link. As demais rotas aplicam autorização conforme o papel.

## Persistência

O PostgreSQL é versionado com Flyway. O Hibernate usa apenas validação de schema, impedindo que a aplicação altere o banco automaticamente.

As reservas usam lock pessimista nos setores de ingresso. Durante a operação, o estoque é bloqueado, validado e reduzido na mesma transação, evitando sobrevenda.

## QR Code

O QR Code contém um JWT assinado pelo backend com o código do ingresso. A portaria verifica:

1. Assinatura do token.
2. Existência do ingresso.
3. Integridade do payload.
4. Evento correspondente.
5. Status do ingresso.

Após uma validação bem-sucedida, o ingresso passa de `EMITIDO` para `UTILIZADO`.