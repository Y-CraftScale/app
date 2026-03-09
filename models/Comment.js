const db = require('../config/db');
const UserMovie = require('./UserMovie'); // To cache movies if needed

const Comment = {
    addComment: async (userId, movieId, movieData, content) => {
        // Ensure movie exists in our local DB before inserting comment
        await UserMovie._ensureMovieInCache(movieData);

        const [result] = await db.query(
            'INSERT INTO comments (user_id, movie_id, content, is_validated) VALUES (?, ?, ?, TRUE)',
            [userId, movieId, content]
        );
        return result.insertId;
    },

    getCommentsByMovie: async (movieId) => {
        const [rows] = await db.query(`
            SELECT c.*, u.username 
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.movie_id = ? AND c.is_validated = TRUE
            ORDER BY c.created_at DESC
        `, [movieId]);
        return rows;
    }
};

module.exports = Comment;
