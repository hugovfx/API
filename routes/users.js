const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// Registro de usuario
router.post('/register', async (req, res) => {
  const { user_nombre, user_apellido, user_password, user_email, user_language } = req.body;

  if (!user_nombre || !user_apellido || !user_password || !user_email || !user_language) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE user_email = ?', [user_email]);

    if (rows.length > 0) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(user_password, 10);

    await db.query('INSERT INTO users (user_nombre, user_apellido, user_password, user_email, user_language) VALUES (?, ?, ?, ?, ?)',
      [user_nombre, user_apellido, hashedPassword, user_email, user_language]
    );

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  const { user_email, user_password } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE user_email = ?', [user_email]);
    if (rows.length === 0) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(user_password, user.user_password);

    if (!validPassword) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ user_id: user.user_id }, 'secretkey', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

// Obtener información del usuario
router.get('/:id', async (req, res) => {
  try {
    const [results] = await db.query('SELECT user_nombre AS name FROM users WHERE user_id = ?', [req.params.id]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(results[0]);
  } catch (err) {
    console.error('Error al obtener los datos del usuario:', err);
    res.status(500).json({ message: 'Error al obtener los datos del usuario' });
  }
});

// Obtener productos del usuario
router.get('/:id/products', async (req, res) => {
  try {
    const [results] = await db.query(
      'SELECT p.id, p.name, p.price, p.description, i.url AS image_url ' +
      'FROM products p JOIN images i ON p.image_id = i.id ' +
      'WHERE p.user_id = ?', [req.params.id]
    );
    res.json(results);
  } catch (err) {
    console.error('Error al obtener los productos del usuario:', err);
    res.status(500).json({ message: 'Error al obtener los productos del usuario' });
  }
});

// Agregar forma de contacto
router.post('/:id/contacts', async (req, res) => {
  const { contact_type, contact_value } = req.body;
  try {
    await db.query('INSERT INTO user_contacts (user_id, contact_type, contact_value) VALUES (?, ?, ?)', [req.params.id, contact_type, contact_value]);
    res.status(201).json({ message: 'Forma de contacto agregada' });
  } catch (err) {
    console.error('Error al agregar la forma de contacto:', err);
    res.status(500).json({ message: 'Error al agregar la forma de contacto' });
  }
});

module.exports = router;
