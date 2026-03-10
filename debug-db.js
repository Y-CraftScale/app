const mysql = require('mysql2/promise');
require('dotenv').config();

async function debugConnection() {
    console.log("Tentative de connexion avec :");
    console.log("- Host:", process.env.DB_HOST);
    console.log("- User:", process.env.DB_USER);
    console.log("- DB:", process.env.DB_NAME);
    console.log("- Port:", 3306);

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS.replace(/['"]/g, ''), // Enlever les guillemets simples ou doubles
            database: process.env.DB_NAME,
            connectTimeout: 5000 // 5 seconds timeout
        });

        console.log("✅ Connexion à la BDD réussie (sans guillemets) !");
        await connection.end();
    } catch (err) {
        console.error("❌ Erreur détaillée :", {
            code: err.code,
            errno: err.errno,
            sqlState: err.sqlState,
            message: err.message
        });
    }
}

debugConnection();
