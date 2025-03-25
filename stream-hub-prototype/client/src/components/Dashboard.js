import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Logout from './Logout';

const Dashboard = () => {
  const [favorites, setFavorites] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [recommendations, setRecommendations] = useState([]);
  const [reminders, setReminders] = useState([]);

  const fetchFavorites = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await axios.get('http://localhost:5000/api/content/favorites', {
        headers: { Authorization: `Bearer ${token}` }

      });
      const all = res.data;
      const allGenres = Array.from(new Set(all.flatMap(fav => (fav.genres || '').split(', ').filter(Boolean))));
      setFavorites(all);
      setGenres(allGenres);
      setFiltered(all);
    } catch (err) {
      console.error(err);
      alert('Failed to load favorites');
    }
  };

  const fetchRecommendations = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/content/recommendations', {
        headers: { Authorization: \`Bearer \${token}` }
      });
      setRecommendations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReminders = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/content/reminders', {
        headers: { Authorization: \`Bearer \${token}\` }
      });
      setReminders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateFavorite = async (id, data) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(\`http://localhost:5000/api/content/favorites/\${id}\`, data, {
        headers: { Authorization: \`Bearer \${token}\` }
      });
    } catch (err) {
      alert('Update failed');
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(\`http://localhost:5000/api/content/favorites/\${id}\`, {
        headers: { Authorization: \`Bearer \${token}\` }
      });
      fetchFavorites();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleTagChange = (id, tags) => updateFavorite(id, { tags });

  const handleToggleNotify = (id, current) => updateFavorite(id, { notify: !current });

  const handleShare = (id) => {
    const shareUrl = \`\${window.location.origin}/shared/\${id}\`;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard!');
  };

  const handleGenreFilter = (genre) => {
    setSelectedGenre(genre);
    if (genre === 'All') {
      setFiltered(favorites);
    } else {
      setFiltered(favorites.filter(fav => (fav.genres || '').includes(genre)));
    }
  };

  useEffect(() => {
    fetchFavorites();
    fetchRecommendations();
    fetchReminders();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">Your Favorites</h2>
        <Logout />
      </div>
      <div className="mb-4">
        <label className="mr-2 font-medium">Filter by Genre:</label>
        <select
          className="border px-2 py-1 rounded"
          value={selectedGenre}
          onChange={(e) => handleGenreFilter(e.target.value)}
        >
          <option>All</option>
          {genres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {filtered.map((fav) => (
          <div key={fav.id} className="bg-white shadow rounded-xl p-4 flex flex-col">
            <div className="text-lg font-bold mb-2">{fav.title}</div>
            {fav.genres && (
              <div className="text-sm text-gray-500 mb-1">
                Genres: <span className="italic">{fav.genres}</span>
              </div>
            )}
            <input
              className="border p-2 rounded mb-2 text-sm"
              value={fav.tags}
              onChange={(e) => handleTagChange(fav.id, e.target.value)}
              placeholder="Add tags"
            />
            <label className="text-sm mb-2">
              <input
                type="checkbox"
                checked={fav.notify}
                onChange={() => handleToggleNotify(fav.id, fav.notify)}
                className="mr-2"
              />
              Notify me of releases
            </label>
            <div className="flex justify-between mt-auto">
              <button onClick={() => handleDelete(fav.id)} className="text-red-600 text-sm hover:underline">Remove</button>
              <button onClick={() => handleShare(fav.id)} className="text-blue-600 text-sm hover:underline">Share</button>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-2xl font-semibold mb-4">Upcoming Releases</h3>
      <ul className="mb-10">
        {reminders.length === 0 && <li className="text-gray-500">No upcoming releases in the next 7 days.</li>}
        {reminders.map((r) => (
          <li key={r.id} className="mb-2">
            📅 <strong>{r.title}</strong> — releasing on {r.date}
          </li>
        ))}
      </ul>

      <h3 className="text-2xl font-semibold mb-4">Recommended for You</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {recommendations.map((rec) => (
          <div key={rec.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            {rec.poster && (
              <img
                src={\`https://image.tmdb.org/t/p/w300\${rec.poster}\`}
                alt={rec.title}
                className="w-full h-44 object-cover"
              />
            )}
            <div className="p-3">
              <div className="font-bold text-md mb-1">{rec.title}</div>
              <p className="text-sm text-gray-600">{rec.overview.slice(0, 100)}...</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
