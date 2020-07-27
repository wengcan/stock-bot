import axios from 'axios';

const axiosInstance = axios.create({
    timeout: 1000
  });

export default axiosInstance;