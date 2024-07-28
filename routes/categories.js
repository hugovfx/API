const express = require('express');
const router = express.Router();
const db = require('../db');
require('dotenv').config();

// Obtener todas las categorías
router.get('/categories', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name FROM categories');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener las categorías:', error);
    res.status(500).json({ message: 'Error al obtener las categorías' });
  }
});


module.exports = router;
