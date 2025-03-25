import React, { useState } from 'react';
import api from '../services/api'; // import your shared api

const Search = ({ token }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const res = await api.get(`/content/search?query=${encodeURIComponent(query)}`);
      setResults(res.data);
    } catch (err) {
      alert("Search failed");
    }
  };

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search content..."
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {results.map(item => <li key={item.id}>{item.title}</li>)}
      </ul>
    </div>
  );
};

export default Search;
