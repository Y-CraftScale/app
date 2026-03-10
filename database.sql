-- ==========================================

-- 1. TABLE USERS

-- Centrale pour l'authentification et les rôles

-- ==========================================

CREATE TABLE IF NOT EXISTS users (

id INT AUTO_INCREMENT PRIMARY KEY,

username VARCHAR(50) NOT NULL UNIQUE,

email VARCHAR(100) NOT NULL UNIQUE,

password VARCHAR(255) NOT NULL,

bio TEXT,

-- Gestion des Rôles et Statuts

is_admin BOOLEAN DEFAULT FALSE, -- Pour l'accès au dashboard

is_banned BOOLEAN DEFAULT FALSE, -- Pour la modération (ban/déban)

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

) ENGINE=INNODB;



-- ==========================================

-- 2. TABLE MOVIES (CACHE LOCAL)

-- Stocke les infos statiques des films venant de TMDB.

-- Permet de respecter la 2NF/3NF : le titre dépend du film, pas de l'user.

-- ==========================================

CREATE TABLE IF NOT EXISTS movies (

movie_id INT PRIMARY KEY, -- ID venant de l'API TMDB (Pas d'Auto-Inc)

title VARCHAR(255) NOT NULL,

poster_path VARCHAR(255),

release_date DATE,

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

) ENGINE=INNODB;



-- ==========================================

-- 3. TABLE USER_MOVIES (LIAISON & LISTES)

-- Table d'association pure. Gère la Watchlist, les Vus et la Note Perso.

-- ==========================================

CREATE TABLE IF NOT EXISTS user_movies (

user_id INT NOT NULL,

movie_id INT NOT NULL, -- FK vers notre cache local 'movies'



-- Statut : FALSE = Watchlist (À voir), TRUE = Watched (Vu)

is_watched BOOLEAN DEFAULT FALSE,



-- Note personnelle (optionnelle, distincte d'un commentaire public)

personal_rating TINYINT CHECK (personal_rating BETWEEN 0 AND 5),



added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

watched_at TIMESTAMP NULL, -- Rempli lors du passage à "Vu"



PRIMARY KEY (user_id, movie_id), -- Un seul statut par film par user



-- Intégrité : Si on supprime un user, sa liste disparait

FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

-- Si on nettoie le cache de films, les liens disparaissent

FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE

) ENGINE=INNODB;



-- ==========================================

-- 4. TABLE COMMENTS (SOCIAL & MODÉRATION)

-- Avis publics soumis à validation admin

-- ==========================================

CREATE TABLE IF NOT EXISTS comments (

id INT AUTO_INCREMENT PRIMARY KEY,

user_id INT NOT NULL,

movie_id INT NOT NULL, -- FK vers cache local



content TEXT NOT NULL,



-- Modération : TRUE par défaut, l'admin peut passer à FALSE (Rejet)

is_validated BOOLEAN DEFAULT TRUE,



created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,



FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE

) ENGINE=INNODB;



-- ==========================================

-- 5. TABLE FRIENDSHIPS (SYSTÈME D'AMIS)

-- Relation N:N récursive sur la table users

-- ==========================================

CREATE TABLE IF NOT EXISTS friendships (

user_id_1 INT NOT NULL,

user_id_2 INT NOT NULL,



-- Gestion de la demande d'ami

status ENUM('pending', 'accepted') DEFAULT 'pending',

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,



PRIMARY KEY (user_id_1, user_id_2),



FOREIGN KEY (user_id_1) REFERENCES users(id) ON DELETE CASCADE,

FOREIGN KEY (user_id_2) REFERENCES users(id) ON DELETE CASCADE

) ENGINE=INNODB;



