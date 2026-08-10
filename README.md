Caros(as) recrutadores(as), é com prazer que apresento:
![Logo T4U](./frontend/public/logo.png)
# TicketsForYou (T4U)
Plataforma de eventos e venda de ingressos desenvolvida para o Desafio Elite Dev 2026.

O sistema permite que organizadores criem e publiquem eventos, clientes reservem e paguem ingressos, e operadores de portaria validem entradas por QR Code ou código digitado.

---
## Aplicação publicada

- Frontend: `https://tickets-for-you.vercel.app`
- API: `https://tickets-for-you-api.onrender.com`
- Swagger: `https://tickets-for-you-api.onrender.com/swagger-ui/index.html`
- Health check: `https://tickets-for-you-api.onrender.com/actuator/health`
---
# BACKEND: 
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
├── frontend/             # Aplicação React
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
| PATCH | `/api/v1/tickets/{id}/cancel` | Cliente |

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

---
# FRONTEND:
## Tecnologias

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- React Router
- Lucide React
- Sonner
- qrcode.react
- @yudiel/react-qr-scanner

## Organização

O frontend segue uma estrutura orientada a funcionalidades:

```text
frontend/src/
├── api/                    # Cliente HTTP centralizado
├── components/
│   └── accessibility/      # Painel de acessibilidade global
├── features/
│   ├── auth/               # Contexto, tipos e proteção de rotas
│   └── events/             # Tipos, cards, listagem e carrossel
├── pages/                  # Páginas da aplicação
└── App.tsx                 # Rotas principais
````
## Rotas da Aplicação

| Rota | Finalidade | Acesso |
| :--- | :--- | :--- |
| `/` | Home, destaques e listagem de eventos | Público |
| `/login` | Autenticação | Público |
| `/events/:eventId` | Detalhes e reserva de evento | Público |
| `/reservations/:reservationId/payment` | Pagamento simulado | Cliente |
| `/tickets` | Carteira de ingressos | Cliente |
| `/tickets/shared/:token` | Ingresso compartilhado | Público |
| `/gate` | Validação de ingressos | Portaria |
| `/organizer` | Criação e publicação de eventos | Organizador |

> **Nota:** As rotas protegidas utilizam o componente `RequireRole`. Essa proteção melhora a experiência visual, enquanto a autorização definitiva é aplicada de forma segura no backend pelo Spring Security.

## Jornadas Implementadas

### Cliente
* Consulta eventos e utiliza busca por texto, tipo e data.
* Visualiza detalhes, setores e estoque.
* Cria uma reserva.
* Simula pagamento (aprovado ou negado).
* Consulta a carteira de ingressos.
* Visualiza o QR Code do ingresso.
* Gera link temporário de compartilhamento de ingresso.
* Cancela ingresso emitido, devolvendo automaticamente uma unidade ao estoque.

### Organizador
* Escolhe entre cadastrar **Filme** ou **Show**.
* Para filmes, realiza consulta ao catálogo externo (TMDb).
* Define data, local, pôster e setores.
* Cria o evento como rascunho.
* Publica o evento para venda ao público.

### Portaria
* Seleciona o evento correspondente.
* Lê o QR Code utilizando a câmera ou inserindo o código manualmente.
* Recebe o resultado da validação na hora.
* Registra a entrada no sistema somente quando o ingresso for válido.


## Destaques e Descoberta de Eventos

A **Home** foi desenvolvida pensando na melhor experiência de descoberta:
* Carrossel de eventos publicados em destaque;
* Troca automática de banners com controles de avançar, voltar e pausar;
* Busca por título, local ou endereço;
* Filtros rápidos por tipo (Filme ou Show) e data;
* Indicação clara da quantidade de eventos encontrados na busca.


## Feedback Visual

A aplicação utiliza a biblioteca **Sonner** para exibir notificações breves (toast) de sucesso, aviso e erro, como:
* Login realizado;
* Reserva criada;
* Pagamento aprovado ou negado;
* Ingresso cancelado;
* Link de compartilhamento copiado;
* Evento criado ou publicado;
* Entrada autorizada ou recusada na portaria.


## Acessibilidade

Como incremento ao desafio, foi implementado um **painel global e persistente de acessibilidade**, contendo os seguintes recursos:
* Aumento e redução do tamanho do texto;
* Modo de alto contraste;
* Redução de animações;
* Persistência das preferências do usuário no `localStorage`;
* Foco visível (outline) para navegação via teclado;
* Link de atalho para "pular diretamente ao conteúdo principal";
* Uso correto de `labels`, mensagens `aria-live`, botões semânticos e controles de carrossel acessíveis;
* Alternativa manual (input de texto) para leitura de QR Code caso a câmera do dispositivo não esteja disponível.


## Identidade Visual

A interface utiliza a seguinte paleta de cores principal:
* **Primária:** `#ffa900`
* **Secundária:** `#ff8400`
* **Fundo escuro:** `#0c0a09`

> *A escolha do laranja está associada à energia, entusiasmo, criatividade e é um ótimo convite à ação (Call to Action). O contraste com o fundo escuro busca transmitir aconchego e conforto visual, garantindo que o foco e o destaque fiquem nas ações importantes como reserva, compra e confirmação.*



## Configuração Local

1. Crie um arquivo `.env` na raiz da pasta `frontend`:
```env
VITE_API_URL=http://localhost:8080/api/v1
```
---
#### PS: Visando a organização e o atendimento dos demais requisitos solicitados, deixo, dentro da pasta `/docs`, outros arquivos que explicam com detalhes: o fluxo da api, a arquitetura e as decisões tomadas para a construção deste desafio.