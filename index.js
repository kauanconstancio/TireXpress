const express = require('express');
const app = express();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Conexão com o banco
const dbPath = path.join(__dirname, 'tirexpress.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) return console.error(err.message);
  console.log('Conectado ao banco de dados SQLite.');
});

// Garantir criação das tabelas
db.serialize(() => {
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

  db.run(`
    CREATE TABLE IF NOT EXISTS workers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      cpf TEXT,
      phone TEXT NOT NULL,
      cnpj TEXT,
      endereco TEXT,
      numero TEXT,
      referencia TEXT,
      password TEXT NOT NULL,
      borracheiro INTEGER DEFAULT 0,
      reboque INTEGER DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS location (
      id INTEGER PRIMARY KEY,
      lat REAL,
      lng REAL,
      type TEXT UNIQUE
    )
  `);
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rota: Cadastro de cliente
app.post('/cadastro', (req, res) => {
  const { name, email, cpf, phone, password } = req.body;
  const query = `INSERT INTO customers (name, email, cpf, phone, password) VALUES (?, ?, ?, ?, ?)`;

  db.run(query, [name, email, cpf, phone, password], function (err) {
    if (err) return res.status(500).send({ erro: err.message });
    res.status(201).send({ id: this.lastID });
  });
});

// Rota: Cadastro de trabalhador
app.post('/cadastro-trabalhador', (req, res) => {
  const {
    name, email, cpf, phone,
    cnpj, endereco, numero, referencia, password,
    borracheiro = 0,
    reboque = 0
  } = req.body;

  const query = `
    INSERT INTO workers (name, email, cpf, phone, cnpj, endereco, numero, referencia, password, borracheiro, reboque)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [name, email, cpf, phone, cnpj, endereco, numero, referencia, password, borracheiro, reboque], function (err) {
    if (err) return res.status(500).send({ erro: err.message });
    res.status(201).send({ mensagem: 'Trabalhador cadastrado com sucesso', id: this.lastID });
  });
});

// Rota: Login de cliente
app.post('/login-cliente', (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT * FROM customers WHERE email = ? AND password = ?`;

  db.get(query, [email, password], (err, user) => {
    if (err) return res.status(500).send({ erro: err.message });
    if (!user) return res.status(401).send({ erro: 'Email ou senha incorretos' });

    res.status(200).send({ mensagem: 'Login realizado com sucesso', user });
  });
});

// Rota: Login de trabalhador
app.post('/login-trabalhador', (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT * FROM workers WHERE email = ? AND password = ?`;

  db.get(query, [email, password], (err, worker) => {
    if (err) return res.status(500).send({ erro: err.message });
    if (!worker) return res.status(401).send({ erro: 'Email ou senha incorretos' });

    res.status(200).send({ mensagem: 'Login realizado com sucesso', worker });
  });
});

// Rota: Atualizar localização
app.post('/location-update', (req, res) => {
  const { type, lat, lng } = req.body;
  db.run(`
    INSERT INTO location (type, lat, lng)
    VALUES (?, ?, ?)
    ON CONFLICT(type) DO UPDATE SET lat = excluded.lat, lng = excluded.lng
  `, [type, lat, lng], (err) => {
    if (err) return res.status(500).send({ erro: err.message });
    res.sendStatus(200);
  });
});

// Rota: Obter localizações
app.get('/location-get', (req, res) => {
  db.all(`SELECT type, lat, lng FROM location`, (err, rows) => {
    if (err) return res.status(500).send({ erro: err.message });
    res.json(rows);
  });
});

// Página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});

// Inicialização do servidor
app.listen(3000, () => {
  console.log('Rodando na porta 3000...');
});
