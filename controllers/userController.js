exports.dashboard = (req, res) => {
    // Récupérer favoris depuis DB
    const favorites = [];
    res.render('dashboard', { user: req.session.user, favorites });
};

exports.profile = (req, res) => {
    res.render('profile');
};

exports.addFavorite = (req, res) => {
    console.log("Adding favorite:", req.body);
    // Ajouter en BDD
    res.redirect('/movies/' + req.body.movieId);
};

exports.removeFavorite = (req, res) => {
    console.log("Removing favorite:", req.body);
    // Supprimer de BDD
    res.redirect('/dashboard');
};
