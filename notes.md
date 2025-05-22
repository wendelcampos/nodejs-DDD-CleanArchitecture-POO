# DDD (Domain Driven Design)

Design dirigido a dominio

## Dominio

- Domain Experts
    - Conversa (Fundamental)
- Linguagem ubiqua

- Usuario
    - Cliente
    - Fornecedor
    - Atendente
    - Barman

- Agregados
- Value Objects
- Eventos de dominio
- Subdominios (Bounded Contexts)
- Entidades
- Casos de uso
  
# Conceitos

- Aggregate
- Whatchedlist

## Exemplo
a
- Order -> OrderItem[]
- Order -> Shipping

- Question -> Attachment[]

### Criação

- Titulo
- Conteudo
- Anexos (3)

### Edição

- Titulo
- Conteudo

- Adicionar um novo anexo (create)
- Remover o segundo anexo que tinha sido criado previamente (delete)
- Editar um anexo existente (update)

# Subdominios

- Core: O que da dinheiro
- Supporting: Dá suporte para o core funcionar
- Generic: Voce precisa, mas não são tão importantes

## Exemplos

### Core

- Compra
- Catalogo
- Pagamento
- Entrega
- Faturamento

### Supporting

- Estoque
  
### Generic

- Notificação ao cliente
- Promoções
- Chat


