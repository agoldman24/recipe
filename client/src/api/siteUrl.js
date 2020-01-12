import axios from 'axios';

export default axios.create({
  baseURL: "https://guarded-temple-45812.herokuapp.com/api"
});