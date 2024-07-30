import React, { useEffect, useState } from 'react';
import { Box, Typography, CssBaseline, FormControl, InputLabel, Select, MenuItem, Button, Grid, 
  Paper, List, ListItem, ListItemText, Collapse, ListItemButton, ListSubheader, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Modal, Checkbox } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axios from 'axios';
import YouTube from 'react-youtube';
import ReactPlayer from 'react-player';
import { red } from '@mui/material/colors';

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

const VerRutinas = () => {
  const [usuarioId, setUsuarioId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [exercisesByRutina, setExercisesByRutina] = useState({});
  const [expandedRutina, setExpandedRutina] = useState(null);
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [editMode, setEditMode] = useState({});
  const [tempCompletado, setTempCompletado] = useState({});
  const [tempObservaciones, setTempObservaciones] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario && usuario.id) {
      setUsuarioId(usuario.id);
    }
  }, []);

  useEffect(() => {
    if (usuarioId && selectedDate) {
      fetchExercises();
    }
  }, [usuarioId, selectedDate]);

  const fetchExercises = async () => {
    try {
      if (!usuarioId) {
        throw new Error('El ID del usuario no está definido');
      }
      const response = await axios.get('http://localhost:3000/api/rutina_ej_alumno/usuario', {
        params: { usuario: usuarioId, fecha: selectedDate.format('YYYY-MM-DD') }
      });
      const ejercicios = response.data;
      if (!Array.isArray(ejercicios)) {
        throw new Error("La respuesta de la API no es un array");
      }

      const rutinaEjercicios = ejercicios.reduce((acc, ejercicio) => {
        const rutinaId = ejercicio.rutina._id;
        if (!acc[rutinaId]) {
          acc[rutinaId] = {
            rutinaNombre: ejercicio.rutina.nombre,
            rutinaId: ejercicio.rutina._id,
            ejercicios: []
          };
        }
        ejercicio.ejercicios.map((ej) => {
            acc[rutinaId].ejercicios.push(ej)
        })
        //console.log(acc);
        return acc;
      }, {});
      
      setExercisesByRutina(rutinaEjercicios);
      
    } catch (error) {
      console.error('Error al obtener los ejercicios del usuario:', error);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleRutinaClick = (rutinaId) => {
    setExpandedRutina(expandedRutina === rutinaId ? null : rutinaId);
  };

  const abrirVideoModal = (videoUrl) => {
    setVideoUrl(videoUrl);
    setOpenVideoModal(true);
  };

  const cerrarVideoModal = () => {
    setVideoUrl('');
    setOpenVideoModal(false);
  };

  const handleEditClick = (rutinaId, ejercicioId) => {
    setEditMode({ ...editMode, [ejercicioId]: true });
    setTempCompletado({ ...tempCompletado, [ejercicioId]: exercisesByRutina[rutinaId].ejercicios.find(e => e._id === ejercicioId).completado });
    setTempObservaciones({ ...tempObservaciones, [ejercicioId]: '' });
  };

  const handleCheckboxChange = (ejercicioId, checked) => {
    setTempCompletado((prev) => ({ ...prev, [ejercicioId]: checked }));
  };

  const handleConfirmClick = async (rutinaId, ejercicioId) => {
    try {
      const existingObservaciones = exercisesByRutina[rutinaId].ejercicios.find(e => e._id === ejercicioId).observaciones || '';
      const newObservacion = tempObservaciones[ejercicioId] ? tempObservaciones[ejercicioId].trim() : '';

      // Formatear las observaciones agregando un salto de línea entre cada comentario
      const updatedObservaciones = newObservacion 
        ? existingObservaciones + (existingObservaciones ? '\n\n' : '') + newObservacion
        : existingObservaciones;
    
      const updatedExercise = {
        ...exercisesByRutina[rutinaId].ejercicios.find(e => e._id === ejercicioId),
        completado: tempCompletado[ejercicioId],
        observaciones: updatedObservaciones
      };
    
      await axios.put(`http://localhost:3000/api/rutina_ej_alumno/${ejercicioId}`, updatedExercise);
    
      const updatedExercisesByRutina = { ...exercisesByRutina };
      const ejercicioIndex = updatedExercisesByRutina[rutinaId].ejercicios.findIndex(e => e._id === ejercicioId);
      updatedExercisesByRutina[rutinaId].ejercicios[ejercicioIndex] = updatedExercise;
    
      setExercisesByRutina(updatedExercisesByRutina);
      setEditMode({ ...editMode, [ejercicioId]: false });
    } catch (error) {
      console.error('Error al actualizar el ejercicio:', error);
    }
  };
  
  const handleCancelClick = (ejercicioId) => {
    setEditMode({ ...editMode, [ejercicioId]: false });
    // Opcional: Resetear tempCompletado y tempObservaciones si es necesario
    setTempCompletado((prev) => {
      const { [ejercicioId]: removed, ...rest } = prev;
      return rest;
    });
    setTempObservaciones((prev) => {
      const { [ejercicioId]: removed, ...rest } = prev;
      return rest;
    });
  };

  const handleObservacionesChange = (ejercicioId, newObservacion) => {
    setTempObservaciones({ ...tempObservaciones, [ejercicioId]: newObservacion });
  };

  if (!usuarioId) {
    return <Typography variant="h6">Cargando...</Typography>;
  } 

  return (
    <ThemeProvider theme={tema}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid item xs={12} component={Paper} elevation={6} square>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', p: 2 }}>
              <Typography variant="h5" component="h1" gutterBottom>
                Visualizar Rutinas
              </Typography>
              <DatePicker
                value={selectedDate}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} />}
                slotProps={{
                  textField: {
                    sx: {
                      '& input': {
                        color: '#000000',
                      },
                      borderRadius: '2px',
                      borderWidth: '1px',
                      borderColor: '#e91e63',
                      border: '1px solid',
                      backgroundColor: '#FFFFFF',
                      width: '300px',
                    }
                  }
                }}
              />
              <List>
                {Object.values(exercisesByRutina).map((rutinaData) => (
                  <React.Fragment key={rutinaData.rutinaId}>
                    <ListItem button onClick={() => handleRutinaClick(rutinaData.rutinaId)}>
                      <ListItemText primary={rutinaData.rutinaNombre || 'Nombre no disponible'} />
                    </ListItem>
                    <Collapse in={expandedRutina === rutinaData.rutinaId} timeout="auto" unmountOnExit>
                      <TableContainer component={Paper} sx={{ mt: 2, overflowX: 'auto', overflowY: 'hidden' }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Nombre</TableCell>
                              <TableCell>Categoría</TableCell>
                              <TableCell>Músculo Principal</TableCell>
                              <TableCell>Descripción</TableCell>
                              <TableCell>Video</TableCell>
                              <TableCell>Series</TableCell>
                              <TableCell>Repeticiones</TableCell>
                              <TableCell>Peso</TableCell>
                              <TableCell>Observaciones</TableCell>
                              <TableCell>Completado</TableCell>
                              <TableCell>Acciones</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {rutinaData.ejercicios.map((ejercicioData) => {
                              const { _id, ejercicio, completado, fecha, observaciones, peso, repeticiones, series } = ejercicioData;
                              const isEditMode = editMode[_id] || false;
                              return (
                                <TableRow key={_id}>
                                  <TableCell>{ejercicio?.nombre || 'Nombre no disponible'}</TableCell>
                                  <TableCell>{ejercicio?.categoria || 'No disponible'}</TableCell>
                                  <TableCell>{ejercicio?.musculoPpal || 'No disponible'}</TableCell>
                                  <TableCell>{ejercicio?.descripcion || 'No disponible'}</TableCell>
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
                                  <TableCell>{series || 'No disponible'}</TableCell>
                                  <TableCell>{repeticiones || 'No disponible'}</TableCell>
                                  <TableCell>{peso || 'No disponible'}</TableCell>
                                  <TableCell>
                                    {isEditMode ? (
                                      <TextField
                                        value={tempObservaciones[_id]}
                                        onChange={(e) => handleObservacionesChange(_id, e.target.value)}
                                        multiline
                                        rows={4}
                                        disabled={!isEditMode}
                                        InputProps={{
                                          sx: {
                                            backgroundColor: 'white',
                                            color: 'black'
                                          },
                                        }}
                                      />
                                    ) : (
                                      <Typography>
                                        {observaciones.split('\n\n').map((line, index) => (
                                          <p key={index}>{line}</p>
                                        ))}
                                      </Typography>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {isEditMode ? (
                                      <Checkbox
                                        checked={tempCompletado[_id] !== undefined ? tempCompletado[_id] : false}
                                        onChange={(e) => handleCheckboxChange(_id, e.target.checked)}
                                        sx={{
                                          color: 'white',
                                          '&.Mui-checked': {
                                            color: 'white',
                                          },
                                          '& .MuiSvgIcon-root': {
                                            color: 'white',
                                          },
                                        }}
                                      />
                                    ) : (
                                      <Checkbox checked={completado} disabled 
                                        sx={{
                                          color: '#868686',
                                          '&.Mui-checked': {
                                            color: '#868686',
                                          },
                                          '& .MuiSvgIcon-root': {
                                            color: '#868686',
                                          },
                                        }}
                                      />
                                      
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {isEditMode ? (
                                      <>
                                        <Button
                                          variant="contained"
                                          color="primary"
                                          onClick={() => handleConfirmClick(rutinaData.rutinaId, _id)}
                                        >
                                          Confirmar
                                        </Button>
                                        <Button
                                          variant="contained"
                                          color="error"
                                          onClick={() => handleCancelClick(_id)}
                                        >
                                          Cancelar
                                        </Button>
                                      </>
                                    ) : (
                                      <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleEditClick(rutinaData.rutinaId, _id)}
                                      >
                                        Editar
                                      </Button>
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Collapse>
                  </React.Fragment>
                ))}
              </List>
            </Box>
          </LocalizationProvider>
        </Grid>
      </Grid>
      <Modal open={openVideoModal} onClose={cerrarVideoModal}>
        <Box sx={{ width: '100%', maxWidth: '800px', maxHeight: '100vh', overflowY: 'auto', mx: 'auto', my: 'auto' }}>
          <Typography variant="h5" align="center" mb={2}>Video del Ejercicio</Typography>
          <Box display="flex" justifyContent="center">
            <YouTube videoId={videoUrl.split('v=')[1]} opts={{ width: '800', height: '480' }} />
          </Box>
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

export default VerRutinas;