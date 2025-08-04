require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const db = require('./db');
const productRoutes = require('./routes/productRoutes');


const app = express();


app.use(cors());
app.use(express.json());
app.use('/api/products', productRoutes);


// API
app.get('/', (req, res) => {
  res.send({ message: 'Server is running', time: new Date().toISOString() });
});

app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

app.get('/api/check-db', (req, res) => {
  db.query('SELECT 1', (err) => {
    if (err) {
      res.status(500).json({ status: 'error', message: err.message });
    } else {
      res.json({ status: 'ok', message: 'Database is connected' });
    }
  });
});

// ดึงผู้ใช้
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// เพิ่มผู้ใช้
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  db.query(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    [name, email],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, name, email });
    }
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

console.log('ENV CHECK:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// ลงท้ายไฟล์ server.js หรือก่อน listen ก็ได้
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, phone } = req.body;

  console.log('Register request:', req.body);

  if (!name || !email || !password || !phone) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const sql = 'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, password, phone], (err, result) => {
    if (err) {
      console.error('Register error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    const newUser = {
      id: result.insertId,
      name,
      email,
      phone,
    };

    return res.status(201).json({ message: 'User registered', user: newUser });
  });
});


app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing email or password' });
  }

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];

    // เปรียบเทียบ password (ถ้ารหัสเก็บแบบ hash ต้องใช้ bcrypt)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // ถ้า login ผ่าน ส่งข้อมูล user กลับไป
    res.json({ message: 'Login successful', user: {
      id: user.user_id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profile_image: user.profile_image,
    }});
  });
});
