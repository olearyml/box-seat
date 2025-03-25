import express from 'express';
import {
  searchContent,
  getFavorites,
  addFavorite,
  updateFavorite,
  deleteFavorite,
  getSharedFavorite,
  acceptSharedFavorite,
  getRecommendations,
  getUpcomingReleases
} from '../controllers/contentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/search', searchContent);

router.use(authenticate);
router.get('/favorites', getFavorites);
router.post('/favorites', addFavorite);
router.put('/favorites/:id', updateFavorite);
router.delete('/favorites/:id', deleteFavorite);
router.get('/shared/:id', getSharedFavorite);
router.post('/shared/:id', acceptSharedFavorite);
router.get('/recommendations', getRecommendations);
router.get('/reminders', getUpcomingReleases);
router.get('/reminders', getUpcomingReleases);


export default router;
