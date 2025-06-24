const express = require('express');
const app = express();
const path = require('path');

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal (HTML)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});

// Iniciar servidor
app.listen(3000, () => {
  console.log('Rodando na porta 3000...');
});
