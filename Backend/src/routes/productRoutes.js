const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');

// ทุกคนดูสินค้าได้หมด
router.get('/', productController.getAllProducts);

// ดูสินค้าแบบรายตัว
router.get('/:id', productController.getProductById);

// admin แก้ไข / ลบ / เพิ่มสินค้า
router.post('/', verifyToken, checkRole('admin'), productController.createProduct);
router.put('/:id', verifyToken, checkRole('admin'), productController.updateProduct);
router.delete('/:id', verifyToken, checkRole('admin'), productController.deleteProduct);

module.exports = router;
