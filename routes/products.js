const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinaryConfig'); // Asegúrate de que la ruta sea correcta
const pool = require('../db'); // Cambié 'db' por 'pool' para usar el pool de conexiones
const auth = require('../middleware/auth');
const streamifier = require('streamifier'); // Importar streamifier
require('dotenv').config();

const upload = multer({ storage: multer.memoryStorage() });

// Publicar un producto (requiere autenticación)
router.post('/', auth, upload.single('image'), async (req, res) => {
  const { name, price, category_id, description } = req.body;
  const imageFile = req.file;

  if (!imageFile) return res.status(400).json({ message: 'Se requiere una imagen' });

  try {
    // Crear un stream de la imagen
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image' },
      async (error, result) => {
        if (error) {
          console.error('Error al subir la imagen:', error);
          return res.status(500).json({ message: 'Error al subir la imagen' });
        }

        const imageUrl = result.secure_url;

        try {
          // Registrar la imagen en la base de datos
          const [imageResult] = await pool.query('INSERT INTO images (url) VALUES (?)', [imageUrl]);
          const imageId = imageResult.insertId;

          // Registrar el producto en la base de datos
          await pool.query('INSERT INTO products (name, price, category_id, description, image_id, user_id) VALUES (?, ?, ?, ?, ?, ?)',
            [name, price, category_id, description, imageId, req.user.user_id]
          );

          res.status(201).json({ message: 'Producto publicado' });
        } catch (dbError) {
          console.error('Error al registrar la imagen o el producto:', dbError);
          res.status(500).json({ message: 'Error al registrar la imagen o el producto' });
        }
      }
    );

    // Subir el archivo como un stream
    streamifier.createReadStream(imageFile.buffer).pipe(stream);
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).json({ message: 'Error al procesar la solicitud' });
  }
});

// Obtener la lista de productos con opción de filtro por categoría
router.get('/', async (req, res) => {
  const categoryId = req.query.category_id;
  let query = `
    SELECT p.id, p.name, p.price, p.description, p.active, c.name AS category_name, i.url AS image_url 
    FROM products p 
    JOIN categories c ON p.category_id = c.id 
    JOIN images i ON p.image_id = i.id 
    WHERE p.active = 1
  `;
  let params = [];

  if (categoryId && categoryId !== 'all') {
    query += ' AND p.category_id = ?';
    params.push(categoryId);
  }

  try {
    const [results] = await pool.query(query, params);
    res.json(results);
  } catch (err) {
    console.error('Error al obtener los productos:', err);
    res.status(500).json({ message: 'Error al obtener los productos' });
  }
});

// Obtener información detallada de un producto
router.get('/:id', async (req, res) => {
  try {
    const [productResults] = await pool.query(`
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

    const [contactResults] = await pool.query(`
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

// Eliminar producto
router.delete('/:id', async (req, res) => {
  const productId = parseInt(req.params.id);
  try {
    // Obtener la URL de la imagen asociada al producto
    const [product] = await pool.query('SELECT image_id FROM products WHERE id = ?', [productId]);
    
    if (product.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const imageId = product[0].image_id;

    // Eliminar el producto
    await pool.query('DELETE FROM products WHERE id = ?', [productId]);

    // Eliminar la imagen asociada (si existe)
    if (imageId) {
      await pool.query('DELETE FROM images WHERE id = ?', [imageId]);
    }

    res.status(200).json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ message: 'Error al eliminar el producto' });
  }
});

module.exports = router;
