exports.searchMovies = (req, res) => {
    // Appel API TMDB ici...
    const movies = [
        { id: 1, title: 'Exemple Film', overview: 'Un film par défaut', vote_average: 7.5, release_date: '2023-01-01' }
    ];
    // Rendu view
    res.render('index', { movies });
};

exports.movieDetails = (req, res) => {
    const movie = {
        id: req.params.id,
        title: 'Détail Film',
        overview: 'Synopsis...',
        vote_average: 8.0,
        release_date: '2023-05-15',
        backdrop_path: '/placeholder.jpg'
    };
    res.render('movie-details', { movie, isFavorite: false });
};
