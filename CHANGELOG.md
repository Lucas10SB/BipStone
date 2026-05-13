# Changelog

Todas as mudanças notáveis do projeto **BipStone** serão documentadas neste arquivo.

## [1.0.0] - 2026-05-13
### ✨ Lançamento Oficial (Produção)
- Finalização de todas as fases planejadas para o MVP.
- Sistema pronto para uso em ambiente de almoxarifado.

## [0.5.0] - 2026-05-12
### 🚀 Phase 5: Exportações e E-mail
- **Geração de Documentos**: Implementada lógica profissional para criação de PDFs e CSVs baseados na reserva.
- **Automação de E-mail**: Integração com `nodemailer` para envio automático para `minetealmoxarifado@gmail.com`.
- **Feedback UI**: Adicionados toasts de sucesso/erro e loading states durante o processamento.

## [0.4.0] - 2026-05-12
### 🏷️ Phase 4: Lógica de Barcode e Medidas
- **Inteligência de Parsing**: Lógica para separar automaticamente Lote (8 dígitos) e Chapa (3 dígitos).
- **Gestão de Itens**: Implementada a funcionalidade de adição de medidas individuais por chapa.
- **Validação**: Impedimento de duplicatas de chapas no mesmo lote na mesma reserva.

## [0.3.0] - 2026-05-12
### 🖥️ Phase 3: Interface de Reserva (Core UI)
- **Formulário Dinâmico**: Campos de Data/Hora automáticos e selects vinculados ao banco de dados.
- **Tabela Interativa**: Componente de tabela que permite adição, edição e remoção de linhas em tempo real.
- **Estilização**: UI refinada com Tailwind CSS 4, focada em usabilidade para tablets e desktops.

## [0.2.0] - 2026-05-12
### 🗄️ Phase 2: Banco de Dados e Acesso
- **SQLite Core**: Configuração do `better-sqlite3` para persistência local veloz.
- **Modelagem**: Tabelas criadas para `materials`, `finishes`, `thicknesses` e o fluxo completo de `reservations`.
- **Seed Data**: Script de inicialização (`init-db.ts`) com catálogo inicial de pedras e acabamentos.

## [0.1.0] - 2026-05-12
### 🏗️ Phase 1: Setup e Infraestrutura
- **Boilerplate**: Inicialização do Next.js 16 com TypeScript.
- **Configurações**: Setup de linting, tsconfig e estrutura de pastas `src/lib`, `src/components`.
- **Workflow GSD**: Inicialização da infraestrutura de planejamento `.planning`.

---
*Nota: Este projeto segue o versionamento semântico e a metodologia GSD.*
