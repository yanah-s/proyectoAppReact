import React, { useState } from 'react';
import axios from 'axios';
import { Button, CssBaseline, TextField, Grid, Paper, Box, Typography, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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

const EditarUsuario = () => {
  const [formulario, setFormulario] = useState({
    nombre: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  const eventoCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  };

  const editarUsuario = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMensaje(null);

    try {
      const respuesta = await axios.put(`http://localhost:3000/api/usuarios/${formulario.email}`, formulario);
      setMensaje('Usuario editado exitosamente.');
    } catch (err) {
      let errorMsg = 'Error de conexión';
      if (err.response) {
        if (err.response.data && err.response.data.mensaje) {
          errorMsg = err.response.data.mensaje;
        } else if (err.response.data && err.response.data.error) {
          errorMsg = err.response.data.error;
        } else if (err.response.data && err.response.data.message) {
          errorMsg = err.response.data.message;
        } else {
          errorMsg = `Error: ${err.response.status} ${err.response.statusText}`;
        }
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={tema}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5">
              Editar Usuario
            </Typography>
            <Box component="form" noValidate onSubmit={editarUsuario} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="nombre"
                label="Nombre completo"
                name="nombre"
                autoComplete="nombre"
                autoFocus
                value={formulario.nombre}
                onChange={eventoCambio}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={formulario.email}
                onChange={eventoCambio}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formulario.password}
                onChange={eventoCambio}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Editar'}
              </Button>
              {error && (
                <Typography color="error">
                  {error}
                </Typography>
              )}
              {mensaje && <Typography color="success.main">{mensaje}</Typography>}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};
export default EditarUsuario;
