require('dotenv').config();
const db = require('./config/db');

async function migrate() {
    try {
        console.log("Adding rating column to comments table...");
        await db.query('ALTER TABLE comments ADD COLUMN rating TINYINT DEFAULT 0;');
        console.log("Column added successfully!");
    } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log("Column already exists.");
        } else {
            console.error("Migration error:", err);
        }
    }
    process.exit();
}
migrate();
