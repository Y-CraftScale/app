-- 1. Table USERS
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table WATCHLIST (Films à voir)
CREATE TABLE IF NOT EXISTS watchlist (
    user_id INT NOT NULL,
    movie_id INT NOT NULL,     -- ID TMDB (Entier)
    movie_title VARCHAR(255),  -- Sauvegarde du titre (Cache)
    movie_poster VARCHAR(255), -- Sauvegarde de l'image (Cache)
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, movie_id), -- Empêche les doublons !
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Table WATCHED (Films vus / Historique)
CREATE TABLE IF NOT EXISTS watched_movies (
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    movie_title VARCHAR(255),
    movie_poster VARCHAR(255),
    watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_rating TINYINT,       -- Note perso de l'utilisateur (0-10) optionnelle ici
    PRIMARY KEY (user_id, movie_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Table COMMENTS (Avis publics)
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    content TEXT NOT NULL,
    rating TINYINT CHECK (rating >= 0 AND rating <= 5), -- Note sur 5
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_validated BOOLEAN DEFAULT TRUE, -- Pour la modération admin
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);