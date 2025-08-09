const db = require('../db');

exports.createOrder = (req, res) => {
  const { product_id, quantity, order_type, start_date, end_date } = req.body;
  const user_id = req.user.user_id; // จาก verifyToken

  if (!product_id || !order_type) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // ดึงราคาสินค้าจาก DB
  const getProductSql = 'SELECT price FROM products WHERE product_id = ?';
  db.query(getProductSql, [product_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ message: 'Product not found' });

    const price = results[0].price;
    const total_price = (quantity || 1) * price;

    const insertSql = `
      INSERT INTO orders (user_id, product_id, quantity, order_type, total_price, start_date, end_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertSql,
      [user_id, product_id, quantity || 1, order_type, total_price, start_date || null, end_date || null],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });

        res.status(201).json({
          message: 'Order created successfully',
          order_id: result.insertId,
          total_price
        });
      }
    );
  });
};
