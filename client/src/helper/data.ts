import axios from 'axios'
console.log(import.meta.env.VITE_PROD_API_URL)
const instance = axios.create({
    baseURL: import.meta.env.VITE_PROD_API_URL,
    headers:{
        'Content-Type':'application/json'
    }
});


export default instance;

