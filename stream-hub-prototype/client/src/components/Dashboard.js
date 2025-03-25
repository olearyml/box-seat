import React, { useEffect, useState } from 'react';
// Instead of axios, import your shared 'api' instance
import api from '../api'; // or '../services/api' depending on your folder structure

const Dashboard = ({ token }) => {
  const [favorites, setFavorites] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await api.get('/content/favorites', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites(res.data);
      } catch (err) {
        alert('Failed to fetch favorites');
      }
    };

    if (token) {
      fetchFavorites();
    }
  }, [token]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await api.get('/content/recommendations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRecommendations(res.data);
      } catch (err) {
        alert('Failed to fetch recommendations');
      }
    };

    if (token) {
      fetchRecommendations();
    }
  }, [token]);

  return (
    <div>
      <h1>Your Dashboard</h1>
      <h2>Favorites</h2>
      <ul>
        {favorites.map((show) => (
          <li key={show.id}>{show.title}</li>
        ))}
      </ul>
      <h2>Recommended for You</h2>
      <ul>
        {recommendations.map((show) => (
          <li key={show.id}>{show.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
