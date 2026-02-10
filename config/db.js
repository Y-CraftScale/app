require('dotenv').config(); // On ouvre le coffre-fort (.env)
const mysql = require('mysql2');

// On crée la configuration de la connexion
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// On transforme la connexion pour utiliser les "Promesses" (plus moderne et facile à lire)
const db = pool.promise();

console.log("✅ Tentative de connexion à la base de données configurée...");

module.exports = db;