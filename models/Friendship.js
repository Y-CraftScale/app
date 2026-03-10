const db = require('../config/db');

const Friendship = {
    searchUsers: async (query, currentUserId) => {
        const searchTerm = `%${query}%`;
        const [rows] = await db.query(`
            SELECT id, username, bio 
            FROM users 
            WHERE username LIKE ? AND id != ?
        `, [searchTerm, currentUserId]);
        return rows;
    },

    getFriendsStatus: async (currentUserId, targetUserId) => {
        const [rows] = await db.query(`
            SELECT status, user_id_1, user_id_2
            FROM friendships
            WHERE (user_id_1 = ? AND user_id_2 = ?)
               OR (user_id_1 = ? AND user_id_2 = ?)
        `, [currentUserId, targetUserId, targetUserId, currentUserId]);
        return rows[0] || null;
    },

    sendRequest: async (senderId, receiverId) => {
        const [result] = await db.query(`
            INSERT INTO friendships (user_id_1, user_id_2, status) 
            VALUES (?, ?, 'pending')
        `, [senderId, receiverId]);
        return result.insertId;
    },

    acceptRequest: async (user1, user2) => {
        await db.query(`
            UPDATE friendships 
            SET status = 'accepted' 
            WHERE (user_id_1 = ? AND user_id_2 = ?) OR (user_id_1 = ? AND user_id_2 = ?)
        `, [user1, user2, user2, user1]);
    },
    
    getPendingRequests: async (userId) => {
         // Requests received by the user
         const [rows] = await db.query(`
            SELECT f.*, u.username as sender_name
            FROM friendships f
            JOIN users u ON f.user_id_1 = u.id
            WHERE f.user_id_2 = ? AND f.status = 'pending'
        `, [userId]);
        return rows;
    },

    getFriendsList: async (userId) => {
        const [rows] = await db.query(`
            SELECT u.id, u.username, u.bio
            FROM friendships f
            JOIN users u ON (u.id = f.user_id_1 OR u.id = f.user_id_2)
            WHERE (f.user_id_1 = ? OR f.user_id_2 = ?)
              AND f.status = 'accepted'
              AND u.id != ?
        `, [userId, userId, userId]);
        return rows;
    }
};

module.exports = Friendship;
