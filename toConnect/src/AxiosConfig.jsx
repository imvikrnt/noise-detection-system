import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.255.96:5000/api', // Base URL for all API calls
  timeout: 10000, // Timeout set to 10 seconds
});

export default axiosInstance;
