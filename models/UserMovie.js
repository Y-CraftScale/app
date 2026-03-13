const db = require('../config/db');

const UserMovie = {
    // Upsert a movie into the local cache
    _ensureMovieInCache: async (movieData) => {
        const { id, title, poster_path, release_date } = movieData;
        const [existing] = await db.query('SELECT movie_id FROM movies WHERE movie_id = ?', [id]);
        
        if (existing.length === 0) {
            await db.query(
                'INSERT INTO movies (movie_id, title, poster_path, release_date) VALUES (?, ?, ?, ?)',
                [id, title, poster_path, release_date || null]
            );
        }
    },

    addToWatchlist: async (userId, movieData) => {
        await UserMovie._ensureMovieInCache(movieData);
        
        // Use INSERT IGNORE or ON DUPLICATE KEY UPDATE depending on needed behavior
        // Here, if it already exists, we might just want to ensure is_watched is false, 
        // but normally they just add it once.
        await db.query(`
            INSERT INTO user_movies (user_id, movie_id, is_watched) 
            VALUES (?, ?, FALSE)
            ON DUPLICATE KEY UPDATE is_watched = FALSE
        `, [userId, movieData.id]);
    },

    markAsWatched: async (userId, movieId) => {
        // UPSERT : fonctionne même si le film n'est pas encore dans la liste
        await db.query(`
            INSERT INTO user_movies (user_id, movie_id, is_watched, watched_at)
            VALUES (?, ?, TRUE, CURRENT_TIMESTAMP)
            ON DUPLICATE KEY UPDATE is_watched = TRUE, watched_at = CURRENT_TIMESTAMP
        `, [userId, movieId]);
    },

    addDirectlyToWatched: async (userId, movieData) => {
        await UserMovie._ensureMovieInCache(movieData);
        await UserMovie.markAsWatched(userId, movieData.id);
    },

    removeFromList: async (userId, movieId) => {
        await db.query(`
            DELETE FROM user_movies 
            WHERE user_id = ? AND movie_id = ?
        `, [userId, movieId]);
    },

    getUserWatchlist: async (userId) => {
        const [rows] = await db.query(`
            SELECT m.*, um.added_at 
            FROM movies m
            JOIN user_movies um ON m.movie_id = um.movie_id
            WHERE um.user_id = ? AND um.is_watched = FALSE
            ORDER BY um.added_at DESC
        `, [userId]);
        return rows;
    },

    getUserWatchedMovies: async (userId) => {
        const [rows] = await db.query(`
            SELECT m.*, um.watched_at, um.personal_rating
            FROM movies m
            JOIN user_movies um ON m.movie_id = um.movie_id
            WHERE um.user_id = ? AND um.is_watched = TRUE
            ORDER BY um.watched_at DESC
        `, [userId]);
        return rows;
    },

    // Check relationship status for a specific movie & user
    getMovieStatus: async (userId, movieId) => {
        const [rows] = await db.query(`
            SELECT is_watched 
            FROM user_movies 
            WHERE user_id = ? AND movie_id = ?
        `, [userId, movieId]);
        return rows[0] || null;
    }
};

module.exports = UserMovie;
