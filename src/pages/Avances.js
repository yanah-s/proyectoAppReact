
import React, { useState ,useEffect } from 'react';
import api from '../configuracion/axiosconfig';
import { Button, CssBaseline, TextField, Grid, Paper, Box, Typography, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AvanceEjercicios from '../components/AvanceEjercicios';
import ReactDOM from 'react-dom';

const tema = createTheme({
    palette: {
      primary: {
        main: '#424242',
      },
      secondary: {
        main: '#757575',
      },
      error: {
        main: '#ff5252',
      },
      background: {
        default: '#121212',
        paper: '#1d1d1d',
      },
      text: {
        primary: '#ffffff',
        secondary: '#bdbdbd',
      },
    },
    typography: {
      h4: {
        fontSize: '2rem',
        color: '#e0e0e0',
      },
    },
  });


  const Avances = () => {
    return (
      <ThemeProvider theme={tema}>
        <CssBaseline />
        <div style={{ padding: 20 }}>
          <h1>Avances en ejercicios</h1>
          <AvanceEjercicios />
        </div>
      </ThemeProvider>
    );
  }

export default Avances;