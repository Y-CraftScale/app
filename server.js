require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour parser le body (form data)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuration des sessions
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Mettre true si HTTPS
}));

// Middleware pour rendre l'utilisateur disponible dans toutes les vues
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Moteur de vue EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout'); // fichier layout.ejs par défaut

// Routes
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/', authRoutes);
app.use('/movies', movieRoutes);
app.use('/', userRoutes); // pour /dashboard etc.
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
    res.redirect('/movies/search');
});

// Page 404
app.use((req, res) => {
    res.status(404).render('error', { message: 'Page non trouvée' });
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
