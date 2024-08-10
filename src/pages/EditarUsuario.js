import React, { useState, useEffect, useCallback } from 'react';
import api from '../configuracion/axiosconfig';
import { Button, CssBaseline, TextField, Grid, Paper, Box, Typography, InputAdornment, CircularProgress, Avatar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import EditIcon from '@mui/icons-material/Edit';

const tema = createTheme({
  palette: {
    primary: { main: '#424242' },
    secondary: { main: '#757575' },
    error: { main: '#ff5252' },
    background: { default: '#121212', paper: '#212529' },
    text: { primary: '#ffffff', secondary: '#bdbdbd' },
  },
  typography: {
    h4: { fontSize: '2rem', color: '#e0e0e0' },
  },
});

const EditarUsuario = () => {
  const [formulario, setFormulario] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const [editableField, setEditableField] = useState(null);
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const handleEditClick = (field) => {
    setEditableField(field);
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', usuario.id);

    setPreview(URL.createObjectURL(file));

    const token = localStorage.getItem('token');

    api.post('/api/usuarios/upload', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        console.log('foto subida', response.data);
        setMensaje('Imagen subida con éxito');
        const imageUrl = `http://localhost:3000/${response.data.file.path}`;
        console.log(imageUrl);
        setPreview(imageUrl);
      })
      .catch(error => {
        console.error('Error uploading file', error);
        setError('Error al subir la imagen');
      });
  }, [usuario.id]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  useEffect(() => {
    const obtenerDatosUsuario = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        const usuario = JSON.parse(localStorage.getItem('usuario'));

        const respuesta = await api.get(`/api/usuarios/${usuario.id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        console.log(respuesta);

        setFormulario({
          nombre: respuesta.data.valor.nombre || '',
          email: respuesta.data.valor.email || '',
          telefono: respuesta.data.valor.telefono || '',
          password: '',
        });

        if (respuesta.data.valor.profileImage) {
          console.log(respuesta.data.valor.profileImage);
          setPreview(`http://localhost:3000/${respuesta.data.valor.profileImage}`);
        }
      } catch (err) {
        setError('Error al obtener los datos del usuario.');
      } finally {
        setLoading(false);
      }
    };

    obtenerDatosUsuario();
  }, []);

  const eventoCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
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

      const respuesta = await api.put(`/api/usuarios/editar/${usuario.id}`, formulario, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'usuario': usuario.id,
        },
      });

      setMensaje('Usuario editado exitosamente.');
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      let errorMsg = 'Error de conexión';
      if (err.response) {
        errorMsg = err.response.data?.mensaje || err.response.data?.error || err.response.data?.message || `Error: ${err.response.status} ${err.response.statusText}`;
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
            <div {...getRootProps()} style={{ border: '2px dashed #757575', borderRadius: '50%', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0', cursor: 'pointer' }}>
              <input {...getInputProps()} />
              {preview ? (
                <Avatar src={preview} alt="Preview" sx={{ width: 150, height: 150 }} />
              ) : (
                <Typography>Click para subir tu foto!</Typography>
              )}
            </div>
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
                disabled
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="telefono"
                label="Teléfono"
                name="telefono"
                autoComplete="telefono"
                value={formulario.telefono}
                onChange={eventoCambio}
                disabled={editableField !== 'telefono'}
                InputProps={{
                  style: { color: 'white' },
                  endAdornment: (
                    <InputAdornment position="end">
                      <EditIcon onClick={() => handleEditClick('telefono')} style={{ cursor: 'pointer', color: 'white' }} />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  style: { color: 'white' },
                }}
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
                disabled={editableField !== 'password'}
                InputProps={{
                  style: { color: 'white' },
                  endAdornment: (
                    <InputAdornment position="end">
                      <EditIcon onClick={() => handleEditClick('password')} style={{ cursor: 'pointer', color: 'white' }} />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  style: { color: 'white' },
                }}
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
