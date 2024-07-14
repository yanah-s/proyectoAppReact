import axios from 'axios';


// const instance = axios.create({
//   baseURL: 'http://3.129.205.13:3000', // Reemplaza con la IP y puerto de tu backend
// });

const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default axios;