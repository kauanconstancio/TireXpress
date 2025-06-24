const express = require('express');
const app = express();
const path = require('path');
const db = require('./database/db'); // importa o banco

app.use(express.json()); // para receber JSON

app.use(express.static(path.join(__dirname, 'public')));

// Rota de exemplo: cadastrar cliente
app.post('/cadastro', (req, res) => {
  const { name, email, cpf, phone, password } = req.body;
  const query = `INSERT INTO customers (name, email, cpf, phone, password) VALUES (?, ?, ?, ?, ?)`;

  db.run(query, [name, email, cpf, phone, password], function (err) {
    if (err) return res.status(500).send({ erro: err.message });
    res.status(201).send({ id: this.lastID });
  });
});

app.post('/cadastro-trabalhador', (req, res) => {
  const {
    name, email, cpf, phone,
    cnpj, endereco, numero, referencia, password
  } = req.body;

  const query = `
    INSERT INTO workers (name, email, cpf, phone, cnpj, endereco, numero, referencia, password)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [name, email, cpf, phone, cnpj, endereco, numero, referencia, password], function (err) {
    if (err) return res.status(500).send({ erro: err.message });
    res.status(201);
  });
});

// Login de cliente
app.post('/login-cliente', (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM customers WHERE email = ? AND password = ?`;

  db.get(query, [email, password], (err, user) => {
    if (err) return res.status(500).send({ erro: err.message });
    if (!user) return res.status(401).send({ erro: 'Email ou senha incorretos' });

    res.status(200).send({ mensagem: 'Login realizado com sucesso', user });
  });
});

// Login de trabalhador
app.post('/login-trabalhador', (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM workers WHERE email = ? AND password = ?`;

  db.get(query, [email, password], (err, worker) => {
    if (err) return res.status(500).send({ erro: err.message });
    if (!worker) return res.status(401).send({ erro: 'Email ou senha incorretos' });

    res.status(200).send({ mensagem: 'Login realizado com sucesso', worker });
  });
});

// Página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});

app.listen(3000, () => {
  console.log('Rodando na porta 3000...');
});
