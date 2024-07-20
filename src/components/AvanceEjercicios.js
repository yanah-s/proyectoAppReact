import React, { useState, useEffect } from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import api from '../configuracion/axiosconfig';
import { Alert, AlertTitle, Button, CssBaseline, TextField, Grid, Paper, Box, Snackbar, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal } from '@mui/material';

const AvanceEjercicios = () => {
  const [ejercicios, setEjercicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [dataOptions, setDataOptions] = useState({});

  useEffect(() => {
    listarEjercicios();
  }, []);

  useEffect(() => {
    // Crear opciones dinámicas cuando se obtienen los ejercicios
    const options = ejercicios.reduce((acc, ejercicio) => {
      acc[ejercicio.nombre] = ejercicio.datos; // Usa `ejercicio.nombre` como clave
      return acc;
    }, {});

    setDataOptions(options);

    // Seleccionar la primera opción por defecto
    if (ejercicios.length > 0) {
      setSelectedOption(ejercicios[0].nombre); // Selecciona el nombre del primer ejercicio por defecto
    }
  }, [ejercicios]);


  const listarEjercicios = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); 
      const usuario = JSON.parse(localStorage.getItem('usuario')); 
      console.log("usuarioid   :" + usuario.id + "token" + token);

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
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id="select-label">Selecciona un ejercicio</InputLabel>
        <Select
          labelId="select-label"
          value={selectedOption}
          onChange={handleChange}
        >
          {Object.keys(dataOptions).map((key) => (
            <MenuItem key={key} value={key}>
              {`Ejercicio ${key.replace('ejercicio', '')}`}
            </MenuItem>
          ))}
        </Select>
        <TextField
                margin="normal"
                required
                fullWidth
                id="peso"
                label="nuevo peso"
                name="peso"
                autoComplete="peso"
                autoFocus
                type='numeric'
                // value={formulario.nombre}
                // onChange={eventoCambio}
              />
        <Button
                  variant="contained"
                  color="primary"
                  // onClick={registrarAvance}
                  sx={{ width: '45%' }}
                >
                  {'Registrar'}
                </Button>
      </FormControl>

      <Sparklines data={dataOptions[selectedOption] || []} style={{ marginTop: 20 }}>
        <SparklinesLine color="blue" />
      </Sparklines>
    </div>
  );
};

export default AvanceEjercicios;
