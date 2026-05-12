# BipStone

## What This Is

O BipStone é um sistema de controle de saída de chapas de granito e mármore, projetado para gerenciar o processo de reserva e expedição de materiais para os mercados interno e externo. O sistema utiliza leitura de código de barras para identificação precisa de lotes e chapas, garantindo a rastreabilidade e eficiência no almoxarifado.

## Core Value

Garantir a precisão e agilidade no controle de saída de chapas de granito através da automação da leitura de códigos de barras e geração de relatórios de expedição.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Tela de reserva de lote com identificação do cliente, data e hora automáticas.
- [ ] Sistema de leitura de código de barras seguindo o padrão de 8 dígitos (lote) + 3 dígitos (chapa).
- [ ] Cadastro/Seleção de materiais, acabamentos e espessuras via campos de seleção (dropdown).
- [ ] Edição manual de linhas para adição de chapas e medidas.
- [ ] Persistência de dados local em SQLite.
- [ ] Exportação de relatórios em PDF e CSV.
- [ ] Envio automático de e-mail para minetealmoxarifado@gmail.com com os relatórios anexados.

### Out of Scope

- [ ] Integração com sistemas de ERP externos (nesta fase inicial).
- [ ] Controle de estoque de entrada (foco inicial é apenas na saída/reserva).
- [ ] Login/Autenticação de múltiplos usuários (será tratado como sistema local/único por enquanto).

## Context

- O usuário atua no ramo de pedras ornamentais (granito e mármore).
- O transporte é feito por carretas (mercado interno) e containers (exportação).
- O sistema de identificação por etiquetas é crítico e segue o padrão LOTE (8) - CHAPA (3).
- O almoxarifado precisa receber as confirmações de saída via e-mail imediatamente após o procedimento.

## Constraints

- **Tech Stack**: Next.js, Node.js, React, TypeScript, SQLite.
- **Database**: Deve ser local (SQLite).
- **UI/UX**: Campos de seleção obrigatórios para Material, Acabamento e Espessura (evitar texto livre).
- **Output**: PDF e CSV são obrigatórios.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| SQLite local | Necessidade de banco de dados simples e local para ambiente de almoxarifado. | — Pending |
| Next.js | Framework fullstack robusto que integra frontend e backend (Node.js) facilmente. | — Pending |

---
*Last updated: 2026-05-12 after initialization*
