# Roadmap: BipStone

## Overview

O desenvolvimento do BipStone seguirá uma abordagem incremental, começando pela base técnica e banco de dados, passando pela interface de usuário dinâmica, lógica de leitura de códigos de barras e, finalmente, as funcionalidades de exportação e comunicação por e-mail.

## Phases

- [x] **Phase 1: Setup & Scaffolding** - Inicialização do projeto Next.js com TypeScript e configurações básicas. (Completed 2026-05-12)
- [x] **Phase 2: Database & Data Access** - Configuração do SQLite e criação dos schemas e seeds iniciais. (Completed 2026-05-12)
- [x] **Phase 3: Core UI (Reservation Screen)** - Criação da tela de reserva com campos dinâmicos e validações. (Completed 2026-05-12)
- [x] **Phase 4: Barcode Logic & Line Management** - Implementação da lógica de leitura de etiquetas e gestão de linhas de chapas. (Completed 2026-05-12)
- [x] **Phase 5: Exports & Email** - Geração de PDF/CSV e integração com serviço de e-mail. (Completed 2026-05-12)

## Phase Details

### Phase 1: Setup & Scaffolding
**Goal**: Base técnica pronta para o desenvolvimento.
**Depends on**: Nothing
**Requirements**: DATA-01
**Success Criteria**:
  1. Projeto Next.js inicializado com TypeScript.
  2. Estrutura de pastas organizada seguindo boas práticas.
  3. Dependências iniciais instaladas (SQLite client, etc).
**Plans**: 1 plan

Plans:
- [x] 01-01: Inicializar Next.js e configurar ambiente base.

### Phase 2: Database & Data Access
**Goal**: Persistência de dados funcional.
**Depends on**: Phase 1
**Requirements**: DATA-01, DATA-02, DATA-03
**Success Criteria**:
  1. Banco SQLite criado e acessível localmente.
  2. Tabelas para Materiais, Acabamentos, Espessuras e Reservas criadas.
  3. Seed de dados iniciais para materiais e acabamentos disponível.
**Plans**: 1 plan

Plans:
- [x] 02-01: Configurar SQLite, Prisma/Better-SQLite3 e criar migrations.

### Phase 3: Core UI (Reservation Screen)
**Goal**: Interface de usuário funcional para entrada de dados.
**Depends on**: Phase 2
**Requirements**: UIX-01, UIX-02, UIX-03, LOGIC-02
**Success Criteria**:
  1. Tela de reserva exibe campos automáticos de data/hora.
  2. Dropdowns de Material, Acabamento e Espessura funcionam com dados do banco.
  3. Tabela dinâmica permite adicionar/remover linhas.
**Plans**: 2 plans

Plans:
- [x] 03-01: Criar layout base e componentes de formulário.
- [x] 03-02: Implementar estado da tabela de chapas e validações.

### Phase 4: Barcode Logic & Line Management
**Goal**: Lógica de identificação de chapas funcional.
**Depends on**: Phase 3
**Requirements**: LOGIC-01, UIX-04
**Success Criteria**:
  1. Entrada de lote separa corretamente os 8 dígitos iniciais e 3 finais.
  2. Medidas das chapas podem ser inseridas e associadas ao lote.
**Plans**: 1 plan

Plans:
- [x] 04-01: Implementar lógica de parsing de código de barras e gestão de medidas.

### Phase 5: Exports & Email
**Goal**: Entrega dos resultados e comunicação externa.
**Depends on**: Phase 4
**Requirements**: REPT-01, REPT-02, REPT-03, UIX-05
**Success Criteria**:
  1. Botão de finalizar gera PDF e CSV corretamente.
  2. E-mail é enviado com os arquivos anexos.
  3. Feedback de sucesso é exibido ao usuário.
**Plans**: 2 plans

Plans:
- [x] 05-01: Implementar geradores de PDF e CSV.
- [x] 05-02: Configurar Nodemailer/API de e-mail e finalizar fluxo.

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Setup & Scaffolding | 1/1 | Complete | 2026-05-12 |
| 2. Database & Data Access | 1/1 | Complete | 2026-05-12 |
| 3. Core UI | 2/2 | Complete | 2026-05-12 |
| 4. Barcode Logic | 1/1 | Complete | 2026-05-12 |
| 5. Exports & Email | 2/2 | Complete | 2026-05-12 |
