const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const verifyToken = require('../middlewares/verifyToken'); 

// สร้างโพสต์ (POST /api/posts)
router.post('/', verifyToken, postController.createPost);

// ดึงโพสต์ทั้งหมด (GET /api/posts)
router.get('/', postController.getPosts);

// เพิ่มคอมเมนต์ในโพสต์ (POST /api/posts/:postId/comments)
router.post('/:postId/comments', verifyToken, postController.addComment);

// export router
module.exports = router;
