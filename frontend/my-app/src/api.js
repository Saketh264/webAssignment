// src/api.js
import axios from 'axios';

export default axios.create({
  baseURL: 'https://webassignment-3.onrender.com/api/students', // Or your actual backend URL
});
