const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'testuser',
  password: 'testpassword',
  database: 'prueba'
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1);
  }
  console.log('Conectado a la base de datos');
});

module.exports = db.promise();
