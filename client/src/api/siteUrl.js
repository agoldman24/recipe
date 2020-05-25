import axios from 'axios';

export default axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? "https://guarded-temple-45812.herokuapp.com/api"
    : "http://localhost:9000/api"
});