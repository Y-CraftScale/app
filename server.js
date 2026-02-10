require('dotenv').config(); // Charge les variables d'environnement
const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./config/db'); // Importe la connexion BDD pour vérifier qu'elle marche

const app = express();

// --- 1. CONFIGURATION DU MOTEUR DE VUE ---
// On dit à Express d'utiliser EJS pour afficher les pages
app.set('view engine', 'ejs');
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

// --- 3. ROUTES (Les panneaux de direction) ---
// Route de test pour voir si ça marche
app.get('/', (req, res) => {
    res.send('<h1>🚀 Le serveur App fonctionne !</h1><p>Architecture MVC en place.</p>');
});

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
        console.error('👉 Vérifie que XAMPP/MAMP est lancé et que la BDD "movie_planner_db" existe.');
    }
});