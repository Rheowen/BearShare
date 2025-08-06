const db = require('../db');

// เพิ่มสินค้า
exports.createProduct = (req, res) => {
  const { user_id, title, description, price, category_id, age_group_id, is_rentable, image } = req.body;

  if (!user_id || !title || !price) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const sql = `
    INSERT INTO products 
    (user_id, title, description, price, category_id, age_group_id, is_rentable, image) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [user_id, title, description, price, category_id, age_group_id, is_rentable, image],
    (err, result) => {
      if (err) {
        console.error('Create product error:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      res.status(201).json({ message: 'Product created', product_id: result.insertId });
    }
  );
};

// แก้ไขสินค้า
exports.updateProduct = (req, res) => {
  const productId = req.params.id;
  const { title, description, price, status, category_id, age_group_id, is_rentable, image } = req.body;

  const sql = `
    UPDATE products SET 
      title = ?, description = ?, price = ?, status = ?, 
      category_id = ?, age_group_id = ?, is_rentable = ?, image = ?
    WHERE product_id = ?
  `;

  db.query(
    sql,
    [title, description, price, status, category_id, age_group_id, is_rentable, image, productId],
    (err) => {
      if (err) {
        console.error('Update product error:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      res.json({ message: 'Product updated' });
    }
  );
};

// ลบสินค้า
exports.deleteProduct = (req, res) => {
  const productId = req.params.id;

  const sql = 'DELETE FROM products WHERE product_id = ?';
  db.query(sql, [productId], (err) => {
    if (err) {
      console.error('Delete product error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    res.json({ message: 'Product deleted' });
  });
};

// แสดงสินค้าทั้งหมด
exports.getAllProducts = (req, res) => {
  const sql = 'SELECT * FROM products ORDER BY product_id DESC';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Get products error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    res.json({ products: results });
  });
};


