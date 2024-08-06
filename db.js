const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'srv1578.hstgr.io',
  user: 'u589597310_gmartinez',
  password: '>Cb67gLd0:',
  database: 'u589597310_proyectoint',
  waitForConnections: true,
  connectionLimit: 10, // Ajusta según tus necesidades
  queueLimit: 0
});

module.exports = pool;
