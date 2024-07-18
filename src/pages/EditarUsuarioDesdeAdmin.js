import React, { useState ,useEffect } from 'react';
import api from '../configuracion/axiosconfig';
import { Button, CssBaseline, TextField, Grid, Paper, Box, Typography, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
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


   

const EditarUsuarioDesdeAdmin = () => {

  
  const [formulario, setFormulario] = useState({
    // nombre: '',
    // email: '',
    // password: ''
    patologias: '',
    observaciones: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const { id } = useParams();
const [usuario, setUsuario] = useState(null);


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
      console.log(id);
      const token = localStorage.getItem('token'); 
      const usuario = JSON.parse(localStorage.getItem('usuario')); 

      const respuesta = await api.put(`/api/usuarios/editarUsuario/${id}`, formulario, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'usuario': usuario.id
          }
        });

      console.log(respuesta);
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
                id="observaciones"
                label="observaciones"
                name="observaciones"
                autoComplete="observaciones"
                autoFocus
                value={formulario.observaciones}
                onChange={eventoCambio}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="patologias"
                label="patologias"
                name="patologias"
                autoComplete="patologias"
                value={formulario.patologias}
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
export default EditarUsuarioDesdeAdmin;
