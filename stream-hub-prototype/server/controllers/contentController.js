import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

const getGenresByIds = async (ids, mediaType) => {
  try {
    const genreRes = await axios.get(
      `https://api.themoviedb.org/3/genre/${mediaType}/list?api_key=${TMDB_API_KEY}`
    );
    const genreMap = genreRes.data.genres.reduce((acc, genre) => {
      acc[genre.id] = genre.name;
      return acc;
    }, {});
    return ids.map((id) => genreMap[id]).filter(Boolean).join(', ');
  } catch {
    return '';
  }
};

export const searchContent = async (req, res) => {
  const { query } = req.query;
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
    );
    res.json(response.data.results);
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
};

export const getFavorites = async (req, res) => {
  const userId = req.user.userId;
  const favorites = await prisma.favorite.findMany({ where: { userId } });
  res.json(favorites);
};

export const addFavorite = async (req, res) => {
  const userId = req.user.userId;
  const { contentId, title, tags } = req.body;

  try {
    // Fetch content details to get genre IDs and media_type
    const detailRes = await axios
      .get(`https://api.themoviedb.org/3/movie/${contentId}?api_key=${TMDB_API_KEY}`)
      .catch(() =>
        axios.get(`https://api.themoviedb.org/3/tv/${contentId}?api_key=${TMDB_API_KEY}`)
      );

    const data = detailRes.data;
    const genreNames = await getGenresByIds(
      data.genres.map((g) => g.id),
      data.media_type || (data.first_air_date ? 'tv' : 'movie')
    );

    const favorite = await prisma.favorite.create({
      data: {
        userId,
        contentId,
        title,
        tags,
        genres: genreNames,
      },
    });
    res.json(favorite);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
};

export const updateFavorite = async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;
  const { tags } = req.body;
  const updated = await prisma.favorite.updateMany({
    where: { id: parseInt(id), userId },
    data: { tags },
  });
  res.json(updated);
};

export const deleteFavorite = async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;
  await prisma.favorite.deleteMany({
    where: { id: parseInt(id), userId },
  });
  res.json({ success: true });
};

export const getSharedFavorite = async (req, res) => {
  const { id } = req.params;
  const favorite = await prisma.favorite.findUnique({
    where: { id: parseInt(id) },
  });
  if (!favorite) return res.status(404).json({ error: 'Favorite not found' });
  res.json({ title: favorite.title, tags: favorite.tags });
};

export const acceptSharedFavorite = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const original = await prisma.favorite.findUnique({
    where: { id: parseInt(id) },
  });
  if (!original) return res.status(404).json({ error: 'Not found' });

  const favorite = await prisma.favorite.create({
    data: {
      userId,
      contentId: original.contentId,
      title: original.title,
      tags: original.tags,
      genres: original.genres,
    },
  });
  res.json(favorite);
};

export const getRecommendations = async (req, res) => {
  const userId = req.user.userId;
  try {
    const favorites = await prisma.favorite.findMany({ where: { userId } });

    const genreCount = {};
    favorites.forEach((fav) => {
      const genres = fav.genres ? fav.genres.split(', ') : [];
      genres.forEach((genre) => {
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      });
    });

    const topGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([genre]) => genre.toLowerCase());

    const tmdbGenresRes = await axios.get(
      `https://api.themoviedb.org/3/genre/tv/list?api_key=${TMDB_API_KEY}`
    );
    const tmdbGenres = tmdbGenresRes.data.genres;

    const genreIds = tmdbGenres
      .filter((g) => topGenres.includes(g.name.toLowerCase()))
      .map((g) => g.id);

    const recRes = await axios.get(
      `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&with_genres=${genreIds.join(',')}&sort_by=popularity.desc`
    );

    const results = recRes.data.results.slice(0, 8).map((item) => ({
      id: item.id,
      title: item.name,
      overview: item.overview,
      poster: item.poster_path,
    }));

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Recommendation failed' });
  }
};

export const getUpcomingReleases = async (req, res) => {
  const userId = req.user.userId;
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId, notify: true },
    });

    const today = new Date();
    const upcoming = [];

    for (const fav of favorites) {
      let data = null;
      try {
        const tvRes = await axios.get(
          `https://api.themoviedb.org/3/tv/${fav.contentId}?api_key=${TMDB_API_KEY}`
        );
        data = tvRes.data;
        if (data.next_episode_to_air) {
          const airDate = new Date(data.next_episode_to_air.air_date);
          const diffDays = Math.ceil((airDate - today) / (1000 * 60 * 60 * 24));
          if (diffDays >= 0 && diffDays <= 7) {
            upcoming.push({
              id: fav.id,
              title: fav.title,
              date: data.next_episode_to_air.air_date,
            });
          }
        }
      } catch (e) {
        try {
          const movieRes = await axios.get(
            `https://api.themoviedb.org/3/movie/${fav.contentId}?api_key=${TMDB_API_KEY}`
          );
          data = movieRes.data;
          const releaseDate = new Date(data.release_date);
          const diffDays = Math.ceil((releaseDate - today) / (1000 * 60 * 60 * 24));
          if (diffDays >= 0 && diffDays <= 7) {
            upcoming.push({
              id: fav.id,
              title: fav.title,
              date: data.release_date,
            });
          }
        } catch {
          continue;
        }
      }
    }

    res.json(upcoming);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Reminder check failed' });
  }
};
