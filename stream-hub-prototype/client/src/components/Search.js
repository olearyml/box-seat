import React, { useState } from 'react';
import axios from 'axios';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/content/search?query=${query}`);

      setResults(res.data);
    } catch (err) {
      alert('Search failed');
    }
  };

  const handleFavorite = async (item) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/content/favorites', {
        contentId: item.id.toString(),
        title: item.title || item.name,
        tags: ""
      }, {
        headers: { Authorization: \`Bearer \${token}\` }
      });
      alert('Added to favorites!');
    } catch (err) {
      alert('You may need to log in to favorite.');
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl mb-4">Search Shows & Movies</h2>
      <input placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-full p-2 mb-2 border" />
      <button onClick={handleSearch} className="bg-indigo-500 text-white p-2 w-full">Search</button>
      <ul className="mt-4">
        {results.map((item) => (
          <li key={item.id} className="border-b p-2 flex justify-between items-center">
            <div>
              <strong>{item.title || item.name}</strong> ({item.media_type})
            </div>
            <button onClick={() => handleFavorite(item)} className="text-green-600">Favorite</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
