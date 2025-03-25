import React, { useEffect, useState } from 'react';
import api from '../services/api'; // import your shared api

const SharedView = ({ id, token }) => {
  const [sharedItem, setSharedItem] = useState(null);

  useEffect(() => {
    const fetchShared = async () => {
      try {
        const res = await api.get(`/content/shared/${id}`);
        setSharedItem(res.data);
      } catch (err) {
        alert("Could not load shared content");
      }
    };

    if (id) fetchShared();
  }, [id]);

  const shareAgain = async () => {
    try {
      await api.post(`/content/shared/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Shared successfully!");
    } catch (err) {
      alert("Failed to share again");
    }
  };

  return (
    <div>
      <h1>Shared Content</h1>
      {sharedItem && <p>{sharedItem.title}</p>}
      <button onClick={shareAgain}>Reshare</button>
    </div>
  );
};

export default SharedView;
