import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  Link,
  CssBaseline,
  TextField,
  Paper,
  Box,
  Grid,
  Typography,
  Modal,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import imagenLogin from '../imagenes/imagenLogin.png';
import RecuperarPassword from './RecuperarPassword';

const tema = createTheme({
  palette: {
    primary: {
      main: '#424242', // Gris oscuro
    },
    secondary: {
      main: '#757575', // Gris medio
    },
    error: {
      main: '#ff5252', // Rojo claro
    },
    background: {
      default: '#121212', // Fondo casi negro
      paper: '#1d1d1d', // Fondo de papel gris oscuro
    },
    text: {
      primary: '#ffffff', // Texto blanco
      secondary: '#bdbdbd', // Texto gris claro
    },
  },
  typography: {
    h4: {
      fontSize: '2rem',
      color: '#e0e0e0', // Texto h4 en gris claro
    },
  },
});

const Login = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [formulario, setFormulario] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const eventoCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const loginUsuario = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMensaje(null);

    try {
      const respuesta = await axios.post('http://localhost:3000/api/autentificacion', formulario);
      console.log('Respuesta:', respuesta.data);
      setMensaje('Ingreso con éxito.');
    } catch (err) {
      console.error('Error:', err);
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
      console.log('Finalizado exitosamente');
    }
  };

  return (
    <ThemeProvider theme={tema}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${imagenLogin})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
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
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={loginUsuario} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
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
                autoComplete="current-password"
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
                {loading ? 'Loading...' : 'Sign In'}
              </Button>
              {error && <Typography color="error">{error}</Typography>}
              {mensaje && <Typography color="success">{mensaje}</Typography>}
              <Grid container>
                <Grid item xs>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={handleOpen}
                    color="primary"
                  >
                    Recuperar Contraseña
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Modal
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
            Recuperar Contraseña
          </Typography>
          <RecuperarPassword handleClose={handleClose} />
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

export default Login;
