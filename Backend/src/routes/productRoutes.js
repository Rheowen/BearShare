const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');

//ทุกคนดูสินค้าได้หมด
router.get('/', productController.getAllProducts);

// admin  แก้ไข / ลบได้
router.post('/', verifyToken, checkRole('admin'), productController.createProduct);
router.put('/:id', verifyToken, checkRole('admin'), productController.updateProduct);
router.delete('/:id', verifyToken, checkRole('admin'), productController.deleteProduct);
module.exports = router;
