require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db'); // เชื่อมต่อจาก db.js

const app = express();

app.use(cors());
app.use(express.json());

// ทดสอบ API
app.get('/', (req, res) => {
  res.send({ message: 'Server is running', time: new Date().toISOString() });
});

// ดึงผู้ใช้ทั้งหมด
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
