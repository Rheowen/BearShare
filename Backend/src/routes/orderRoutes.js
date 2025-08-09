const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const { createOrder } = require('../controllers/orderController');

router.post('/', verifyToken, createOrder);

module.exports = router;
