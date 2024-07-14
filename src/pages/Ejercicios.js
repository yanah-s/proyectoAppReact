import { CircularProgress } from '@mui/material';
import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import { Alert, AlertTitle, Button, CssBaseline, TextField, Grid, Paper, Box, Snackbar, Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import YouTube from 'react-youtube';
import ReactPlayer from 'react-player';


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

const Ejercicios = () => {
    const [ejercicios, setEjercicios] = useState([]);
    const [ejerciciosFiltrados, setFilteredEjercicios] = useState([]);
    const [ejercicioSeleccionado, setSelectedEjercicio] = useState(null);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState({
      nombre: '', categoria: '', musculoPpal: '', otrosMusculos: '', descripcion: '', video: ''
    });
    const [alerta, setAlertOpen] = useState(false);
    const [mensajeAlerta, setAlertMessages] = useState([]);
    const [editado, setIsEdit] = useState(false);
    const [openVideoModal, setOpenVideoModal] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
  
    useEffect(() => {
      listarEjercicios();
    }, []);
  
    const listarEjercicios = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token'); 
        const usuario = JSON.parse(localStorage.getItem('usuario')); 
        console.log("usuarioid   :" + usuario.id + "token" + token);

        const response = await axios.get('http://3.129.205.13:3000/api/ejercicio', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'User-ID': usuario.id
          }
        });
        const ejercicios = response.data.filter(ejercicio => ejercicio.disponible);
        setEjercicios(ejercicios);
        setFilteredEjercicios(ejercicios);
      } catch (err) {
        console.error('Error listando ejercicios:', err);
      } finally {
        setLoading(false);
      }
    };
  
    const filtrarTabla = (e) => {
      const value = e.target.value;
      setFilter(value);
      if (value.length >= 3) {
        const filtered = ejercicios.filter(ejercicio =>{
          const nombre = ejercicio.nombre?.toLowerCase().includes(value.toLowerCase());
          const categoria = ejercicio.categoria?.toLowerCase().includes(value.toLowerCase());
          const musculoPpal = ejercicio.musculoPpal?.toLowerCase().includes(value.toLowerCase());
          const otrosMusculos = Array.isArray(ejercicio.otrosMusculos) &&
          ejercicio.otrosMusculos.some(musculo => musculo?.toLowerCase().includes(value.toLowerCase()));
          const descripcion = ejercicio.descripcion?.toLowerCase().includes(value.toLowerCase());

          return nombre || categoria || musculoPpal || otrosMusculos || descripcion;
        });
        setFilteredEjercicios(filtered);
      } else {
        setFilteredEjercicios(ejercicios);
      }
    };
  
    const abrirModal = (editado = false, ejercicio = null) => {
      setIsEdit(editado);
      setModalData(editado ? ejercicio : {
        nombre: '', categoria: '', musculoPpal: '', otrosMusculos: '', descripcion: '', video: ''
      });
      setOpenModal(true);
    };
  
    const cerrarModal = () => {
      setOpenModal(false);
    };

    const abrirVideoModal = (videoUrl) => {
      setVideoUrl(videoUrl);
      setOpenVideoModal(true);
    };

    const cerrarVideoModal = () => {
      setVideoUrl('');
      setOpenVideoModal(false);
    };
  
    const manejarCambioDeInput = (e) => {
      const { name, value } = e.target;
      if (name === 'otrosMusculos') {
        // Si el valor está vacío, asignar un array vacío
        const arrayValue = value ? value.split(',').map(item => item.trim()) : [];
        setModalData({ ...modalData, [name]: arrayValue });
      } else {
        setModalData({ ...modalData, [name]: value });
      }
    };
  
    const crearOEditar = async () => {
      setLoading(true);
      const formattedData = {
        ...modalData,
        otrosMusculos: Array.isArray(modalData.otrosMusculos) ? modalData.otrosMusculos : [],
      };

      if (editado) {
        delete formattedData.nombre;
        console.log(formattedData.otrosMusculos);
      }
      try {
        if (editado) {
          const token = localStorage.getItem('token'); 
          const usuario = JSON.parse(localStorage.getItem('usuario')); 
          console.log("usuarioid   :" + usuario.id + "token" + token);
        
          await axios.put(`http://3.129.205.13:3000/api/ejercicio/${modalData._id}`, formattedData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'User-ID': usuario.id
            }
          });
        } else { 
          const token = localStorage.getItem('token'); 
          const usuario = JSON.parse(localStorage.getItem('usuario')); 
          console.log("usuarioid   :" + usuario.id + "token" + token);
        
          await axios.post('http://3.129.205.13:3000/api/ejercicio', formattedData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'User-ID': usuario.id
            }
          });
        }
        listarEjercicios();
        cerrarModal();
      } catch (error) {
        
        const errors = error.response && error.response.data && error.response.data.error 
          ? error.response.data.error 
          : [{ message: 'Error desconocido al procesar la solicitud.' }];
            
        setAlertMessages(errors);
        setAlertOpen(true);
        
      } finally {
        setLoading(false);
      }
    };

    const cerrarAlerta = () => {
      setAlertOpen(false);
    };

    const deshabilitarEjercicio = async (id) => {
      const confirmacion = window.confirm('¿Estás seguro de que deseas deshabilitar este ejercicio?');

      if(!confirmacion) return;

      try {
        const token = localStorage.getItem('token'); 
        const usuario = JSON.parse(localStorage.getItem('usuario')); 
        console.log("usuarioid   :" + usuario.id + "token" + token);
        
        await axios.put(`http://3.129.205.13:3000/api/ejercicio/${id}/deshabilitar`, null, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'User-ID': usuario.id
          }
        });
        listarEjercicios();
      } catch (err) {
        console.error('Error al deshabilitar ejercicio:', err);
        throw err;
      }
    };
  
    return (
        <ThemeProvider theme={tema}>
          <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />
            <Grid item xs={12} component={Paper} elevation={6} square>
              <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Ejercicios</Typography>
                <Box sx={{ display: 'flex', width: '100%', mb: 2 }}>
                  <TextField
                    label="Filtrar"
                    variant="outlined"
                    value={filter}
                    onChange={filtrarTabla}
                    sx={{ width: '300px', marginRight: '20px' }}
                  />
                  <Button variant="contained" color="primary" onClick={() => abrirModal(false)}>Crear</Button>
                  <Button variant="contained" color="secondary" onClick={() => abrirModal(true, ejercicioSeleccionado)} disabled={!ejercicioSeleccionado} sx={{'&.Mui-disabled': {backgroundColor: '#757575', color: '#bdbdbd'}}}>Editar</Button>
                  <Button variant="contained" color="error" onClick={() => deshabilitarEjercicio(ejercicioSeleccionado._id)} disabled={!ejercicioSeleccionado} sx={{'&.Mui-disabled': {backgroundColor: '#ff5252', color: '#ff8a80'}}}>Eliminar</Button>
                </Box>
                {loading ? (
                  <CircularProgress />
                ) : (
                  ejerciciosFiltrados.length > 0 ? (
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Categoría</TableCell>
                            <TableCell>Músculo Principal</TableCell>
                            <TableCell>Otros Músculos</TableCell>
                            <TableCell>Descripción</TableCell>
                            <TableCell>Video</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {ejerciciosFiltrados.map((ejercicio) => (
                            <TableRow
                              key={ejercicio._id}
                              onClick={() => setSelectedEjercicio(ejercicioSeleccionado?._id === ejercicio._id ? null : ejercicio)}
                              selected={ejercicioSeleccionado?._id === ejercicio._id}
                            >
                              <TableCell>{ejercicio.nombre}</TableCell>
                              <TableCell>{ejercicio.categoria}</TableCell>
                              <TableCell>{ejercicio.musculoPpal}</TableCell>
                              <TableCell>{ejercicio.otrosMusculos.join(', ')}</TableCell>
                              <TableCell>{ejercicio.descripcion}</TableCell>
                              <TableCell>
                              {ejercicio.video ? (
                                <ReactPlayer
                                  url={`https://www.youtube.com/watch?v=${ejercicio.video.split('v=')[1]}`}
                                  controls
                                  width="120px"
                                  height="90px"
                                  onClick={() => abrirVideoModal(ejercicio.video)}
                                />
                              ) : (
                                <span>No hay video disponible</span>
                              )}
                            </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography variant="h6">No se encontraron ejercicios</Typography>
                  )
                )}
              </Box>
            </Grid>
          </Grid>
    
          <Modal open={openModal} onClose={cerrarModal}>
            <Box sx={{ ...modalStyle, width: '80%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
              <Typography component="h2" variant="h6">{editado ? 'Editar Ejercicio' : 'Crear Ejercicio'}</Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                id="nombre"
                label="Nombre"
                name="nombre"
                autoComplete="nombre"
                autoFocus
                value={modalData.nombre}
                onChange={manejarCambioDeInput}
                disabled={editado}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="categoria"
                label="Categoría"
                name="categoria"
                autoComplete="categoria"
                value={modalData.categoria}
                onChange={manejarCambioDeInput}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="musculoPpal"
                label="Músculo Principal"
                name="musculoPpal"
                autoComplete="musculoPpal"
                value={modalData.musculoPpal}
                onChange={manejarCambioDeInput}
              />
              <TextField
                margin="normal"
                fullWidth
                id="otrosMusculos"
                label="Otros Músculos"
                name="otrosMusculos"
                autoComplete="otrosMusculos"
                value={modalData.otrosMusculos}
                onChange={manejarCambioDeInput}
              />
              <TextField
                margin="normal"
                fullWidth
                id="descripcion"
                label="Descripción"
                name="descripcion"
                autoComplete="descripcion"
                value={modalData.descripcion}
                onChange={manejarCambioDeInput}
              />
              <TextField
                margin="normal"
                fullWidth
                id="video"
                label="Video (URL de YouTube)"
                name="video"
                autoComplete="video"
                value={modalData.video}
                onChange={manejarCambioDeInput}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={cerrarModal}
                  sx={{ width: '45%' }}
                >
                  Cerrar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={crearOEditar}
                  sx={{ width: '45%' }}
                >
                  {editado ? 'Editar' : 'Crear'}
                </Button>
              </Box>
            </Box>
          </Modal>

          <Modal open={openVideoModal} onClose={cerrarVideoModal}>
            <Box sx={{ width: '100%', maxWidth: '800px', maxHeight: '100vh', overflowY: 'auto', mx: 'auto', my: 'auto' }}>
              <Typography variant="h5" align="center" mb={2}>Video del Ejercicio</Typography>
              <Box display="flex" justifyContent="center">
                <YouTube videoId={videoUrl.split('v=')[1]} opts={{ width: '800', height: '480' }} />
              </Box>
            </Box>
          </Modal>
          <Snackbar
            open={alerta}
            autoHideDuration={6000}
            onClose={cerrarAlerta}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={cerrarAlerta} severity="error" sx={{ width: '100%' }}>
              <AlertTitle>Error</AlertTitle>
              {mensajeAlerta.map((error, index) => (
                <div key={index}>
                  {error.path && `${error.path.join('.')}: `}{error.message}
                </div>
              ))}
            </Alert>
          </Snackbar>
        </ThemeProvider>
      );
    };

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };

export default Ejercicios;