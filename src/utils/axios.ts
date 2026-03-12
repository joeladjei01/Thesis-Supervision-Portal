import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_ENDPOINT_URL;
// console.log('API Base URL:', API_BASE_URL);

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: API_BASE_URL,
});

export default axiosInstance;
