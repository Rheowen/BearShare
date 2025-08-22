const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const orderController = require('../controllers/orderController');

// User สร้าง Order
router.post('/', verifyToken, orderController.createOrder);

// User ดู Order ของตัวเอง
router.get('/my-orders', verifyToken, orderController.getUserOrders);

// Admin อัปเดต Status ของ Order
router.put('/:id/status', verifyToken, orderController.updateOrderStatus);

// Admin ดู Order ทั้งหมด
router.get('/', verifyToken, orderController.getAllOrders);

module.exports = router;
