require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// =========================
// Routes
// =========================
app.get('/', (req, res) => {
  res.send({ message: 'Server is running', time: new Date().toISOString() });
});

app.get('/api/check-db', (req, res) => {
  db.query('SELECT 1', (err) => {
    if (err) return res.status(500).json({ message: 'Database not connected' });
    res.json({ message: 'Database connected' });
  });
});

// =========================
// Auth Routes
// =========================

// ✅ REGISTER (hash password ก่อนบันทึก)
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password || !phone)
    return res.status(400).json({ message: 'Missing required fields' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, hashedPassword, phone], (err, result) => {
      if (err) return res.status(500).json({ message: 'Register error', error: err });

      res.status(201).json({
        message: 'User registered',
        user: {
          user_id: result.insertId,
          name,
          email,
          phone,
          role: 'user',
        },
      });
    });
  } catch (err) {
    res.status(500).json({ message: 'Error hashing password', error: err });
  }
});

//  LOGIN (compare password + generate token)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Missing email or password' });

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Login error', error: err });
    if (results.length === 0)
      return res.status(401).json({ message: 'Invalid email or password' });

    const user = results[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: 'Invalid email or password' });

    // สร้าง token
    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword,
    });
  });
});

// =========================
// Protected Route Example (optional)
// =========================
const verifyToken = require('./middlewares/verifyToken');
app.get('/api/profile', verifyToken, (req, res) => {
  res.json({ message: 'Access granted', user: req.user });
});

// =========================
// Start Server
// =========================
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
