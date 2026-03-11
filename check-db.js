require('dotenv').config();
const db = require('./config/db');

async function check() {
    try {
        const [rows] = await db.query('DESCRIBE comments;');
        console.table(rows);
    } catch (err) {
        console.error("Database check error:", err);
    }
    process.exit();
}
check();
