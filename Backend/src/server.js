require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const db = require('./db');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes); // CRUD ไม่มี token check แล้ว

// =========================
// Test Routes
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

// Register
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password || !phone)
    return res.status(400).json({ message: 'Missing required fields' });

  const sql = 'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, password, phone], (err, result) => {
    if (err) return res.status(500).json({ message: 'Register error', error: err });

    res.status(201).json({
      message: 'User registered',
      user: {
        id: result.insertId,
        name,
        email,
        phone,
      },
    });
  });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Missing email or password' });

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Login error', error: err });
    if (results.length === 0 || results[0].password !== password)
      return res.status(401).json({ message: 'Invalid email or password' });

    const user = results[0];

    res.json({
      message: 'Login successful',
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  });
});

// =========================
// Start Server
// =========================
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
