const db = require('../config/db');
const UserMovie = require('./UserMovie'); // To cache movies if needed

const Comment = {
    addComment: async (userId, movieId, movieData, content, rating) => {
        // Ensure movie exists in our local DB before inserting comment
        await UserMovie._ensureMovieInCache(movieData);

        // 1. Inserer le commentaire sans le rating (car rating n'est pas dans la table comments)
        const [result] = await db.query(
            'INSERT INTO comments (user_id, movie_id, content, is_validated) VALUES (?, ?, ?, FALSE)',
            [userId, movieId, content]
        );

        // 2. Mettre à jour la note personnelle dans user_movies
        // On utilise INSERT ... ON DUPLICATE KEY UPDATE pour créer l'entrée si elle n'existe pas
        await db.query(
            `INSERT INTO user_movies (user_id, movie_id, personal_rating) 
             VALUES (?, ?, ?) 
             ON DUPLICATE KEY UPDATE personal_rating = VALUES(personal_rating)`,
            [userId, movieId, rating]
        );

        return result.insertId;
    },

    getCommentsByMovie: async (movieId) => {
        const [rows] = await db.query(`
            SELECT c.*, u.username, um.personal_rating as rating
            FROM comments c
            JOIN users u ON c.user_id = u.id
            LEFT JOIN user_movies um ON u.id = um.user_id AND c.movie_id = um.movie_id
            WHERE c.movie_id = ? AND c.is_validated = TRUE
            ORDER BY c.created_at DESC
        `, [movieId]);
        return rows;
    }
};

module.exports = Comment;
