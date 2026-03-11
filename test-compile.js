const ejs = require('ejs');
const fs = require('fs');
try {
    const template = fs.readFileSync('views/movie-details.ejs', 'utf-8');
    ejs.compile(template);
    console.log("Compilation successful!");
} catch (e) {
    console.error("Compilation error:", e);
}
