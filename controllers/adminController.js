const Admin = require('../models/Admin');

exports.getAdminDashboard = async (req, res) => {
    try {
        const [users, comments] = await Promise.all([
            Admin.getAllUsers(),
            Admin.getAllRecentComments()
        ]);

        res.render('admin-dashboard', { users, comments });
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
