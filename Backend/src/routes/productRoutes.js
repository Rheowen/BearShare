const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');

//ทุกคนดูสินค้าได้
router.get('/', productController.getAllProducts);

// admin  แก้ไข / ลบได้
router.post('/', verifyToken, checkRole('admin'), productController.createProduct);
router.put('/:id', verifyToken, checkRole('admin'), productController.updateProduct);
router.delete('/:id', verifyToken, checkRole('admin'), productController.deleteProduct);
module.exports = router;
