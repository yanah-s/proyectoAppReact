import React, { useState } from 'react';
import {
  Button,
  Link,
  CssBaseline,
  TextField,
  Paper,
  Box,
  Grid,
  Typography,
  Alert,
  Modal,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// import imagenLogin from '../../public/images/imagenLogin.png';
import RecuperarPassword from './RecuperarPassword';
import api from '../configuracion/axiosconfig'; 
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Motivacion from './Motivacion.js'; 

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
      default: '#212529',
      paper: '#212529',
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

const Login = () => {
  const [formulario, setFormulario] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [motivacionOpen, setMotivacionOpen] = useState(false); // Estado para el modal de motivación
  const [motivacionMessage, setMotivacionMessage] = useState(''); // Mensaje del modal de motivación
  const navigate = useNavigate();
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  const handleMotivacionClose = () => setMotivacionOpen(false); // Cierra el modal de motivación

  const eventoCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const loginUsuario = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError([]);
    setMensaje(null);

    try {
      const response = await api.post('/api/autentificacion', formulario);
 
      const isAdmin = response.data.usuario.admin;
  
      setMensaje('Ingreso con éxito.');
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
      localStorage.setItem('admin', isAdmin.toString());
      window.dispatchEvent(new Event('sesionIniciada'));
      if (response.data.usuario.mensaje) { 
   
        localStorage.setItem('motivacionMessage', response.data.usuario.mensaje);
      } else {
       console.error("sin mensaje");
      }
  
      navigate('/');
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
      setError([errorMsg]);
    } finally {
      setLoading(false);
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
            // backgroundImage: `url(${imagenLogin})`,
            backgroundImage: `url('/images/imagenLogin.png')`,
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
              Iniciar sesión
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
                value={formulario.email}
                onChange={eventoCambio}
                InputLabelProps={{ shrink: true }} 
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
                InputLabelProps={{ shrink: true }} 
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Ingresar'}
              </Button>
              {error.length > 0 && (
                <Alert severity="error">
                  {error.map((e, i) => (
                    <div key={i}>{e}</div>
                  ))}
                </Alert>
              )}
              {mensaje && <Typography color="success.main">{mensaje}</Typography>}
            </Box>

            {/* Mover el enlace fuera del formulario */}
            <Grid container>
              <Grid item xs>
                <Link
                  component="button"
                  variant="body2"
                  onClick={(e) => {
                    e.preventDefault(); // Evitar que se dispare el submit del formulario
                    handleOpen(); // Abrir el modal
                  }}
                  color="primary"
                >
                  Olvidó su contraseña?
                </Link>
              </Grid>
            </Grid>

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

