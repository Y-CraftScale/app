require('dotenv').config(); // Charge les variables d'environnement
const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./config/db'); // Importe la connexion BDD pour vérifier qu'elle marche
const nunjucks = require('nunjucks');


const app = express();

// --- 1. CONFIGURATION DU MOTEUR DE VUE ---
// On dit à Express d'utiliser EJS pour afficher les pages
nunjucks.configure(path.join(__dirname, 'views'), {
    autoescape: true,
    express: app,
    watch: true
});
app.set('view engine', 'njk');
app.set('views', path.join(__dirname, 'views'));

// --- 2. MIDDLEWARES (Les outils globaux) ---
// Pour lire les données des formulaires (POST)
app.use(express.urlencoded({ extended: true }));
// Pour lire le JSON
app.use(express.json());
// Pour servir les fichiers CSS, images et JS du dossier public
app.use(express.static(path.join(__dirname, 'public')));

// Configuration de la session (pour garder l'utilisateur connecté)
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Mettre true si on est en HTTPS
}));

// Ajout du middleware global checkUser pour vérifier la session à chaque requête
const { checkUser } = require('./middlewares/authMiddleware');
app.use(checkUser);

// --- 3. ROUTES (Les panneaux de direction) ---
const authRoutes = require('./routes/authRoutes');
app.use('/', authRoutes);

const movieRoutes = require('./routes/movieRoutes');
app.use('/', movieRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/', userRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes);

// --- 4. DÉMARRAGE DU SERVEUR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`\n🚀 Serveur démarré sur http://localhost:${PORT}`);

    // Petit test technique pour vérifier la BDD au démarrage
    try {
        await db.query('SELECT 1');
        console.log('✅ Connexion à la Base de Données : RÉUSSIE');
    } catch (err) {
        console.error('❌ Connexion à la Base de Données : ÉCHOUÉE');
        console.error('👉 Détails de l\'erreur :', err.message);
    }
});