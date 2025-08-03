const bcrypt = require('bcrypt');
const db = require('../db');

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

    // ตรวจสอบรหัสผ่านโดย bcrypt
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // ไม่ส่ง password_hash กลับไป
    const { password_hash, ...userWithoutPassword } = user;

    return res.json({ message: 'Login successful', user: userWithoutPassword });
  });
};

module.exports = {
  registerUser,
  loginUser,
};
