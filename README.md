Caros(as) recrutadores(as), é com prazer que apresento:
# TicketsForYou (T4U)
Plataforma de eventos e venda de ingressos desenvolvida para o Desafio Elite Dev 2026.

O sistema permite que organizadores criem e publiquem eventos, clientes reservem e paguem ingressos, e operadores de portaria validem entradas por QR Code ou código digitado.

## Funcionalidades implementadas

- Autenticação JWT com três perfis: Organizador, Cliente e Portaria.
- Busca de filmes no catálogo externo TMDb.
- Criação e publicação de eventos pelo organizador.
- Eventos públicos com setores e estoque disponível.
- Reserva transacional de ingressos, sem sobrevenda.
- Expiração automática de reservas não pagas, com reposição de estoque.
- Pagamento simulado com aprovação ou recusa.
- Emissão automática de ingressos após pagamento aprovado.
- QR Code baseado em token JWT assinado.
- Área de ingressos do cliente.
- Compartilhamento de ingresso por link temporário.
- Validação de ingresso na portaria.
- Bloqueio de ingresso reutilizado ou de evento incorreto.
- Swagger UI para documentação e testes da API.

## Tecnologias

- Java 17
- Spring Boot 4
- Spring Security
- Spring Data JPA
- PostgreSQL 16
- Flyway
- Docker Compose
- Springdoc OpenAPI / Swagger UI
- TMDb API
- JWT (JJWT)

## Estrutura do projeto

```text
tickets-for-you/
├── backend/              # API Spring Boot
├── frontend/             # Aplicação React (em desenvolvimento)
├── docs/                 # Documentação técnica
├── docker-compose.yml    # PostgreSQL local
└── README.md
```

O backend é organizado por funcionalidade:

```text
com.ticketsforyou/
├── auth/
├── catalog/
├── config/
├── event/
├── reservation/
├── ticket/
└── user/
```

## Pré-requisitos

- Java 17
- Docker Desktop
- IntelliJ IDEA ou outra IDE Java
- Conta no TMDb com API Read Access Token

## Como executar

### 1. Suba o PostgreSQL

Na raiz do repositório:

```bash
docker compose up -d
```

### 2. Configure a variável do TMDb

No IntelliJ, adicione à configuração de execução:

```text
TMDB_ACCESS_TOKEN=seu_token_tmdb
```

Não envie nem versione esse token.

### 3. Execute o backend

Abra a pasta `backend` como projeto Maven no IntelliJ e execute a classe:

```text
TicketsForYouApiApplication
```

A API ficará disponível em:

```text
http://localhost:8080
```

Swagger UI:

```text
http://localhost:8080/swagger-ui.html
```

## Usuários de demonstração

Todos usam a senha:

```text
T4U@2026
```

| Papel | E-mail |
| --- | --- |
| Organizador | organizador@ticketsforyou.com |
| Cliente | cliente1@ticketsforyou.com |
| Cliente | cliente2@ticketsforyou.com |
| Portaria | portaria@ticketsforyou.com |

## Endpoints principais

| Método | Rota | Acesso |
| --- | --- | --- |
| POST | `/api/v1/auth/login` | Público |
| GET | `/api/v1/auth/me` | Autenticado |
| GET | `/api/v1/events` | Público |
| GET | `/api/v1/events/{id}` | Público |
| POST | `/api/v1/events` | Organizador |
| PATCH | `/api/v1/events/{id}/publish` | Organizador |
| GET | `/api/v1/catalog/movies` | Organizador |
| POST | `/api/v1/reservations` | Cliente |
| PATCH | `/api/v1/reservations/{id}/payment` | Cliente |
| GET | `/api/v1/tickets/me` | Cliente |
| POST | `/api/v1/tickets/{id}/share` | Cliente |
| GET | `/api/v1/tickets/shared/{token}` | Público |
| POST | `/api/v1/gate/validate-ticket` | Portaria |

## Fluxo de teste sugerido

1. Faça login como organizador.
2. Consulte filmes no TMDb ou crie um evento.
3. Publique o evento.
4. Faça login como cliente.
5. Crie uma reserva com um setor disponível.
6. Simule o pagamento aprovado.
7. Consulte `GET /api/v1/tickets/me`.
8. Faça login como portaria.
9. Valide o `qrPayload` de um ingresso.
10. Valide novamente o mesmo payload e confirme o retorno `JA_UTILIZADO`.

## Decisões técnicas

A primeira versão utiliza ingressos por quantidade e setor, em vez de mapa de assentos numerados. Essa escolha atende ao desafio e permite garantir estoque transacional sem ampliar excessivamente o escopo.

O QR não contém apenas um ID simples: ele usa um token JWT assinado pelo backend. A portaria valida assinatura, ingresso, evento e status antes de liberar a entrada.

## Uso de IA

A IA foi utilizada como parceira para discutir arquitetura, estruturar documentação, revisar decisões técnicas e orientar a implementação incremental.

As decisões de produto e arquitetura foram tomadas durante o desenvolvimento, incluindo:

- Organização por funcionalidade.
- Uso de PostgreSQL e Flyway.
- Venda por setores na primeira versão.
- Enums de domínio em português.
- Fluxo de reserva com lock pessimista.
- QR Code assinado e validação única na portaria.

A implementação foi acompanhada, executada e testada manualmente no ambiente local por mim.

PS: Visando a organização e o atendimento dos demais requisitos solicitados, deixo, dentro da pasta `/docs`, outros arquivos que explicam com detalhes: o fluxo da api, a arquitetura e as decisões tomadas para a construção desde desafio.