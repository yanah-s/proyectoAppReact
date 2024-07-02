import React, { useEffect ,useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../configuracion/axiosconfig';



const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        const token = localStorage.getItem('token');
        const usuario = localStorage.getItem('usuario');
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const body = { usuario };

        const response = await axios.post('http://localhost:3000/api/logout', body, config);

        console.log('Respuesta:', response);
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('admin');
        navigate('/');
      } catch (err) {
        console.error('Error:', err);
      }
    };

    logout();
  }, [navigate]);

  return (
    <div>
      <p>Cerrando sesión...</p>
    </div>
  );
};

export default Logout;
