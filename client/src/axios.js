import axios from 'axios';

const server = 'http://localhost:3000';

const instance = axios.create({
  baseURL: server,
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = window.localStorage.getItem('token');
  return config;
});

export default instance;
