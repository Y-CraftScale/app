exports.loginPage = (req, res) => {
    res.render('login');
};

exports.login = (req, res) => {
    // Logique de connexion (vérifier mdp, etc.)
    req.session.user = { id: 1, role: 'user', username: 'TestUser' }; // Simulation
    res.redirect('/dashboard');
};

exports.registerPage = (req, res) => {
    res.render('register');
};

exports.register = (req, res) => {
    // Logique d'inscription
    res.redirect('/login');
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
};
