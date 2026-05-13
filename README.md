# 💎 BipStone

> **Sistema Inteligente de Controle de Saída de Chapas de Granito e Mármore**

O **BipStone** é uma solução robusta e especializada para o setor de pedras ornamentais. Projetado para otimizar o fluxo de almoxarifado, o sistema gerencia com precisão o processo de reserva e expedição de chapas, garantindo rastreabilidade total através da automação de leitura de códigos de barras.

---

## 🎯 Objetivo Central

Garantir a precisão e agilidade no controle de saída de materiais, eliminando erros manuais de digitação e automatizando a comunicação entre o pátio e o escritório/cliente.

## ✨ Principais Funcionalidades

- **📋 Gestão de Reservas**: Tela intuitiva para identificação de clientes e registro automático de data/hora.
- **🏷️ Lógica de Barcode**: Parsing automático de etiquetas no padrão de 8 dígitos (lote) + 3 dígitos (chapa).
- **📦 Tabelas Dinâmicas**: Adição rápida de itens com campos pré-validados para materiais, acabamentos e espessuras.
- **📄 Exportação Profissional**: Geração instantânea de relatórios em **PDF** (para conferência) e **CSV** (para integração).
- **📧 Automação de E-mail**: Envio imediato dos documentos gerados para o almoxarifado via integração SMTP.
- **🗄️ Persistência Local**: Banco de dados SQLite integrado para máxima performance e baixa latência.

## 🏗️ Arquitetura e Tech Stack

O projeto foi construído seguindo os mais modernos padrões de desenvolvimento web:

- **Frontend/Backend**: [Next.js 16](https://nextjs.org/) (App Router)
- **Interface**: [React 19](https://react.dev/) + [Tailwind CSS 4](https://tailwindcss.com/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/) (Tipagem estritamente definida)
- **Banco de Dados**: [SQLite](https://www.sqlite.org/) (Gerenciado via `better-sqlite3`)
- **Documentação**: `pdf-lib` para geração de PDFs técnicos.
- **Comunicação**: `nodemailer` para integração de e-mail corporativo.

---

## 🛠️ Instalação e Configuração

### 1. Requisitos Prévios
- Node.js (v20 ou superior)
- npm / yarn / pnpm

### 2. Clonagem e Dependências
```bash
git clone <url-do-repositorio>
cd BipStone
npm install
```

### 3. Inicialização do Banco de Dados
O sistema utiliza um script de seed para carregar os materiais e acabamentos padrões da empresa:
```bash
npx tsx scripts/init-db.ts
```

### 4. Variáveis de Ambiente
Configure o arquivo `.env.local` na raiz do projeto:
```env
EMAIL_PASSWORD=sua_senha_de_app_gmail
```

### 5. Execução
```bash
npm run dev
```
Acesse: [http://localhost:3000](http://localhost:3000)

---

## 📈 Fluxo de Trabalho (GSD)

Este projeto foi desenvolvido utilizando a metodologia **GSD (Get Shit Done)**, dividida nas seguintes fases:

1.  **Phase 1: Setup & Scaffolding** - Estruturação base e ambiente.
2.  **Phase 2: Database & Data Access** - Modelagem SQLite e migrações.
3.  **Phase 3: Core UI** - Desenvolvimento da interface de reserva dinâmica.
4.  **Phase 4: Barcode Logic** - Inteligência de parsing de etiquetas.
5.  **Phase 5: Exports & Email** - Finalização com geração de docs e automação de e-mail.

---

## 📦 Entrega e Build
Para preparar o sistema para uso em produção:
```bash
npm run build
npm run start
```

---
*Desenvolvido com foco em eficiência operacional para o setor de rochas ornamentais.*
