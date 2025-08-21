const db = require('../db');




// ==================== CREATE POST ====================
exports.createPost = (req, res) => {
    const { user_id, title, content } = req.body;

    if (!user_id || !title || !content) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const sql = `INSERT INTO posts (user_id, title, content, created_at) VALUES (?, ?, ?, NOW())`;
    db.query(sql, [user_id, title, content], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json({ 
            message: 'Post created successfully',
            post_id: result.insertId
        });
    });
};

// ==================== GET POSTS WITH COMMENTS ====================
exports.getPosts = (req, res) => {
    const sql = `
        SELECT p.post_id, p.title, p.content, p.created_at,
               u.name AS author,
               JSON_ARRAYAGG(
                   JSON_OBJECT(
                       'comment_id', c.comment_id,
                       'content', c.content,
                       'created_at', c.created_at,
                       'author', cu.name
                   )
               ) AS comments
        FROM posts p
        JOIN users u ON p.user_id = u.user_id
        LEFT JOIN comments c ON p.post_id = c.post_id
        LEFT JOIN users cu ON c.user_id = cu.user_id
        GROUP BY p.post_id
        ORDER BY p.created_at DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json(results);
    });
};

// ==================== ADD COMMENT ====================
exports.addComment = (req, res) => {
    const { post_id, user_id, content } = req.body;

    if (!post_id || !user_id || !content) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const sql = `INSERT INTO comments (post_id, user_id, content, created_at) VALUES (?, ?, ?, NOW())`;
    db.query(sql, [post_id, user_id, content], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json({ 
            message: 'Comment added successfully',
            comment_id: result.insertId
        });
    });
};
