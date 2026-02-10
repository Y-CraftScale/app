exports.usersList = (req, res) => {
    // Lister tous les users depuis la BDD
    const users = [
        { id: 1, username: 'Admin', email: 'admin@cine.com', role: 'admin' },
        { id: 2, username: 'User1', email: 'user1@cine.com', role: 'user' }
    ];
    res.render('admin/users', { users });
};

exports.banUser = (req, res) => {
    const userId = req.params.id;
    console.log(`Banning user ${userId}`);
    // Update DB status = banned
    res.redirect('/admin/users');
};
