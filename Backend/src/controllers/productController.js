const db = require('../db');
const { param } = require('../routes/authRoutes');

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

// แสดงสินค้าทั้งหมด + filter
exports.getAllProducts = (req, res) => {
  const { category_id, age_group_id, is_rentable, maxPrice, minPrice, search } = req.query;

  let sql = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (category_id) {
    sql += ' AND category_id = ?'; //sql = 'SELECT * FROM products WHERE 1=1 AND category_id = ?'
    params.push(category_id);
  }

  if (age_group_id) {
    sql += ' AND age_group_id = ?';
    params.push(age_group_id); 
  }

  if (is_rentable !== undefined) {
    sql += ' AND is_rentable = ?';
    params.push(is_rentable);
  }

  if (minPrice && maxPrice) {
    sql += ' AND price BETWEEN ? AND ?';
    params.push(minPrice, maxPrice);
  }

  if (search) {
    sql += ' AND title LIKE ?'; 
    params.push(`%${search}%`);
  }

  sql += ' ORDER BY product_id DESC';        //SELECT * FROM products WHERE category_id = ? ORDER BY product_id DESC
                                             //เรียงลำดับตาม product_id  DESC (Descending)สินค้าที่เพิ่มล่าสุดจะอยู่ด้านบน ตรงข้ามASC

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Get products error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    res.status(200).json({
      message: 'Products fetched successfully',
      products: results,
    });
  });
};

exports.getProductById = (req, res) => {
  const productId = req.params.id;
  const sql = 'SELECT * FROM products WHERE product_id = ?';

  db.query(sql, [productId], (err, results) => {
    if (err) {
      console.error('Get product by id error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(results[0]);
  });
};


