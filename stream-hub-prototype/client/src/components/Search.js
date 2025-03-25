
import React, { useState } from 'react';
import axios from 'axios';

const Search = ({ token }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/content/search?query=${query}`);
      setResults(res.data);
    } catch (err) {
      alert("Search failed");
    }
  };

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search content..." />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {results.map(item => <li key={item.id}>{item.title}</li>)}
      </ul>
    </div>
  );
};

export default Search;
