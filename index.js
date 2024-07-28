const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const usersRouter = require('./routes/users');
const categoriesRouter = require('./routes/categories');
const productsRouter = require('./routes/products');
require('dotenv').config();
const app = express();
const port = 3000;

require('dotenv').config();


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Servir archivos estáticos desde la carpeta 'public'

// Rutas
app.use('/api/users', usersRouter);
app.use('/api', categoriesRouter);
app.use('/api/products', productsRouter);

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
