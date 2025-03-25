import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SharedView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(null);

  useEffect(() => {
    const fetchShared = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/content/shared/${id}`);

        setFavorite(res.data);
      } catch (err) {
        console.error(err);
        alert('Could not load shared content.');
      }
    };
    fetchShared();
  }, [id]);

  const handleAccept = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('You must be logged in to save this favorite.');

    try {
      await axios.post(\`http://localhost:5000/api/content/shared/\${id}\`, {}, {
        headers: { Authorization: \`Bearer \${token}\` }
      });
      alert('Added to your favorites!');
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to save favorite.');
    }
  };

  if (!favorite) return <div className="p-4 text-center">Loading shared favorite...</div>;

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-2">{favorite.title}</h2>
      <p className="text-gray-600 mb-4">Tags: {favorite.tags || 'No tags'}</p>
      <button onClick={handleAccept} className="bg-green-600 text-white px-4 py-2 rounded">
        Add to My Favorites
      </button>
    </div>
  );
};

export default SharedView;
