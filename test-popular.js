require('dotenv').config();
const tmdbService = require('./services/tmdbService');

async function testPopular() {
    console.log("Testing popular movies fetch...");
    const movies = await tmdbService.getPopularMovies();
    console.log("Popular movies count:", movies.length);
    if (movies.length > 0) {
        console.log("First movie:", movies[0].title);
    }
}

testPopular();
