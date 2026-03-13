const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const { requireAuth } = require('../middlewares/authMiddleware');

router.get('/', movieController.getHomePage);
router.get('/search', movieController.search);
router.get('/movie/:id', movieController.getMovieById);

// Protected routes for Member features
router.post('/movie/watchlist/add', requireAuth, movieController.toggleWatchlist);
router.post('/movie/watched/add', requireAuth, movieController.markAsWatched);
router.post('/movie/watched/add-direct', requireAuth, movieController.addDirectlyToWatched);
router.post('/movie/remove', requireAuth, movieController.removeFromList);
router.post('/movie/comment', requireAuth, movieController.addComment);

module.exports = router;
