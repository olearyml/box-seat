import axios from 'axios';

const api = axios.create({
  // Replace with your actual Render domain
  baseURL: 'https://box-seat-api.onrender.com/api'
});

export default api;
