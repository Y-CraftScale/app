const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.loginPage = (req, res) => {
    res.render('login');
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByEmail(email);

        if (!user) {
            req.session.error_msg = 'Email ou mot de passe incorrect.';
            return res.redirect('/login');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.session.error_msg = 'Email ou mot de passe incorrect.';
            return res.redirect('/login');
        }

        if (user.is_banned) {
            req.session.error_msg = 'Ce compte a été banni.';
            return res.redirect('/login');
        }

        req.session.userId = user.id;
        req.session.success_msg = 'Connexion réussie !';
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        req.session.error_msg = 'Une erreur est survenue lors de la connexion.';
        res.redirect('/login');
    }
};

exports.registerPage = (req, res) => {
    res.render('register');
};

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            req.session.error_msg = 'Cet email est déjà utilisé.';
            return res.redirect('/register');
        }

        await User.create({ username, email, password });
        req.session.success_msg = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        req.session.error_msg = "Une erreur est survenue lors de l'inscription.";
        res.redirect('/register');
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
};
