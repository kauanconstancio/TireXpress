const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho do banco
const dbPath = path.join(__dirname, 'tirexpress.db');

// Conexão com SQLite
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) return console.error(err.message);
  console.log('Conectado ao banco de dados SQLite.');
});

// Criar tabelas
db.serialize(() => {
  // Tabela de clientes
  db.run(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      cpf TEXT NOT NULL,
      phone TEXT NOT NULL,
      password TEXT NOT NULL
    )
  `);

  // Tabela de trabalhadores com campos adicionais
  db.run(`
    CREATE TABLE IF NOT EXISTS workers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      cpf TEXT NOT NULL,
      phone TEXT NOT NULL,
      cnpj TEXT NOT NULL,
      endereco TEXT NOT NULL,
      numero TEXT,
      referencia TEXT,
      password TEXT NOT NULL,
      borracheiro INTEGER DEFAULT 0,
      reboque INTEGER DEFAULT 0
    )
  `);
});

module.exports = db;
