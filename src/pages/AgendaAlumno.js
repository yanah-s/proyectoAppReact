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
  TableRow,
  Link
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

const AgendaAlumno = () => {
  const [disponibilidad, setDisponibilidad] = useState([]); //donde se almacenan todos los turnos disponibles, 
  //apenas se carga la pagina, consulta disponibilidad.
  const [selectedTurnos, setSelectedTurnos] = useState({});
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [turnoUsuario, setTurnoUsuario] = useState(null);
  const [fechaUsuario, setFechaUsuario] = useState(null);
  const [horaUsuario, setHoraUsuario] = useState(null);
  const [idTurno, setIdTurno] = useState(null);
  const [mostrarFechaAgendada, setMostrarFechaAgendada] = useState(false);
  const isButtonDisabled = selectedTurnos === null || loading || mostrarFechaAgendada;
  console.log('isButtonDisabled:', isButtonDisabled);
  const formatFecha = (fecha) => {
    const opciones = { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Montevideo' };
    return new Intl.DateTimeFormat('es-ES', opciones).format(new Date(fecha));
  };

  // Función para formatear la hora
  const formatHora = (hora) => {
    const opciones = { hour: '2-digit', minute: '2-digit', timeZone: 'America/Montevideo' };
    return new Intl.DateTimeFormat('es-ES', opciones).format(new Date(hora));
  };

  // Definir las fechas y horas formateadas
  const fechaFormateada = formatFecha(fechaUsuario);
  const horaFormateada = formatHora(horaUsuario);

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

  useEffect(() => {
    consultarAgendaCliente(); 

  }, []);

  useEffect(() => {
    if (turnoUsuario) {
      console.log('Datos de la agenda:', turnoUsuario);
    }
  }, [turnoUsuario]);

    const consultarAgendaCliente = async (e) => {
      try {
        const token = localStorage.getItem('token'); 
        const usuario = JSON.parse(localStorage.getItem('usuario')); 
        
        const responseAgenda = await api.get('/api/agenda/agendaAlumno/', {
          headers: {
              'Authorization': `Bearer ${token}`,
              'User-ID': usuario.id
            },
            params: {
              usuario: usuario.id
            }
        });
        if(responseAgenda.status != 204){
        console.log(usuario.id);
        console.log(responseAgenda.data);
        setTurnoUsuario(responseAgenda.data);
        setFechaUsuario(responseAgenda.data.fecha);
        setHoraUsuario(responseAgenda.data.hora_desde);
        setIdTurno(responseAgenda.data._id);
        setMostrarFechaAgendada(responseAgenda.data.fecha !== undefined && responseAgenda.data.fecha !== null && responseAgenda.data.hora_desde !== undefined && responseAgenda.data.hora_desde !== null);
   
        }
        else {
          console.log("No hay turnos agendados para el usuario.");
          setMostrarFechaAgendada(false);
        }
           
        
      }  catch (err) {
        
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
        }
    }
    const cancelarTurno = async (e) => {
      try {
        const token = localStorage.getItem('token'); 
        const usuario = JSON.parse(localStorage.getItem('usuario')); 
        console.log("mandando en params" + usuario.id + idTurno);
        const responseAgenda = await api.put('/api/agenda/eliminar/', 
          { 
            usuarioId: usuario.id,
            turnoId: idTurno
          }, 
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'User-ID': usuario.id
            }
          });
        setMensaje("Turno eliminado");
        consultarAgendaCliente();
      } catch (err) {
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
      }
    };


  const handleSubmitAgenda = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError([]);
    setMensaje(null);

   try {
    if (Object.keys(selectedTurnos).length === 0) {
      const errorMsg = "Debe seleccionar un turno en la agenda";
      setError([errorMsg]);
      return;
    }
     
      
      const token = localStorage.getItem('token'); 
      const usuario = JSON.parse(localStorage.getItem('usuario')); 
      const dataAgenda = {
        usuarioId: usuario.id, 
        turnoId : selectedTurnos,
      };
      const responseAgenda = await api.put('/api/agenda/',dataAgenda, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'User-ID': usuario.id
          }
      });
      setMensaje('Turno agendado exitosamente.');
      consultarAgendaCliente();
    
    } catch (err) {
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
      setLoading(false);
    }
  };
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
           {!mostrarFechaAgendada && (
          <p>Puedes agendar una consulta de evaluación si lo deseas.</p>
          
        )}
         {mostrarFechaAgendada && (
          <p>Usted tiene un turno agendado para el día {fechaFormateada} a las {horaFormateada}hs</p>
          
        )}
         {mostrarFechaAgendada && (
          <Grid item xs>
          <Link
          component="button"
          variant="body2"
           onClick={cancelarTurno}
          color="primary"
        >
          Deseo cancelar mi turno
        </Link>
        </Grid>
        )}
          <Box component="form" noValidate sx={{ mt: 1 }}>
          {mensaje && <Typography color="success.main">{mensaje}</Typography>}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={fechaSeleccionada}
                onChange={(newValue) => {
                  setFechaSeleccionada(newValue);
                  eventoFechaClick(newValue);
                }}
              
                shouldDisableDate={shouldDisableDate}
                customclassname={{ disabled: 'custom-disabled' }}
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
              label="Motivo de la consulta"
              name="observaciones"
              autoComplete="observaciones"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isButtonDisabled}
              onClick={handleSubmitAgenda}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'AGENDAR'}
            </Button>
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
            disabled={isButtonDisabled}
            onClick={seleccionTurno}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'SELECCIONAR TURNO'}
          </Button>
          </Box>
        </Fade>
      </Modal>
      
  </ThemeProvider>
);
}
export default AgendaAlumno;

