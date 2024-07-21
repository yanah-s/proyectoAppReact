import React, { useState, useEffect  } from 'react';
import api from '../configuracion/axiosconfig';
import { Alert, AlertTitle, Button, CssBaseline, CircularProgress, TextField, Grid, Paper, Box, Snackbar, Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, MenuItem, Select, FormControl, InputLabel, 
    Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { format } from 'date-fns';
import { Tabs, Tab } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Api, AppRegistration } from '@mui/icons-material';

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
  MuiTableCell: {
    styleOverrides: {
      root: {
        whiteSpace: 'normal',
        wordWrap: 'break-word',
      },
    },
  },
});

const Rutinas = () => {
    const [activeTab, setActiveTab] = useState('crear');
    const [rutinas, setRutinas] = useState([]);
    const [rutinasFiltradas, setFilteredRutinas] = useState([]);
    const [rutinaSeleccionada, setSelectedRutina] = useState(null);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState({
      nombre: '', categoria: '', ejercicios: []
    });
    const [openAsignarModal, setOpenAsignarModal] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDates, setSelectedDates] = useState([]);
    const [tempDate, setTempDate] = useState(null);
    const [alerta, setAlertOpen] = useState(false);
    const [mensajeAlerta, setAlertMessages] = useState([]);
    const [editado, setIsEdit] = useState(false);
    const [categoria, setCategoria] = useState(modalData.categoria || '');
    const [ejerciciosFiltrados, setEjerciciosFiltrados] = useState([]);
    const [showExercises, setShowExercises] = useState(false);
    const [ejercicios, setEjercicios] = useState([]);
    const [exercisesData, setExercisesData] = useState([]);
    const [userExercisesData, setUserExercisesData] = useState([]);
    const [userExercisesDataFiltrado, setUserExercisesDataFiltrado] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [alertaCrear, setAlertaCrear] = useState(false);
    const [mensajeAlertaCrear, setMensajeAlertaCrear] = useState('');
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('');
    const [selectedExerciseData, setSelectedExerciseData] = useState(null);
    const [usuarios, setUsuarios] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [ejerciciosUsuario, setEjerciciosUsuario] = useState([]);
  
    useEffect(() => {
      listarRutinas();
      //listarUsuarios();
      if (categoria) {
        console.log("Fetching ejercicios for categoría:", categoria);
        api.get(`/api/ejercicio/categoria`, { params: { categoria } })
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
          
          const response = await api.get('/api/ejercicio/categoria', {
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

    const handleUsuarioChange = async (event) => {
      let usuarioId ="";
      if(event){
        usuarioId = event.target.value;
        setUsuarioSeleccionado(usuarioId);

      }else{
        usuarioId = usuarioSeleccionado;
      }
    
      console.log(usuarioId);
      if (usuarioId) {
        try { 
          const token = localStorage.getItem('token'); 
          const usuario = JSON.parse(localStorage.getItem('usuario')); 
          const response = await api.get('/api/rutina_ej_alumno/usuario',  {
            params: { usuario: usuarioId }
          });
          console.log(response);
          setUserExercisesData(response.data);
          setUserExercisesDataFiltrado(response.data);
        } catch (error) {
          console.error('Error al obtener los ejercicios del usuario:', error);
        }
      } else {
        setUserExercisesData([]);
      }
    };

    const handleTabSelect = (k) => {
      setActiveTab(k);
      if (k === 'asignar') {
        setUsuarioSeleccionado(""); 
      }
    };
  
    const listarRutinas = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token'); 
        const usuario = JSON.parse(localStorage.getItem('usuario')); 
        console.log("usuarioid   :" + usuario.id + "token" + token);

        const response = await api.get('/api/rutinas', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'User-ID': usuario.id
          }
        });
        console.log(usuario);
        const rutinas = response.data.filter(rutina => rutina.disponible);
        setRutinas(rutinas);
        setFilteredRutinas(rutinas);
      } catch (err) {
        console.error('Error listando rutinas:', err);
      } finally {
        setLoading(false);
      }
    };

    const listarUsuarios = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const usuario = JSON.parse(localStorage.getItem('usuario')); 

        const response = await api.get('/api/usuarios', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'User-ID': usuario.id
          }
        });
        setUsuarios(response.data);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };

    const handleAddDate = (date) => {
      if (date && !selectedDates.some(d => dayjs(d).isSame(date, 'day'))) {
        setSelectedDates([...selectedDates, date]);
      }
      setTempDate(null);
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES');
    };
  
    const handleDeleteDate = (dateToDelete) => {
      setSelectedDates(selectedDates.filter(date => !dayjs(date).isSame(dateToDelete, 'day')));
    };
  
    const handleContinue = () => {
      if (!selectedDates.length || !rutinaSeleccionada) {
        setMensajeAlertaCrear('Debe completar todos los campos.');
        setAlertaCrear(true);
        return;
      }
    
      // Encuentra la rutina completa a partir del ID
      const selectedRutinaObj = rutinas.find(rutina => rutina._id === rutinaSeleccionada);
    
      // Verifica si la rutina seleccionada tiene la propiedad 'ejercicios'
      if (selectedRutinaObj && selectedRutinaObj.ejercicios) {
        setExercisesData(selectedRutinaObj.ejercicios.map(ejercicio => ({
          ...ejercicio,
          series: '',
          repeticiones: '',
          observaciones: ''
        })));
        setShowExercises(true);
      } else {
        // Maneja el caso en el que no se encontraron ejercicios
        console.error('La rutina seleccionada no tiene ejercicios.');
        setMensajeAlertaCrear('Error al seleccionar la rutina. Por favor, inténtelo de nuevo.');
        setAlertaCrear(true);
      }
    };

    const abrirModalAsignar = () => {
      setTempDate(null);
      setSelectedDates([]);
      setSelectedRutina(null);
      setOpenAsignarModal(true);
    }

    const handleOpenModal = () => {
      const selectedData = userExercisesData[selectedRow];
      setSelectedExerciseData({
        ...selectedData,
        fecha: formatDate(selectedData.fecha)
      });
      setIsModalOpen(true);
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
      setSelectedExerciseData(null);
    };

    const handleSave = async () => {
      try {
        for (const date of selectedDates) {
          for (const ejercicio of exercisesData) {
            await api.post('/api/rutina_ej_alumno', {
              usuario: usuarioSeleccionado,
              fecha: new Date(date).toISOString(), // Asegúrate de que la fecha esté en formato ISO
              rutina: rutinaSeleccionada,
              ejercicio: ejercicio._id,
              series: Number(ejercicio.series),
              repeticiones: Number(ejercicio.repeticiones),
              peso: Number(ejercicio.peso),
              observaciones: ejercicio.observaciones || '',
              completado: false
            });
          }
        }
        setOpenAsignarModal(false);
        setShowExercises(false);
        handleUsuarioChange();
      } catch (error) {
        const errors = error.response && error.response.data && error.response.data.error 
          ? error.response.data.error 
          : [{ message: 'Error desconocido al procesar la solicitud.' }];
            
        setAlertMessages(errors);
        setAlertOpen(true);
      }
    };
  
    const handleEdit = async () => {
      try {
        await api.put(`api/rutina_ej_alumno/${selectedExerciseData._id}`, selectedExerciseData);
        const updatedData = [...userExercisesData];
        updatedData[selectedRow] = selectedExerciseData;
        setUserExercisesData(updatedData);
        handleCloseModal();
        handleUsuarioChange();
      } catch (error) {
        const errors = error.response && error.response.data && error.response.data.error 
          ? error.response.data.error 
          : [{ message: 'Error desconocido al procesar la solicitud.' }];
            
        setAlertMessages(errors);
        setAlertOpen(true);
      }
    };

    const handleDelete = async () => {
      if (selectedRow !== null) {
        try {
          const selectedData = userExercisesData[selectedRow];
          await api.delete(`/api/rutina_ej_alumno/${selectedData._id}`);
          const updatedData = userExercisesData.filter((_, index) => index !== selectedRow);
          setUserExercisesData(updatedData);
          setSelectedRow(null);
          setIsDialogOpen(false);
          handleUsuarioChange();
        } catch (error) {
          console.error('Error al eliminar el ejercicio:', error);
        }
      }
    };

    const handleOpenDialog = () => {
      setIsDialogOpen(true);
    };
  
    const handleCloseDialog = () => {
      setIsDialogOpen(false);
    };

    const filtrarTabla = (e) => {
      const value = e.target.value;
      setFilter(value);
      if (value.length >= 3) {
        const filtered = rutinas.filter(rutina =>{
          const nombre = rutina.nombre?.toLowerCase().includes(value.toLowerCase());
          const categoria = rutina.categoria?.toLowerCase().includes(value.toLowerCase());
          const ejercicios = Array.isArray(rutina.ejercicios) &&
          rutina.ejercicios.some(ejercicio => ejercicio.nombre?.toLowerCase().includes(value));

          return nombre || categoria || ejercicios;
        });
        setFilteredRutinas(filtered);
      } else {
        setFilteredRutinas(rutinas);
      }
    };

    const filtrarTablaAsignar = (e) => {
      const value = e.target.value;
      setFilter(value);
      if (value.length >= 3) {
        const filtered = userExercisesData.filter(ejercicio =>{
          console.log(ejercicio);
          const rutina = ejercicio.rutina.nombre?.toLowerCase().includes(value.toLowerCase());
          const nombre = ejercicio.ejercicio.nombre?.toLowerCase().includes(value.toLowerCase());
          const series = ejercicio.series?.toString().toLowerCase().includes(value.toLowerCase());
          const repeticiones = ejercicio.repeticiones?.toString().toLowerCase().includes(value.toLowerCase());
          const observaciones = ejercicio.observaciones?.toLowerCase().includes(value.toLowerCase());
          const fecha = new Date(ejercicio.fecha).toLocaleDateString('es-ES').includes(value.toLowerCase());

          return rutina || nombre || series || repeticiones || observaciones || fecha;
        });
        setUserExercisesDataFiltrado(filtered);
      } else {
        setUserExercisesDataFiltrado(userExercisesData);
      }
    };

    const handleRowSelect = (index) => {
      if (selectedRow === index) {
        setSelectedRow(null);  
      } else {
        setSelectedRow(index); 
      }
    };
  
    const handleEditClick = () => {
      setIsEditing(true);
    };
  
    const handleSaveClick = async () => {
      setIsEditing(false);
      if (selectedRow !== null) {
        const updatedExercise = userExercisesData[selectedRow];
        try {
          await api.put(`/api/rutina_ej_alumno/${updatedExercise._id}`, updatedExercise);
          console.log('Updated successfully');
        } catch (error) {
          console.error('Error updating exercise:', error);
        }
      }
      setIsEditing(false);
    };
  
    const handleFieldChange = (index, field, value) => {
      const updatedData = [...userExercisesData];
      updatedData[index][field] = value;
      setUserExercisesData(updatedData);
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
      
          const response = await api.get('/api/ejercicio/categoria', {
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
        
          await api.put(`/api/rutinas/${modalData._id}`, formattedData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'User-ID': usuario.id
            }
          });
        } else {
          const token = localStorage.getItem('token'); 
          const usuario = JSON.parse(localStorage.getItem('usuario')); 
          console.log("usuarioid   :" + usuario.id + "token" + token);
        
          await api.post('/api/rutinas', formattedData, {
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
        
        await api.put(`/api/rutinas/${id}/deshabilitar`, null, {
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
          <Grid container component="main" sx={{ overflow: 'hidden' }}>
            <CssBaseline />
            <Grid item xs={12} component={Paper} elevation={6} square sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', height: '100%', p: 2  }}>
                <Tabs activeKey={activeTab} onSelect={handleTabSelect} className="mb-3">
                  <Tab eventKey="crear" title="Crear">
                    <Typography component="h1" variant="h5">Rutinas</Typography>
                    <Box sx={{ display: 'flex', width: '100%', mb: 2 }}>
                      <TextField
                        label="Filtrar"
                        variant="outlined"
                        value={filter}
                        onChange={filtrarTabla}
                        sx={{ width: '300px', marginRight: '20px', '& .MuiInputBase-root': { backgroundColor: 'white', color:'black'}, }}
                      />
                      <Button variant="contained" color="primary" onClick={() => abrirModal(false)}>Crear</Button>
                      <Button variant="contained" color="secondary" onClick={() => abrirModal(true, rutinaSeleccionada)} disabled={!rutinaSeleccionada} sx={{'&.Mui-disabled': {backgroundColor: '#757575', color: '#bdbdbd'}}}>Editar</Button>
                      <Button variant="contained" color="error" onClick={() => deshabilitarRutina(rutinaSeleccionada._id)} disabled={!rutinaSeleccionada} sx={{'&.Mui-disabled': {backgroundColor: '#ff5252', color: '#ff8a80'}}}>Eliminar</Button>
                    </Box>
                    {loading ? (
                      <CircularProgress />
                    ) : (
                      rutinasFiltradas.length > 0 ? (
                        <Box sx={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto' }}>
                          <TableContainer component={Paper} sx={{ width: '100%' }}>
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
                        </Box>
                      ) : (
                        <Typography variant="h6">No se encontraron rutinas</Typography>
                      )
                    )}
                  </Tab>
                  <Tab eventKey="asignar" title="Asignar">
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', p: 2  }}>
                    <Typography component="h1" variant="h5">Asignar Rutinas</Typography>
                    <FormControl fullWidth={false} margin="normal" sx={{ width: '300px' }}>
                      <Select
                        value={usuarioSeleccionado || ""} 
                        onChange={handleUsuarioChange}
                        onOpen={listarUsuarios}
                        displayEmpty
                        sx={{ backgroundColor: 'white', color: 'black !important'}}
                      >
                        <MenuItem value="" disabled>Selecciona un usuario</MenuItem>
                        {usuarios.map(usuario => (
                          <MenuItem key={usuario._id} value={usuario._id}>
                            {usuario.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {usuarioSeleccionado && (
                      <>
                        <Typography variant="h6"> Usuario: {usuarios.find(u => u._id === usuarioSeleccionado)?.nombre} </Typography>
                        <Box sx={{ display: 'flex', width: '100%', mb: 2 }}>
                          <TextField
                            label="Filtrar"
                            variant="outlined"
                            value={filter}
                            onChange={filtrarTablaAsignar}
                            sx={{ width: '300px', marginRight: '20px', '& .MuiInputBase-root': { backgroundColor: 'white', color: 'black'}, }}
                          />
                          <Button variant="contained" color="primary" onClick={abrirModalAsignar}>Crear</Button>
                          <Button variant="contained" color="secondary" onClick={handleOpenModal}  disabled={selectedRow === null} sx={{'&.Mui-disabled': {backgroundColor: '#757575', color: '#bdbdbd'}}}>Editar</Button>
                          <Button variant="contained" color="error" onClick={handleOpenDialog} disabled={selectedRow === null} sx={{'&.Mui-disabled': {backgroundColor: '#ff5252', color: '#ff8a80'}}}>Eliminar</Button>
                        </Box>
                        <Box sx={{ flex: 1, overflowY: 'auto' }}>
                          <TableContainer component={Paper} sx={{ width: '100%' }}>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Rutina</TableCell>
                                  <TableCell>Ejercicio</TableCell>
                                  <TableCell>Series</TableCell>
                                  <TableCell>Repeticiones</TableCell>
                                  <TableCell>Peso</TableCell>
                                  <TableCell>Observaciones</TableCell>
                                  <TableCell>Fecha</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {userExercisesDataFiltrado.map((ejercicio, index) => (
                                  <TableRow 
                                    key={ejercicio._id}
                                    onClick={() => handleRowSelect(index)}
                                    selected={index === selectedRow}
                                  >
                                    <TableCell>{ejercicio.rutina.nombre}</TableCell>
                                    <TableCell>{ejercicio.ejercicio.nombre}</TableCell>
                                    <TableCell>{ejercicio.series}</TableCell>
                                    <TableCell>{ejercicio.repeticiones}</TableCell>
                                    <TableCell>{ejercicio.peso}</TableCell>
                                    <TableCell>{ejercicio.observaciones}</TableCell>
                                    <TableCell>{formatDate(ejercicio.fecha) || ''}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      </>
                    )}
                  </Box>
                  </Tab>
                </Tabs>
              </Box>
            </Grid>
          </Grid>
          <Modal open={openModal} onClose={cerrarModal}>
            <Box sx={{ ...modalStyle, width: '80%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
              <Typography component="h2" variant="h6" sx={{ mb: 2, backgroundColor: 'transparent' }}>{editado ? 'Editar Ejercicio' : 'Crear Ejercicio'}</Typography>
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
          <Modal
            open={openAsignarModal}
            onClose={() => {setOpenAsignarModal(false); setShowExercises(false);}}
          >
            <Box sx={{ ...modalStyle, width: '80%', maxWidth: '1000px', maxHeight: '80vh', overflowY: 'auto' }}>
              <Typography variant="h6" component="h2" sx={{ mb: 2, backgroundColor: 'transparent' }}>
                {showExercises ? "Detalles de los Ejercicios" : "Asignar Rutinas"}
              </Typography>
              {showExercises ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Ejercicio</TableCell>
                        <TableCell>Series</TableCell>
                        <TableCell>Repeticiones</TableCell>
                        <TableCell>Peso</TableCell>
                        <TableCell>Observaciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {exercisesData.map((ejercicio, index) => (
                        <TableRow key={ejercicio._id}>
                          <TableCell>{ejercicio.nombre}</TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              value={ejercicio.series || ''}
                              onChange={(e) => {
                                const newExercisesData = [...exercisesData];
                                newExercisesData[index].series = e.target.value;
                                setExercisesData(newExercisesData);
                              }}
                              sx={{
                                '& .MuiInputBase-input': {
                                  padding: '4px 0 5px !important', // Ajusta el padding aquí
                                },
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              value={ejercicio.repeticiones || ''}
                              onChange={(e) => {
                                const newExercisesData = [...exercisesData];
                                newExercisesData[index].repeticiones = e.target.value;
                                setExercisesData(newExercisesData);
                              }}
                              sx={{
                                '& .MuiInputBase-input': {
                                  padding: '4px 0 5px !important',
                                },
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              value={ejercicio.peso || ''}
                              onChange={(e) => {
                                const newExercisesData = [...exercisesData];
                                newExercisesData[index].peso = e.target.value;
                                setExercisesData(newExercisesData);
                              }}
                              sx={{
                                '& .MuiInputBase-input': {
                                  padding: '4px 0 5px !important', // Ajusta el padding aquí
                                },
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={ejercicio.observaciones || ''}
                              onChange={(e) => {
                                const newExercisesData = [...exercisesData];
                                newExercisesData[index].observaciones = e.target.value;
                                setExercisesData(newExercisesData);
                              }}
                              sx={{
                                '& .MuiInputBase-input': {
                                  padding: '4px 0 5px !important', // Ajusta el padding aquí
                                },
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <DatePicker
                        value={tempDate}
                        onChange={(date) => handleAddDate(date)}
                        label="Seleccionar Fechas"
                        slotProps={{
                          textField: {
                            sx: {
                              '& input': {
                                color: '#000000', // Cambia el color del texto del input
                              },
                              borderRadius: '2px',
                              borderWidth: '1px',
                              borderColor: '#e91e63',
                              border: '1px solid',
                              backgroundColor: '#FFFFFF',
                              width: '45%',
                            }
                          }
                        }} 
                      />
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {selectedDates.map((date, index) => (
                          <Chip 
                            key={index}
                            label={dayjs(date).format('DD/MM/YYYY')}
                            onDelete={() => handleDeleteDate(date)}
                          />
                        ))}
                      </Box>
                    </Box>
                  </LocalizationProvider>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Seleccionar Rutina</InputLabel>
                    <Select
                      value={rutinaSeleccionada || ""} // Usa solo el ID de la rutina
                      onChange={(e) => {
                        setSelectedRutina(e.target.value); // Actualiza solo con el ID
                      }}
                      sx={{
                        backgroundColor: 'white',
                        '& .MuiSelect-select': {
                          backgroundColor: 'white',
                          color: 'black',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'black',
                        },
                        '& .MuiInputLabel-root': {
                          color: 'black !important',
                        },
                        '& .MuiMenuItem-root': {
                          backgroundColor: 'white',
                          color: 'black',
                          '&:hover': {
                            backgroundColor: '#f5f5f5',
                          },
                        },
                        width: '45%',
                      }}
                    >
                      {rutinas.map((rutina) => (
                        <MenuItem key={rutina._id} value={rutina._id}>
                          {rutina.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              )}
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                {showExercises ? (
                  <Button variant="contained" color="primary" onClick={handleSave}>
                    Guardar
                  </Button>
                ) : (
                  <Button variant="contained" color="primary" onClick={handleContinue}>
                    Continuar
                  </Button>
                )}
              </Box>
            </Box>
          </Modal>
          <Modal
            open={isModalOpen}
            onClose={handleCloseModal}
          >
            <Box sx={{ ...modalStyle, width: '80%', maxWidth: '1000px', maxHeight: '80vh', overflowY: 'auto' }}>
              <Typography variant="h6" component="h2" sx={{ mb: 2, backgroundColor: 'transparent' }}>Editar ejercicio</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ejercicio</TableCell>
                    <TableCell>Series</TableCell>
                    <TableCell>Repeticiones</TableCell>
                    <TableCell>Peso</TableCell>
                    <TableCell>Observaciones</TableCell>
                    <TableCell>Fecha</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{selectedExerciseData?.ejercicio.nombre}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={selectedExerciseData?.series || ''}
                        onChange={(e) => setSelectedExerciseData(prev => ({ ...prev, series: e.target.value }))}
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '4px 0 5px !important', // Ajusta el padding aquí
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={selectedExerciseData?.repeticiones || ''}
                        onChange={(e) => setSelectedExerciseData(prev => ({ ...prev, repeticiones: e.target.value }))}
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '4px 0 5px !important', // Ajusta el padding aquí
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={selectedExerciseData?.peso || ''}
                        onChange={(e) => setSelectedExerciseData(prev => ({ ...prev, peso: e.target.value }))}
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '4px 0 5px !important', // Ajusta el padding aquí
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={selectedExerciseData?.observaciones || ''}
                        onChange={(e) => setSelectedExerciseData(prev => ({ ...prev, observaciones: e.target.value }))}
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: '4px 0 5px !important', // Ajusta el padding aquí
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>{selectedExerciseData?.fecha || ''}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" color="primary" onClick={handleEdit}>Editar</Button>
              </Box>
            </Box>
          </Modal>
          <Dialog
            open={isDialogOpen}
            onClose={handleCloseDialog}
          >
            <DialogTitle sx={{ mb: 2, backgroundColor: 'transparent' }}>Confirmar Eliminación</DialogTitle>
            <DialogContent>
              <DialogContentText>
                ¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={handleCloseDialog} color="primary">
                Cancelar
              </Button>
              <Button variant="contained" onClick={handleDelete} color="error">
                Confirmar
              </Button>
            </DialogActions>
          </Dialog>
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