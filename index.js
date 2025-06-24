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

// Página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});

app.listen(3000, () => {
  console.log('Rodando na porta 3000...');
});
