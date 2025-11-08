const express = require('express');
const path = require('path');

const app = express();

// Serve arquivos da pasta build
app.use(express.static(path.join(__dirname, 'build')));

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(10111, () => {
    console.log('Server is running on port 10111');
});
