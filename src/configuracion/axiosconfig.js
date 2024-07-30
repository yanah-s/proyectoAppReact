// import axios from 'axios';



// const token = localStorage.getItem('token');
// if (token) {
//   axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
// }

// export default axios;
//import axios from 'axios';

// const api = axios.create({
//   baseURL: process.env.REACT_APP_API_BASE_URL
// });

// const token = localStorage.getItem('token');
// if (token) {
//   api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
// }

// export default api;


import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL
});

// Configuración del token de autenticación si existe
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Interceptor de respuesta para manejar errores de autenticación
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Token ha expirado o es inválido, redirigir al usuario al inicio de sesión
      localStorage.removeItem('token'); 
      if (window.location.href !== window.location.origin + '/login') {
        window.location.href = '/login'; 
      }
    }
    return Promise.reject(error);
  }
);

export default api;
