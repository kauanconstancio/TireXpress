const express = require('express');
const app = express();
const path = require('path');

app.get('/', (req ,res) => {
res.sendFile(path.dirname('public', ))
});

// Iniciar o servidor
app.listen(3000, () => console.log('Rodando na porta 3000...'));
