const express = require('express');
const app = express();
const path = require('path');

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});

app.listen(3000, () => console.log('Rodando na porta 3000...'));
