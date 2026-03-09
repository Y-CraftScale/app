require('dotenv').config();
const axios = require('axios');

// On crée une "instance" d'Axios.
// C'est comme pré-enregistrer le numéro de téléphone et les réglages.
const tmdbClient = axios.create({
    baseURL: process.env.TMDB_BASE_URL,
    params: {
        api_key: process.env.TMDB_API_KEY, // La clé est envoyée automatiquement à chaque appel
        language: 'fr-FR' // On veut les films en Français ! 🇫🇷
    },
    headers: {
        'Accept': 'application/json'
    }
});

// Petite fonction pour tester si ça marche
const getPopularMovies = async () => {
    try {
        // On appelle l'endpoint "/movie/popular"
        const response = await tmdbClient.get('/movie/popular');
        return response.data.results; // On renvoie juste la liste des films
    } catch (error) {
        console.error("❌ Erreur TMDB :", error.message);
        return [];
    }
};

// On exporte le client et les fonctions pour les utiliser ailleurs
module.exports = {
    tmdbClient,
    getPopularMovies
};