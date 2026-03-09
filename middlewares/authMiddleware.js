const User = require('../models/User');

const requireAuth = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }
    return res.redirect('/login');
};

const forwardAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        return res.redirect('/dashboard');
    }
    return next();
};

const checkUser = async (req, res, next) => {
    // Inject session messages into locals for EJS
    if (req.session.error_msg) {
        res.locals.error_msg = req.session.error_msg;
        delete req.session.error_msg;
    }
    if (req.session.success_msg) {
        res.locals.success_msg = req.session.success_msg;
        delete req.session.success_msg;
    }

    if (req.session && req.session.userId) {
        try {
            const user = await User.findById(req.session.userId);
            res.locals.user = user;
            next();
        } catch (err) {
            console.error(err);
            res.locals.user = null;
            next();
        }
    } else {
        res.locals.user = null;
        next();
    }
};

module.exports = { requireAuth, forwardAuthenticated, checkUser };
