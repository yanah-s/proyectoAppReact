import React, { useState, useEffect } from 'react';
import api from '../configuracion/axiosconfig';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Button, Modal, Table, TableContainer, TableHead, TableRow, TableBody, TableCell, Select, 
  MenuItem, TextField, Checkbox, Grid, Paper, Box, CssBaseline, Typography, InputLabel, Divider, 
  FormControlLabel, FormControl  } from '@mui/material';

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
  MuiTableCell: {
    styleOverrides: {
      root: {
        whiteSpace: 'normal',
        wordWrap: 'break-word',
      },
    },
  },
});

const ObjetivosMetas = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [objetivos, setObjetivos] = useState([]);
  const [metas, setMetas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('');
  const [availableMetas, setAvailableMetas] = useState([]);
  const [objetivosMetas, setObjetivosMetas] = useState([]);
  const [metaSeleccionada, setMetaSeleccionada] = useState(null);
  const [objetivoSeleccionado, setObjetivoSeleccionado] = useState(null);
  const [modalData, setModalData] = useState({
    meta: '', fechaDesde: '', fechaHasta: '', valor: '', cumplido: false});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMetaId, setSelectedMetaId] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [valor, setValor] = useState(0);
  const [cumplido, setCumplido] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  // const [newObjectiveMeta, setNewObjectiveMeta] = useState({
  //   nombre: '',
  //   fechaInicio: '',
  //   fechaFin: '',
  //   valor: 0,
  //   esAdmin: false,
  //   completado: false,
  // });

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    console.log(usuario);
    if(usuario.admin){
      setIsAdmin(true);

    }else{
      setUsuarioSeleccionado(usuario.id);
      fetchMetas(usuario.id);
    }

    cargarMetas();    
  }, []);

  const cargarMetas = async () =>{
    try {
      const token = localStorage.getItem('token'); 
      const usuario = JSON.parse(localStorage.getItem('usuario')); 
      const response =await api.get('api/objetivo_meta', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-ID': usuario.id
        }
      });
      setAvailableMetas(response.data);
    } catch (error) {
      console.error('Error fetching available metas', error);
    }
  }


  const fetchMetas = async (usuarioId) => {
    try {
      const token = localStorage.getItem('token'); 
      const usuario = JSON.parse(localStorage.getItem('usuario')); 
      const response = await api.get('api/objetivo_meta_usuario/usuario', {
        params: { usuario: usuarioId },
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-ID': usuario.id
        }
      });
      const objetivos = [];
      const metas = [];

      response.data.forEach(item => {
        if (item.creadoAdmin) {
          objetivos.push(item);
        } else {
          metas.push(item);
        }
      });

      setObjetivos(objetivos);
      setMetas(metas);
    } catch (error) {
      console.error('Error fetching metas', error);
    }
  };

  const listarUsuarios = async () => {
    try {
      const token = localStorage.getItem('token'); 
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      // const response = await api.get('api/usuarios', {
      const response = await api.get('/api/usuarios/alumnos', {
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

  // const handleCreateUserMeta = async () => {
  //   try {

  //     if (isEdit) {
  //       if(!isAdmin){
  //         await axios.put(`http://localhost:3000/api/objetivo_meta_usuario/${metaSeleccionada._id}`, {
  //           fechaDesde: new Date(formatDate2(modalData.fechaDesde)).toISOString(),
  //           fechaHasta: new Date(formatDate2(modalData.fechaHasta)).toISOString(),
  //           valor: modalData.valor,
  //           cumplido: modalData.cumplido, // Este sería el checkbox "cumplida"
  //         });
  //       }else{
  //         await axios.put(`http://localhost:3000/api/objetivo_meta_usuario/${objetivoSeleccionado._id}`, {
  //           fechaDesde: new Date(formatDate2(modalData.fechaDesde)).toISOString(),
  //           fechaHasta: new Date(formatDate2(modalData.fechaHasta)).toISOString(),
  //           valor: modalData.valor,
  //           cumplido: modalData.cumplido, // Este sería el checkbox "cumplida"
  //         });
  //       }
        
  //     } else {
  //       await axios.post('http://localhost:3000/api/objetivo_meta_usuario', {
  //         objetivoMeta: modalData.objetivoMeta._id,
  //         usuario: usuarioSeleccionado,
  //         fechaDesde: new Date(formatDate2(modalData.fechaDesde)).toISOString(),
  //         fechaHasta: new Date(formatDate2(modalData.fechaHasta)).toISOString(),
  //         valor: modalData.valor,
  //         creadoAdmin: isAdmin,
  //         cumplido: false,
  //       });
  //     }
  //     fetchMetas(usuarioSeleccionado);
  //     setModalOpen(false);
  //   } catch (error) {
  //     console.error('Error creating user meta', error);
  //   }
  // };

  const handleCreateUserMeta = async () => {
    try {
      const token = localStorage.getItem('token'); 
      const usuario = JSON.parse(localStorage.getItem('usuario')); 
      const headers = {
        'Authorization': `Bearer ${token}`,
        'User-ID': usuario.id
      };
  
      if (isEdit) {
        if (!isAdmin) {
          await api.put(`api/objetivo_meta_usuario/${metaSeleccionada._id}`, {
            fechaDesde: new Date(formatDate2(modalData.fechaDesde)).toISOString(),
            fechaHasta: new Date(formatDate2(modalData.fechaHasta)).toISOString(),
            valor: modalData.valor,
            cumplido: modalData.cumplido, // Este sería el checkbox "cumplida"
          }, {
            headers
          });
        } else {
          await api.put(`api/objetivo_meta_usuario/${objetivoSeleccionado._id}`, {
            fechaDesde: new Date(formatDate2(modalData.fechaDesde)).toISOString(),
            fechaHasta: new Date(formatDate2(modalData.fechaHasta)).toISOString(),
            valor: modalData.valor,
            cumplido: modalData.cumplido, // Este sería el checkbox "cumplida"
          }, {
            headers
          });
        }
      } else {
        await api.post('api/objetivo_meta_usuario', {
          objetivoMeta: modalData.objetivoMeta._id,
          usuario: usuarioSeleccionado,
          fechaDesde: new Date(formatDate2(modalData.fechaDesde)).toISOString(),
          fechaHasta: new Date(formatDate2(modalData.fechaHasta)).toISOString(),
          valor: modalData.valor,
          creadoAdmin: isAdmin,
          cumplido: false,
        }, {
          headers
        });
      }
  
      fetchMetas(usuarioSeleccionado);
      setModalOpen(false);
    } catch (error) {
      console.error('Error creating user meta', error);
    }
  };

  const actualizarMeta = () =>{
    setSelectedMetaId(metaSeleccionada._id || ''); // Precargar el select con la meta seleccionada
    //setFechaInicio(formatDate(metaSeleccionada.fechaDesde) || '');
   // setFechaFin(formatDate(metaSeleccionada.fechaHasta) || '');
    setValor(metaSeleccionada.valor || 0);
    setCumplido(metaSeleccionada.cumplido || false);
    setModalOpen(true);
    
  } 

  const abrirModal = (editado = false, meta = null) => {
    setIsEdit(editado);
    if (editado && meta) {
      const metaFormateada = {
        ...meta,
        fechaDesde: formatDate(meta.fechaDesde),
        fechaHasta: formatDate(meta.fechaHasta),
      };
      setModalData(metaFormateada);
    } else {
      setModalData({
        objetivoMeta: '',
        fechaDesde: '',
        fechaHasta: '',
        valor: '',
        cumplido: false,
      });
    }
    setModalOpen(true);
  };

  const manejarCambioDeInput = (e) => {
    const { name, value, checked } = e.target;
  
    if (name === "meta") {
      setModalData((prevData) => ({
        ...prevData,
        objetivoMeta: { _id: value }, 
      }));
    } else if(name === "cumplido"){
      setModalData(prevState => ({
        ...prevState,
        [name]: checked, // `checked` es un booleano
      }));
    
    } else if (name === "fechaDesde" || name === "fechaHasta") {
      // Convertir la fecha de DD-MM-YYYY a YYYY-MM-DD
      const formattedDate = formatDate3(value);
      setModalData((prevData) => ({
        ...prevData,
        [name]: formattedDate,
      }));
    }else {
      setModalData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // useEffect(() => {
  //   fetchObjetivosMetas();
  // }, []);

  // const fetchObjetivosMetas = async () => {
  //   const response = await axios.get('/api/objetivosMetas');
  //   setObjetivosMetas(response.data);
  // };

  // const handleCreateOrEdit = async () => {
  //   if (selectedObjective) {
  //     await axios.put(`/api/objetivosMetas/${selectedObjective.id}`, newObjectiveMeta);
  //   } else {
  //     await axios.post('/api/objetivosMetas', newObjectiveMeta);
  //   }
  //   fetchObjetivosMetas();
  //   setModalOpen(false);
  // };
  const handleUsuarioChange = async (event) => {
    let usuarioId ="";
    if(event){
      usuarioId = event.target.value;
      setUsuarioSeleccionado(usuarioId);

    }else{
      usuarioId = usuarioSeleccionado;
    }
    if(usuarioId){
      fetchMetas(usuarioId);
    }
  }

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`; // Format as DD-MM-YYYY
  }

  const formatDate2 = (dateString) => {
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`; // Formato YYYY-MM-DD
}

const formatDate3 = (dateString) => {
  const [year, month, day] = dateString.split('-');
  return `${day}-${month}-${year}`; // Formato DD-MM-YYYY
};

const eliminarRegistro = async () =>{
  try {
    if(!isAdmin){
      await api.delete(`api/objetivo_meta_usuario/${metaSeleccionada._id}`);
    }else{
      await api.delete(`api/objetivo_meta_usuario/${objetivoSeleccionado._id}`);
    }
      
    fetchMetas(usuarioSeleccionado);

  } catch (error) {
    console.error('Error creating user meta', error);
  }
}
  
  const handleEdit = '';
  const handleDelete = '';
  const handleHideCompleted = '';
  
  return (
    <ThemeProvider theme={tema}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid item xs={12} component={Paper} elevation={6} square sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', height: '100%', p: 2  }}>
            {isAdmin && (
              <FormControl fullWidth={false} margin="normal" sx={{ width: '300px' }}>
              <Select
                value={usuarioSeleccionado || ""} 
                onChange={handleUsuarioChange}
                onOpen={listarUsuarios}
                displayEmpty
                // sx={{ backgroundColor: 'white', color: 'black !important'}}
                sx={{ 
                  // backgroundColor: '#424242', 
                  backgroundColor: tema.palette.background.paper,
                  color: 'white',
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                  '.MuiSvgIcon-root ': {
                    fill: 'white !important',
                  },
                  '.MuiList-root': {
                    // backgroundColor: '#424242',
                    backgroundColor: tema.palette.background.paper,
                    color: 'white',
                  },
                }}
              >
                <MenuItem value="" disabled>Selecciona un usuario</MenuItem>
                {usuarios.map(usuario => (
                  <MenuItem key={usuario._id} value={usuario._id}>
                    {usuario.nombre}
                  </MenuItem>
                ))}
              </Select>
              </FormControl>
            )}

            {usuarioSeleccionado || !isAdmin ? (
              <>
                <Box sx={{ border: '1px solid lightgray', borderRadius: 2, mb: 5, mt:5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography component="h1" variant="h5" sx={{ pl: 4, mt:1 }}>Objetivos</Typography>
                    {isAdmin && (
                      <Box>
                        <Button variant="contained" color="primary"onClick={() => {abrirModal(false)}} sx={{ ml: 4, mt:2 }}>Crear</Button>
                        <Button variant="contained" color="secondary"onClick={() => {abrirModal(true, objetivoSeleccionado)}} sx={{ ml: 1, mt:2, '&.Mui-disabled': {backgroundColor: '#757575', color: '#bdbdbd' }}} disabled={!objetivoSeleccionado}>Editar</Button>
                        <Button variant="contained" color="error"onClick={() => {eliminarRegistro(objetivoSeleccionado)}} sx={{ ml: 1, mt: 2,'&.Mui-disabled': {backgroundColor: '#ff5252', color: '#ff8a80'}}} disabled={!objetivoSeleccionado}>Eliminar</Button>
                      </Box>
                    )}
                  </Box>
                  <Divider sx={{ my: 2, borderColor: 'lightgray', opacity: 1 }}/>
                  {objetivos.filter((objetivo) => objetivo.creadoAdmin === true).length === 0 ? (
                    <p>Aún no tienes objetivos asignados.</p>
                  ) : (
                    <Box sx={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto' }}>
                      <TableContainer component={Paper} sx={{ width: '100%' }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Nombre</TableCell>
                              <TableCell>Fecha Ini</TableCell>
                              <TableCell>Fecha Fin</TableCell>
                              <TableCell>Valor</TableCell>
                              <TableCell>Completado</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {objetivos.filter((objetivo) => objetivo.creadoAdmin === true).map((objetivo) => (
                              <TableRow
                                key={objetivo._id}
                                onClick={() => {
                                  if (isAdmin) { // Verifica si el usuario es admin
                                    setObjetivoSeleccionado(objetivoSeleccionado?._id === objetivo._id ? null : objetivo);
                                  }
                                }}
                                selected={objetivoSeleccionado?._id === objetivo._id}
                              >
                                <TableCell>{objetivo.objetivoMeta.nombre}</TableCell>
                                <TableCell>{formatDate(objetivo.fechaDesde)}</TableCell>
                                <TableCell>{formatDate(objetivo.fechaHasta)}</TableCell>
                                <TableCell>{objetivo.valor}</TableCell>
                                <TableCell>
                                  <Checkbox checked={objetivo.cumplido} disabled 
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
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )}
                </Box>
                <Box sx={{ border: '1px solid lightgray', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography component="h1" variant="h5" sx={{ pl: 4, mt:1 }}>Metas</Typography>
                    <Button variant="contained" color="primary"onClick={() => {abrirModal(false)}} sx={{ ml: 4, mt:2 }}>Crear</Button>
                    <Button variant="contained" color="secondary"onClick={() => {abrirModal(true, metaSeleccionada)}} sx={{ ml: 1, mt: 2, '&.Mui-disabled': {backgroundColor: '#757575', color: '#bdbdbd' }}} disabled={!metaSeleccionada}>Editar</Button>
                    <Button variant="contained" color="error"onClick={() => {eliminarRegistro(objetivoSeleccionado)}} sx={{ ml: 1, mt: 2,'&.Mui-disabled': {backgroundColor: '#ff5252', color: '#ff8a80'}}} disabled={!metaSeleccionada}>Eliminar</Button>
                  </Box>
                  <Divider sx={{ my: 2, borderColor: 'lightgray', opacity: 1 }}/>
                  {metas.filter((meta) => meta.creadoAdmin === false).length === 0 ? (
                    <p>Aún no tienes metas asignadas.</p>
                  ) : (
                    <Box sx={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto' }}>
                      <TableContainer component={Paper} sx={{ width: '100%' }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Nombre</TableCell>
                              <TableCell>Fecha Ini</TableCell>
                              <TableCell>Fecha Fin</TableCell>
                              <TableCell>Valor</TableCell>
                              <TableCell>Completado</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {metas.filter((meta) => meta.creadoAdmin === false).map((meta) => (
                              <TableRow
                                key={meta._id}
                                onClick={() => setMetaSeleccionada(metaSeleccionada?._id === meta._id ? null : meta)}
                                selected={metaSeleccionada?._id === meta._id}
                              >
                                <TableCell>{meta.objetivoMeta.nombre}</TableCell>
                                <TableCell>{formatDate(meta.fechaDesde)}</TableCell>
                                <TableCell>{formatDate(meta.fechaHasta)}</TableCell>
                                <TableCell>{meta.valor}</TableCell>
                                <TableCell>
                                  <Checkbox checked={meta.cumplido} disabled 
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
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )}
                </Box>
              </>
            ) : (
              <p>Seleccione un usuario para ver sus metas.</p>
            )}

            {/* <Button onClick={() => setModalOpen(true)}>Crear</Button> */}
            {/* <Button onClick={handleEdit} disabled={!selectedObjective}>Editar</Button> */}
            {/* <Button onClick={handleDelete} disabled={!selectedObjective}>Eliminar</Button> */}
            {/* <Button onClick={handleHideCompleted}>Ocultar Completadas</Button> */}
          </Box>
        </Grid>
      </Grid>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box sx={{ ...modalStyle, width: '50%', maxWidth: '1000px', maxHeight: '80vh', overflowY: 'auto' }}>
          <Typography variant="h6" component="h2" sx={{ mb: 2, backgroundColor: 'transparent', textAlign: 'center' }}>Crear Meta</Typography>
            <InputLabel>Seleccionar Meta</InputLabel>
            <Select
              required
              id="meta"
              name="meta"
              autoComplete="meta"
              value={modalData.objetivoMeta? modalData.objetivoMeta._id : ''}
              onChange={manejarCambioDeInput}
              disabled={isEdit}
              sx={{
                // backgroundColor: 'white',
                backgroundColor: tema.palette.background.paper,
                color: 'white',
                '& .MuiSelect-select': {
                  // backgroundColor: 'white',
                  backgroundColor: tema.palette.background.paper,
                  color: 'white',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
                '& .MuiInputLabel-root': {
                  color: 'white !important',
                },
                '& .MuiMenuItem-root': {
                  backgroundColor: tema.palette.background.paper,
                  color: 'white',
                  '&:hover': {
                    // backgroundColor: '#f5f5f5',
                    backgroundColor: tema.palette.background.paper,
                  },
                },
                width: '65%',
              }}
            >
              <MenuItem value="" disabled>Select a meta</MenuItem>
              {availableMetas.map((meta) => (
                <MenuItem key={meta._id} value={meta._id}>{meta.nombre}</MenuItem>
              ))}
              
            </Select>
            <InputLabel>Fecha Desde</InputLabel>
            <TextField
              type="date"
              margin="normal"
              required
              id="fechaDesde"
              name="fechaDesde"
              autoComplete="fechaDesde"
              value={formatDate2(modalData.fechaDesde)}
              onChange={manejarCambioDeInput}
              sx= {{
                '& input': {
                  color: 'white', // Cambia el color del texto del input
                },
                borderRadius: '2px',
                borderWidth: '1px',
                borderColor: '#e91e63',
                border: '1px solid',
                // backgroundColor: '#FFFFFF',
                backgroundColor: tema.palette.background.paper,
                width: '65%',
              }}
            />
            <InputLabel>Fecha Hasta</InputLabel>
            <TextField
              type="date"
              margin="normal"
              required
              id="fechaHasta"
              name="fechaHasta"
              autoComplete="fechaHasta"
              value={formatDate2(modalData.fechaHasta)}
              onChange={manejarCambioDeInput}
              sx= {{
                '& input': {
                  color: 'white', // Cambia el color del texto del input
                },
                borderRadius: '2px',
                borderWidth: '1px',
                borderColor: '#e91e63',
                border: '1px solid',
                backgroundColor: tema.palette.background.paper,
                width: '65%',
              }}
            />
            <InputLabel>Valor</InputLabel>
            <TextField
              type="number"
              margin="normal"
              required
              id="valor"
              name="valor"
              autoComplete="valor"
              value={modalData.valor}
              onChange={manejarCambioDeInput}
              sx= {{
                '& input': {
                  color: '#000000', // Cambia el color del texto del input
                },
                borderRadius: '2px',
                borderWidth: '1px',
                borderColor: '#e91e63',
                border: '1px solid',
                // backgroundColor: '#FFFFFF',
                backgroundColor: tema.palette.background.paper,
                width: '65%',
              }}
            />

            {isEdit && (
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      margin="normal"
                      id="cumplido"
                      name="cumplido"
                      autoComplete="cumplido"
                      checked={modalData.cumplido}
                      onChange={manejarCambioDeInput}
                    />
                  }
                  label={modalData.creadoAdmin? "Cumplido" : "Cumplida"}
                />
              </Box>
            )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button onClick={() => setModalOpen(false)} color="error" variant="outlined">Cancelar</Button>
            <Button onClick={handleCreateUserMeta} variant="contained" color="primary">{isEdit ? 'Editar' : 'Guardar'}</Button>
          </Box>
        </Box>
      </Modal>
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

export default ObjetivosMetas;