import Database from 'better-sqlite3';
import path from 'path';

// Define o caminho do banco de dados (na raiz do projeto)
const dbPath = path.resolve(process.cwd(), 'bipstone.db');

// Inicializa o banco de dados
const db = new Database(dbPath, { verbose: console.log });

// Configuração para melhor performance e concorrência
db.pragma('journal_mode = WAL');

export default db;
