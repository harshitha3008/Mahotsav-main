// Create a file like api.js in your services folder
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://mahotsav-backend.onrender.com'
});

export default api;