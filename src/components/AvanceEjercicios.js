import React, { useState, useEffect } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Button, TextField } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import api from '../configuracion/axiosconfig';

const AvanceEjercicios = ({ id }) => {
  const [formulario, setFormulario] = useState({ ejercicio: '', peso: '' });
  const [ejercicios, setEjercicios] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [dataOptions, setDataOptions] = useState({});
  const [avances, setAvances] = useState([]);
  const [fechaUltimoEjercicio, setFechaUltimoEjercicio] = useState(null);
  const hoy = new Date();
  const mostrarComponentes = id === undefined || id === null;
  const usuario = JSON.parse(localStorage.getItem('usuario')); 

  
  // const sePuedeHabilitar = fechaUltimoEjercicio ? ((hoy - fechaUltimoEjercicio) / (1000 * 60 * 60 * 24)) >= 1 : true;

  const sePuedeHabilitar = usuario.alumno === true && (fechaUltimoEjercicio ? ((hoy - fechaUltimoEjercicio) / (1000 * 60 * 60 * 24)) >= 7 : true);


  useEffect(() => {
    listarEjercicios();
    console.log(sePuedeHabilitar);
    console.log(fechaUltimoEjercicio);
  }, []);


  useEffect(() => {
    listarEjercicios();
    obtenerAvances();
  }, [id]);


  useEffect(() => {
    const options = ejercicios.reduce((acc, ejercicio) => {
      acc[ejercicio.nombre] = ejercicio; 
      return acc;
    }, {});

    setDataOptions(options);

    if (ejercicios.length > 0) {
      setSelectedOption(ejercicios[0].nombre);
    }
  }, [ejercicios]);

  const listarEjercicios = async () => {
    try {
      const token = localStorage.getItem('token'); 
      const usuario = JSON.parse(localStorage.getItem('usuario')); 

      const response = await api.get('/api/ejercicio', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-ID': usuario.id
        }
      });
      const ejercicios = response.data.filter(ejercicio => ejercicio.disponible);
      setEjercicios(ejercicios);
     
    } catch (err) {
      console.error('Error listando ejercicios:', err);
    }
  };

  
  const obtenerAvances = async () => {
    console.log("id recibido" + id);
    // const token = localStorage.getItem('token');
    // const usuario = JSON.parse(localStorage.getItem('usuario'));

    // // Usa el id del prop si está disponible, de lo contrario usa el del localStorage
    // const usuarioId = id || usuario.id;

    const token = localStorage.getItem('token');
    const usuarioId = id || JSON.parse(localStorage.getItem('usuario')).id;

        if (!usuarioId) {
          throw new Error('No se encontró el id del usuario.');
        }

    const selectedEjercicio = dataOptions[selectedOption];
  
    if (!selectedEjercicio) return;
  
    const ejercicioId = selectedEjercicio._id;
  
    try {

      
      const response = await api.get(`/api/avances/usuarioEjercicio?ejercicio=${ejercicioId}`, {
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
        setFechaUltimoEjercicio(null);
        setAvances([]);
        return;
      }
  
      const avances = response.data.map(avance => ({
        fecha: new Date(avance.fecha).toLocaleDateString(),
        valorNumerico: avance.valorNumerico,
      }));
  
      // Obtener la fecha del último registro
      const ultimoEjercicio = response.data[response.data.length - 1];
      if (ultimoEjercicio) {
        setFechaUltimoEjercicio(new Date(ultimoEjercicio.fecha));
      }
  
      setAvances(avances);
    } catch (err) {
      console.error('Error obteniendo avances:', err);
    }
  };
  
  
  useEffect(() => {
    if (selectedOption) {
      obtenerAvances();
    }
  }, [selectedOption]);

  const registrarAvance = async () => {
    const token = localStorage.getItem('token'); 
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    const selectedEjercicio = dataOptions[selectedOption];
    const data = {
      ejercicio: selectedEjercicio._id,
      peso: formulario.peso,
      usuarioId: usuario.id
    };

    try {
      const response = await api.post('/api/avances/avanceEjercicios', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-ID': usuario.id
        }
      });
      console.log('Avance registrado:', response.data);
      obtenerAvances();
    } catch (err) {
      console.error('Error registrando avance:', err);
    }
  };

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    setFormulario((prevFormulario) => ({
      ...prevFormulario,
      peso: ''
    }));
  };

  const handlePesoChange = (event) => {
    setFormulario({ ...formulario, peso: event.target.value });
  };

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id="select-label">Selecciona un ejercicio</InputLabel>
        <Select labelId="select-label" value={selectedOption} onChange={handleChange}>
          {Object.keys(dataOptions).map((key) => (
            <MenuItem key={key} value={key}>
              {`Ejercicio ${key.replace('ejercicio', '')}`}
            </MenuItem>
          ))}
        </Select>
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
        {/* <Button variant="contained" color="primary" onClick={registrarAvance} sx={{ width: '45%' }}>
          Registrar
        </Button> */}
      {mostrarComponentes && (
              <Button
        variant="contained"
        color="primary"
        onClick={registrarAvance}
        disabled={!sePuedeHabilitar} 
        sx={{ width: '45%' }}
      >
        Registrar
      </Button>
       )}
      <br></br>
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
          <Line type="monotone" dataKey="valorNumerico" stroke="#22978da9"  name="Peso levantado" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AvanceEjercicios;

