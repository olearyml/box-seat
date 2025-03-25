// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://box-seat-api.onrender.com/api' 
});

export default api;
