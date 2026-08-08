# Decisões arquiteturais

## ADR-001 — Organização do projeto

A aplicação será mantida em um monorepositório com `backend`, `frontend` e `docs`.
O backend será desenvolvido em Java com Spring Boot, e o frontend com React e Tailwind CSS.

Motivo: centralizar código, documentação e instruções de execução facilita a avaliação do desafio.

## ADR-002 — Venda por setores na primeira versão

A primeira versão trabalhará com quantidade de ingressos por setor, em vez de mapa de assentos.

Motivo: o requisito permite as duas abordagens. Setores permitem entregar o fluxo inteiro ( reserva, pagamento, emissão, compartilhamento e portaria) com garantia de estoque, preservando espaço para adicionar assentos numerados posteriormente.