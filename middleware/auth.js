const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Failed to authenticate token' });

    req.user_id = decoded.user_id; // Guarda el user_id en req para usarlo más tarde
    next();
  });
};

module.exports = auth;
