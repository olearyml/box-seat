
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = ({ token }) => {
  const [favorites, setFavorites] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/content/favorites', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites(res.data);
      } catch (err) {
        alert("Failed to fetch favorites");
      }
    };

    fetchFavorites();
  }, [token]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/content/recommendations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRecommendations(res.data);
      } catch (err) {
        alert("Failed to fetch recommendations");
      }
    };

    fetchRecommendations();
  }, [token]);

  return (
    <div>
      <h1>Your Dashboard</h1>
      <h2>Favorites</h2>
      <ul>
        {favorites.map(show => <li key={show.id}>{show.title}</li>)}
      </ul>
      <h2>Recommended for You</h2>
      <ul>
        {recommendations.map(show => <li key={show.id}>{show.title}</li>)}
      </ul>
    </div>
  );
};

export default Dashboard;
