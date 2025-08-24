const db = require("../db");

// ===========================
// User สร้าง Order
// ===========================
exports.createOrder = (req, res) => {
  const userId = req.user.id; // จาก verifyToken
  const { product_id, name, phone, address, rental_days, start_date } = req.body;

  if (!product_id || !name || !phone || !address || !rental_days || !start_date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const sql = `
    INSERT INTO orders (user_id, product_id, name, phone, address, rental_days, start_date, end_date)
    VALUES (?, ?, ?, ?, ?, ?, STR_TO_DATE(?, '%Y-%m-%d'), DATE_ADD(STR_TO_DATE(?, '%Y-%m-%d'), INTERVAL ? DAY))
  `;

  db.query(
    sql,
    [userId, product_id, name, phone, address, rental_days, start_date, start_date, rental_days],
    (err, result) => {
      if (err) return res.status(500).json({ message: "DB Error", error: err });

      res.status(201).json({
        message: "Order created, waiting for admin approval",
        order_id: result.insertId,
      });
    }
  );
};

// ===========================
// User ดูคำสั่งเช่าของตัวเอง
// ===========================
exports.getUserOrders = (req, res) => {
  const userId = req.user.id; // จาก verifyToken

  const sql = `
    SELECT o.*, p.title, p.price, p.image
    FROM orders o
    JOIN products p ON o.product_id = p.product_id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "DB Error", error: err });
    res.json(results);
  });
};

// ===========================
// Admin ดู Order ทั้งหมด
// ===========================
exports.getAllOrders = (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }

  const sql = `
    SELECT o.*, p.title, p.price, p.image, u.name as user_name
    FROM orders o
    JOIN products p ON o.product_id = p.product_id
    JOIN users u ON o.user_id = u.user_id
    ORDER BY o.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "DB Error", error: err });
    res.json(results);
  });
};


// ===========================
// Admin อัปเดต Status ของ Order
// ===========================
exports.updateOrderStatus = (req, res) => {
  const user = req.user; // จาก verifyToken
  const orderId = req.params.id;
  const { status } = req.body; // 'approved' หรือ 'rejected'

  if (user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const sql = `UPDATE orders SET status = ? WHERE order_id = ?`;

  db.query(sql, [status, orderId], (err, result) => {
    if (err) return res.status(500).json({ message: "DB Error", error: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: `Order ${status} successfully` });
  });
};
