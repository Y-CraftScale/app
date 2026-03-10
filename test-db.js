const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
    console.log("Config:", {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        port: 3306
    });

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        console.log("✅ Connexion réussie !");
        const [rows] = await connection.execute('SELECT 1 + 1 AS solution');
        console.log("Test Query Solution:", rows[0].solution);
        await connection.end();
    } catch (err) {
        console.error("❌ Erreur de connexion:", err);
    }
}

testConnection();
