import React, { useState, useEffect } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Button, TextField } from '@mui/material';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area } from 'recharts';
import api from '../configuracion/axiosconfig';

const AvanceEjercicios = ({ id }) => {
  const [formulario, setFormulario] = useState({ peso: '' });
  const [avances, setAvances] = useState([]);
  const [fechaUltimoPeso, setFechaUltimoPeso] = useState(null);
  const hoy = new Date();
  const mostrarComponentes = id === undefined || id === null;
  const usuario = JSON.parse(localStorage.getItem('usuario')); 
  

  const sePuedeHabilitar = usuario.alumno === true && (fechaUltimoPeso ? ((hoy - fechaUltimoPeso) / (1000 * 60 * 60 * 24)) >= 7 : true);

  useEffect(() => {
    obtenerAvances();
  }, [id]); 

  const obtenerAvances = async () => {
   
    const token = localStorage.getItem('token');
    const usuarioId = id || JSON.parse(localStorage.getItem('usuario')).id;

        if (!usuarioId) {
          throw new Error('No se encontró el id del usuario.');
        }

    try {
      const response = await api.get(`/api/avances/usuarioPeso`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-ID': JSON.parse(localStorage.getItem('usuario')).id
        },
        params: {
          usuario: usuarioId,
        },
      });
  
      if (!response.data || response.data.length === 0) {
        // No hay avances, permitir el registro
        setFechaUltimoPeso(null);
        setAvances([]);
        return;
      }
  
      const avances = response.data.map(avance => ({
        fecha: new Date(avance.fecha).toLocaleDateString(),
        valorNumerico: avance.valorNumerico,
      }));
  
      // Obtener la fecha del último registro
      const ultimoPeso = response.data[response.data.length - 1];
      if (ultimoPeso) {
        setFechaUltimoPeso(new Date(ultimoPeso.fecha));
      }
  
      setAvances(avances);
    } catch (err) {
      console.error('Error obteniendo avances:', err);
    }
  };



  const registrarAvance = async () => {
    const token = localStorage.getItem('token'); 
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    const data = {
     
      peso: formulario.peso,
      usuarioId: usuario.id
    };

    try {
      const response = await api.post('/api/avances/usuarioPeso', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-ID': usuario.id
        }
      });
    
      setFormulario((prevFormulario) => ({
        ...prevFormulario,
        peso: ''
      }));

      obtenerAvances();
    } catch (err) {
      console.error('Error registrando avance:', err);
    }
  };

  const handlePesoChange = (event) => {
    setFormulario({ ...formulario, peso: event.target.value });
  };


  return (
    <div>
      <FormControl fullWidth>
      {mostrarComponentes && (
        <TextField
          margin="normal"
          required
          fullWidth
          id="peso"
          label="peso en KG"
          name="peso"
          autoComplete="peso"
          autoFocus
          type='numeric'
          value={formulario.peso}
          onChange={handlePesoChange}
        />
      )}
      {mostrarComponentes && (
              <Button
        variant="contained"
        color="primary"
        onClick={registrarAvance}
        disabled={!sePuedeHabilitar}  // Deshabilitar si no se cumplen las condiciones
        sx={{ width: '45%' }}
      >
        Registrar
      </Button>
      )}
      </FormControl>

      <ResponsiveContainer width="100%" height={200}>
    <LineChart data={avances} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis 
        dataKey="fecha" 
        tick={{ fontSize: 12 }} 
        tickFormatter={(tick) => tick.split(',')[0]} 
      />
      <YAxis 
        tickFormatter={(tick) => tick !== 0 ? tick : ''} 
      />
      <Tooltip />
      <Area 
        type="monotone" 
        dataKey="valorNumerico" 
        stroke="#f0a6c0" 
        fill="#f0a6c0"   
        strokeWidth={2}   
      />
      <Line 
        type="monotone" 
        dataKey="valorNumerico" 
        stroke="#f0a6c0"  
        name="Peso en KG" 
      />
    </LineChart>
  </ResponsiveContainer>
    </div>
  );
};

export default AvanceEjercicios;

