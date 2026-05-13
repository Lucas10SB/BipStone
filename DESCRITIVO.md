# BipStone - Descritivo do Projeto

## Visão Geral
O BipStone é um sistema web desenvolvido em Next.js (App Router) focado na gestão de reservas e controle de ordens de carregamento de pedras (mármores, granitos, etc.). A aplicação permite registrar detalhes de materiais, acabamentos, espessuras e gerar relatórios completos em formato PDF e CSV. 

## Stack Tecnológica
- **Framework:** Next.js 16 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS 4 e lucide-react para ícones.
- **Banco de Dados:** SQLite (com lib `better-sqlite3` rodando com journal_mode = WAL para melhor performance)
- **Geração de Documentos:** `pdf-lib` para gerar PDFs das ordens de carregamento.
- **Envio de E-mail:** `nodemailer` para disparo de reservas geradas.

## Arquitetura e Componentes Principais
1. **Banco de Dados (`src/lib/db.ts`):** 
   - Gerencia a conexão com o banco SQLite (`bipstone.db`).
   - O banco contém tabelas para `materials`, `finishes`, `thicknesses`, `reservations` e `reservation_items`.
   - Um script de seed e setup encontra-se em `scripts/init-db.ts`.

2. **Geração de Documentos e Email (`src/lib/`):**
   - `generate-docs.ts`: Módulo que utiliza o `pdf-lib` para montar visualmente o PDF da ordem de reserva de material contendo dados do cliente, data, hora e especificações de chapas (material, acabamento, código/lote, dimensões). Também gera a versão em CSV.
   - `mail.ts`: Módulo responsável pelo envio de e-mails usando o `nodemailer` e SMTP. Permite envio automático do PDF e CSV em anexo.

3. **Frontend (`src/app/` e `src/components/`):**
   - A interface principal é carregada através do `page.tsx` conectada com o componente `ReservationPage.tsx` (presente em `src/components/reservation/`), que funciona como uma interface rica interativa onde o usuário pode preencher e validar as reservas em tempo real antes da emissão.
   - Os dados iniciais e sugestão de próxima ordem de carregamento vêm via Server Actions (`src/app/actions/get-initial-data.ts`).
