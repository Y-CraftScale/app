const adminMiddleware = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    return res.status(403).render('error', { message: "Accès refusé" });
};

module.exports = adminMiddleware;
