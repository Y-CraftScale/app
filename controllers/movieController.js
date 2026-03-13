const tmdbService = require('../services/tmdbService');
const UserMovie = require('../models/UserMovie');
const Comment = require('../models/Comment');

exports.getHomePage = async (req, res) => {
    try {
        const [trendingMovies, topRatedMovies] = await Promise.all([
            tmdbService.getTrendingMovies(),
            tmdbService.getTopRatedMovies()
        ]);

        res.render('index', { 
            trendingMovies: trendingMovies.slice(0, 10),
            topRatedMovies: topRatedMovies.slice(0, 10)
        });
    } catch (error) {
        console.error("Erreur getHomePage:", error);
        res.render('index', { trendingMovies: [], topRatedMovies: [] });
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
        
        const [movie, similarMovies, comments, providers] = await Promise.all([
            tmdbService.getMovieDetails(movieId),
            tmdbService.getSimilarMovies(movieId),
            Comment.getCommentsByMovie(movieId),
            tmdbService.getMovieProviders(movieId)
        ]);

        if (!movie) {
            return res.status(404).send('Film non trouvé');
        }

        let userStatus = null;
        if (req.session && req.session.userId) {
            userStatus = await UserMovie.getMovieStatus(req.session.userId, movieId);
        }

        res.render('movie-details', { 
            movie, 
            similarMovies: similarMovies.slice(0, 6),
            comments,
            providers,
            userStatus
        });
    } catch (error) {
        console.error("Erreur getMovieById:", error);
        res.status(500).send('Erreur serveur');
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

        if (!rating || rating < 1 || rating > 5) {
            req.session.error_msg = "Veuillez sélectionner une note valide.";
            return res.redirect(`/movie/${movieId}`);
        }

        await Comment.addComment(userId, movieId, { id: movieId, title, poster_path, release_date }, content, rating);
        
        req.session.success_msg = "Votre commentaire a été soumis et est en attente de modération.";
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

exports.addDirectlyToWatched = async (req, res) => {
    try {
        const { movieId, title, poster_path, release_date } = req.body;
        const userId = req.session.userId;

        await UserMovie.addDirectlyToWatched(userId, {
            id: movieId,
            title,
            poster_path,
            release_date
        });

        req.session.success_msg = "Film ajouté à votre historique !";
        res.redirect(`/movie/${movieId}`);
    } catch (err) {
        console.error("Erreur addDirectlyToWatched:", err);
        req.session.error_msg = "Impossible d'ajouter le film à l'historique.";
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
