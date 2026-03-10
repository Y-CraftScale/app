const db = require('../config/db');

const Admin = {
    getAllUsers: async () => {
        const [rows] = await db.query(`
            SELECT id, username, email, is_admin, is_banned, created_at 
            FROM users 
            ORDER BY created_at DESC
        `);
        return rows;
    },

    toggleBanStatus: async (userId, newStatus) => {
        await db.query(`
            UPDATE users 
            SET is_banned = ? 
            WHERE id = ? AND is_admin = FALSE
        `, [newStatus, userId]);
    },

    getAllRecentComments: async () => {
        const [rows] = await db.query(`
            SELECT c.*, u.username, m.title as movie_title 
            FROM comments c
            JOIN users u ON c.user_id = u.id
            JOIN movies m ON c.movie_id = m.movie_id
            WHERE c.is_validated = FALSE
            ORDER BY c.created_at DESC 
            LIMIT 50
        `);
        return rows;
    },

    approveComment: async (commentId) => {
        await db.query(`
            UPDATE comments 
            SET is_validated = TRUE 
            WHERE id = ?
        `, [commentId]);
    },

    deleteComment: async (commentId) => {
        await db.query(`
            DELETE FROM comments 
            WHERE id = ?
        `, [commentId]);
    }
};

module.exports = Admin;
