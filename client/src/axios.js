import axios from 'axios';

const server = 'http://localhost:3000';

const instance = axios.create({
  baseURL: server,
});

export default instance;
