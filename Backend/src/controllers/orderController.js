const db = require("../db");

// ===========================
// User สร้าง Order (หัก Coin ตาม plan)
// ===========================
exports.createOrder = async (req, res) => {
  const userId = req.user.id;
  const { product_id, rental_days, coins_cost, name, phone, address, start_date } = req.body;

  if (!product_id || !rental_days || !coins_cost || !name || !phone || !address || !start_date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // 1) ตรวจสอบเหรียญผู้ใช้
    const [users] = await db.promise().query(
      "SELECT coins FROM users WHERE user_id = ?",
      [userId]
    );
    const user = users[0];
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.coins < coins_cost) return res.status(400).json({ message: "Not enough coins" });

    // 2) เริ่ม Transaction
    await db.promise().beginTransaction();

    // หักเหรียญ
    await db.promise().query(
      "UPDATE users SET coins = coins - ? WHERE user_id = ?",
      [coins_cost, userId]
    );

    // สร้าง order
    const [result] = await db.promise().query(
      `INSERT INTO orders (user_id, product_id, name, phone, address, rental_days, coins_cost, start_date, end_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, STR_TO_DATE(?, '%Y-%m-%d'), DATE_ADD(STR_TO_DATE(?, '%Y-%m-%d'), INTERVAL ? DAY))`,
      [userId, product_id, name, phone, address, rental_days, coins_cost, start_date, start_date, rental_days]
    );

    // log coin transaction
    await db.promise().query(
      "INSERT INTO coin_transactions (user_id, amount, type, reference_id) VALUES (?, ?, 'rental', ?)",
      [userId, -coins_cost, result.insertId]
    );

    await db.promise().commit();

    res.status(201).json({
      message: "Order created, waiting for admin approval",
      order_id: result.insertId,
      coins_left: user.coins - coins_cost,
    });

  } catch (err) {
    await db.promise().rollback();
    console.error(err);
    res.status(500).json({ message: "DB Error", error: err });
  }
};

// ===========================
// User ดูคำสั่งเช่าของตัวเอง
// ===========================
exports.getUserOrders = async (req, res) => {
  const userId = req.user.id;

  try {
    const [results] = await db.promise().query(
      `SELECT o.*, p.title, p.price, p.image
       FROM orders o
       JOIN products p ON o.product_id = p.product_id
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [userId]
    );

    res.json(results);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB Error", error: err });
  }
};

// ===========================
// Admin ดู Order ทั้งหมด
// ===========================
exports.getAllOrders = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }

  try {
    const [results] = await db.promise().query(
      `SELECT o.*, p.title, p.price, p.image, u.name AS user_name
       FROM orders o
       JOIN products p ON o.product_id = p.product_id
       JOIN users u ON o.user_id = u.user_id
       ORDER BY o.created_at DESC`
    );

    res.json(results);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB Error", error: err });
  }
};

// ===========================
// Admin อัปเดต Status ของ Order
// ===========================
exports.updateOrderStatus = async (req, res) => {
  const user = req.user;
  const orderId = req.params.id;
  const { status } = req.body;

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }

  if (!["approved", "rejected", "returned"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const [result] = await db.promise().query(
      "UPDATE orders SET status = ? WHERE order_id = ?",
      [status, orderId]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Order not found" });

    res.json({ message: `Order ${status} successfully` });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB Error", error: err });
  }
};
