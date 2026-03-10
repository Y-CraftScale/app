const tmdbService = require('../services/tmdbService');
const UserMovie = require('../models/UserMovie');
const Comment = require('../models/Comment');

exports.getHomePage = async (req, res) => {
    try {
        const [trendingMovies, topRatedMovies, popularMovies] = await Promise.all([
            tmdbService.getTrendingMovies(),
            tmdbService.getTopRatedMovies(),
            tmdbService.getPopularMovies()
        ]);

        res.render('index', {
            trendingMovies: trendingMovies.slice(0, 10),
            topRatedMovies: topRatedMovies.slice(0, 10),
            popularMovies: popularMovies.slice(0, 10)
        });
    } catch (error) {
        console.error("Erreur getHomePage:", error);
        res.render('index', { trendingMovies: [], topRatedMovies: [], popularMovies: [] });
    }
};

exports.search = async (req, res) => {
    try {
        const query = req.query.q;
        let movies = [];

        if (query && query.trim() !== '') {
            movies = await tmdbService.searchMovies(query);
        }

        res.render('search', { movies, query });
    } catch (error) {
        console.error("Erreur lors de la recherche:", error);
        res.render('search', { movies: [], query: req.query.q || '' });
    }
};

exports.getMovieById = async (req, res) => {
    try {
        const movieId = req.params.id;

        // On récupère les infos TMDB (obligatoires)
        const [movie, similarMovies] = await Promise.all([
            tmdbService.getMovieDetails(movieId),
            tmdbService.getSimilarMovies(movieId)
        ]);

        if (!movie) {
            return res.status(404).send('Film non trouvé');
        }

        // On récupère les infos BDD (optionnelles - ne doit pas faire crash la page)
        let comments = [];
        let userStatus = null;

        try {
            const [commentsData, statusData] = await Promise.all([
                Comment.getCommentsByMovie(movieId),
                req.session && req.session.userId ? UserMovie.getMovieStatus(req.session.userId, movieId) : Promise.resolve(null)
            ]);
            comments = commentsData || [];
            userStatus = statusData || null;
        } catch (dbError) {
            console.error("⚠️ La BDD est injoignable (échec récupération avis/status):", dbError.message);
            // La page pourra quand même s'afficher sans les avis
        }

        res.render('movie-details', {
            movie,
            similarMovies: similarMovies.slice(0, 6),
            comments,
            userStatus
        });
    } catch (error) {
        console.error("Erreur critique getMovieById:", error);
        res.status(500).send('Erreur serveur (Problème de connexion TMDB ou réseau)');
    }
};

exports.addComment = async (req, res) => {
    try {
        const { movieId, title, poster_path, release_date, content, rating } = req.body;
        const userId = req.session.userId;

        if (!content || content.trim() === '') {
            req.session.error_msg = "Le commentaire ne peut pas être vide.";
            return res.redirect(`/movie/${movieId}`);
        }

        const numRating = parseInt(rating, 10) || 0;
        await Comment.addComment(userId, movieId, { id: movieId, title, poster_path, release_date }, content, numRating);

        req.session.success_msg = "Votre commentaire a été publié !";
        res.redirect(`/movie/${movieId}`);
    } catch (err) {
        console.error("Erreur ajout commentaire:", err);
        req.session.error_msg = "Erreur lors de la publication du commentaire.";
        res.redirect('back');
    }
};

exports.toggleWatchlist = async (req, res) => {
    try {
        const { movieId, title, poster_path, release_date } = req.body;
        const userId = req.session.userId;

        await UserMovie.addToWatchlist(userId, {
            id: movieId,
            title,
            poster_path,
            release_date
        });

        req.session.success_msg = "Film ajouté à votre Watchlist.";
        res.redirect(`/movie/${movieId}`);
    } catch (err) {
        console.error("Erreur addToWatchlist:", err);
        req.session.error_msg = "Impossible d'ajouter à la Watchlist.";
        res.redirect('back');
    }
};

exports.markAsWatched = async (req, res) => {
    try {
        const { movieId } = req.body;
        const userId = req.session.userId;

        await UserMovie.markAsWatched(userId, movieId);
        req.session.success_msg = "Film marqué comme vu !";
        res.redirect(`/movie/${movieId}`);
    } catch (err) {
        console.error("Erreur markAsWatched:", err);
        req.session.error_msg = "Erreur lors du changement de statut.";
        res.redirect('back');
    }
};

exports.removeFromList = async (req, res) => {
    try {
        const { movieId } = req.body;
        const userId = req.session.userId;

        await UserMovie.removeFromList(userId, movieId);
        req.session.success_msg = "Film retiré de vos listes.";
        res.redirect(`/dashboard`);
    } catch (err) {
        console.error("Erreur removeFromList:", err);
        req.session.error_msg = "Impossible de retirer le film.";
        res.redirect('back');
    }
};
