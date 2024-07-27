
import React, { useState ,useEffect } from 'react';
import api from '../configuracion/axiosconfig';
import { Button, CssBaseline, TextField, Grid, Paper, Box, Typography, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AvanceEjercicios from '../components/AvanceEjercicios';
import AvancePesoAlumno from '../components/AvancePesoAlumno';
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
    // return (
    //   <ThemeProvider theme={tema}>
    //   <CssBaseline />
    //   <div style={{ padding: 20 }}>
    //     <h1>Avances en ejercicios</h1>
    //     <Grid container spacing={3}>
    //       <Grid item xs={12} md={6}>
    //         <AvanceEjercicios />
    //       </Grid>
    //       <Grid item xs={12} md={6}>
    //         <AvancePesoAlumno />
    //       </Grid>
    //     </Grid>
    //   </div>
    // </ThemeProvider>
    return (
      <ThemeProvider theme={tema}>
        <CssBaseline />
        <div style={{ padding: 20 }}>
        <h1>Registra tus avances</h1>
        <p>Cada 7 días puedes registrar los nuevos avances</p>
          <Grid container spacing={6}> {/* Ajusta el valor de spacing aquí */}
            <Grid item xs={12} md={6}>
              <Paper style={{ padding: 20 }}>
              <h1>     Prograsión KG     </h1>
                <AvanceEjercicios />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
           
              <Paper style={{ padding: 20 }}>
              <h1>  Peso corporal   </h1>
              <br></br>
              <br></br>
                <AvancePesoAlumno />
                <br></br>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </ThemeProvider>
    );
  }

export default Avances;