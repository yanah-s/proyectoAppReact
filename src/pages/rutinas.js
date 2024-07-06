import { CircularProgress } from '@mui/material';
import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import { Alert, AlertTitle, Button, CssBaseline, TextField, Grid, Paper, Box, Snackbar, Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
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

const Rutinas = () => {
    const [rutinas, setRutinas] = useState([]);
    const [rutinasFiltradas, setFilteredRutinas] = useState([]);
    const [rutinaSeleccionada, setSelectedRutina] = useState(null);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState({
      nombre: '', categoria: '', ejercicios: []
    });
    const [alerta, setAlertOpen] = useState(false);
    const [mensajeAlerta, setAlertMessages] = useState([]);
    const [editado, setIsEdit] = useState(false);
    const [categoria, setCategoria] = useState(modalData.categoria || '');
    const [ejerciciosFiltrados, setEjerciciosFiltrados] = useState([]);
  
    useEffect(() => {
      listarRutinas();
      if (categoria) {
        console.log("Fetching ejercicios for categoría:", categoria);
        axios.get(`http://localhost:3000/api/ejercicio/categoria`, { params: { categoria } })
          .then(response => {
            console.log("Ejercicios fetched:", response.data);
            setEjerciciosFiltrados(response.data);
          })
          .catch(error => {
            console.error('Error al obtener los ejercicios:', error);
          });
      } else {
        setEjerciciosFiltrados([]);
      }
    }, [categoria]);

    const manejarCambioCategoria = async (event) => {
      const newCategoria = event.target.value;
      setCategoria(newCategoria);
    
      manejarCambioDeInput(event);
    
      if (newCategoria) {
        try {
          const token = localStorage.getItem('token'); 
          const usuario = JSON.parse(localStorage.getItem('usuario')); 
          console.log("usuarioid   :" + usuario.id + "token" + token);
          
          const response = await axios.get('http://localhost:3000/api/ejercicio/categoria', {
            params: { 
              categoria: newCategoria 
            },
            headers: {
              'Authorization': `Bearer ${token}`,
              'User-ID': usuario.id
            }
          });
          setEjerciciosFiltrados(response.data);
        } catch (error) {
          console.error('Error al obtener los ejercicios:', error);
        }
      } else {
        setEjerciciosFiltrados([]);
      }
    };
  
    const listarRutinas = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token'); 
        const usuario = JSON.parse(localStorage.getItem('usuario')); 
        console.log("usuarioid   :" + usuario.id + "token" + token);

        const response = await axios.get('http://localhost:3000/api/rutinas', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'User-ID': usuario.id
          }
        });
        const rutinas = response.data.filter(rutina => rutina.disponible);
        setRutinas(rutinas);
        setFilteredRutinas(rutinas);
      } catch (err) {
        console.error('Error listando rutinas:', err);
      } finally {
        setLoading(false);
      }
    };
  
    const filtrarTabla = (e) => {
      const value = e.target.value;
      setFilter(value);
      if (value.length >= 3) {
        const filtered = rutinas.filter(rutina =>{
          const nombre = rutina.nombre?.toLowerCase().includes(value.toLowerCase());
          const categoria = rutina.categoria?.toLowerCase().includes(value.toLowerCase());
          const ejercicios = Array.isArray(rutina.ejercicios) &&
          rutina.ejercicios.some(ejercicio => ejercicio?.toLowerCase().includes(value.toLowerCase()));

          return nombre || categoria || ejercicios;
        });
        setFilteredRutinas(filtered);
      } else {
        setFilteredRutinas(rutinas);
      }
    };
  
    const abrirModal = async (editado = false, rutina = null) => {
      setIsEdit(editado);
    
      if (editado && rutina) {
        // Configurar modalData con la rutina seleccionada
        setModalData({ ...rutina, ejercicios: rutina.ejercicios || [] });
    
        // Obtener ejercicios filtrados por categoría
        try {
          
          const token = localStorage.getItem('token'); 
          const usuario = JSON.parse(localStorage.getItem('usuario')); 
          console.log("usuarioid   :" + usuario.id + "token" + token);
      
          const response = await axios.get('http://localhost:3000/api/ejercicio/categoria', {
            params: { categoria: rutina.categoria },
            headers: {
              'Authorization': `Bearer ${token}`,
              'User-ID': usuario.id
            }
          });
      
          setEjerciciosFiltrados(response.data);
    
          // Actualizar modalData con los ejercicios seleccionados de la rutina
          const selectedEjercicios = response.data.filter(ejercicio =>
            rutina.ejercicios.some(e => e._id === ejercicio._id)
          );
          setModalData(prevData => ({ ...prevData, ejercicios: selectedEjercicios }));
        } catch (error) {
          console.error('Error al obtener los ejercicios:', error);
        }
      } else {
        setModalData({
          nombre: '',
          categoria: '',
          ejercicios: [],
        });
        setEjerciciosFiltrados([]);
      }
    
      setOpenModal(true);
    };
  
    const cerrarModal = () => {
      setOpenModal(false);
      setSelectedRutina(null);
    };

    const manejarCambioDeInput = (e) => {
      const { name, value } = e.target;
    
      if (name === 'ejercicios') {
        const selectedValues = e.target.value;
        const selectedEjercicios = ejerciciosFiltrados.filter(ejercicio =>
          selectedValues.includes(ejercicio._id)
        );
        setModalData({ ...modalData, [name]: selectedEjercicios });
      } else {
        setModalData({ ...modalData, [name]: value });
      }
    };
  
    const crearOEditar = async () => {
      setLoading(true);
      const formattedData = {
        ...modalData,
        ejercicios: Array.isArray(modalData.ejercicios) ? modalData.ejercicios : [],
      };
    
      if (editado) {
        delete formattedData.nombre;
      }

      console.log(formattedData);
    
      try {
        if (editado) {
          const token = localStorage.getItem('token'); 
          const usuario = JSON.parse(localStorage.getItem('usuario')); 
          console.log("usuarioid   :" + usuario.id + "token" + token);
        
          await axios.put(`http://localhost:3000/api/rutinas/${modalData._id}`, formattedData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'User-ID': usuario.id
            }
          });
        } else {
          const token = localStorage.getItem('token'); 
          const usuario = JSON.parse(localStorage.getItem('usuario')); 
          console.log("usuarioid   :" + usuario.id + "token" + token);
        
          await axios.post('http://localhost:3000/api/rutinas', formattedData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'User-ID': usuario.id
            }
          });
        }
        listarRutinas();
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

    const deshabilitarRutina = async (id) => {
      const confirmacion = window.confirm('¿Estás seguro de que deseas deshabilitar esta rutina?');

      if(!confirmacion) return;

      try {
        const token = localStorage.getItem('token'); 
        const usuario = JSON.parse(localStorage.getItem('usuario')); 
        console.log("usuarioid   :" + usuario.id + "token" + token);
        
        await axios.put(`http://localhost:3000/api/rutinas/${id}/deshabilitar`, null, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'User-ID': usuario.id
          }
        });
        listarRutinas();
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
                <Typography component="h1" variant="h5">Rutinas</Typography>
                <Box sx={{ display: 'flex', width: '100%', mb: 2 }}>
                  <TextField
                    label="Filtrar"
                    variant="outlined"
                    value={filter}
                    onChange={filtrarTabla}
                    sx={{ width: '300px', marginRight: '20px' }}
                  />
                  <Button variant="contained" color="primary" onClick={() => abrirModal(false)}>Crear</Button>
                  <Button variant="contained" color="secondary" onClick={() => abrirModal(true, rutinaSeleccionada)} disabled={!rutinaSeleccionada} sx={{'&.Mui-disabled': {backgroundColor: '#757575', color: '#bdbdbd'}}}>Editar</Button>
                  <Button variant="contained" color="error" onClick={() => deshabilitarRutina(rutinaSeleccionada._id)} disabled={!rutinaSeleccionada} sx={{'&.Mui-disabled': {backgroundColor: '#ff5252', color: '#ff8a80'}}}>Eliminar</Button>
                </Box>
                {loading ? (
                  <CircularProgress />
                ) : (
                  rutinasFiltradas.length > 0 ? (
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Categoría</TableCell>
                            <TableCell>Ejercicios</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rutinasFiltradas.map((rutina) => (
                            <TableRow
                              key={rutina._id}
                              onClick={() => setSelectedRutina(rutinaSeleccionada?._id === rutina._id ? null : rutina)}
                              selected={rutinaSeleccionada?._id === rutina._id}
                            >
                              <TableCell>{rutina.nombre}</TableCell>
                              <TableCell>{rutina.categoria}</TableCell>
                              <TableCell>
                                <div>
                                  {rutina.ejercicios.map(ejercicio => (
                                    <li key={ejercicio._id}>{ejercicio.nombre}</li>
                                    ))}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography variant="h6">No se encontraron rutinas</Typography>
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
                onChange={manejarCambioCategoria}
              />
              <FormControl fullWidth margin="dense">
                <InputLabel style={{ color: '#CCD2E5' }}>Ejercicios</InputLabel>
                <Select
                  id="ejercicios"
                  name="ejercicios"
                  multiple
                  value={modalData.ejercicios.map(ejercicio => ejercicio._id)}
                  onChange={manejarCambioDeInput}
                  displayEmpty
                  sx={{ backgroundColor: 'white', color: 'black'}}
                >
                  <MenuItem value="" disabled>
                    Selecciona un ejercicio
                  </MenuItem>
                  {ejerciciosFiltrados.map(ejercicio => (
                    <MenuItem
                      key={ejercicio._id}
                      value={ejercicio._id}
                      sx={{
                        '&.Mui-selected': {
                          backgroundColor: '#273C75', 
                          color: 'white', 
                        },
                        '&.Mui-selected:hover': {
                          backgroundColor: 'blue',
                        },
                      }}
                    >
                      {ejercicio.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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

export default Rutinas;