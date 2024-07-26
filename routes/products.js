const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const db = require('../db');
const auth = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage() });

// Publicar un producto (requiere autenticación)
router.post('/', auth, upload.single('image'), async (req, res) => {
  const { name, price, category_id, description } = req.body;
  const imageFile = req.file;

  if (!imageFile) return res.status(400).json({ message: 'Se requiere una imagen' });

  const base64Image = imageFile.buffer.toString('base64');

  try {
    const response = await axios.post('https://api.imgur.com/3/image', {
      image: base64Image,
      type: 'base64'
    }, {
      headers: {
        Authorization: `Client-ID TU_CLIENT_ID`
      }
    });

    const imageUrl = response.data.data.link;
    const [imageResult] = await db.query('INSERT INTO images (url) VALUES (?)', [imageUrl]);
    const imageId = imageResult.insertId;

    await db.query('INSERT INTO products (name, price, category_id, description, image_id, user_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, price, category_id, description, imageId, req.user_id]
    );

    res.status(201).json({ message: 'Producto publicado' });
  } catch (error) {
    console.error('Error al subir la imagen o registrar el producto:', error);
    res.status(500).json({ message: 'Error al procesar la solicitud' });
  }
});

// Obtener la lista de productos
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query(
      'SELECT p.id, p.name, p.price, p.description, p.active, c.name AS category_name, i.url AS image_url FROM products p JOIN categories c ON p.category_id = c.id JOIN images i ON p.image_id = i.id WHERE p.active = 1'
    );
    res.json(results);
  } catch (err) {
    console.error('Error al obtener los productos:', err);
    res.status(500).json({ message: 'Error al obtener los productos' });
  }
});

// Obtener información detallada de un producto
router.get('/:id', async (req, res) => {
  try {
    const [productResults] = await db.query(`
      SELECT p.name, p.price, p.description, c.name AS category_name, 
             u.user_nombre AS user_name, i.url AS image_url 
      FROM products p 
      JOIN categories c ON p.category_id = c.id 
      JOIN images i ON p.image_id = i.id 
      JOIN users u ON p.user_id = u.user_id 
      WHERE p.id = ?
    `, [req.params.id]);

    if (productResults.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const product = productResults[0];

    const [contactResults] = await db.query(`
      SELECT contact_type, contact_value 
      FROM user_contacts 
      WHERE user_id = (SELECT user_id FROM products WHERE id = ?)
    `, [req.params.id]);

    product.contacts = contactResults;

    res.json(product);
  } catch (err) {
    console.error('Error al obtener los datos del producto:', err);
    res.status(500).json({ message: 'Error al obtener los datos del producto' });
  }
});




module.exports = router;
