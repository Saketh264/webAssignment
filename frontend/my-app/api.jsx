import axios from 'axios';

const api = axios.create({
  baseURL: '/students' // Vite proxy will forward this to http://localhost:5000/students
});

export default api;
