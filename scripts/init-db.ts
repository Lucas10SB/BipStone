import db from '../src/lib/db';

const initDb = () => {
  console.log('Inicializando banco de dados...');

  // Tabela de Materiais
  db.exec(`
    CREATE TABLE IF NOT EXISTS materials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )
  `);

  // Tabela de Acabamentos
  db.exec(`
    CREATE TABLE IF NOT EXISTS finishes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    )
  `);

  // Tabela de Espessuras
  db.exec(`
    CREATE TABLE IF NOT EXISTS thicknesses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      value TEXT NOT NULL UNIQUE
    )
  `);

  // Tabela de Reservas
  db.exec(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de Itens da Reserva (Chapas)
  db.exec(`
    CREATE TABLE IF NOT EXISTS reservation_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reservation_id INTEGER NOT NULL,
      material_id INTEGER NOT NULL,
      finish_id INTEGER NOT NULL,
      thickness_id INTEGER NOT NULL,
      lot TEXT NOT NULL,
      slab_number TEXT NOT NULL,
      measurements TEXT NOT NULL,
      FOREIGN KEY (reservation_id) REFERENCES reservations (id),
      FOREIGN KEY (material_id) REFERENCES materials (id),
      FOREIGN KEY (finish_id) REFERENCES finishes (id),
      FOREIGN KEY (thickness_id) REFERENCES thicknesses (id)
    )
  `);

  console.log('Tabelas criadas com sucesso.');

  // Seeds iniciais (opcional, para testes)
  const materials = ['Branco Siena', 'Preto Absoluto', 'Verde Ubatuba', 'Giallo Ornamental'];
  const finishes = ['Polido', 'Levigado', 'Escovado', 'Jateado'];
  const thicknesses = ['2cm', '3cm'];

  const insertMaterial = db.prepare('INSERT OR IGNORE INTO materials (name) VALUES (?)');
  materials.forEach(m => insertMaterial.run(m));

  const insertFinish = db.prepare('INSERT OR IGNORE INTO finishes (name) VALUES (?)');
  finishes.forEach(f => insertFinish.run(f));

  const insertThickness = db.prepare('INSERT OR IGNORE INTO thicknesses (value) VALUES (?)');
  thicknesses.forEach(t => insertThickness.run(t));

  console.log('Dados iniciais (seeds) inseridos.');
};

initDb();
