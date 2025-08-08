const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

// Register user
const registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password || !phone) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // ตรวจสอบว่ามี email นี้ในระบบหรือยัง
    const checkSql = 'SELECT * FROM users WHERE email = ?';
    db.query(checkSql, [email], async (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });
      if (results.length > 0)
        return res.status(409).json({ message: 'Email already registered' });

      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // insert user
      const insertSql = 'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)';
      db.query(insertSql, [name, email, hashedPassword, phone], (err, result) => {
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
    });
  } catch (err) {
    res.status(500).json({ message: 'Error hashing password', error: err });
  }
};

// Login user
const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];

    // ตรวจสอบรหัสผ่าน
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // สร้าง JWT token
    const token = jwt.sign(
      {
        user_id: user.user_id, 
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    // ไม่ส่ง password กลับ
  const { password: userPassword, ...userWithoutPassword } = user;
    return res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  });
};

module.exports = { registerUser, loginUser };
