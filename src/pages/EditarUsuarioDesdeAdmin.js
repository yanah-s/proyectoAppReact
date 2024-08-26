import React, { useState, useEffect } from 'react';
import api from '../configuracion/axiosconfig';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  CssBaseline,
  TextField,
  Grid,
  Paper,
  Box,
  Typography,
  CircularProgress,
  Avatar,
} from '@mui/material';

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
      paper: '#212529' 
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
    nombre: '',
    patologias: '',
    observaciones: ''
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const { id } = useParams();
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const obtenerDatosUsuario = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        const respuesta = await api.get(`/api/usuarios/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        setFormulario({
          nombre: respuesta.data.valor.nombre || '',
          observaciones: respuesta.data.valor.observaciones || '',
          patologias: respuesta.data.valor.patologias || ''
        });

        if (respuesta.data.valor.profileImage) {
          const imageUrl = `${process.env.REACT_APP_API_BASE_URL}/${respuesta.data.valor.profileImage}`;
          setPreview(imageUrl);
        }
      } catch (err) {
        setError('Error al obtener los datos del usuario.');
      } finally {
        setLoading(false);
      }
    };

    obtenerDatosUsuario();
  }, [id]);

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
      const token = localStorage.getItem('token');
      const usuario = JSON.parse(localStorage.getItem('usuario'));

      const respuesta = await api.put(`/api/usuarios/editarUsuario/${id}`, formulario, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'usuario': usuario.id
        }
      });

      setMensaje('Usuario editado exitosamente.');
      // setTimeout(() => {
      //   navigate('/ListarUsuarios');
      // }, 1000); // 1 segundo de retraso
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
    <Grid container  sx={{ height: '100vh' }}>
      <CssBaseline />
      <Grid item xs={12} sm={8} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >

              <Avatar
                src={preview}
                alt="Foto de perfil"
                sx={{ width: 150, height: 150, marginBottom: 2 }}
              />
            <Box component="form" noValidate onSubmit={editarUsuario} sx={{ mt: 1 }}>
            
              <TextField
                margin="normal"
                required
                fullWidth
                id="nombre"
                label="Nombre"
                name="nombre"
                autoComplete="nombre"
                value={formulario.nombre}
                onChange={eventoCambio}
                disabled
                sx={{
                  '& .MuiInputBase-input.Mui-disabled': {
                    color: '#B0B0B0 !important', 
                    opacity: '1 !important',
                    '-webkit-text-fill-color': '#B0B0B0 !important',
                  },
                  '& .MuiInputLabel-root.Mui-disabled': {
                    color: '#B0B0B0', 
                  },
                }}
              />
              <TextField
                margin="normal"
                fullWidth
                id="observaciones"
                label="Observaciones"
                name="observaciones"
                autoComplete="observaciones"
                autoFocus
                value={formulario.observaciones}
                onChange={eventoCambio}
              />
              <TextField
                margin="normal"
                fullWidth
                id="patologias"
                label="Patologías"
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
