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

    getStats: async () => {
        const queries = [
            db.query('SELECT COUNT(*) as count FROM users'),
            db.query('SELECT COUNT(*) as count FROM users WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())'),
            db.query('SELECT COUNT(*) as count FROM comments'),
            db.query('SELECT COUNT(*) as count FROM comments WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())')
        ];

        const [
            [totalUsersRows],
            [newUsersRows],
            [totalCommentsRows],
            [newCommentsRows]
        ] = await Promise.all(queries);

        return {
            totalUsers: totalUsersRows[0].count,
            newUsersThisMonth: newUsersRows[0].count,
            totalComments: totalCommentsRows[0].count,
            newCommentsThisMonth: newCommentsRows[0].count
        };
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
    },

    deleteUser: async (userId) => {
        // Sécurité : on refuse de supprimer un admin via cette méthode
        const [rows] = await db.query('SELECT is_admin FROM users WHERE id = ?', [userId]);
        if (!rows[0] || rows[0].is_admin) {
            throw new Error("Impossible de supprimer un compte administrateur.");
        }
        // Suppression dans l'ordre pour respecter les contraintes FK
        await db.query('DELETE FROM user_movies WHERE user_id = ?', [userId]);
        await db.query('DELETE FROM comments WHERE user_id = ?', [userId]);
        await db.query('DELETE FROM friendships WHERE user_id_1 = ? OR user_id_2 = ?', [userId, userId]).catch(() => {});
        await db.query('DELETE FROM users WHERE id = ? AND is_admin = FALSE', [userId]);
    }
};

module.exports = Admin;
