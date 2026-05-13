# BipStone

Sistema web para gestão e emissão de ordens de carregamento e reserva de materiais (mármores e granitos).

## 🚀 Funcionalidades
- Gerenciamento de chapas, lotes e materiais.
- Emissão de relatórios em PDF para clientes e fornecedores.
- Exportação de dados de reservas em formato CSV.
- Disparo de e-mails automáticos com as reservas anexadas.
- Baseado em SQLite para facilitar a implantação e manutenção de pequeno a médio porte.

## 🛠️ Tecnologias Utilizadas
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- SQLite (via better-sqlite3)
- pdf-lib
- nodemailer

## ⚙️ Instalação e Execução

### 1. Clonar o repositório
```bash
git clone <url-do-repositorio>
cd BipStone
```

### 2. Instalar dependências
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 3. Configurar Banco de Dados (Inicialização)
Antes de rodar pela primeira vez, é necessário inicializar o banco de dados e inserir os dados iniciais (seeds):
```bash
npx tsx scripts/init-db.ts
```

### 4. Configurar Variáveis de Ambiente
Crie um arquivo `.env` ou `.env.local` na raiz do projeto com as credenciais de e-mail (caso a funcionalidade de e-mail seja ativada no ambiente de desenvolvimento):
```env
EMAIL_PASSWORD=sua_senha_de_app_do_gmail
```

### 5. Executar em modo de desenvolvimento
```bash
npm run dev
```
O servidor estará disponível em [http://localhost:3000](http://localhost:3000).

## 📦 Build para Produção
Para gerar a versão otimizada para produção:
```bash
npm run build
npm run start
```
