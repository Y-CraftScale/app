const User = require('../models/User');
const UserMovie = require('../models/UserMovie');

exports.dashboard = async (req, res) => {
    try {
        const userId = req.session.userId;
        const [watchlist, watchedMovies] = await Promise.all([
            UserMovie.getUserWatchlist(userId),
            UserMovie.getUserWatchedMovies(userId)
        ]);

        res.render('dashboard', { watchlist, watchedMovies });
    } catch (err) {
        console.error("Erreur Dashboard:", err);
        res.status(500).send("Erreur lors du chargement du tableau de bord.");
    }
};

exports.getProfileEdit = async (req, res) => {
    res.render('profile-edit');
};

exports.updateProfile = async (req, res) => {
    try {
        const { username, email, bio } = req.body;
        const userId = req.session.userId;

        // Optionally, check if new email is already taken by another user
        const existingUser = await User.findByEmail(email);
        if (existingUser && existingUser.id !== userId) {
            req.session.error_msg = "Cet email est déjà pris par un autre utilisateur.";
            return res.redirect('/profile/edit');
        }

        await User.updateProfile(userId, { username, email, bio });
        
        // Update session data subtly so EJS template gets the fresh name etc
        req.session.success_msg = "Profil mis à jour avec succès !";
        res.redirect('/dashboard');
    } catch (err) {
        console.error("Erreur UpdateProfile:", err);
        req.session.error_msg = "Erreur lors de la mise à jour du profil.";
        res.redirect('/profile/edit');
    }
};
