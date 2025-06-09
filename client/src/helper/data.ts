import axios from 'axios'

const instance = axios.create({
    baseURL: import.meta.env.VITE_PROD_API_URL || 'http://localhost:5000/api',
    headers:{
        'Content-Type':'application/json'
    }
});


export default instance;

