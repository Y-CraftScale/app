const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
    findByEmail: async (email) => {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },

    findById: async (id) => {
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    },

    create: async (userData) => {
        const { username, email, password } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await db.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );
        return result.insertId;
    },

    updateProfile: async (userId, newData) => {
        const { username, email, bio } = newData;
        await db.query(
            'UPDATE users SET username = ?, email = ?, bio = ? WHERE id = ?',
            [username, email, bio, userId]
        );
    },

    deleteUser: async (userId) => {
        // Suppression dans l'ordre pour respecter les contraintes FK
        await db.query('DELETE FROM user_movies WHERE user_id = ?', [userId]);
        await db.query('DELETE FROM comments WHERE user_id = ?', [userId]);
        // Supprimer les liens d'amitié si la table existe
        await db.query('DELETE FROM friendships WHERE user_id_1 = ? OR user_id_2 = ?', [userId, userId]).catch(() => {});
        await db.query('DELETE FROM users WHERE id = ?', [userId]);
    }
};

module.exports = User;
