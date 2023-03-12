import axios from 'axios';

const server = 'https://mern-app-blog.onrender.com';

const instance = axios.create({
  baseURL: server,
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = window.localStorage.getItem('token');
  return config;
});

export default instance;
