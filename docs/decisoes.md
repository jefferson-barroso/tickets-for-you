# Decisões arquiteturais

## ADR-001 - Monorepositório

Backend, frontend e documentação ficam no mesmo repositório.

**Motivo:** facilita a avaliação, execução local e entendimento da solução completa.

## ADR-002 - Java e Spring Boot

O backend usa Java 17 e Spring Boot.

**Motivo:** oferece uma base madura para APIs REST, autenticação, persistência, validação e documentação.

## ADR-003 - PostgreSQL e Flyway

O banco escolhido é PostgreSQL, com migrations Flyway.

**Motivo:** o domínio possui relacionamentos e transações importantes. O Flyway torna a estrutura do banco reproduzível e versionada.

## ADR-004 - Venda por setores

A primeira versão vende ingressos por setor e quantidade.

**Motivo:** o escopo desafio permite essa abordagem. Ela permite concluir o fluxo completo com controle confiável de estoque, sem a complexidade adicional de mapa de assentos.

## ADR-005 - Organização por funcionalidade

O código é separado por módulos de negócio, como `event`, `reservation` e `ticket`.

**Motivo:** classes relacionadas permanecem próximas, facilitando manutenção e evolução.

## ADR-006 - Enums em português

Os status e papéis de negócio são persistidos em português.

**Motivo:** o produto é destinado ao contexto brasileiro e termos como `PUBLICADO`, `CLIENTE` e `PORTARIA` tornam a regra de negócio mais legível. Mas as classes e as demais partes do código (exceto já as palavras reservadas) estão em inglês para que o treinamento do meu inglês técnico, e eventual uso de desenvolvedores estrangeiros.

## ADR-007 - JWT para autenticação e QR

JWT é usado tanto na autenticação da API quanto no payload assinado do QR Code.

**Motivo:** evita tokens forjados e permite que o backend valide a integridade do ingresso.

## ADR-008 - Pagamento simulado

O pagamento recebe um resultado controlado de aprovação ou recusa.

**Motivo:** atende ao desafio sem integração financeira real e permite testar os dois cenários.