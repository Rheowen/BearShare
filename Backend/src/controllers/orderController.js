const db = require("../db");

// helper function
const getUserIdFromReq = (req) => req.user?.user_id ?? req.user?.id;

// ===========================
// Create Order
// ===========================
exports.createOrder = async (req, res) => {
  const userId = getUserIdFromReq(req);
  const { product_id, rental_days, coins_cost, name, phone, address } = req.body;

  console.log("Incoming request body:", req.body);

  if (!product_id || !rental_days || !coins_cost || !name || !phone || !address) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const connection = await db.promise().getConnection();
  try {
    await connection.beginTransaction();

    // ตรวจสอบเหรียญผู้ใช้
    const [users] = await connection.query(
      "SELECT coins FROM users WHERE user_id = ?",
      [userId]
    );
    const user = users[0];
    if (!user) {
      await connection.rollback();
      return res.status(404).json({ message: "User not found" });
    }
    if (user.coins < coins_cost) {
      await connection.rollback();
      return res.status(400).json({ message: "Not enough coins" });
    }

    console.log("User coins:", user.coins, "Coins cost:", coins_cost);

    // หักเหรียญ
    await connection.query(
      "UPDATE users SET coins = coins - ? WHERE user_id = ?",
      [coins_cost, userId]
    );

    // สร้าง order
    const [result] = await connection.query(
      `INSERT INTO orders 
       (user_id, product_id, name, phone, address, rental_days, coins_cost, start_date, end_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL ? DAY))`,
      [userId, product_id, name, phone, address, rental_days, coins_cost, rental_days]
    );

    console.log("Order inserted with ID:", result.insertId);

    // log coin transaction
    await connection.query(
      "INSERT INTO coin_transactions (user_id, amount, type, reference_id) VALUES (?, ?, 'rental', ?)",
      [userId, -coins_cost, result.insertId]
    );

    await connection.commit();
    connection.release();

    res.status(201).json({
      message: "Order created, waiting for admin approval",
      order_id: result.insertId,
      coins_left: user.coins - coins_cost,
      // เนื่องจาก order.end_date ไม่มี ต้อง query อีกรอบถ้าจะเอา
    });

  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error("Error in createOrder:", err);
    res.status(500).json({ message: "DB Error", error: err });
  }
};

// ===========================
// User ดูคำสั่งเช่าของตัวเอง
// ===========================
exports.getUserOrders = async (req, res) => {
  const userId = getUserIdFromReq(req);

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
  const userId = getUserIdFromReq(req);
  const orderId = req.params.id;
  const { status } = req.body;

  if (req.user.role !== "admin") {
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

// ---------------------- Request return (user) ----------------------
exports.requestReturn = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    const orderId = req.params.id;

    console.log(`RequestReturn: userId=${userId}, orderId=${orderId}`);

    // check order belongs to user
    const [rows] = await db.promise().query('SELECT * FROM orders WHERE order_id = ?', [orderId]);
    const order = rows[0];
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.user_id !== userId) {
      return res.status(403).json({ message: 'You can only request return for your own orders' });
    }

    if (order.return_status !== 'not_returned') {
      return res.status(400).json({ message: `Return not allowed in current status (${order.return_status})` });
    }

    const now = new Date();
    await db.promise().query(
      'UPDATE orders SET return_status = ?, return_date = ? WHERE order_id = ?',
      ['requested', now, orderId]
    );

    console.log(`Return requested for order ${orderId} by user ${userId}`);
    res.json({ message: 'Return requested', order_id: orderId });
  } catch (err) {
    console.error('Error in requestReturn:', err);
    res.status(500).json({ message: 'DB Error', error: err });
  }
};

// ---------------------- Confirm return (admin or product owner) ----------------------
exports.confirmReturn = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    const orderId = req.params.id;
    console.log(`ConfirmReturn: by ${userId} for order ${orderId}`);

    // load order and product owner
    const [[orderRows]] = await db.promise().query(
      'SELECT o.*, p.user_id AS product_owner_id FROM orders o JOIN products p ON o.product_id = p.product_id WHERE o.order_id = ?',
      [orderId]
    );

    const order = orderRows;
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const requesterRole = req.user?.role ?? null;
    const productOwnerId = order.product_owner_id;

    // only admin or product owner can confirm
    if (requesterRole !== 'admin' && userId !== productOwnerId) {
      return res.status(403).json({ message: 'Only admin or product owner can confirm return' });
    }

    if (order.return_status !== 'requested') {
      return res.status(400).json({ message: `Cannot confirm return from status ${order.return_status}` });
    }

    await db.promise().query(
      'UPDATE orders SET return_status = ? WHERE order_id = ?',
      ['returned', orderId]
    );

    console.log(`Return confirmed for order ${orderId} by ${userId}`);
    res.json({ message: 'Return confirmed', order_id: orderId });
  } catch (err) {
    console.error('Error in confirmReturn:', err);
    res.status(500).json({ message: 'DB Error', error: err });
  }
};

// ===========================
// Admin ยืนยันการคืนสินค้า (ขั้นสุดท้าย)
// ===========================
exports.completeReturn = async (req, res) => {
  const adminId = getUserIdFromReq(req);
  const orderId = req.params.id;

  console.log(`CompleteReturn: by ${adminId} for order ${orderId}`);

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }

  const connection = await db.promise().getConnection();
  try {
    await connection.beginTransaction();

    // ดึง order ที่อยู่ในสถานะ returned
    const [orders] = await connection.query(
      "SELECT * FROM orders WHERE order_id = ? AND return_status = 'returned'",
      [orderId]
    );

    if (orders.length === 0) {
      await connection.rollback();
      connection.release();
      return res
        .status(404)
        .json({ message: "Order not found or not ready for completion" });
    }

    const order = orders[0];

    // อัปเดต return_status เป็น completed
    await connection.query(
      "UPDATE orders SET return_status = 'completed' WHERE order_id = ?",
      [orderId]
    );

    // คืนสินค้ากลับเป็น available
    await connection.query(
      "UPDATE products SET status = 'available' WHERE product_id = ?",
      [order.product_id]
    );

    await connection.commit();
    connection.release();

    res.json({ message: "Return completed successfully" });
  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error("Error in completeReturn:", err);
    res.status(500).json({ message: "DB Error", error: err });
  }
};
