const Admin = require('../models/Admin');
const UserMovie = require('../models/UserMovie');

exports.getAdminDashboard = async (req, res) => {
    try {
        const userId = req.session.userId;
        const [users, comments, stats, watchlist, watchedMovies] = await Promise.all([
            Admin.getAllUsers(),
            Admin.getAllRecentComments(),
            Admin.getStats(),
            UserMovie.getUserWatchlist(userId),
            UserMovie.getUserWatchedMovies(userId)
        ]);

        res.render('admin-dashboard', { 
            users, 
            comments, 
            stats,
            watchlist,
            watchedMovies,
            user: req.session.user // Ensure the user object is also available in session if not global
        });
    } catch (err) {
        console.error("Erreur param dashboard admin:", err);
        req.session.error_msg = "Erreur de chargement du dashboard administrateur.";
        res.redirect('/dashboard');
    }
};

exports.toggleBan = async (req, res) => {
    try {
        const targetUserId = req.params.id;
        const { currentStatus } = req.body;
        // if currentStatus is "1", the new status is 0 (unban). Otherwise 1 (ban)
        const newStatus = currentStatus === '1' ? 0 : 1;

        await Admin.toggleBanStatus(targetUserId, newStatus);

        req.session.success_msg = newStatus === 1 ? "Utilisateur banni !" : "Utilisateur débanni.";
        res.redirect('/admin');
    } catch (err) {
        console.error("Erreur toggleBan:", err);
        req.session.error_msg = "Erreur lors du changement de statut.";
        res.redirect('/admin');
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        await Admin.deleteComment(commentId);

        req.session.success_msg = "Commentaire supprimé définitivement.";
        res.redirect('/admin');
    } catch (err) {
        console.error("Erreur deleteComment:", err);
        req.session.error_msg = "Erreur lors de la suppression du commentaire.";
        res.redirect('/admin');
    }
};

exports.approveComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        await Admin.approveComment(commentId);

        req.session.success_msg = "Commentaire approuvé avec succès.";
        res.redirect('/admin');
    } catch (err) {
        console.error("Erreur approveComment:", err);
        req.session.error_msg = "Erreur lors de l'approbation du commentaire.";
        res.redirect('/admin');
    }
};
