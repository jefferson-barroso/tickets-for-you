# Fluxos da API

## Compra de ingresso

```text
Cliente autentica
    ↓
Consulta eventos publicados
    ↓
Seleciona setores e quantidade
    ↓
Cria reserva
    ↓
Estoque é bloqueado e reduzido
    ↓
Pagamento simulado
    ↓
Pagamento aprovado
    ↓
Ingressos são emitidos com QR assinado
```

Se o pagamento for recusado ou a reserva expirar, o estoque é restaurado.

## Validação na portaria

```text
Portaria autentica
    ↓
Lê QR Code ou recebe código digitado
    ↓
API verifica token assinado
    ↓
API verifica evento e status do ingresso
    ↓
Entrada liberada ou recusada
```

Resultados possíveis:

- `VALIDO`
- `INVALIDO`
- `JA_UTILIZADO`
- `EVENTO_INCORRETO`
- `CANCELADO`

## Compartilhamento

```text
Cliente seleciona ingresso
    ↓
API cria token aleatório com validade de 48 horas
    ↓
Link temporário é retornado
    ↓
Pessoa acessa o link
    ↓
API exibe o ingresso compartilhado
```