const express = require('express');
const app = express();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Caminho do banco
const dbPath = path.join(__dirname, 'tirexpress.db');
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

  // Tabela de trabalhadores
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

  // Tabela de localização
  db.run(`
    CREATE TABLE IF NOT EXISTS location (
      id INTEGER PRIMARY KEY,
      lat REAL,
      lng REAL,
      type TEXT UNIQUE
    )
  `);

  // Tabela de solicitações
  db.run(`
    CREATE TABLE IF NOT EXISTS requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      service_type TEXT NOT NULL,
      vehicle_type TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pendente',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    )
  `);
});

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ROTAS

// Cadastro: Cliente
app.post('/cadastro', (req, res) => {
  const { name, email, cpf, phone, password } = req.body;
  if (!name || !email || !cpf || !phone || !password) {
    return res.status(400).send({ erro: 'Preencha todos os campos obrigatórios' });
  }

  const query = `INSERT INTO customers (name, email, cpf, phone, password) VALUES (?, ?, ?, ?, ?)`;
  db.run(query, [name, email, cpf, phone, password], function (err) {
    if (err) return res.status(500).send({ erro: err.message });
    res.status(201).send({ id: this.lastID });
  });
});

// Cadastro: Trabalhador
app.post('/cadastro-trabalhador', (req, res) => {
  const {
    name, email, cpf, phone, cnpj, endereco,
    numero, referencia, password,
    borracheiro = 0, reboque = 0
  } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).send({ erro: 'Preencha os campos obrigatórios' });
  }

  const query = `
    INSERT INTO workers (name, email, cpf, phone, cnpj, endereco, numero, referencia, password, borracheiro, reboque)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [name, email, cpf, phone, cnpj, endereco, numero, referencia, password, borracheiro, reboque], function (err) {
    if (err) return res.status(500).send({ erro: err.message });
    res.status(201).send({ mensagem: 'Trabalhador cadastrado com sucesso', id: this.lastID });
  });
});

// Login: Cliente
app.post('/login-cliente', (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT * FROM customers WHERE email = ? AND password = ?`;

  db.get(query, [email, password], (err, user) => {
    if (err) return res.status(500).send({ erro: err.message });
    if (!user) return res.status(401).send({ erro: 'Email ou senha incorretos' });
    res.status(200).send({ mensagem: 'Login realizado com sucesso', user });
  });
});

// Login: Trabalhador
app.post('/login-trabalhador', (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT * FROM workers WHERE email = ? AND password = ?`;

  db.get(query, [email, password], (err, worker) => {
    if (err) return res.status(500).send({ erro: err.message });
    if (!worker) return res.status(401).send({ erro: 'Email ou senha incorretos' });
    res.status(200).send({ mensagem: 'Login realizado com sucesso', worker });
  });
});

// Localização: Atualizar
app.post('/location-update', (req, res) => {
  const { type, lat, lng } = req.body;
  if (!type || !lat || !lng) {
    return res.status(400).send({ erro: 'Dados de localização incompletos' });
  }

  db.run(`
    INSERT INTO location (type, lat, lng)
    VALUES (?, ?, ?)
    ON CONFLICT(type) DO UPDATE SET lat = excluded.lat, lng = excluded.lng
  `, [type, lat, lng], (err) => {
    if (err) return res.status(500).send({ erro: err.message });
    res.sendStatus(200);
  });
});

// Localização: Buscar todos
app.get('/location-get', (req, res) => {
  db.all(`SELECT type, lat, lng FROM location`, (err, rows) => {
    if (err) return res.status(500).send({ erro: err.message });
    res.status(200).json(rows);
  });
});

// Solicitação: Criar
app.post('/solicitar-servico', (req, res) => {
  const { customer_id, service_type, vehicle_type, description } = req.body;
  if (!customer_id || !service_type || !vehicle_type) {
    return res.status(400).send({ erro: 'Campos obrigatórios não preenchidos' });
  }

  const query = `
    INSERT INTO requests (customer_id, service_type, vehicle_type, description)
    VALUES (?, ?, ?, ?)
  `;

  db.run(query, [customer_id, service_type, vehicle_type, description], function (err) {
    if (err) return res.status(500).send({ erro: err.message });
    res.status(201).send({ mensagem: 'Solicitação enviada com sucesso', id: this.lastID });
  });
});

// Página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});

// Inicializar servidor
app.listen(3000, () => {
  console.log('Rodando na porta 3000...');
});
