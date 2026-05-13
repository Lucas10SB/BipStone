# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

## [0.1.0] - Inicial
### Adicionado
- Estrutura base do projeto em Next.js 16 (App Router) e React 19.
- Configuração de banco de dados SQLite com `better-sqlite3`.
- Script de inicialização (`scripts/init-db.ts`) com tabelas: `materials`, `finishes`, `thicknesses`, `reservations` e `reservation_items`.
- Tela interativa principal de criação de reservas (`ReservationPage`).
- Lógica de geração de PDF e CSV customizados baseados nos itens reservados (`generate-docs.ts`).
- Função de disparo de e-mails com os anexos PDF e CSV configurada no `nodemailer` (`mail.ts`).
- Estilização de interface completa usando Tailwind CSS 4.
