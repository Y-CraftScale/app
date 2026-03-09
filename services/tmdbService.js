require('dotenv').config();
const axios = require('axios');

// On crée une "instance" d'Axios.
const tmdbClient = axios.create({
    baseURL: process.env.TMDB_BASE_URL,
    params: {
        api_key: process.env.TMDB_API_KEY,
        language: 'fr-FR'
    },
    headers: {
        'Accept': 'application/json'
    }
});

const getTrendingMovies = async () => {
    try {
        const response = await tmdbClient.get('/trending/movie/week');
        return response.data.results;
    } catch (error) {
        console.error("❌ Erreur TMDB getTrendingMovies :", error.message);
        return [];
    }
};

const getTopRatedMovies = async () => {
    try {
        const response = await tmdbClient.get('/movie/top_rated');
        return response.data.results;
    } catch (error) {
        console.error("❌ Erreur TMDB getTopRatedMovies :", error.message);
        return [];
    }
};

const searchMovies = async (query) => {
    try {
        const response = await tmdbClient.get('/search/movie', {
            params: { query }
        });
        return response.data.results;
    } catch (error) {
        console.error("❌ Erreur TMDB searchMovies :", error.message);
        return [];
    }
};

const getMovieDetails = async (movieId) => {
    try {
        const response = await tmdbClient.get(`/movie/${movieId}`);
        return response.data;
    } catch (error) {
        console.error("❌ Erreur TMDB getMovieDetails :", error.message);
        return null;
    }
};

const getSimilarMovies = async (movieId) => {
    try {
        const response = await tmdbClient.get(`/movie/${movieId}/similar`);
        return response.data.results;
    } catch (error) {
        console.error("❌ Erreur TMDB getSimilarMovies :", error.message);
        return [];
    }
};

module.exports = {
    tmdbClient,
    getTrendingMovies,
    getTopRatedMovies,
    searchMovies,
    getMovieDetails,
    getSimilarMovies
};