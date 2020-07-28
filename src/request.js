import https from 'https';
import axios from 'axios';

const axiosInstance = axios.create({
    timeout: 1000,
    httpsAgent: new https.Agent({  
      rejectUnauthorized: false
    }) 
  });

export default axiosInstance;