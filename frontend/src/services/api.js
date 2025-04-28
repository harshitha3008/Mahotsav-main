// Create a file like api.js in your services folder
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:10000'
});

export default api;