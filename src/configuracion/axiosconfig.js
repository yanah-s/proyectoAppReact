// import axios from 'axios';



// const token = localStorage.getItem('token');
// if (token) {
//   axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
// }

// export default axios;
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL
});

const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default api;
