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

// User ขอคืนสินค้า
router.patch('/:id/return', verifyToken, orderController.requestReturn);

// Admin / product owner ยืนยันการคืนสินค้า
router.patch('/:id/confirm-return', verifyToken, orderController.confirmReturn);

//  Admin / product owner ทำการคืนสินค้าเสร็จ
router.patch('/:id/complete-return', verifyToken, orderController.completeReturn);

module.exports = router;
