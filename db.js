const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'srv1578.hstgr.io',
  user: 'u589597310_gmartinez',
  password: '>Cb67gLd0:',
  database: 'u589597310_proyectoint'
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1);
  }
  console.log('Conectado a la base de datos');
});

module.exports = db.promise();
