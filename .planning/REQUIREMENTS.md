# Requirements: BipStone

**Defined:** 2026-05-12
**Core Value:** Garantir a precisão e agilidade no controle de saída de chapas de granito através da automação.

## v1 Requirements

### Interface & Experience (UIX)

- [ ] **UIX-01**: Tela de reserva com campos para: Nome do Cliente, Data (auto), Hora (auto).
- [ ] **UIX-02**: Seleção de Material, Acabamento e Espessura via Dropdown (campos controlados).
- [ ] **UIX-03**: Tabela dinâmica de chapas com possibilidade de adicionar linhas manualmente.
- [ ] **UIX-04**: Campos de entrada para Lote (8 dígitos) e Medidas das chapas.
- [ ] **UIX-05**: Feedback visual de sucesso ao salvar a reserva.

### Data Management (DATA)

- [ ] **DATA-01**: Banco de dados SQLite local configurado.
- [ ] **DATA-02**: Schema para Clientes, Materiais, Acabamentos e Reservas de Chapas.
- [ ] **DATA-03**: Persistência de dados das reservas no SQLite.

### Business Logic (LOGIC)

- [ ] **LOGIC-01**: Sistema de leitura de código de barras (padrão Lote 8 + Chapa 3).
- [ ] **LOGIC-02**: Validação de campos obrigatórios antes do salvamento.

### Reporting & Integration (REPT)

- [ ] **REPT-01**: Geração de arquivo PDF com o resumo da reserva de chapas.
- [ ] **REPT-02**: Geração de arquivo CSV com os dados estruturados da reserva.
- [ ] **REPT-03**: Envio automático de e-mail para minetealmoxarifado@gmail.com com anexos (PDF e CSV).

## v2 Requirements

### Analytics & Inventory

- **ANLT-01**: Dashboard com estatísticas de saída por material/mês.
- **ANLT-02**: Sincronização opcional com nuvem para backup.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Login de Usuários | Sistema local de uso único simplificado para v1. |
| Controle de Entrada | Foco inicial apenas na expedição/saída. |
| Integração ERP | Alta complexidade, mantido como sistema isolado para v1. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| UIX-01 | Phase 3 | Complete |
| UIX-02 | Phase 3 | Complete |
| UIX-03 | Phase 3 | Complete |
| UIX-04 | Phase 3 | Complete |
| UIX-05 | Phase 3 | Complete |
| DATA-01 | Phase 1 | Complete |
| DATA-02 | Phase 2 | Complete |
| DATA-03 | Phase 2 | Complete |
| LOGIC-01 | Phase 4 | Complete |
| LOGIC-02 | Phase 3 | Complete |
| REPT-01 | Phase 5 | Complete |
| REPT-02 | Phase 5 | Complete |
| REPT-03 | Phase 5 | Complete |

**Coverage:**
- v1 requirements: 13 total
- Mapped to phases: 13
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-12*
*Last updated: 2026-05-12 after initial definition*
