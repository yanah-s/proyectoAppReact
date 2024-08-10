import React, { useState, useEffect } from 'react';
import {
  CircularProgress,
  Modal,
  Backdrop,
  Fade,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Paper,
  Box,
  Typography,
  Alert,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import api from '../configuracion/axiosconfig';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import dayjs from 'dayjs';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import './AgendaUsuarios.css';
import { useNavigate } from 'react-router-dom';

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
      // paper: '#1d1d1d',
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

const AgendaUsuarios = () => {
  const [disponibilidad, setDisponibilidad] = useState([]); //donde se almacenan todos los turnos disponibles, 
  //apenas se carga la pagina, consulta disponibilidad.
  const [selectedTurnos, setSelectedTurnos] = useState({});
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [formulario, setFormulario] = useState({
    nombre: '',
    email: '',
    fNacimiento: '',
    password: '',
    password2: '',
    patologias: '',
    telefono: ''
  });
  const navigate = useNavigate();
  useEffect(() => {
    const fetchDisponibilidad = async () => {
      try {
        const response = await api.get('/api/agenda'); 
       setDisponibilidad(response.data);
      } catch (error) {
        console.error('Error al obtener la disponibilidad de agenda:', error);
      }
    };
    
    fetchDisponibilidad();
  }, []);
 
  // const handleSubmitUsuario = async (e) => {
    
  //   e.preventDefault();
  //   setLoading(true);
  //   setError([]);
  //   setMensaje(null);
    
    
  //   try {
      
  //     if (formulario.nombre === '' || formulario.email === '' || formulario.fNacimiento === '' || formulario.password === '' || formulario.password2 === '' || formulario.telefono === '') {
  //       const errorMsg = "Revise su formulario";
  //       setError([errorMsg]);
  //       setLoading(false);
  //       return; 
  //     }
  //     const coincide = validarPassword(formulario.password, formulario.password2);
  //     if (!coincide) {

  //       const errorMsg = "Las contraseñas no coinciden";
  //       setError([errorMsg]);
  //       return;
  //     }
  //       if (Object.keys(selectedTurnos).length === 0) {
  //         const errorMsg = "Debe seleccionar un turno en la agenda";
  //         setError([errorMsg]);
  //         return;
  //       }
  //       const respuestaUsuario = await api.post('/api/usuarios/', formulario);
  //       const dataAgenda = {
  //         usuarioId: respuestaUsuario.data.value._id, 
  //         turnoId : selectedTurnos,
  //       };
  //       const responseAgenda = await api.put('/api/agenda/',dataAgenda, {
  //         headers: {
  //             'Content-Type': 'application/json'
  //         }
  //       });
  //       setMensaje('Usuario registrado y turno agendado exitosamente.');
  //       navigate('/login');
  //     }
  //      catch (err) {
  //     let errorMsg = 'Error de conexión';

  //     if (err.response) {
  //       if (err.response.data && err.response.data.errors) {
  //         setError(err.response.data.errors);
  //       } else if (err.response.data && err.response.data.message) {
  //         setError([err.response.data.message]);
  //       } else {
  //         errorMsg = `Error: ${err.response.status} ${err.response.statusText}`;
  //         setError([errorMsg]);
  //       }
  //     } else {
  //       setError([errorMsg]);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmitUsuario = async (e) => {
    e.preventDefault(); 
  
    setLoading(true);
  
    try {
      // Validación de formulario
      if (formulario.nombre === '' || formulario.email === '' || formulario.fNacimiento === '' || formulario.password === '' || formulario.password2 === '' || formulario.telefono === '') {
        const errorMsg = "Revise su formulario";
        setError([errorMsg]);
        return; 
      }
  
      // Validación de contraseñas
      const coincide = validarPassword(formulario.password, formulario.password2);
      if (!coincide) {
        const errorMsg = "Las contraseñas no coinciden";
        setError([errorMsg]);
        return;
      }
  
      // Validación de turno
      if (Object.keys(selectedTurnos).length === 0) {
        const errorMsg = "Debe seleccionar un turno en la agenda";
        setError([errorMsg]);
        return;
      }
  
      // Primera petición: Crear usuario
      const respuestaUsuario = await api.post('/api/usuarios/', formulario);
      console.log('Usuario creado:', respuestaUsuario.data);
  
      // Preparar datos para la segunda petición
      const dataAgenda = {
        usuarioId: respuestaUsuario.data.value._id, 
        turnoId: selectedTurnos,
      };
  
      console.log('Datos para agendar:', dataAgenda);
  
      // Segunda petición: Agendar turno
      const responseAgenda = await api.put('/api/agenda/', dataAgenda, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      console.log('Respuesta de agenda:', responseAgenda.data);
  
      // Mensaje de éxito y redirección
      setMensaje('Usuario registrado y turno agendado exitosamente.');
      navigate('/login');
  
    } catch (err) {
      console.log('Error:', err);  // Log adicional para depurar errores
      let errorMsg = 'Error de conexión';
  
      if (err.response) {
        if (err.response.data && err.response.data.errors) {
          setError(err.response.data.errors);
        } else if (err.response.data && err.response.data.message) {
          setError([err.response.data.message]);
        } else {
          errorMsg = `Error: ${err.response.status} ${err.response.statusText}`;
          setError([errorMsg]);
        }
      } else {
        setError([errorMsg]);
      }
    } finally {
      setLoading(false); // Asegúrate de que esto se ejecute siempre
    }
  };
  

  const validarPassword = (password, password2) => {
    return password === password2;
  };
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  //checkbox para seleccionar el turno actualiza de true a false o al reves
  const handleTurnoChange = (turnoId) => {
    setSelectedTurnos(prev => (prev === turnoId ? null : turnoId));
  };


  const seleccionTurno = () => {
    setOpenModal(false);
  };
  

  //al hacer click en una fecha, se guarda la misma en el estado y se abre el modal
  const eventoFechaClick = (date) => {
    setFechaSeleccionada(date);
    setOpenModal(true);
  };

  //se cierra modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  //chequea en todos los turnos disponbles cuales corresponden al turno/dia seleccionado
  const turnosDisponiblesParaFecha = disponibilidad.filter(turno => 
    dayjs(turno.fecha).isSame(fechaSeleccionada, 'day')
  );

  const shouldDisableDate = (date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    const today = dayjs().startOf('day');
  
    // Comparar la fecha con la de hoy
    if (dayjs(formattedDate).isBefore(today, 'day')) {
      return true; // Deshabilitar fechas pasadas
    }

    return !disponibilidad.some(turno => dayjs(turno.fecha).format('YYYY-MM-DD') === formattedDate);
  };




return (
  <ThemeProvider theme={tema}>
    <CssBaseline />
  
    <Grid container component="main" sx={{ height: '100vh',
       justifyContent: 'center', alignItems: 'center' }}>


      <Grid item xs={12} md={8} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
           <h2>¡EMPIEZA HOY!</h2> 
          <Box component="form" noValidate sx={{ mt: 1 }}>
            
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={fechaSeleccionada}
                onChange={(newValue) => {
                  setFechaSeleccionada(newValue);
                  eventoFechaClick(newValue);
                }}
              
                shouldDisableDate={shouldDisableDate}
                customClassName={{ disabled: 'custom-disabled' }}
              />
            </LocalizationProvider>
            <FormControlLabel
              control={<Checkbox color="primary" />}
              label="Preferiría mi consulta de forma presencial"
            />
            <TextField
              margin="normal"
              fullWidth
              id="observaciones"
              label="Observaciones"
              name="observaciones"
              autoComplete="observaciones"
            />
            {error.length > 0 && (
              <Alert severity="error">
                {error.map((e, i) => (
                  <div key={i}>{e}</div>
                ))}
              </Alert>
            )}
          </Box>
        </Box>
      </Grid>

      <Grid container component="main" sx={{ height: '100vh',
       justifyContent: 'center', alignItems: 'center' }}>
        <Grid item xs={12} md={8} component={Paper} elevation={6} square>

                <form onSubmit={handleSubmitUsuario} noValidate>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="nombre"
                    label="Nombre completo"
                    name="nombre"
                    autoComplete="nombre"
                    autoFocus
                    value={formulario.nombre}
                    onChange={handleChange}
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
                    onChange={handleChange}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="telefono"
                    label="telefono"
                    name="telefono"
                    autoComplete="telefono"
                    value={formulario.telefono}
                    onChange={handleChange}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="fNacimiento"
                    label="Fecha de nacimiento"
                    type="date"
                    name="fNacimiento"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={formulario.fNacimiento}
                    onChange={handleChange}
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    name="patologias"
                    label="Patologías/Aclaraciones referentes a su salud"
                    type="text"
                    id="patologias"
                    // autoComplete="patologias"
                    value={formulario.patologias}
                    onChange={handleChange}
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
                    onChange={handleChange}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password2"
                    label="Password"
                    type="password"
                    id="password2"
                    autoComplete="new-password"
                    value={formulario.password2}
                    onChange={handleChange}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrar'}
                  </Button>
                  {/* {error.length > 0 && (
                    <Typography color="error">
                      {error.map((e, i) => (
                        <div key={i}>{e}</div>
                      ))}
                    </Typography>
                  )} */}
                   {error.length > 0 && (
                    <Alert severity="error">
                      {error.map((e, i) => (
                        <div key={i}>{e}</div>
                      ))}
                    </Alert>
                  )}
                  {mensaje && <Typography color="success.main">{mensaje}</Typography>}
                </form>
        </Grid>
      </Grid>
      </Grid>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Fade in={openModal}>
          <Box sx={{ 
            width: 400, 
            bgcolor: 'background.paper', 
            p: 2, 
            maxHeight: '80vh',  // Altura máxima del modal
            overflowY: 'auto',  // Habilitar scroll vertical 
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: '4px',
            },
          }}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Horas disponibles para el {fechaSeleccionada && fechaSeleccionada.format('DD/MM/YYYY')}
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Hora</TableCell>
                    <TableCell>Seleccionar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {turnosDisponiblesParaFecha.map((turno) => (
                <TableRow key={turno._id}>
                  <TableCell>{dayjs(turno.hora_desde).format('HH:mm')}</TableCell>
                  <TableCell>{dayjs(turno.hora_hasta).format('HH:mm')}</TableCell>
                  <TableCell>
                  <Checkbox
                      checked={selectedTurnos === turno._id}
                      onChange={() => handleTurnoChange(turno._id)}
                    />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
              onClick={seleccionTurno}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'SELECCIONAR TURNO'}
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
        </Fade>
      </Modal>
  </ThemeProvider>
);
}
export default AgendaUsuarios;

