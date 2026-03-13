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

const Friendship = require('../models/Friendship');

exports.searchUsers = async (req, res) => {
    try {
        const query = req.query.q;
        let users = [];
        
        if (query && query.trim() !== '') {
            const currentUserId = req.session.userId || 0; 
            users = await Friendship.searchUsers(query, currentUserId);
        }

        res.render('user-search', { users, query });
    } catch (err) {
        console.error("Erreur searchUsers:", err);
        res.render('user-search', { users: [], query: req.query.q || '' });
    }
};

exports.getPublicProfile = async (req, res) => {
    try {
        const targetUserId = req.params.id;
        const currentUserId = req.session ? req.session.userId : null;

        if (currentUserId && currentUserId.toString() === targetUserId.toString()) {
            return res.redirect('/dashboard');
        }

        const targetUser = await User.findById(targetUserId);
        if (!targetUser) {
            return res.status(404).send("Utilisateur introuvable");
        }

        const [watchlist, watchedMovies] = await Promise.all([
            UserMovie.getUserWatchlist(targetUserId),
            UserMovie.getUserWatchedMovies(targetUserId)
        ]);

        let friendshipStatus = null;
        if (currentUserId) {
            friendshipStatus = await Friendship.getFriendsStatus(currentUserId, targetUserId);
        }

        res.render('public-profile', { 
            targetUser, 
            watchlist, 
            watchedMovies,
            friendshipStatus,
            currentUserId
        });

    } catch (err) {
        console.error("Erreur getPublicProfile:", err);
        res.status(500).send("Erreur serveur");
    }
};

exports.sendFriendRequest = async (req, res) => {
    try {
        const { receiverId } = req.body;
        const senderId = req.session.userId;

        await Friendship.sendRequest(senderId, receiverId);
        req.session.success_msg = "Demande d'ami envoyée !";
        res.redirect(`/user/${receiverId}`);
    } catch (err) {
        console.error("Erreur sendFriendRequest:", err);
        req.session.error_msg = "Erreur lors de l'envoi de la demande.";
        res.redirect('back');
    }
};

exports.acceptFriendRequest = async (req, res) => {
    try {
        const { senderId } = req.body;
        const receiverId = req.session.userId;

        await Friendship.acceptRequest(senderId, receiverId);
        req.session.success_msg = "Demande d'ami acceptée ! Vous êtes maintenant connectés.";
        res.redirect('/dashboard');
    } catch (err) {
        console.error("Erreur acceptFriendRequest:", err);
        req.session.error_msg = "Erreur lors de l'acceptation.";
        res.redirect('back');
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.session.userId;

        await User.deleteUser(userId);

        // Détruire la session et rediriger vers l'accueil
        req.session.destroy(() => {
            res.redirect('/');
        });
    } catch (err) {
        console.error("Erreur deleteAccount:", err);
        req.session.error_msg = "Erreur lors de la suppression du compte.";
        res.redirect('/dashboard');
    }
};
