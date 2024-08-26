import React, { useEffect, useState } from 'react';
import api from '../configuracion/axiosconfig';

function PorcentajeAsistencia({ id }) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    obtenerDatos();
  }, [id]);
  useEffect(() => {
    obtenerDatos();
  }, []);

    async function obtenerDatos() {
   
      try {
        
        const token = localStorage.getItem('token');
        const usuarioId = id || JSON.parse(localStorage.getItem('usuario')).id;

        if (!usuarioId) {
          throw new Error('No se encontró el id del usuario.');
        }

        const respuesta = await api.get('/api/rutina_ej_alumno/porcentaje', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'User-ID': JSON.parse(localStorage.getItem('usuario')).id
          },
          params: {
            usuario: usuarioId,
          },
        });
      
        setDatos(Math.round(respuesta.data.porcentaje));
      } catch (error) {
        console.error('Error al obtener los datos:', error);
        setError(error.message || 'Error al obtener los datos');
      } finally {
        setCargando(false);
      }
    }

  

  if (cargando) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (datos === null) {
    return <div>No hay datos disponibles</div>;
  }

  return (
    <div>
      Porcentaje de Asistencia: {datos}%
    </div>
  );
}

export default PorcentajeAsistencia;
