const express = require('express');
const router = express.Router();
const pool = require('../db'); // Asegúrate de que la ruta sea correcta
require('dotenv').config();

// Obtener todas las categorías
router.get('/categories', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name FROM categories');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener las categorías:', error);
    res.status(500).json({ message: 'Error al obtener las categorías' });
  }
});

module.exports = router;
