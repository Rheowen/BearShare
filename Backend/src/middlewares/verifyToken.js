const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: 'Access token not found' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    // Assign เฉพาะ field ที่จำเป็น
    req.user = {
      id: decoded.user_id,
      role: decoded.role,
      email: decoded.email,
      name: decoded.name // ถ้าต้องการ
    };

    next();
  });
}

module.exports = verifyToken;
